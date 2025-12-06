# vedio-jarvis

TL resources for vedio generation

## Frontend — Install & Run

Prerequisites:

- Node.js >= 22.12.0
- pnpm (recommended)

Commands:

```bash
# from repo root
cd frontend
pnpm install
pnpm dev      # start Vite dev server
pnpm build    # build for production
pnpm preview  # preview built app
```

If you don't have Node 22 installed, use a version manager, for example:

```bash
# using fnm (example)
brew install fnm
fnm install 22
fnm use 22
```

Notes:

- The frontend project is scaffolded with Vite + React + TypeScript and expects ESM (see `frontend/package.json` and `frontend/tsconfig.node.json`).

## Backend — Install & Run

Prerequisites:

- Node.js >= 22.12.0
- pnpm (recommended)

Commands:

```bash
# from repo root
# create a root .env from the sample and edit DATABASE_URL / PORT as needed
cp .env.sample .env
cd backend
pnpm install
pnpm dev      # start dev server (uses `tsx watch src/server.ts`)
pnpm build    # tsc build
pnpm start    # run built app (after build)
```

Notes:

- The backend is TypeScript + Node (ESM). The project uses a centralized config loader that reads the repository root `.env` file (not `.env.development`). Create a root `.env` by copying `.env.sample` to `.env` and editing `DATABASE_URL` and `PORT` before starting the server.
- Node does not read `.env` automatically; the backend's `config.ts` uses `dotenv` to load the root `.env` at startup so `process.env` contains those values.
- Security: do not commit your actual `.env` with secrets — keep `.env` in `.gitignore` and commit only `/.env.sample`.
- If you prefer an alternative, you can set env vars directly in the shell when starting:

```bash
PORT=4000 pnpm -C backend dev
# or cross-platform
npx cross-env PORT=4000 pnpm -C backend dev
```

- Optionally, the code can be extended to validate required env vars in production; contact me if you want automatic validation (e.g. fail when `DATABASE_URL` is missing in production).

## Docker (Postgres)

The repository includes a `docker-compose.yml` that runs a stable PostgreSQL 15 image for local development.

Environment variables

- The compose file reads DB credentials from the repository root `.env`. Ensure these keys exist in `.env`:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_PORT=5432
DATABASE_URL="postgresql://user:password@localhost:5432/postgres?schema=public"
```

Start Postgres

```bash
docker compose up -d
```

Stop Postgres and remove containers

```bash
docker compose down
```

## Lint & Format

This repository includes ESLint and Prettier configuration at the repository root. Run the following from the repo root to check or fix code style across the workspace:

```bash
# install workspace deps first
pnpm install

# lint TypeScript files (type-aware ESLint rules require tsconfig.json paths)
pnpm lint

# fix lint issues automatically
pnpm lint:fix

# check formatting
pnpm format:check

# format files with Prettier
pnpm format
```

## Pre-commit Hook

- **What it runs:** on `git commit` the repository's pre-commit hook (installed by Husky) runs:
  - `lint-staged` to run `eslint --fix` and `prettier --write` against staged `*.{js,jsx,ts,tsx}` files (fixes are applied and re-staged automatically).
  - The workspace test script in CI mode: `pnpm -w run test:ci` (runs `vitest --run` across `frontend`, `backend`, and `shared`).

- **Why:** this prevents committing code that fails linting/formatting or breaks tests.

- **How to install (automatically):** Husky hooks are installed by the `prepare` hook in `package.json` when running `pnpm install`. Run this once after cloning the repo:

```bash
pnpm install
```
