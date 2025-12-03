import { describe, expect, it, vi } from 'vitest'

describe('reference data client', () => {
  it('fetches reference data successfully', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ institutions: [{ id: 'i1', name: 'Bank' }] }),
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.doMock('../../src/index.ts', () => ({
      getEnv: () => Promise.resolve({ apiBaseUrl: 'http://api', shellPort: 0, accountsPort: 0, reportingPort: 0 }),
    }))

    const { fetchReferenceData } = await import('../../src/api/referenceData.ts')
    const data = await fetchReferenceData()

    expect(data.institutions).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith('http://api/reference-data')
  })

  it('throws on failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.doMock('../../src/index.ts', () => ({
      getEnv: () => Promise.resolve({ apiBaseUrl: 'http://api', shellPort: 0, accountsPort: 0, reportingPort: 0 }),
    }))

    const { fetchReferenceData } = await import('../../src/api/referenceData.ts')

    await expect(fetchReferenceData()).rejects.toThrow('Failed to fetch reference data: 500')
  })
})