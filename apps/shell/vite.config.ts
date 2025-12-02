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
        name: 'shell',
        remotes: {
          accounts: `http://localhost:${env.accountsPort}/assets/remoteEntry.js`,
          reporting: `http://localhost:${env.reportingPort}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom', 'react-router-dom', '@demo/ui', '@demo/common']
      })
    ],
    resolve: {
      alias: {
        '@demo/ui': '../../packages/ui',
        '@demo/types': '../../packages/types',
        '@demo/common': path.resolve(__dirname, '../../packages/common/src'),
        '@demo/common/api': path.resolve(__dirname, '../../packages/common/src/api')
      }
    },
    server: {
      port: env.shellPort
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false
    }
  }
})
