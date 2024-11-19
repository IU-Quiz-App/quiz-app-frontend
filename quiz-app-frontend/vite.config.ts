import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'


export default defineConfig(({ command, mode }) => {
   const serverConfig =
       command === 'serve'
          ? {
             host: 'frontend.quiz-app.test',
             port: 5173,
             https: {
               key: fs.readFileSync('./cert/key.pem'),
               cert: fs.readFileSync('./cert/cert.pem'),
             },
             proxy: {
               '/api': {
                 target: 'https://localhost:3000/', // Backend server
                 changeOrigin: true,
                 secure: false,
                 rewrite: (path) => path.replace(/^\/api/, ''),
               },
             },
           }
            : undefined;

  return {
    plugins: [react()],
    server: serverConfig,
  }
})