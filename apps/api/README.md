# API service

Express API backed by in-memory sqlite (sql.js) to feed the MFEs.

- Endpoints: `GET /accounts`, `GET /positions`, `GET /reference-data`, `GET /health`.
- Data: tables seeded from `src/data.ts` (accounts, positions, institutions) with foreign keys enforced.
- Cross-origin: CORS enabled for the shell/remote ports defined in env.
- Types: uses shared models from `@demo/types`.

## Scripts
- `pnpm dev` – run with `vite-node src/server.ts` (auto-reloads).
- `pnpm build` / `pnpm start` – compile with `tsc` and run built server.
- `pnpm lint` – ESLint.
- `pnpm test` / `pnpm test:coverage` – Jest suites for endpoints and DB wiring.

## Config notes
- Server and allowed origins derive from `@demo/common` env helper to match the MFEs.
- Swap to persistent sqlite by replacing the sql.js adapter if desired; seed data lives in `src/data.ts`.
