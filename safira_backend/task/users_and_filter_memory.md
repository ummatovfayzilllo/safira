---
Work Package A — users.service.ts + validation.filter.ts
Status: DONE
---

## Scope
- `src/modules/users/users.service.ts`
- `src/core/error/validation.filter.ts`

## Changes made

1. **Bare-filename storage instead of full URL** (`users.service.ts`)
   - `create()` (~line 32-34): `data['image'] = urlGenerator(this.config, image)` → `data['image'] = image`.
   - `updateImage()` (~line 51-52): removed `const image = urlGenerator(this.config, imageName)`; now writes `{ image: imageName }` directly to Prisma.
   - `update()` (~line 147-148): `data['image'] = urlGenerator(this.config, image)` → `data['image'] = image`.

2. **Read-time URL building** — added a private helper right after the constructor:
   ```ts
   private withImageUrl<T extends { image?: string | null }>(entity: T): T {
     return {
       ...entity,
       image: entity.image ? urlGenerator(this.config, entity.image) : entity.image,
     };
   }
   ```
   Applied to every method that returns a user object with an `image` field:
   - `create()` — wraps `newUser` before returning.
   - `updateImage()` — wraps `updatedUser` before returning.
   - `findAll()` — `users.map((user) => this.withImageUrl(user))`.
   - `findOne()` — wraps `user` before returning.
   - `update()` — wraps `updatedUser` before returning (key renamed nothing, still `updatedUser`).
   - `remove()` — deliberately NOT wrapped; `deletedUser` is going away anyway and the record is only returned as a delete confirmation, not a "usable" user object. Left as-is.

   Checked `findOne()`'s `includeMentorProfile` branch: `mentorProfile`'s select block (`about`, `job`, `experience`, `telegram`, `instagram`, `linkedin`, `facebook`, `github`, `website`, `createdAt`, `updatedAt`) has **no image-like field**, so no extra handling was needed there — `withImageUrl` only touches the top-level `user.image`, which is correct.

3. **Removed `.split('/').at(-1)` pattern** — `updateImage()`, `update()`, `remove()` now call `unlinkFile(oldUser.image)` directly on the bare filename already in the DB, guarded by the existing `if (oldUser.image)` checks.

4. **`validation.filter.ts` `.path` bug** (line ~69): `fs.unlink(file['video'], ...)` → `fs.unlink(file['video'].path, ...)`. Was passing the multer file object instead of its path string.

## Verification
- `npx tsc --noEmit` from `safira_backend/` → **0 errors**, project-wide clean.
- No other files touched. No git operations performed (no add/commit).

## Deviations / issues
None. Plan followed as specified.

## Kamchiliklar (supervisor review)

No package-specific defects found in this diff — verified against `git diff` directly,
matches the self-report exactly.

One **shared, cross-package** gap was found during supervisor review (not specific to
this package, but affects `withImageUrl()`'s correctness here too): `urlGenerator()`
did not handle legacy DB rows that still hold a full URL (written before this fix).
Feeding a full URL back into `urlGenerator()` produced a double-wrapped broken URL
(`http://host/api/image/http://host/api/image/x.png`), and `unlinkFile()` would build
a bogus path and silently fail to delete legacy files. **Fixed by the supervisor** in
`common/utils/generators.ts` (`urlGenerator`) and `common/utils/file.helpers.ts`
(`unlinkFile`) — both now detect an `http(s)://`-prefixed input and re-derive the bare
filename before proceeding, so `withImageUrl()` here now works correctly for legacy
rows too, without needing the data migration to run first.

Minor pre-existing inconsistency (not introduced by this fix, not touched): `update()`
returns `{ message, updatedUser }` instead of `{ message, data }` like every other
method in this file. Cosmetic, out of scope.
