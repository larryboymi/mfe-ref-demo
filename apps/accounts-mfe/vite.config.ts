import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
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
      '@demo/types': '../../packages/types'
    }
  },
  server: {
    port: 3001
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false
  }
});
