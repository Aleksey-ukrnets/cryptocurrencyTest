import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        secure: false,
        rewrite: (p: string) => p.replace(/^\/api/, '')
      }
    }
  }
})