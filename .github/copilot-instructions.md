## Repo Copilot Instructions

Purpose: give quick, actionable guidance to an AI assistant about where to find code and how to run common tasks for this monorepo.

Repository layout (top-level)

- `frontend/` — Vite + React + TypeScript (ESM). Contains UI app and Vite config.
- `backend/` — Express + TypeScript (ESM). Server code and Prisma schema live here.
- `shared/` — shared utilities and types used across packages.
- `package.json` — root workspace file (pnpm workspaces + Turbo orchestration).
- `pnpm-workspace.yaml` — pnpm workspace definition.
- `turbo.json` — turborepo pipeline (dev/build/lint/test etc.).
- `eslint.config.js` — root ESLint flat config used across packages.
- `.eslintignore` — ignore patterns for ESLint.
- `.husky/` — Husky hooks (pre-commit runs lint-staged and workspace tests).
- `.github/PULL_REQUEST_TEMPLATE.md` — PR template.

Key workspace conventions

- Package manager: `pnpm` (root `packageManager` in `package.json`). Use `pnpm -w` at the repo root for workspace-level commands.
- Node: pinned to Node >= 22.12.0 (see `.nvmrc`). Projects use ESM (`"type": "module"`).
- Tooling: Turborepo (`turbo`) orchestrates `dev`, `build`, `start`, `lint`, `format`, `test`.
- Lint/format: ESLint (flat `eslint.config.js`) + Prettier. Pre-commit hook runs `lint-staged` then `pnpm -w run test:ci`.
- Tests: Vitest per-package (`vitest.config.ts` in each package). Root scripts: `test`, `test:ci`, `test:coverage`.

Common commands

- Install workspace deps: `pnpm install`
- Dev (parallel): `pnpm run dev` (runs Turbo dev across packages)
- Build: `pnpm run build`
- Start: `pnpm run start`
- Lint: `pnpm run lint` — lint all packages via Turbo
- Fix lint: `pnpm run lint:fix`
- Format: `pnpm run format`
- Run tests (CI): `pnpm -w run test:ci`
- Generate coverage: `pnpm -w run test:coverage` (per-package coverage files)

Frontend specifics (`frontend/`)

- Entry points: `frontend/src/main.tsx` and `frontend/index.html`.
- Dev server: `pnpm -C frontend dev` or `pnpm run dev` at root runs Turbo which starts frontend dev.
- Build: `pnpm -C frontend build`.
- Vitest config: `frontend/vitest.config.ts` (uses `jsdom` environment).

Backend specifics (`backend/`)

- Layout: the backend follows a layered structure to separate concerns:
  - `backend/src/routes/` — HTTP route definitions that compose controllers.
  - `backend/src/controllers/` — translate HTTP requests to service calls and return responses.
  - `backend/src/services/` — business logic and orchestration.
  - `backend/src/models/` — TypeScript domain models and types.
  - `backend/src/repositories/` — data access code (Prisma client usage lives here).
  - `backend/src/utils/` — shared utilities and config (e.g., `config.ts`).

- Entry: `backend/src/server.ts` (wires middleware, routes and starts Express). `backend/src/utils/config.ts` reads the repo `.env` by default.
- Dev: `pnpm -C backend dev` (starts the backend dev script defined in `backend/package.json`).
- Debug: use the VS Code `launch.json` configuration to run `pnpm -C backend run dev` or attach to `--inspect` port.
- Prisma: schema in `backend/prisma/schema.prisma`. Place repository-level DB access in `backend/src/repositories/` and call from services.
- API use Restful style.
- Tests: `backend/vitest.config.ts` (node environment) — place unit tests alongside modules (e.g., `services/*.test.ts`).

Shared specifics (`shared/`)

- Contains shared types/validators (e.g., `zod`) and utilities. Entry typically `shared/src/index.ts`.
- Vitest config: `shared/vitest.config.ts` (node environment).

Notes for the assistant (operational guidance)

- Prefer workspace-level commands run from repo root using `pnpm -w` and `turbo` for consistency.
- When editing ESLint or vitest configs, update the package-level config files (`frontend/vitest.config.ts`, `backend/vitest.config.ts`, `eslint.config.js`) and re-run `pnpm -w install` if adding devDependencies.
- For DB work: `docker compose up -d` runs Postgres; check `.env` for DB credentials. If the named Docker volume contains an existing DB, initialization will be skipped — choose to create missing DBs inside the container or reinitialize the volume.
- Pre-commit behavior: `.husky/pre-commit` runs `lint-staged` then `pnpm -w run test:ci`. If this is too slow, suggest moving full test run to `pre-push` and keep `pre-commit` only for `lint-staged`.

Where to change scripts

- Root scripts: edit `package.json` at repository root (e.g., add CI/test scripts or change Turbo invocation).
- Per-package scripts: edit `frontend/package.json`, `backend/package.json`, or `shared/package.json`.

If asked to add features

- Adding CI workflow: create `.github/workflows/ci.yml` that runs `pnpm install`, `pnpm -w run lint:fix` (or `lint`), `pnpm -w run test:ci`, and optionally `pnpm -w run test:coverage`.
- Aggregating coverage: run per-package `vitest --run --coverage` then collect `coverage/lcov.info` from each package and merge with a tool (or add a `scripts/collect-coverage.js`).

When in doubt, run small commands locally and report back errors and logs so the maintainer can choose corrective action.
