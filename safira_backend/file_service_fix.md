# File Service Fix — Plan

Investigation date: 2026-07-19. Written before touching any code, per request.

## Current architecture (as-is)

- **Upload**: `common/utils/file.storage.ts` — multer `diskStorage`, filename generated as
  `${Date.now()}-${random}${ext}` (already unique enough, not a problem).
- **Disk path resolution**: `common/utils/generators.ts` → `getPathInFileType(fileName)` —
  picks a folder by extension (`images`/`videos`/`docs`/`axrchive`/`unknown`) under
  `join(process.cwd(), '..', 'core', 'uploads', <type>)`. This assumes the process always
  runs with CWD = a `backend/` dir sitting next to a sibling `core/` dir — baked into
  `Dockerfile` (`WORKDIR /app/backend`, `mkdir -p /app/core/uploads`).
- **URL generation**: `urlGenerator(config, filename)` (same file) builds a **full absolute
  URL** — `${APP_BASE_URL}/api/{image|video|docs|archive}/{filename}` — using the
  `APP_BASE_URL`/`HOST`/`PORT` env values **at the moment of the write**.
- **What's stored in DB**: the full URL from `urlGenerator()`, not the bare filename, in:
  `User.image`, `Course.banner`, `Course.introVideo`, `Lesson.video`, `LessonFile.file`,
  `Homework.files[]`, `HomeworkSubmission.files[]`, `Question.file`.
- **Serving**: `core/services/file.stream.controller.ts` + `.service.ts` — routes
  `GET /api/{video,image,docs,archive}/:file` take just the filename and re-derive the disk
  path via `getPathInFileType` again. Serving itself is filename-only already — fine.
- **Deletion**: `common/utils/file.helpers.ts` → `unlinkFile(filename)` — also filename-only,
  re-derives path the same way. To get a "filename" out of a DB value that's actually a full
  URL, every service does `someUrl.split('/').at(-1)` inline — repeated 10+ times.
- **Error-path cleanup**: `core/error/validation.filter.ts` →
  `MulterValidationExceptionFilter` — on `BadRequestException`/`NotFoundException`/
  `ConflictException`, deletes the just-uploaded multer temp file(s) using multer's own
  `file.path` (unrelated to the DB URL convention). Hardcodes field names `banner`,
  `introVideo`, single `file`, `video` — doesn't know about `files[]` (homeworks/
  homework_submissions) or lesson_files' `file` field by name.

## Confirmed bugs (with evidence)

1. **Root cause — full URL baked into DB at write time.**
   `data['image'] = urlGenerator(this.config, image)` (and equivalents in courses,
   homeworks, lesson_files, lessons, questions, homework_submissions). Since
   `urlGenerator` reads `APP_BASE_URL`/`HOST`/`PORT` from config *at write time*, every
   stored value freezes in the host/port that was active on that request. Moving to
   Docker/Render (different host, port, or domain) permanently breaks every previously
   uploaded file's URL — matches the "fileni get qilishda muammo" report.

2. **`modules/courses/courses.service.ts:119`** — in `update()`, when `introVideo` is
   re-uploaded:
   ```ts
   data['introVideo'] = urlGenerator(this.config, 'intro');
   ```
   Hardcoded literal `'intro'` instead of the actual uploaded filename (`introVideo`
   param). Every course intro-video re-upload stores a URL pointing at a file named
   `intro` (no extension) that never exists on disk → guaranteed 404 on GET. Very likely
   the concrete bug behind the "fileni get qilishda muammo" report.

3. **`modules/homeworks/homeworks.service.ts:90-92`** (in `update()`) and
   **`modules/homework_submissions/homework_submissions.service.ts:41-43` and `122-124`**
   (in `create()` and `update()`):
   ```ts
   data['files'] = files.map(async (file) => {
     return urlGenerator(this.config, file.filename);
   });
   ```
   `urlGenerator` is synchronous, but wrapping the callback in `async` makes `.map()`
   return `Promise<string>[]`, not `string[]`. This array of unresolved Promises gets
   written straight into a Prisma `String[]` column. (Contrast with
   `homeworks.service.ts` `create()` a few lines above, which does the same map
   *without* `async` — correctly. The bug is an inconsistency introduced in `update()`.)

4. **Filename extraction duplicated ~10+ times**: `someUrl.split('/').at(-1)` appears in
   `users.service.ts` (x3), `courses.service.ts` (x4), `homeworks.service.ts` (x2),
   `questions.service.ts` (x2), `homework_submissions.service.ts` (x2) — fragile, and
   only necessary because the DB stores a full URL instead of a bare filename.

