# Documentation & Maintenance Tasks for Release 3.0.0

- [x] Audit and remove stale file `compose.yml` (PostgreSQL Docker Compose setup obsolete post-stateless migration) <!-- id: 0 -->
- [x] Clean up `tsconfig.json` `include` array (remove deleted `playwright.config.ts` and `drizzle.config.ts`) <!-- id: 1 -->
- [x] Refresh `README.md`: <!-- id: 2 -->
  - [x] Update Bun version requirements to `>= 1.3.14` (`bun@1.3.14`)
  - [x] Update Tech Stack table (replace PostgreSQL / Docker Compose integration row with Upstash Redis rate-limiting)
  - [x] Update Environment Variables table (add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
  - [x] Update Testing section (remove PostgreSQL integration tests section, update Vitest configuration description)
  - [x] Update Project Structure tree (remove `compose.yml`, update file list with local storage hooks/lib)
- [x] Run quality checks and verification (lint, format check, unit tests, tsc, build) <!-- id: 3 -->
- [x] Document final release documentation disposition <!-- id: 4 -->
