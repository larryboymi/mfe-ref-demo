import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('env helper', () => {
  beforeEach(() => {
    vi.resetModules()
    // @ts-ignore
    delete (globalThis as any).__demoMetaEnv
  })

  it('reads numbers and api base url from process env', async () => {
    const original = { ...process.env }
    process.env.VITE_API_URL = 'http://example.com'
    process.env.VITE_SHELL_PORT = '4000'
    process.env.VITE_ACCOUNTS_PORT = '4001'
    process.env.VITE_REPORTING_PORT = '4002'

    const mod = await import('../src/index.ts')
    const cfg = mod.env()

    expect(cfg.apiBaseUrl).toBe('http://example.com')
    expect(cfg.shellPort).toBe(4000)
    expect(cfg.accountsPort).toBe(4001)
    expect(cfg.reportingPort).toBe(4002)

    process.env = original
  })

  it('reads from injected meta env when provided', async () => {
    ;(globalThis as any).__demoMetaEnv = {
      VITE_API_URL: 'http://meta',
      VITE_SHELL_PORT: '1234',
    }
    const mod = await import('../src/index.ts')
    const cfg = mod.env()
    expect(cfg.apiBaseUrl).toBe('http://meta')
    expect(cfg.shellPort).toBe(1234)
  })

  it('reuses cached env on subsequent calls', async () => {
    const mod = await import('../src/index.ts')
    const first = mod.env()
    const second = mod.env()
    expect(second).toBe(first)
  })

  it('uses numeric fallbacks when env values are invalid', async () => {
    ;(globalThis as any).__demoMetaEnv = {
      VITE_SHELL_PORT: 'not-a-number',
    }
    const mod = await import('../src/index.ts')
    const cfg = mod.env()
    expect(cfg.shellPort).toBe(3000)
  })

  it('falls back to defaults when no env is provided', async () => {
    const mod = await import('../src/index.ts')
    const cfg = mod.__envTestUtils.readEnv({ meta: {}, proc: {} })
    expect(cfg).toEqual({
      apiBaseUrl: 'http://localhost:3050',
      shellPort: 3000,
      accountsPort: 3001,
      reportingPort: 3002,
    })
  })

  it('honors explicit overrides for meta and process env', async () => {
    const mod = await import('../src/index.ts')
    const cfg = mod.__envTestUtils.readEnv({
      meta: { VITE_API_URL: 'http://override', VITE_SHELL_PORT: '4100' },
      proc: { VITE_ACCOUNTS_PORT: '4200', VITE_REPORTING_PORT: '4300' },
    })
    expect(cfg.apiBaseUrl).toBe('http://override')
    expect(cfg.shellPort).toBe(4100)
    expect(cfg.accountsPort).toBe(4200)
    expect(cfg.reportingPort).toBe(4300)
  })

  it('falls back when import.meta.env is missing', async () => {
    const originalMeta = (import.meta as any).env
    ;(import.meta as any).env = undefined
    try {
      const mod = await import('../src/index.ts')
      const cfg = mod.__envTestUtils.readEnv({ meta: undefined, proc: {} })
      expect(cfg.apiBaseUrl).toBe('http://localhost:3050')
    } finally {
      ;(import.meta as any).env = originalMeta
    }
  })
})
