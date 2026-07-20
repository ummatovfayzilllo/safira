# syntax=docker/dockerfile:1
ARG NODE_VERSION=22-alpine

# ---------------------------------------------------------------------------
# 1) builder: full deps + prisma client + TypeScript build
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app/backend

# bcrypt is a native addon; python3/make/g++ are needed to compile it on alpine
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# 2) runner: production-only deps + compiled output
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app/backend
ENV NODE_ENV=production

# openssl is required at runtime by the Prisma query engine on alpine
RUN apk add --no-cache openssl \
    && addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY package.json package-lock.json ./
# drop the "prepare" (husky) lifecycle script — husky is a devDependency and
# only wires up local git hooks, meaningless (and absent) in this stage
RUN npm pkg delete scripts.prepare
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && npm ci --omit=dev \
    && apk del .build-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/backend/dist ./dist

# getPathInFileType() in src/common/utils/generators.ts resolves uploads to
# join(process.cwd(), '..', 'core', 'uploads', <type>) — with WORKDIR
# /app/backend that's /app/core/uploads. Keep this in sync with docker-compose.yml.
RUN mkdir -p /app/core/uploads \
    && chown -R nestjs:nodejs /app/core/uploads

USER nestjs
EXPOSE 15975

# tsconfig has no rootDir, so tsc preserves the src/ prefix in dist/ output
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
