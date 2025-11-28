import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'accounts/AccountsSummary': path.resolve(__dirname, './tests/mocks/AccountsSummary.tsx'),
      'reporting/PositionsTable': path.resolve(__dirname, './tests/mocks/PositionsTable.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    css: false,
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
  },
})
