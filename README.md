# My MFE Demo

Monorepo showing a shell plus two micro-frontends backed by a small API. Shared libraries handle types, API clients, query wiring, and cross-MFE state for selections and favorites.

## Getting started
1. Install deps: `pnpm install`
2. Run everything: `pnpm dev:all`
3. Open `http://localhost:3000` to load the shell; remotes (accounts 3001, reporting 3002) and API (3050) are started automatically. Click through Accounts and Reporting to see shared selections and favorites reflected across MFEs.

- **Apps**
  - `apps/shell`: host/aggregator loading remotes, bootstraps shared QueryClient and store providers.
  - `apps/accounts-mfe`: accounts UI with TanStack Query data, favorites toggle, and selection mirroring.
  - `apps/reporting-mfe`: positions table with reference-data lookups plus shared selection tree.
  - `apps/api`: Express + in-memory sqlite (sql.js) exposing `/accounts`, `/positions`, `/reference-data`, `/health` with CORS enabled.
- **Packages**
  - `packages/types`: shared types for accounts, positions, institutions, etc.
  - `packages/common`: API clients, env loader, query client factory, and reusable selection/favorites stores built on `useSyncExternalStore`.
  - `packages/ui`: small React primitives (`Card`, `Button`) and a `SelectionDemo` that consumes the shared stores.
- **Config highlights**
  - Ports and API base come from `@demo/common` `env()` so Vite configs and Cypress reuse the same values.
  - Query clients are created in `@demo/common/queryClient` to avoid duplicate React Query instances.
  - Store state persists to `localStorage` by default and can be shared across MFEs.

## Scripts
- `pnpm dev:shell` / `dev:api` / `preview:accounts` / `preview:reporting`: run individual apps.
- `pnpm dev:all`: shell + both MFEs (preview) + API together.
- `pnpm lint`, `pnpm test`, `pnpm test:coverage`: run across the workspace.
- `pnpm e2e`, `pnpm e2e:open`: run Cypress suites (expects dev servers running).

## Development notes
- Each app/package also exposes `lint`, `test`, and `test:coverage` locally.
- Environment is resolved from `import.meta.env` with process env fallback; defaults to ports 3000/3001/3002 and API `http://localhost:3050`.
- Federation remotes/host Vite configs read ports from `@demo/common` to keep host/remotes in sync.
