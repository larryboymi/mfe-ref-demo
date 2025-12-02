const { defineConfig } = require('cypress')

const defaults = {
  port: 3002,
  apiBaseUrl: 'http://localhost:3050',
}

const loadEnv = async () => {
  try {
    const mod = await import('@demo/common')
    return mod.getEnv ? await mod.getEnv() : null
  } catch {
    return null
  }
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents: async (_on, config) => {
      const env = await loadEnv()
      const port = env?.reportingPort ?? (Number(process.env.VITE_REPORTING_PORT) || defaults.port)
      config.baseUrl = `http://localhost:${port}`
      config.env = {
        ...config.env,
        apiBaseUrl: env?.apiBaseUrl ?? process.env.VITE_API_URL ?? defaults.apiBaseUrl,
      }
      return config
    },
    specPattern: 'cypress/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
})
