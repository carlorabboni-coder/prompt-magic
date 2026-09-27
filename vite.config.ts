import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base relativa: funziona su GitHub Pages, Vercel, Netlify, Cloudflare, file:// — gratis ovunque
  base: './',
})
