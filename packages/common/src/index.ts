export * from './api/accounts.ts'
export * from './api/positions.ts'
export * from './api/referenceData.ts'
export * from './queryClient.ts'
export * from './store/baseStore.ts'
export * from './store/selectionStore.ts'
export * from './store/favoritesStore.ts'

type MetaEnv = Record<string, string | undefined>
type GlobalWithMeta = typeof globalThis & { __demoMetaEnv?: MetaEnv }

export type EnvConfig = {
  apiBaseUrl: string
  shellPort: number
  accountsPort: number
  reportingPort: number
}

let cachedEnv: EnvConfig | null = null

const readEnv = (overrides?: { meta?: MetaEnv; proc?: MetaEnv }): EnvConfig => {
  const injected = overrides?.meta ?? (globalThis as GlobalWithMeta).__demoMetaEnv
  const metaEnv: MetaEnv = injected ?? (import.meta as { env?: MetaEnv }).env ?? {}
  const procEnv: MetaEnv = overrides?.proc ?? ((globalThis as { process?: { env?: MetaEnv } }).process?.env ?? {})

  const apiBaseUrl = metaEnv.VITE_API_URL || procEnv.VITE_API_URL || 'http://localhost:3050'

  const readNumber = (key: string, fallback: number) => {
    const value = metaEnv[key] ?? procEnv[key]
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

export const __envTestUtils = { readEnv }
