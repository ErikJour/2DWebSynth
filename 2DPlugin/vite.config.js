// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/2DWebSynth/', 
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});

