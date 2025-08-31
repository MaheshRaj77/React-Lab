import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://10.233.110.149:3002',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react(), tailwindcss()],
})
