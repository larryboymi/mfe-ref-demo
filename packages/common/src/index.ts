export type EnvConfig = {
  apiBaseUrl: string
  shellPort: number
  accountsPort: number
  reportingPort: number
}

let cachedEnv: EnvConfig | null = null

const readEnv = (): EnvConfig => {
  const apiBaseUrl = process.env.VITE_API_URL || 'http://localhost:3050'

  const readNumber = (key: string, fallback: number) => {
    const value = process.env[key]
    const parsed = value ? Number(value) : Number.NaN
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return {
    apiBaseUrl,
    shellPort: readNumber('VITE_SHELL_PORT', 3000),
    accountsPort: readNumber('VITE_ACCOUNTS_PORT', 3001),
    reportingPort: readNumber('VITE_REPORTING_PORT', 3002),
  }
}



export const env = (): EnvConfig => {
  if (cachedEnv) return cachedEnv
  cachedEnv = readEnv()
  return cachedEnv
}

export const getEnv = async (): Promise<EnvConfig> => Promise.resolve(env())
