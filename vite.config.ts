import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname } from 'path'

// Obtain the directory path of the current file
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true // Enable source maps
  },
  resolve: {
    alias: {
      '@': `${__dirname}/src` // Use the obtained directory path to construct the alias
    }
  },
  server: {
    port: 3000
  }
})