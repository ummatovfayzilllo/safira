---
name: courses-file-service-fix
status: done
---

# Work Package B — courses.service.ts

File: `src/modules/courses/courses.service.ts`

## Changes made

1. **`create()` (line ~40-45)** — stopped calling `urlGenerator()` at write time.
   `data['introVideo'] = introVideo` and `data['banner'] = banner` now store the
   bare uploaded filename directly.

2. **`findAll()` (line ~56-83)** — added read-time URL building: after fetching
   courses (with `mentor`/`category` includes, unchanged), map each course so
   `banner`/`introVideo` are converted from bare filename to full URL via
   `urlGenerator(this.config, ...)`, guarded for null.

3. **`findOne()` (line ~85-104)** — `checkExistsResurs` call now typed
   `<Course>` (was untyped/`unknown` before, which would have blocked property
   access). Same read-time URL mapping applied as in `findAll()`.

4. **`update()` (line ~106-142)** — **confirmed bug fixed**: the old code had
   `data['introVideo'] = urlGenerator(this.config, 'intro')` — a hardcoded
   literal `'intro'` string instead of the actual uploaded filename. Now:
   `data['introVideo'] = introVideo` (the real param). Same convention applied
   to `banner`. Also removed the `bannerUrl`/`introVideoUrl`/`.split('/').at(-1)`
   local-var dance — `unlinkFile()` is now called directly on `course.banner`
   / `course.introVideo` (bare filenames already in DB).

   **Bonus bug found+fixed while here (not in original plan, but same root
   cause)**: in the old code, `data['introVideo'] = urlGenerator(...)` was
   nested *inside* `if (introVideoUrl && typeof introVideoUrl === 'string')`
   — meaning if a course had **no previous** `introVideo` (first-time set),
   uploading one via `update()` would save the file to disk but **never
   persist it to the DB** (the assignment was unreachable when there was
   nothing to unlink). Now `data['introVideo'] = introVideo` runs whenever
   `introVideo` is truthy, independent of whether there was a prior value to
   clean up. Same latent issue existed for `banner` and is fixed identically.

5. **`remove()` (line ~144-166)** — removed the `.split('/').at(-1)` pattern;
   `unlinkFile(course.banner)` / `unlinkFile(course.introVideo)` called
   directly.

## Verification

`npx tsc --noEmit` run from `safira_backend/` — no errors reported for
`courses.service.ts` (project has preexisting unrelated errors elsewhere,
none introduced by this change).

## Scope note

Only `src/modules/courses/courses.service.ts` was touched, per directive. No
git operations performed.

## Kamchiliklar (supervisor review)

No defects found in this package's diff — independently verified against `git diff`;
the `'intro'`-literal fix and the "first upload never persisted" bonus fix are both
correct and match the self-report exactly.

Same shared cross-package gap as the other packages applies here: legacy `banner`/
`introVideo` values already stored as full URLs would have double-wrapped through
`urlGenerator()` and failed to unlink. **Fixed by the supervisor** in
`common/utils/generators.ts` and `common/utils/file.helpers.ts` (see
`users_and_filter_memory.md` for the detail) — no change was needed in this file
itself.
