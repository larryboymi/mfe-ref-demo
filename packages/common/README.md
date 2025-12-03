# @demo/common

Shared utilities for MFEs and the shell: API clients, env loader, query client factory, and cross-app state stores.

## Exports
- `api/accounts`, `api/positions`, `api/referenceData`: TanStack Query-friendly fetchers and hooks that read `apiBaseUrl` from `env()`.
- `env`, `getEnv`: resolves ports and API base from `import.meta.env` with process/env fallbacks; defaults to 3000/3001/3002 and `http://localhost:3050`.
- `queryClient`: factory that returns a configured `QueryClient`.
- Stores:
  - `store/baseStore`: generic `createPersistentStore`, `createStoreContext` helpers (uses `useSyncExternalStore`, persists to `localStorage`).
  - `store/selectionStore`: shared selection state `{ activeId }`.
  - `store/favoritesStore`: shared favorites `{ ids }`.
- `__envTestUtils`, `__storeTestUtils`: testing aids for env and store internals.

## Scripts
- `pnpm lint`
- `pnpm test` / `pnpm test:coverage` – Vitest with v8 coverage.

## Usage notes
- All stores are singletons; wrap apps with `SelectionProvider` and `FavoritesProvider` to avoid invalid hook calls.
- Env helper is used by Vite, Cypress, and API server to keep ports and API base consistent.
