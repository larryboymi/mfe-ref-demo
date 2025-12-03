# Reporting MFE

Micro-frontend that renders positions with totals, favorites, and a shared selection tree.

- Data: uses `@demo/common/api/positions` and `@demo/common/api/referenceData` via TanStack Query, with institution lookups.
- State: wrapped in `SelectionProvider` and `FavoritesProvider` from `@demo/common/store`; selection tree drives shared state, and favorites are shown inline with heart icons.
- UI: `PositionsTable` shows holdings, totals, and error state when fetch fails.
- Env/ports: configured through `@demo/common` `env()` so Vite/Cypress share the same baseUrl and port.

## Scripts
- `pnpm dev` – run MFE (default port 3002).
- `pnpm build` / `pnpm preview` / `pnpm serve-remote` – production build + standalone preview.
- `pnpm lint` – ESLint.
- `pnpm test` / `pnpm test:coverage` – Vitest suites.
- `pnpm e2e` / `pnpm e2e:open` – Cypress runner (requires API and host running).

## Notables
- Selection tree component is shared through `@demo/ui` while the store lives in `@demo/common`, demonstrating cross-MFE state without prop drilling.
- Query client is provided by the shell when federated; local dev mounts its own.
