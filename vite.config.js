import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '',   // ✅ use relative paths (works for previews + main site)
  build: {
    outDir: 'dist',
  },
})
