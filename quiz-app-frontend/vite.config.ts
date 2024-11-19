import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'


export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve('./cert/', 'key.pem')),
      cert: fs.readFileSync(path.resolve('./cert/', 'cert.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3000/', // Backend server
        changeOrigin: true,
        secure: false, // Disable certificate verification
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})