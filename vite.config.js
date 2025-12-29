import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/weather-api': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather-api/, ''),
        secure: true
      },
      '/prayer-api': {
        target: 'https://api.aladhan.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prayer-api/, ''),
        secure: true
      }
    }
  }
})