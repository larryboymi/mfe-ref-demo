import { getEnv } from '../index.ts'
import { useQuery } from '@tanstack/react-query'
import type { Position } from '@demo/types'

export const positionsQueryKey = ['positions'] as const

export const fetchPositions = async (): Promise<Position[]> => {
  const { apiBaseUrl } = await getEnv()
  const res = await fetch(`${apiBaseUrl}/positions`)
  if (!res.ok) {
    throw new Error(`Failed to fetch positions: ${res.status}`)
  }
  return res.json()
}

export const usePositions = () =>
  useQuery<Position[]>({
    queryKey: positionsQueryKey,
    queryFn: fetchPositions,
  })
