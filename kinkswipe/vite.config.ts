import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
          'animation': ['framer-motion'],
          'export': ['html2canvas'],
          'compression': ['lz-string'],
          'tinder': ['react-tinder-card'],
          'state': ['zustand']
        }
      }
    }
  }
})
