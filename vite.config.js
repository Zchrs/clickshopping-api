import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 100000,
    outDir: "E:/clickshopping-api/public", // nueva carpeta
    emptyOutDir: true, // Establece un valor más alto para el límite de advertencia del tamaño del fragmento
    rollupOptions: {
      output: {
        manualChunks: {
          // Define aquí los fragmentos manuales según tus necesidades
        }
      }
    }
  }
})

