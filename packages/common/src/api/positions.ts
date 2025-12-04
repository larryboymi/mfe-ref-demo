import { useQuery } from '@tanstack/react-query'
import type { Position } from '@demo/types'
import type { ApiQueryKey } from '../queryClient.ts'

export const positionsQueryKey = ['GET', '/positions'] as const satisfies ApiQueryKey

export const usePositions = () =>
  useQuery<Position[]>({
    queryKey: positionsQueryKey,
  })
