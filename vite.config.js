import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',   // ✅ use relative paths so /public/ assets work on Netlify
  build: {
    outDir: 'dist',
  },
})
