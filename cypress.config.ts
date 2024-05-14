import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: '/e-motion-web/tests/e2e/specs/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://172.18.0.2:4173',
    supportFile: false
  }
})
