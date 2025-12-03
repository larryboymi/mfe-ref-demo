/* @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'

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

  it('uses reference data hooks end-to-end', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ institutions: [{ id: '1', name: 'Bank' }] }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query')
    const { useReferenceData, useInstitutionById } = await import('../../src/api/referenceData.ts')
    const client = new QueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client, children })

    const { result: refResult } = renderHook(() => useReferenceData(), { wrapper })
    const { result: instResult } = renderHook(() => useInstitutionById('1'), { wrapper })

    await waitFor(() => expect(refResult.current.data?.institutions).toHaveLength(1))
    await waitFor(() => expect(instResult.current?.name).toBe('Bank'))
  })

  it('prefetches with provided queryClient', async () => {
      const { QueryClient } = await import('@tanstack/react-query')
    const { prefetchReferenceData, referenceDataQueryKey, fetchReferenceData } =
      await import('../../src/api/referenceData.ts')
    const client = new QueryClient()
    const spy = vi.spyOn(client, 'prefetchQuery')
    await prefetchReferenceData(client)
    expect(spy).toHaveBeenCalledWith({
      queryKey: referenceDataQueryKey,
      queryFn: fetchReferenceData,
      staleTime: 60 * 60 * 1000,
    })
  })
})
