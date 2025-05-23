import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(() => {

  return {
    plugins: [react()],
    build: {
      target: 'esnext',
    },
    resolve: {
      alias: {
        '@assets': '/src/assets',
        '@layout': '/src/layout',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@services': '/src/services',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.dev.iu-quiz.de',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', 'https://www.dev.iu-quiz.de')
            });
          },
        },
      }
    }
  }
})