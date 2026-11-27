import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  base: mode === 'production' ? '/Web_Tickets_Trim1/' : '/',
  server: {
    port: 3001,
    proxy: {
      '/api' : {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}));           