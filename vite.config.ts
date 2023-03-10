import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    target: ["esnext"]
  },
  resolve: {
    alias: {
      "$assets": "/src/assets",
      "$components": "/src/components",
      "$lib": "/src/lib"
    }
  }
})
