import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('createQueryClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('configures sensible defaults', async () => {
    const { createQueryClient } = await import('../src/queryClient')
    const client = createQueryClient()
    const defaults = client.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBe(30_000)
    expect(defaults.queries?.retry).toBe(1)
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false)
    expect(typeof defaults.queries?.queryFn).toBe('function')
  })

  it('builds URLs with params and arrays', async () => {
    vi.doMock('../src/env.ts', () => ({
      getEnv: () => Promise.resolve({ apiBaseUrl: 'http://api', shellPort: 0, accountsPort: 0, positionsPort: 0 }),
    }))
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response)

    const { fetchFromApi: freshFetchFromApi } = await import('../src/queryClient')

    const result = await freshFetchFromApi<{ ok: boolean }>(['GET', '/items', { search: 'term', tags: ['a', 'b'], skip: null }])

    expect(result.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://api/items?search=term&tags=a&tags=b',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('default queryFn uses API query keys and passes signal', async () => {
    vi.doMock('../src/env.ts', () => ({
      getEnv: () => Promise.resolve({ apiBaseUrl: 'http://api', shellPort: 0, accountsPort: 0, positionsPort: 0 }),
    }))
    const controller = new AbortController()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response)

    const { createQueryClient } = await import('../src/queryClient')
    const client = createQueryClient()
    const queryFn = client.getDefaultOptions().queries?.queryFn
    const data = await queryFn?.({
      queryKey: ['GET', '/things', { q: 'x' }],
      signal: controller.signal,
      meta: undefined,
      pageParam: undefined,
      direction: undefined,
      queryHash: 'hash',
    } as never)

    expect((data as { ok: boolean }).ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledWith('http://api/things?q=x', expect.objectContaining({ signal: controller.signal }))
  })

  it('throws when query key is not in [method, path] shape', async () => {
    const { createQueryClient } = await import('../src/queryClient')
    const client = createQueryClient()
    const queryFn = client.getDefaultOptions().queries?.queryFn
    await expect(
      queryFn?.({
        queryKey: ['onlyOne'] as never,
        signal: undefined,
        meta: undefined,
        pageParam: undefined,
        direction: undefined,
        queryHash: 'bad',
      } as never),
    ).rejects.toThrow('Query key must be [method, path, params?]')
  })
})
