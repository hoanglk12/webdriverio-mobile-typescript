// Syncs this project's Claude Code auto-memory notes into a running LightRAG server.
// Run manually (there is no hook wiring this up automatically):
//   npm run rag:sync
//
// Source of truth is ~/.claude/projects/{encoded-project-path}/memory/ — the same
// directory Claude Code's built-in auto-memory system already reads/writes. This
// script does not touch that directory; it only reads from it.
//
// For new files: inserts via POST /documents/text (bypasses file-tracker).
// For changed files: deletes old doc then re-inserts.
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const LIGHTRAG_URL = 'http://localhost:9623';

function encodedProjectDir(projectRoot) {
  return projectRoot.replace(/[\\/:]/g, '-');
}

const PROJECT_ROOT = process.cwd();
const MEMORY_DIR = join(homedir(), '.claude', 'projects', encodedProjectDir(PROJECT_ROOT), 'memory');

function getMemoryFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) continue;
    if (!entry.endsWith('.md')) continue;
    const content = readFileSync(full, 'utf8');
    results.push({ name: entry, contentLength: content.length, content });
  }
  return results;
}

async function insertDoc(text, fileSource) {
  const res = await fetch(`${LIGHTRAG_URL}/documents/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, file_source: fileSource }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${res.status} ${txt.slice(0, 120)}`);
  }
  return res.json();
}

async function main() {
  // Health check — silent exit if server not running
  try {
    const r = await fetch(`${LIGHTRAG_URL}/health`, { signal: AbortSignal.timeout(5000) });
    const h = await r.json();
    if (h.status !== 'healthy') throw new Error(`unhealthy: ${h.status}`);
  } catch (e) {
    const isDown =
      e.cause?.code === 'ECONNREFUSED' ||
      e.name === 'TimeoutError' ||
      e.message?.includes('fetch failed') ||
      e.message?.includes('ECONNREFUSED');
    console.log(
      isDown
        ? '[sync-memory-to-lightrag] LightRAG not running — start it with scripts\\start-rag.bat first'
        : `[sync-memory-to-lightrag] Health check failed (${e.message}) — skipping`
    );
    return;
  }

  console.log('[sync-memory-to-lightrag] LightRAG healthy — syncing...');
  console.log(`[sync-memory-to-lightrag] Source: ${MEMORY_DIR}`);

  if (!existsSync(MEMORY_DIR)) {
    console.log('[sync-memory-to-lightrag] Memory dir not found — nothing to sync');
    return;
  }

  // Get current docs — POST /documents/paginated (page_size max is 200)
  const docsRes = await fetch(`${LIGHTRAG_URL}/documents/paginated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: 1, page_size: 200, status_filter: 'processed' }),
  });
  if (!docsRes.ok) {
    console.log(
      `[sync-memory-to-lightrag] /documents/paginated returned ${docsRes.status} — aborting (would otherwise re-insert everything as new)`
    );
    return;
  }
  const docsData = await docsRes.json();
  const processed = (docsData.documents ?? []).filter((d) => d.status === 'processed');
  const total = docsData.status_counts?.processed ?? processed.length;
  if (total > processed.length) {
    console.log(
      `[sync-memory-to-lightrag] Only ${processed.length} of ${total} processed docs fetched — page_size cap hit, aborting`
    );
    return;
  }
  const lrMap = new Map(processed.map((d) => [d.file_path, { id: d.id, contentLength: d.content_length }]));

  const memoryFiles = getMemoryFiles(MEMORY_DIR);

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  let errors = 0;

  const toInsert = [];
  const toUpdate = [];

  for (const file of memoryFiles) {
    const existing = lrMap.get(file.name);
    // WHY: LightRAG strips 1–2 chars (trailing newline/CRLF) when storing, so stored
    // content_length is always 1–2 less than the raw file length. Tolerance prevents
    // every file appearing as "changed" on every sync run.
    if (existing && Math.abs(existing.contentLength - file.contentLength) <= 2) {
      unchanged++;
    } else if (existing) {
      toUpdate.push({ file, existing });
    } else {
      toInsert.push({ file });
    }
  }

  // Pass 1 — delete stale docs before any inserts (LightRAG delete is async)
  const deleteIds = toUpdate.map((u) => u.existing.id);
  if (deleteIds.length > 0) {
    const res = await fetch(`${LIGHTRAG_URL}/documents/delete_document`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_ids: deleteIds }),
    });
    if (!res.ok) {
      console.log(`  Batch delete warning (${res.status}) — proceeding anyway`);
    }
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const hr = await fetch(`${LIGHTRAG_URL}/health`, { signal: AbortSignal.timeout(5000) });
        const hj = await hr.json();
        const busy = hj.pipeline_destructive_busy || hj.pipeline_busy;
        if (!busy) break;
      } catch {
        break;
      }
    }
  }

  // Pass 2 — insert new + updated files
  for (const { file } of [...toUpdate, ...toInsert]) {
    const isUpdate = toUpdate.some((u) => u.file.name === file.name);
    try {
      await insertDoc(file.content, file.name);
      if (isUpdate) {
        console.log(`  Updated: ${file.name}`);
        updated++;
      } else {
        console.log(`  Inserted: ${file.name}`);
        inserted++;
      }
    } catch (e) {
      console.log(`  Error inserting ${file.name}: ${e.message}`);
      errors++;
    }
  }

  console.log(
    `[sync-memory-to-lightrag] Done — ${inserted} new, ${updated} updated, ${unchanged} unchanged${errors ? `, ${errors} errors` : ''}`
  );
}

main().catch((e) => {
  console.error('[sync-memory-to-lightrag] Error (non-fatal):', e.message);
});
