import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Aztro API için
      '/api/aztro': {
        target: 'https://aztro.sameerkumar.website',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/aztro/, '')
      },
      
      // Tüm burçlar için alternatif API
      '/api/all': {
        target: 'https://horoscope-app-api.vercel.app/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/all/, '')
      }
    }
  }
});