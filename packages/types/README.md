# @demo/types

Shared TypeScript models consumed by the API, MFEs, and common utilities.

- `Account`, `Position`, `ReferenceData`, `Institution`, plus helper shapes for requests and API responses.
- Published as ESM with `types` pointing to `src/index.ts`.

## Scripts
- `pnpm lint`
- `pnpm test` / `pnpm test:coverage` – Vitest.

## Usage
Import from `@demo/types` in any package or app:

```ts
import type { Account, Institution } from '@demo/types'
```
