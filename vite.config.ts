import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/11-11-tech/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
