import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',  // This allows top-level await
  },
  esbuild: {
    target: 'esnext',  // This also allows top-level await
  },
});
