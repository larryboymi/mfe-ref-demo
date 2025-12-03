import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('env helper', () => {
  beforeEach(() => {
    vi.resetModules()
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
})
