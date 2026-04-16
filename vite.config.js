import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /auth/* requests to Spring Boot backend
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Forward /api/* requests to Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

