import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'
import { getEnv } from '@demo/common'
import path from 'node:path'

export default defineConfig(async () => {
  const env = await getEnv()
  return {
    plugins: [
      react(),
      federation({
        name: 'reporting',
        filename: 'remoteEntry.js',
        exposes: {
          './PositionsTable': './src/widgets/PositionsTable.tsx',
          './App': './src/App.tsx'
        },
        shared: ['react', 'react-dom', '@demo/ui']
      })
    ],
    resolve: {
      alias: {
        '@demo/ui': '../../packages/ui',
        '@demo/types': '../../packages/types',
        '@demo/config': path.resolve(__dirname, '../../packages/config/src/index.ts')
      }
    },
    server: {
      port: env.reportingPort
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false
    }
  }
})
