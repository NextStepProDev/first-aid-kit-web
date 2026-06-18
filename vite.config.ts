import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Tailwind 3 is wired through postcss.config.cjs (picked up automatically by Vite).
// Migrating to the @tailwindcss/vite plugin is tracked as a follow-up (Tailwind 4).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
