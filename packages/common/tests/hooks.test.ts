import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})

describe('data hooks', () => {
  it('uses useQuery for accounts with correct queryKey and fn', async () => {
    const mockResult = { data: [] }
    const useQuery = vi.fn().mockReturnValue(mockResult)
    vi.doMock('@tanstack/react-query', () => ({ useQuery }))
    const { useAccounts, accountsQueryKey, fetchAccounts } = await import('../src/api/accounts.ts')

    const result = useAccounts()

    expect(result).toBe(mockResult)
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: accountsQueryKey,
      queryFn: fetchAccounts,
    })
  })

  it('uses useQuery for positions with correct queryKey and fn', async () => {
    const mockResult = { data: [] }
    const useQuery = vi.fn().mockReturnValue(mockResult)
    vi.doMock('@tanstack/react-query', () => ({ useQuery }))
    const { usePositions, positionsQueryKey, fetchPositions } = await import('../src/api/positions.ts')

    const result = usePositions()

    expect(result).toEqual(mockResult)
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: positionsQueryKey,
      queryFn: fetchPositions,
    })
  })
})