import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/turkce': {
        target: 'https://burc-api.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/turkce/, '')
      },
      '/api/ingilizce': {
        target: 'https://horoscope-free-api.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ingilizce/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
  }
});