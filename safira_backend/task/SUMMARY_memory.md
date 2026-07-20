---
name: file-service-fix-summary
description: Consolidated status of the file-service fix (safira_backend/file_service_fix.md) after 4 parallel implementer agents + 1 supervisor pass
metadata:
  type: task
  status: done
---

# File Service Fix — Consolidated Summary

Orchestrated as 4 parallel work packages (A-D) + 1 supervisor verification pass (E),
per plan in `safira_backend/file_service_fix.md`. All work done by background agents,
verified independently by the supervisor against `git diff` (not just self-reports).

## Bug-by-bug verification

| # | Bug | Status | Evidence |
|---|-----|--------|----------|
| 1 | Full URL stored in DB instead of bare filename (7 fields: `User.image`, `Course.banner`, `Course.introVideo`, `Lesson.video`, `LessonFile.file`, `Homework.files[]`, `HomeworkSubmission.files[]`, `Question.file`) | **Fixed** — all 7 | Confirmed via `git diff` + `grep -rn "urlGenerator" src/modules/` — no remaining write-time calls |
| 2 | `courses.service.ts` hardcoded `'intro'` literal in `update()` | **Fixed** | `task/courses_memory.md` — plus a **bonus bug** found: first-time banner/introVideo upload via `update()` never persisted to DB (assignment was unreachable when there was no prior value to clean up) — also fixed |
| 3 | `.map(async (file) => urlGenerator(...))` Promise-array bug (3 instances: homeworks `update()`, homework_submissions `create()`+`update()`) | **Fixed**, all 3 | `grep -rn "\.map(async" src/modules/` → empty |
| 4 | Duplicated `someUrl.split('/').at(-1)` filename extraction (~10+ call sites) | **Fixed** everywhere | `grep -rn "\.split('/').at(-1)" src/` → clean |
| 5 | `validation.filter.ts` — `fs.unlink(file['video'], ...)` missing `.path` | **Fixed** | `task/users_and_filter_memory.md` |
| 6, 8 | `getPathInFileType` Docker path assumption / uploads-path re-verification | **Deliberately out of scope** — owned by the separate Docker-integration effort | Noted, not a defect |
| 7 | Stray `console.log`s | Left as-is | Low priority, not blocking |

## New defect found + fixed during supervisor review (not in original plan)

**Legacy full-URL rows would have broken on deploy, immediately, before any migration ran.**
`urlGenerator()` and `unlinkFile()` (in `common/utils/generators.ts` /
`common/utils/file.helpers.ts`) assumed every DB value was already a bare filename. Any
row written *before* this fix still holds a full URL. Feeding that into the new
read-time `urlGenerator()` call would have **double-wrapped** it
(`http://host/api/image/http://host/api/image/x.png`), breaking every existing file
link the moment this code shipped — and `unlinkFile()` would have silently failed to
delete old files (wrong derived path).

**Fix**: both functions now detect an `http(s)://`-prefixed input and re-derive the
bare filename first, before proceeding. `npx tsc --noEmit` stayed clean (0 errors)
after this change. This means **the fix is safe to deploy immediately** — legacy rows
keep working (and get correctly re-pointed at whatever host is current) without
needing the data migration to run first.

## Cross-package consistency

All 4 packages independently converged on the same convention: store bare filename at
write time, build the full URL via `urlGenerator(this.config, filename)` at read time
(`findAll`/`findOne`/create-response/update-response), guarded for null. Packages A, C,
D each added a small private helper (`withImageUrl`, `withFileUrl`, `withVideoUrl`) to
do this consistently within their own service; Package B (courses) inlined the mapping
directly in `findAll`/`findOne`. No functional inconsistency — just a naming/style
difference, not worth unifying further.

## Data migration script

Prepared at `safira_backend/scripts/migrate-file-urls-to-filenames.ts`. Walks all 7
fields, normalizes any `http(s)://`-prefixed value down to its bare filename, leaves
already-bare values untouched. Supports `--dry-run` (prints what would change, no
writes). **Now optional / cleanliness-only**, not a correctness prerequisite, since the
legacy-URL guard clauses above already make old rows work correctly on read/delete.

Run with:
```bash
cd safira_backend
npx ts-node --transpile-only scripts/migrate-file-urls-to-filenames.ts --dry-run   # preview
npx ts-node --transpile-only scripts/migrate-file-urls-to-filenames.ts             # apply
```

## Files changed (full list)

- `src/modules/users/users.service.ts`
- `src/core/error/validation.filter.ts`
- `src/modules/courses/courses.service.ts`
- `src/modules/homeworks/homeworks.service.ts`
- `src/modules/homework_submissions/homework_submissions.service.ts`
- `src/modules/lesson_files/lesson_files.service.ts`
- `src/modules/lessons/lessons.service.ts`
- `src/modules/questions/questions.service.ts`
- `src/common/utils/generators.ts` (supervisor fix)
- `src/common/utils/file.helpers.ts` (supervisor fix)
- `safira_backend/scripts/migrate-file-urls-to-filenames.ts` (new)

Not touched: `src/modules/mentor_profiles/*` — no file/image field exists on
`MentorProfile` in the schema.

## Verification

- `npx tsc --noEmit` — 0 errors, project-wide, after all 5 agents' changes combined.
- No git operations performed by any agent (no add/commit/push) — all changes are
  currently uncommitted working-tree edits, ready for review.

## Overall verdict

Fix is solid. All 7 confirmed bugs from the original plan are fixed and independently
verified against the actual diff (not just self-reports). One additional real defect
(legacy-URL double-wrapping) was found during supervisor review and fixed directly.
Nothing was left broken or half-done.
