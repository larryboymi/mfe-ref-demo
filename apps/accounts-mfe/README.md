# Accounts MFE

Micro-frontend that shows account balances, supports selections/favorites, and mirrors shared state for other MFEs.

- Data: uses `@demo/common/api/accounts` and `@demo/common/api/referenceData` with TanStack Query.
- State: wraps UI in `SelectionProvider` and `FavoritesProvider` from `@demo/common/store`, includes a selection mirror widget.
- UI: renders account cards with heart toggle for favorites and detail view when selected.
- Env/ports: pulled from `@demo/common` `env()`; Vite/Cypress configs reuse the same helper.

## Scripts
- `pnpm dev` – run MFE (default port 3001).
- `pnpm build` / `pnpm preview` / `pnpm serve-remote` – production build + standalone preview.
- `pnpm lint` – ESLint.
- `pnpm test` / `pnpm test:coverage` – Vitest suites.
- `pnpm e2e` / `pnpm e2e:open` – Cypress runner (requires API and host running).

## Notables
- Query client is provided by the shell when federated; local dev still bootstraps one per app.
- Shared selection/favorite state persists to `localStorage`, so switching between MFEs reflects the same choices.
