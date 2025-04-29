import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    // Настройки для Cloudflare Pages
    target: 'esnext',
    // Генерировать source maps для более легкой отладки
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion', 'react-transition-group']
        }
      }
    }
  },
  // Настройки для разработки
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
    proxy: {
      // Настройка прокси для API
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    },
    hmr: {
      // Для работы с ngrok
      clientPort: 443,
      host: 'edited-indonesia-sun-fastest.trycloudflare.com'
    },
    cors: true,
    allowedHosts: ['acda-2-56-176-147.ngrok-free.app', '4934-2-56-176-147.ngrok-free.app', '2651-45-14-71-8.ngrok-free.app', 'edited-indonesia-sun-fastest.trycloudflare.com']
  },
  css: {
    devSourcemap: true
  }
}); 