import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname } from 'path'

const dirName = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': `${dirName}/src`,
    },
  },
  server: {
    port: 3854,
  },
})
