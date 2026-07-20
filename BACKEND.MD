# Backend — Docker & CI/CD

Status as of 2026-07-19. Covers `safira_backend/` containerization and the
GitHub Actions pipeline. Written after the setup was built and verified with
a real `docker compose up` run (migrations applied, server started, `GET
/api/courses/getall` returned 200).

## Files

- `safira_backend/Dockerfile` — multi-stage build (`builder` compiles with
  full deps, `runner` is the production image with prod-only deps).
- `safira_backend/.dockerignore`
- `safira_backend/docker-compose.yml` — `backend` + `db` (Postgres 16),
  named volumes `pgdata` and `uploads`. Local/dev use only — Render does not
  run this file, it builds the `Dockerfile` directly as a native Docker
  service.
- `.github/workflows/ci-cd.yml` (repo root) — lint → test → build →
  docker-build-validate → trigger Render deploy hook (on push to `main`
  only).

## Dead workflow removed

`safira_backend/.github/workflows/deploy.yml` used to exist but **never
actually ran** — GitHub Actions only reads `.github/workflows/` from the
*repository root*, not from nested subdirectories. Once `safira_front` and
`safira_backend` were merged into one repo (subtree merge), this file
silently stopped being live CI. It's been replaced by the root-level
`ci-cd.yml`, which uses `defaults.run.working-directory: safira_backend`
and `paths: ['safira_backend/**']` so frontend-only commits don't trigger it.

## Bugs found while building the Docker image

These aren't Docker-specific bugs, but the image build is what surfaced them:

1. **`prepare` script breaks prod-only installs.** `package.json`'s
   `scripts.prepare` runs `husky`, but `husky` is a devDependency. Any
   `npm ci --omit=dev` (as the Dockerfile runner stage does) fails with
   `husky: not found`. Fixed in the Dockerfile via
   `npm pkg delete scripts.prepare` right before the prod install — husky
   only wires up local git hooks, meaningless inside a container.

2. **Build output path.** `tsconfig.json` has no `rootDir`, so `tsc`
   preserves the `src/` prefix under `dist/`: the real entry point is
   `dist/src/main.js`, not `dist/main.js`. The Dockerfile `CMD` accounts for
   this explicitly (commented, so it doesn't silently rot if the build
   config changes).

## Uploads / local disk storage — the one fragile piece

`src/common/utils/generators.ts` → `getPathInFileType()` resolves every
uploaded file's disk location as:

```
join(process.cwd(), '..', 'core', 'uploads', <images|videos|docs|axrchive>)
```

This assumes the running process's CWD is a `backend/`-like directory
sitting next to a sibling `core/` dir. The Dockerfile sets
`WORKDIR /app/backend`, so in the container this resolves to
`/app/core/uploads` — that's exactly where `docker-compose.yml` mounts the
`uploads` named volume. **If the Dockerfile's `WORKDIR` ever changes, this
volume mount must move with it**, or uploads will silently start landing
outside the persisted volume (no error — `mkdirSync` just creates whatever
path it's given).

See `safira_backend/file_service_fix.md` for the broader plan already in
progress to fix this properly (bare-filename storage + URL built at read
time, eventually a dedicated file-service). That work is orthogonal to the
Docker setup — once it lands, only the volume mount target in
`docker-compose.yml` (and the equivalent Render disk mount path) needs to
follow wherever the new convention points.

## Deploying to Render — required manual steps

The pipeline builds/validates the image and pings Render's deploy hook, but
these are one-time dashboard setup steps Render doesn't pick up from the
repo automatically:

- **Service type must be Docker**, not the current buildpack/Node runtime —
  set Root Directory to `safira_backend` so Render finds the `Dockerfile`.
- **Persistent disk required for uploads.** Render's container filesystem is
  ephemeral — anything written to `/app/core/uploads` is wiped on every
  deploy/restart unless a Render Disk (paid feature) is attached at that
  exact path. Until the file-service fix moves storage off local disk, this
  is a real data-loss risk in production, not just a dev inconvenience.
- **Environment variables** to set in the Render dashboard (not read from
  `.env`, which never enters the image — see `.dockerignore`):
  `DATABASE_URL` (Render Postgres instance), `APP_BASE_URL` (the service's
  public Render URL), `ALLOWED_ORIGINS`, `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`, `EMAIL_*`. `PORT` is injected by Render itself —
  `main.ts` already respects `process.env.PORT` so no change needed there.
- **Secrets already referenced by CI:** `RENDER_SERVICE_ID` and
  `RENDER_API_KEY` GitHub Actions secrets (used by the old dead workflow
  too) — confirm they're still valid for whichever Render service ends up
  hosting the Docker build.

## Local dev with Docker

```bash
cd safira_backend
docker compose up -d --build
```

- Backend: `http://localhost:15975/api-docs`
- Postgres is **not** exposed to the host by default (avoids clashing with
  a locally-running Postgres on the standard 5432 port) — the backend
  reaches it over the compose network as `db:5432`. Uncomment the `ports:`
  block under the `db` service in `docker-compose.yml` (pick a free host
  port) if you need `psql` access from the host.
- `docker compose down` stops both containers; add `-v` to also wipe the
  named volumes (`pgdata`, `uploads`) if you want a clean-slate DB/uploads.