5. **`core/error/validation.filter.ts:68-69`**:
   ```ts
   if (file && file['video'] && file['video'].path) {
     fs.unlink(file['video'], (err) => { ... });   // passes the file OBJECT, not .path
   }
   ```
   Should be `fs.unlink(file['video'].path, ...)`. As written this silently fails to
   delete the orphaned temp upload on validation errors for the `video` field.

6. **`getPathInFileType`'s `process.cwd()/../core/uploads` convention** is a hardcoded
   assumption shared between `generators.ts` and `Dockerfile`. Needs to be re-verified
   once Docker Compose / Render's working dir and volume mounts are finalized — if the
   run command or WORKDIR changes, uploads silently land in the wrong place (the
   `mkdirSync` call "succeeds" either way, so nothing errors — it just quietly breaks).

7. Stray `console.log` debug statements in the hot paths touched above
   (`generators.ts:45,75-76`; `file.helpers.ts:9`; `users.service.ts:25,40`, etc.) —
   low priority, clean up opportunistically while already editing these files.

## Fix steps (planned order)

1. **Stop storing full URLs — store the bare filename** (`file.filename` from multer) in
   every affected field: `User.image`, `Course.banner`, `Course.introVideo`, `Lesson.video`,
   `LessonFile.file`, `Homework.files[]`, `HomeworkSubmission.files[]`, `Question.file`.
   Remove the `urlGenerator()` calls from the write path in every `*.service.ts` `create`/
   `update` method.

2. **Build the full URL at read time instead**, in one centralized helper, applied when
   serializing responses (`findAll`/`findOne`/create/update response mapping) — so the URL
   always reflects the **current** `APP_BASE_URL`, never a stale one baked in at upload
   time. This is the actual fix for the Docker/Render dynamic-host problem.

3. **Delete the `someUrl.split('/').at(-1)` pattern everywhere** — once DB holds bare
   filenames, `unlinkFile(oldRecord.image)` etc. can be called directly, no parsing needed.

4. **Fix `courses.service.ts:119`** — becomes moot/trivial once step 1 lands (just store
   the `introVideo` filename param, no hardcoded `'intro'`).

5. **Fix the async-map bug** in `homeworks.service.ts` `update()` and
   `homework_submissions.service.ts` `create()`/`update()` — drop the unnecessary `async`,
   map directly to `file.filename` per step 1.

6. **Fix `MulterValidationExceptionFilter`** — correct `file['video']` → `file['video'].path`;
   consider generalizing the filter to walk all keys of `request.file`/`request.files`
   generically (array or `{fieldname: [file]}` shapes) instead of hardcoding
   `banner`/`introVideo`/`video`/single `file`, so newer fields (`file`, `files[]` used by
   lesson_files/homeworks/questions/homework_submissions) get cleaned up too on validation
   errors.

7. **Data migration for existing rows** — current DB rows already hold full URLs (buggy
   behavior to date). Before/alongside deploying the code fix, run a one-off script to
   normalize existing `image`/`banner`/`introVideo`/`video`/`file`/`files[]` values down to
   bare filenames (`value.split('/').at(-1)`), so old records don't silently 404 forever.
   Alternative: make the read-time URL-builder detect "already a full URL" (`startsWith('http')`)
   vs. "bare filename" and handle both during a transition window, then run the migration,
   then remove the defensive branch.

8. **Re-verify the `getPathInFileType` `process.cwd()/../core/uploads` assumption** against
   the final Docker Compose / Render setup once that's wired up — confirm uploads still land
   in a findable, persisted location. Explicitly a placeholder until cloud storage / a custom
   file service replaces local disk storage, per the already-agreed plan.

9. **Clean up stray `console.log`s** in the touched files (optional, lowest priority, do
   opportunistically).

## Modules/files touched by this fix

- `src/common/utils/generators.ts` (`urlGenerator`, `getPathInFileType`)
- `src/common/utils/file.helpers.ts` (`unlinkFile`)
- `src/common/utils/file.storage.ts` (no change expected — filename generation already fine)
- `src/core/error/validation.filter.ts` (`MulterValidationExceptionFilter`)
- `src/core/services/file.stream.service.ts` / `file.stream.controller.ts` (verify still
  works with bare-filename convention — should need no change)
- `src/modules/users/users.service.ts`
- `src/modules/courses/courses.service.ts`
- `src/modules/homeworks/homeworks.service.ts`
- `src/modules/homework_submissions/homework_submissions.service.ts`
- `src/modules/lesson_files/lesson_files.service.ts`
- `src/modules/lessons/lessons.service.ts`
- `src/modules/questions/questions.service.ts`

Not touched: `src/modules/mentor_profiles/*` — no file/image field exists on
`MentorProfile` in `prisma/schema.prisma`; the profile picture is `User.image`, already
covered under `users.service.ts`.
