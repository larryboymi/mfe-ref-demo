import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        accounts: 'http://localhost:5001/assets/remoteEntry.js',
        reporting: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@demo/ui', '@demo/types']
    })
  ],
  resolve: {
    alias: {
      '@demo/ui': '../../packages/ui/src',
      '@demo/types': '../../packages/types/src'
    }
  },
  server: {
    port: 5000
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false
  }
});
