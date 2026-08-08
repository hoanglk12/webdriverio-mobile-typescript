---
name: ci-release-triage
description: Use when investigating or modifying this repo's GitHub Actions pipeline (.github/workflows/mobile-tests.yml) — e.g. "why did the Android CI job fail", "the iOS matrix job is red", "add a new CI job", "why didn't the Allure report publish", "the Slack notification isn't firing". Encodes the job graph, matrix strategy, artifact locations, and known fragile points so triage starts from the right place instead of re-reading the whole YAML each time.
---

# Triaging `.github/workflows/mobile-tests.yml`

## Job graph

```
lint-and-typecheck (ubuntu, gate)
        │
        ├──▶ test-android (macos, matrix: api-level [30, 31])
        └──▶ test-ios     (macos, matrix: ios-version × device ['iPhone 14 Pro'])
                        │
                        ▼
              publish-report (ubuntu, needs both)
                        │
                        ▼
                  notify (ubuntu, needs both, if: always())
```

- `lint-and-typecheck` runs `npm ci` → `npm run lint` → `npm run type-check` → `npm run format:check`. Both platform test jobs `needs:` this — a lint/type/format failure blocks both, so check this job first on any red run.
- `workflow_dispatch` accepts `platform` (android/ios/both, default android) and `suite` inputs. The `if:` conditions on `test-android`/`test-ios` key off `github.event.inputs.platform` — on a push/PR trigger (no inputs), both platform conditions evaluate to their `== null` branch and both run.

## Where to look for failure evidence

Each test job uploads (with `if: always()` or `if: failure()`):
- `allure-results-android-<api-level>` / `allure-results-ios-<ios-version>` — raw Allure results, retained 30 days.
- `screenshots-android-<api-level>` / `screenshots-ios-<ios-version>` — only uploaded `if: failure()`, retained 7 days.
- `logs-android-<api-level>` (Android only) — Winston logs, retained 7 days.

Download the relevant artifact from the failed run rather than re-running blind.

## Known fragile points, check these first

1. **AVD cache staleness** — `avd-${{ matrix.api-level }}` cache key. If the emulator behaves oddly on Android but the cache-hit step shows `true`, try invalidating the cache (bump the key or delete it) before assuming a code regression.
2. **Global Appium version drift** — the workflow does `npm install -g appium@next` (always latest `next` tag) independent of the `appium` devDependency pinned in `package.json`. A driver/CLI mismatch here can produce session-start failures that don't reproduce locally with the pinned version.
3. **iOS simulator UUID lookup returning empty** — the `Boot iOS Simulator` step greps `xcrun simctl list devices available` for `matrix.device` + `matrix.ios-version`; if GitHub's macOS runner image doesn't have that exact iOS version/device pair pre-installed, the grep returns nothing, `DEVICE_UUID` is empty, and `xcrun simctl boot` fails with a confusing error. Check `xcrun simctl list devices available` output in the job log first.
4. **`publish-report`'s `gh-pages` checkout** uses `continue-on-error: true` — a missing `gh-pages` branch (e.g. first-ever run) won't fail the job but will produce a report with no history; not a bug, just expected on a fresh repo.
5. **Secrets required**: `secrets.GITHUB_TOKEN` (implicit, Pages deploy) and `secrets.SLACK_WEBHOOK_URL` (must be configured in repo/org settings for `notify` to actually post — if it's silently not posting, check the secret exists before checking the action logs).

## Scope note

This skill is for the CI *pipeline* itself. If a test fails inside a job and you need to know what happened on the emulated device at that moment (not why the job infrastructure failed), that's `appium-failure-triage`'s territory, applied to a local reproduction of the failing spec.
