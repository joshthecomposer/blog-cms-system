import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  build: {
    outDir: "../wwwroot/client",
    emptyOutDir: true
  }
})
