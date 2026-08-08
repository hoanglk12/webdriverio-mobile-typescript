---
name: api-test-authoring
description: Use when adding or modifying an API-level test in this framework (tests/specs/api/) — e.g. "add a test for the checkout endpoint", "write an API test that hits GET /orders", "test that an unauthenticated request gets rejected". Encodes this repo's apiClient usage pattern (utils/apiClient.ts), auth-token lifecycle, and Axios error-handling convention, so new API specs match tests/specs/api/api.spec.ts instead of using raw axios.
---

# Writing an API test in this framework

Reference: `tests/specs/api/api.spec.ts` is the worked example — follow its shape.

## Use the shared `apiClient`, not raw axios

```ts
import apiClient from '../../../utils/apiClient';
```

`apiClient` (`utils/apiClient.ts`) is a pre-configured Axios wrapper: base URL and timeout come from `.env` (`API_BASE_URL`, `API_TIMEOUT`, defaulting to `https://api.example.com` / `10000`), and it already has request/response logging interceptors wired to `utils/logger.ts`. Call `apiClient.get<T>(url)`, `.post<T, D>(url, data)`, `.put`, `.patch`, `.delete` — don't `import axios` directly in a spec.

## Auth token lifecycle

- Log in and capture the token, then `apiClient.setAuthToken(token)` so subsequent calls carry `Authorization: Bearer <token>` automatically.
- Clean up with `apiClient.removeAuthToken()` in an `after()` hook so later `describe` blocks don't inherit a stale token.
- This mirrors `api.spec.ts`'s `Product API` describe block: `before()` logs in and sets the token, `after()` removes it.

## Asserting on failure responses

Axios throws on non-2xx by default. To inspect the status code safely:

```ts
import { isAxiosError } from 'axios';
// ...
} catch (error) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  expect(status).to.equal(401);
}
```

Don't assume `error.response` exists without the `isAxiosError` guard — a network-level failure (no response at all) has a different shape and this pattern handles both.

## Tagging and structure

- Same Allure convention as UI specs: `AllureReporter.addFeature('API Testing')` once, `addStory('...')` per scenario naming the endpoint/behavior under test, `addStep('...')` at key checkpoints (after a successful call, after an expected-failure assertion).
- Use `logger.info`/`logger.error` (from `utils/logger.ts`) around request outcomes, matching the existing spec's logging density — not silent, not excessively verbose.
- Define response-shape interfaces inline in the spec file (see `LoginResponse`, `Product` in `api.spec.ts`) rather than importing types from application code that doesn't exist in this repo (there is no backend here — the API under test is external/placeholder).
- Place the spec under `tests/specs/api/`.

## Scope note

This repo's API surface (`api.example.com`) is currently a placeholder/demo target with no real auth or business logic to attack — this skill is about writing *functional* API tests that match the existing pattern, not security testing. If real security testing of an API becomes a goal, that's a separate concern (OWASP API Top 10 tooling), not this convention.
