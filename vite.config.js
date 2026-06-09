import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    // Disable source maps in production to reduce technology fingerprinting surface
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunks: split Firebase and vendor libs into separate cacheable files
        manualChunks(id) {
          // Firebase SDK — large library, split by sub-package
          if (id.includes('node_modules/firebase')) {
            if (id.includes('/app/')) return 'firebase-app';
            if (id.includes('/auth/')) return 'firebase-auth';
            if (id.includes('/firestore/')) return 'firebase-firestore';
            return 'firebase-misc';
          }
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
        }
      }
    }
  }
})
