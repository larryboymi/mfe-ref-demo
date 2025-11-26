import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'reporting',
      filename: 'remoteEntry.js',
      exposes: {
        './PositionsTable': './src/widgets/PositionsTable.tsx'
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
    port: 3002
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false
  }
});
