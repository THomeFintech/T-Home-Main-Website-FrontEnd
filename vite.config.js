import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }

          if (id.includes('react-router')) {
            return 'router-vendor'
          }

          if (id.includes('recharts')) {
            return 'charts-vendor'
          }

          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'pdf-vendor'
          }

          if (id.includes('@react-oauth') || id.includes('google-auth-library')) {
            return 'auth-vendor'
          }

          if (id.includes('axios')) {
            return 'network-vendor'
          }

          if (id.includes('framer-motion')) {
            return 'motion-vendor'
          }
        },
      },
    },
  },
})
