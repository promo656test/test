import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', 
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
      },
    },
    emptyOutDir: false,
  },
});