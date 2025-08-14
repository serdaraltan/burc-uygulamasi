import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/horoscope': {
        target: 'https://aztro.sameerkumar.website',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/horoscope/, '')
      },
      '/api/all': {
        target: 'https://aztro.sameerkumar.website',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/all/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
  }
});