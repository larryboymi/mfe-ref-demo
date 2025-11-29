import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'
import { getEnv } from '@demo/config'
import path from 'node:path'

export default defineConfig(async () => {
  const env = await getEnv()
  return {
    plugins: [
      react(),
      federation({
        name: 'accounts',
        filename: 'remoteEntry.js',
        exposes: {
          './AccountsSummary': './src/widgets/AccountsSummary.tsx',
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
      port: env.accountsPort
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false
    }
  }
})
