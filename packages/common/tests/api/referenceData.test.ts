/* @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('reference data client', () => {
  it('uses reference data hooks end-to-end', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ institutions: [{ id: '1', name: 'Bank' }] }),
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.doMock('../../src/env.ts', () => ({
      getEnv: () => Promise.resolve({ apiBaseUrl: 'http://api', shellPort: 0, accountsPort: 0, positionsPort: 0 }),
    }))
    const { createQueryClient } = await import('../../src/queryClient.ts')
    const { QueryClientProvider } = await import('@tanstack/react-query')
    const { useReferenceData, useInstitutionById } = await import('../../src/api/referenceData.ts')
    const client = createQueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client, children })

    const { result: refResult } = renderHook(() => useReferenceData(), { wrapper })
    const { result: instResult } = renderHook(() => useInstitutionById('1'), { wrapper })

    await waitFor(() => expect(refResult.current.data?.institutions).toHaveLength(1))
    await waitFor(() => expect(instResult.current?.name).toBe('Bank'))
  })

  it('prefetches with provided queryClient', async () => {
    const { createQueryClient } = await import('../../src/queryClient.ts')
    const { prefetchReferenceData, referenceDataQueryKey } = await import('../../src/api/referenceData.ts')
    const client = createQueryClient()
    const spy = vi.spyOn(client, 'prefetchQuery').mockResolvedValue(undefined as never)
    await prefetchReferenceData(client)
    expect(spy).toHaveBeenCalledWith({
      queryKey: referenceDataQueryKey,
      staleTime: 60 * 60 * 1000,
    })
  })
})
