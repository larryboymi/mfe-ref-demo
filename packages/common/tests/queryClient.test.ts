import { describe, expect, it } from 'vitest'
import { createQueryClient } from '../src/queryClient'

describe('createQueryClient', () => {
  it('configures sensible defaults', () => {
    const client = createQueryClient()
    const defaults = client.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBe(30_000)
    expect(defaults.queries?.retry).toBe(1)
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false)
  })
})
