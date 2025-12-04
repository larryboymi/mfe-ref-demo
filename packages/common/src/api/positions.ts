import { useQuery } from '@tanstack/react-query'
import type { Position } from '@demo/types'
import { fetchFromApi } from '../queryClient.ts'
import type { ApiQueryKey } from '../queryClient.ts'

export const positionsQueryKey = ['GET', '/positions'] as const satisfies ApiQueryKey

export const fetchPositions = async (): Promise<Position[]> =>
  fetchFromApi<Position[]>(positionsQueryKey)

export const usePositions = () =>
  useQuery<Position[]>({
    queryKey: positionsQueryKey,
  })
