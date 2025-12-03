# @demo/ui

Lightweight shared UI primitives for the MFEs and shell.

- `Card`: titled container that accepts ReactNode titles (supports icons, counts, etc.).
- `Button`: basic styled button.
- `SelectionDemo`: sample component wired to `@demo/common` selection/favorites stores for rapid state-change demos.

## Scripts
- `pnpm lint`
- `pnpm test` / `pnpm test:coverage` – Vitest with jsdom.

## Usage

```tsx
import { Card, Button } from '@demo/ui'

const Example = () => (
  <Card title="Hello">
    <Button onClick={() => console.log('clicked')}>Click</Button>
  </Card>
)
```
