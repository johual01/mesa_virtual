# AGENTS.md - Proyecto_MesaVirtual
This file is for coding agents in `E:\DESARROLLO\Proyecto_MesaVirtual`.
It documents reliable commands and coding conventions observed in this repo.

## 1) Repository shape
- Monorepo-style layout with separate Node projects:
  - `backend/` -> Express + TypeScript + Mongoose API
  - `frontend/` -> Next.js 15 + TypeScript app
  - `packages/diceLogic/` -> local shared package dependency (`dicelogic`)
- Root `package.json` orchestrates backend + frontend processes only.
- Docker support exists via `docker-compose.yml` and app-specific Dockerfiles.

## 2) Setup and install
- Install root dependencies: `npm install`
- Install backend dependencies: `npm --prefix backend install`
- Install frontend dependencies: `npm --prefix frontend install`
- Keep `packages/dicelogic` present; backend and frontend both reference it via `file:`.

## 3) Build/lint/dev commands
### Root commands
- Start backend + frontend in dev mode: `npm run dev`
- Build backend + frontend: `npm run build`
- Start both built apps: `npm run start`

### Frontend commands (`frontend/`)
- Dev server: `npm --prefix frontend run dev`
- Build: `npm --prefix frontend run build`
- Start production server: `npm --prefix frontend run start`
- Lint: `npm --prefix frontend run lint`
- Type-check only: `npx tsc -p frontend/tsconfig.json --noEmit`

### Backend commands (`backend/`)
- Dev server: `npm --prefix backend run dev`
- Build TypeScript: `npm --prefix backend run build`
- Start compiled server: `npm --prefix backend run start`
- Type-check only: `npx tsc -p backend/tsconfig.json --noEmit`

### Docker commands
- Build and run all services: `docker compose up --build`
- Build and run in background: `docker compose up -d --build`
- Stop services: `docker compose down`

## 4) Test commands (current state)
- There is currently no working automated unit/integration test runner configured in root, frontend, or backend scripts.
- `packages/diceLogic/package.json` has a placeholder `test` script that exits with error.

### Single-test command
- Not currently available (no configured test framework).
- If you introduce tests, add and document these scripts immediately:
  - Run all tests
  - Run one file
  - Run one named test
- Suggested pattern examples (if adopting a framework):
  - Vitest single test: `vitest path/to/file.test.ts -t "test name"`
  - Jest single test: `jest path/to/file.test.ts -t "test name"`

## 5) Minimum verification before merge
- Frontend edits: run `npm --prefix frontend run lint`
- Backend edits: run `npm --prefix backend run build`
- Shared contract / cross-app changes: run `npm run build`

## 6) Linting and static analysis
- Frontend lint config is `frontend/eslint.config.mjs`.
- Enabled rulesets are `next/core-web-vitals` and `next/typescript`.
- Backend has no dedicated ESLint script; `tsc` build is the primary static check.

## 7) TypeScript conventions
- Both apps use `strict: true`.
- Prefer explicit interfaces/types for API contracts and domain data.
- Frontend:
  - Put shared contracts under `frontend/src/types/*.ts`
  - Keep service methods explicitly typed with `Promise<T>` returns
  - Hooks commonly model errors as `string | null`
- Backend:
  - Mongoose document interfaces use `I` prefix (`IUser`, `ICampaign`, etc.)
  - Existing enum naming includes lowercase enum type names (e.g., `campaignState`); preserve local convention
  - Handlers are typically typed as `(req: Request, res: Response)`

## 8) Import conventions
- Frontend:
  - Use `@/*` alias for app-internal imports (`@/components/...`, `@/types/...`)
  - Keep external imports before internal alias imports
  - Prefer `import type` for type-only imports
- Backend:
  - Use relative imports (`../models/...`, `./routes/...`)
  - Group external packages before local modules

## 9) Naming conventions
- React components: `PascalCase` names; most component files are `PascalCase.tsx`
- Hooks: `useX` naming in `frontend/src/hooks`
- Services: camelCase exports ending in `Service` (e.g., `characterService`)
- Next app routes: folder-based routing under `frontend/src/app/**/page.tsx`
- Backend:
  - Controllers end with `.controller.ts`
  - Route modules live in `backend/routes`
  - Model files are singular `PascalCase.ts`

## 10) Formatting conventions
- No dedicated Prettier configuration is present.
- Do not mass-reformat unrelated files.
- Frontend contains mixed style (generated UI + manual code); follow local file style for:
  - quote type (`'` or `"`)
  - semicolon usage
  - indentation width

## 11) Error handling conventions
- Frontend services:
  - Use `fetch`, check `response.ok`, parse JSON error payload fallback, then `throw new Error(...)`
  - Error key fallback order is commonly `errMsg` then `message`
- Frontend hooks/components:
  - Wrap async flows in `try/catch/finally`
  - Convert unknown errors with `err instanceof Error ? err.message : <fallback>`
- Backend controllers:
  - Validate required input early and return `4xx` when missing/invalid
  - Use `try/catch` around DB and side-effect operations
  - Return structured JSON errors, commonly `{ errMsg: string, error?: unknown }`
  - Frequent status codes: `400`, `401`, `403`, `404`, `500`

## 12) API and auth patterns
- Backend route prefixes:
  - Auth under `/auth`
  - Main API under `/api`
- Frontend API base uses `NEXT_PUBLIC_URL_API` with localhost fallback.
- Auth behavior uses bearer tokens + refresh-token cookie (`credentials: 'include'`).
- Preserve existing response keys (`message`, `errMsg`, payload objects).

## 13) Environment and config notes
- Backend env is loaded and validated in `backend/env.ts`.
- Missing required backend env keys throw at startup.
- Frontend uses Next env vars (`NEXT_PUBLIC_URL_API`, `NEXT_PUBLIC_BASE_PATH`).
- Docker compose provisions MongoDB, MinIO, backend, frontend, and Nginx.

## 14) CI/CD notes
- GitHub Actions workflow exists at `.github/workflows/nextjs.yml`.
- It currently builds/deploys frontend (GitHub Pages flow), using Node 20 and `next build`.

## 15) Cursor/Copilot instruction files
- Checked for Cursor rules:
  - `.cursorrules` -> not found
  - `.cursor/rules/` -> not found
- Checked for Copilot instructions:
  - `.github/copilot-instructions.md` -> not found
- No repository-level Cursor/Copilot rule files are currently available to merge.

## 16) Agent workflow recommendations
- Before coding:
  - Read target module and neighboring service/type files
  - Confirm whether change belongs to frontend, backend, or both
- After coding:
  - Run minimum verification commands from section 5
  - If adding tests, update this file with exact run-all and run-single-test commands
