import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-maplibre': ['maplibre-gl', '@vis.gl/react-maplibre'],
          'vendor-motion': ['motion/react'],
          'vendor-lottie': ['@lottiefiles/dotlottie-react'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
    // CSS code splitting for better caching
    cssCodeSplit: true,
    // Inline small assets to reduce requests
    assetsInlineLimit: 4096,
    // Report compressed size for optimization feedback
    reportCompressedSize: true,
  },
})

