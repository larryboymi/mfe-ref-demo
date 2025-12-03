import { afterEach } from 'vitest'

vi.mock('../..', () => ({
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

describe('fetchPositions', () => {
  it('calls the configured API base', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    const { fetchPositions } = await import('../../src/api/positions')
    await fetchPositions()

    expect(fetchMock).toHaveBeenCalledWith('http://api.test/positions')
  })

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => [],
    } as Response)

    const { fetchPositions } = await import('../../src/api/positions')

    await expect(fetchPositions()).rejects.toThrow('Failed to fetch positions: 500')
  })
})
