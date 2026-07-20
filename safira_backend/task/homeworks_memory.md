---
name: homeworks-memory
description: Work Package C status — homeworks + homework_submissions file-service fix
metadata:
  type: task
  status: done
---

# Work Package C — homeworks.service.ts + homework_submissions.service.ts

## What changed

### `src/modules/homeworks/homeworks.service.ts`

- `create()` (was line 25-27): `data['files'] = files.map((file) => { return urlGenerator(this.config, file.filename); });` → `data['files'] = files.map((file) => file.filename);`. Now stores bare filenames, not full URLs.
- `findAll()`: now fetches homeworks then maps each record's `files` (bare filenames) through `urlGenerator(this.config, file)` before returning, so the response still contains full URLs built from the *current* `APP_BASE_URL`.
- `findOne()`: switched from the generic `checkExistsResurs(...)` inline call to fetching into a `homework` var first, then returning `{ ...homework, files: mapped-to-URLs }` — same read-time URL-building as `findAll()`.
- `update()` (was line 90-92): removed the `async` from the `files.map(async (file) => urlGenerator(...))` write — **this was the confirmed Promise bug**: `.map()` returned `Promise<string>[]` and that array of pending Promises was being written directly into the Prisma `files: String[]` column. Now: `data['files'] = files.map((file) => file.filename);` — synchronous, bare filenames, bug gone.
- `update()` cleanup loop (was line ~79-84): removed `oldHomework.files.map(async (file) => { const fileName = file.split('/').at(-1); unlinkFile(fileName || ''); })` → `oldHomework.files.forEach((file) => { if (file && typeof file === 'string') unlinkFile(file); })`. No more URL-splitting; `unlinkFile` is called directly on the bare filename.
- `remove()` cleanup loop (was line ~120-125): same fix as above — `forEach` + direct `unlinkFile(file)`, no `.split('/').at(-1)`.

### `src/modules/homework_submissions/homework_submissions.service.ts`

- `create()` (was line 41-43): `data['files'] = files.map(async (file) => { return urlGenerator(...); });` → `data['files'] = files.map((file) => file.filename);`. **Confirmed async-map Promise bug #2 fixed.**
- `findAll()`: now fetches submissions then maps each record's `files` through `urlGenerator(this.config, file)` before returning.
- `findOne()`: switched to fetch-then-map pattern, same as homeworks — returns `{ ...submission, files: mapped-to-URLs }`.
- `update()` (was line 122-124): same async-map bug, same fix — `data['files'] = files.map((file) => file.filename);`. **Confirmed async-map Promise bug #3 fixed.**
- `update()` cleanup loop (was line ~130-139): `oldHomeworkSubmission.files.map(async (file) => { const fileName = file.split('/').at(-1); try { unlinkFile(fileName || ''); } catch... })` → `forEach` + direct `unlinkFile(file)` inside the same try/catch, no splitting.
- `remove()` cleanup loop (was line ~162-171): same fix — `forEach` + direct `unlinkFile(file)`.

## Verification

- `npx tsc --noEmit` run from `safira_backend/` after all edits: **0 errors project-wide**. Both files compile cleanly.
- Confirmed no remaining `files.map(async` pattern in either file (all 3 confirmed instances fixed: homeworks `update()`, homework_submissions `create()`, homework_submissions `update()`).
- Confirmed no remaining `.split('/').at(-1)` in either file.

## Notes / deviations

- Changed the cleanup loops from `.map(async ...)` to `.forEach(...)` rather than just dropping `async` from `.map` — `.map`'s return value was never used for cleanup (fire-and-forget unlink), so `forEach` is the more correct primitive; behavior is equivalent (still fire-and-forget, `unlinkFile` itself already wraps its own try/catch internally per `common/utils/file.helpers.ts`).
- Did **not** touch `common/utils/generators.ts`, `common/utils/file.helpers.ts`, or any other module — out of scope per directive.
- Did not run git commands (no add/commit) per directive.
- **Depends on Work Package data migration (plan step 7, owned by the supervisor task)**: any *existing* DB rows for `Homework.files` / `HomeworkSubmission.files` still contain full URLs from before this fix. Since `unlinkFile()` now assumes bare filenames, deleting/updating a *pre-existing* record before migration runs would pass a full URL into `unlinkFile`, which resolves the wrong path and silently fails to delete (see `file.helpers.ts`'s own try/catch — it just logs and swallows the error, no crash, but the old file leaks on disk). Not a regression introduced here — it's the same normalization gap called out in `file_service_fix.md` step 7, now surfaced concretely in this module.

## Kamchiliklar (supervisor review)

No defects found in this package's own diff — independently verified against `git diff`;
all 3 async-map Promise-bug instances are confirmed fixed, `.split('/').at(-1)` is gone,
`.forEach` swap for cleanup loops is correct and equivalent.

The gap this package's own memory file already flagged above (legacy full-URL rows
breaking `unlinkFile`, and by extension also breaking `urlGenerator()` on read —
double-wrapped URLs) was **fixed by the supervisor**, centrally, in
`common/utils/generators.ts` and `common/utils/file.helpers.ts` — both now detect and
correctly handle a legacy full-URL value. This means reads/deletes on old
`Homework`/`HomeworkSubmission` rows now work correctly even *before* the data
migration script (task/SUMMARY_memory.md) is run — the migration is now a cleanliness
improvement rather than a hard prerequisite for correctness.
