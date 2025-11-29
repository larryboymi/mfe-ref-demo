import { defineConfig } from 'cypress'
import { getEnv } from '@demo/config'


export default defineConfig({
  e2e: {
    async setupNodeEvents(_on, config) {
      const env = await getEnv()
      config.baseUrl = `http://localhost:${env.reportingPort}`
      return config
    },
    specPattern: 'cypress/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
})
