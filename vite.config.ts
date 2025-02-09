import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(() => {

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@assets': '/src/assets',
        '@layouts': '/src/layouts',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@services': '/src/services',
      },
    },
  }
})