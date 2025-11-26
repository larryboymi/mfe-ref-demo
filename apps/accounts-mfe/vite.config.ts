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
        './AccountsSummary': './src/widgets/AccountsSummary.tsx'
      },
      shared: ['react', 'react-dom', '@demo/ui', '@demo/types']
    })
  ],
  resolve: {
    alias: {
      '@demo/ui': '../../packages/ui/src',
      '@demo/types': '../../packages/types/src'
    }
  },
  server: {
    port: 5001
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false
  }
});
