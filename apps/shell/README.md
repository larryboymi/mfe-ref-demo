# Shell app

Host/aggregator for the micro-frontends. Loads remotes via Vite federation, wires shared providers, and renders navigation plus the Accounts and Reporting widgets.

- Boots a shared `QueryClientProvider` from `@demo/common/queryClient` and wraps children in `SelectionProvider` and `FavoritesProvider` so stores are shared across MFEs.
- Reads ports and API base via `@demo/common` `env()` to keep dev/preview/E2E in sync.
- Renders links and remote components from `accounts-mfe` and `reporting-mfe`; local mocks live in `apps/shell/tests/mocks`.

## Scripts
- `pnpm dev` – run shell at configured port (default 3000).
- `pnpm build` / `pnpm preview` – production build and preview.
- `pnpm lint` – ESLint.
- `pnpm test` / `pnpm test:coverage` – Vitest suites.
- `pnpm e2e` / `pnpm e2e:open` – Cypress runner (expects shell + remotes + API running).

## Config notes
- `vite.config.ts` pulls ports from `@demo/common` env helper.
- Cypress config reads the same env inside `setupNodeEvents`.
- Uses `@demo/common` API clients and stores; react/query deduped via shared provider.
