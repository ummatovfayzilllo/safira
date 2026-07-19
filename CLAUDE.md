# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**edfix_front_in_next** is a Next.js 16 frontend application with React 19, TypeScript, and Tailwind CSS v4.

### Critical: Next.js 16 Breaking Changes

This project uses **Next.js 16.2.10**, which has breaking changes from earlier versions. Before writing any code:
- Read the relevant guide in `node_modules/next/dist/docs/` for the feature you're implementing
- Pay close attention to deprecation notices
- APIs, conventions, and file structure may differ from training data

## Common Development Tasks

### Start Development Server
```bash
npm run dev
```
Opens http://localhost:3000 with hot module reloading.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```
Runs the production build locally. Must run `npm run build` first.

### Run Linter
```bash
npm run lint
```
Uses ESLint with Next.js core web vitals and TypeScript configs. Run before committing.

## Architecture & Structure

### App Router
This project uses Next.js App Router (not Pages Router):
- **`app/`** — Contains all routes, layouts, and pages
  - `layout.tsx` — Root layout applied to all pages
  - `page.tsx` — Root page at `/`
  - `globals.css` — Global styles with Tailwind directives

### Styling
- **Tailwind CSS v4** with PostCSS
- `postcss.config.mjs` — PostCSS configuration (handles Tailwind)
- Styles in `app/globals.css`

### TypeScript Configuration
- **Target:** ES2017
- **Strict mode enabled** — No implicit any, strict null checks
- **Path alias:** `@/*` maps to project root for clean imports
- `tsconfig.json` includes `.next/types/` for Next.js generated types

### ESLint Configuration
- Uses `eslint-config-next` with core web vitals and TypeScript rules
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Dependencies
- `next@16.2.10` — React framework
- `react@19.2.4`, `react-dom@19.2.4` — UI library
- `tailwindcss@^4` — CSS utility framework
- `typescript@^5` — Type checking
- `eslint@^9`, `eslint-config-next` — Linting

## Import Convention
Use the `@/` alias for imports:
```typescript
// Good
import Component from '@/app/components/MyComponent';

// Avoid
import Component from '../app/components/MyComponent';
```

## State Management & API

### Zustand Stores
- **`features/stores/authStore.ts`** — User authentication state (user, tokens, loading, error)
- **`features/stores/apiStore.ts`** — Global API state (loading, error, success messages)

### Axios Instance
- **`features/api/axiosIntanse.ts`** — Configured with automatic token injection and 401 refresh
  - Automatically handles token refresh on 401 responses
  - Stores tokens in localStorage
  - Injects `Authorization: Bearer <token>` header to all requests

### Auth Hooks
Located in `features/auth/hocks/auth.hocks.ts`:
- `useRegister()` — Registration flow
- `useVerify()` — Email verification
- `useLogin()` — Login
- `useResetPassword()` — Start password reset
- `useResetPasswordVerify()` — Complete password reset
- `useLogout()` — Logout and clear state

### General API Hooks
Located in `features/hooks/useApiCall.ts`:
- `useApiCall()` — Generic hook for any HTTP request
- `useGet()` — GET requests
- `usePost()` — POST requests
- `usePatch()` — PATCH requests
- `useDelete()` — DELETE requests

### Usage Example
```typescript
import { useLogin } from '@/features';

export default function LoginPage() {
  const login = useLogin();
  const { isLoading, error } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // Tokens are automatically stored
    } catch (err) {
      // Error is in store
    }
  };

  return (
    <form onSubmit={() => handleLogin(...)}>
      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
    </form>
  );
}
```

## Notes
- The project uses `.mjs` extensions for config files (ES modules)
- Next.js automatically generates types in `.next/types/` — do not edit manually
- The `/public` directory serves static assets
- Environment variables: `NEXT_PUBLIC_API_BASE_URL` sets the API base URL (default: http://localhost:3000)
