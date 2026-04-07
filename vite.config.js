import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Proxy sirf local development ke liye hota hai, 
  // Vercel par hum direct URL use karenge
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Yeh line zaroori hai taaki Vercel sahi rasta dhoond sake
  base: '/',
})