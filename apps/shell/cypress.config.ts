import { defineConfig } from 'cypress'
import { getEnv } from '../../packages/common/src/config'

export default defineConfig({
  e2e: {
    async setupNodeEvents(_on, config) {
      const env = await getEnv()
      config.baseUrl = `http://localhost:${env.shellPort}`
      return config
    },
    specPattern: 'cypress/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
})
