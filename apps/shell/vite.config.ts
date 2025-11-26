import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        accounts: 'http://localhost:3001/assets/remoteEntry.js',
        reporting: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@demo/ui']
    })
  ],
  resolve: {
    alias: {
      '@demo/ui': '../../packages/ui',
      '@demo/types': '../../packages/types'
    }
  },
  server: {
    port: 3000
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false
  }
});
