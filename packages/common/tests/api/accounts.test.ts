import { afterEach } from 'vitest'

vi.mock('../../src/env.ts', () => ({
  getEnv: vi.fn().mockResolvedValue({
    apiBaseUrl: 'http://api.test',
    shellPort: 3000,
    accountsPort: 3001,
    positionsPort: 3002,
  }),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchAccounts', () => {
  it('calls the configured API base', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    const { fetchAccounts } = await import('../../src/api/accounts')
    await fetchAccounts()

    expect(fetchMock).toHaveBeenCalledWith('http://api.test/accounts', { method: 'GET', signal: undefined })
  })

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => [],
    } as Response)

    const { fetchAccounts } = await import('../../src/api/accounts')

    await expect(fetchAccounts()).rejects.toThrow('Request for GET /accounts failed: 500')
  })
})
