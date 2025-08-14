import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Lokal API endpoint'leri için proxy tanımla
      '/api/horoscope': {
        target: 'http://localhost:5173', // Vite geliştirme sunucusu
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/horoscope/, '/api')
      },
      '/api/all': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/all/, '/api/all')
      }
    }
  },
  optimizeDeps: {
    include: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
  }
});