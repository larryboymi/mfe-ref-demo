import type { Position } from '@demo/types'
import { getEnv } from '../index'

export const positionsQueryKey = ['positions'] as const

export const fetchPositions = async (): Promise<Position[]> => {
  const { apiBaseUrl } = await getEnv()
  const res = await fetch(`${apiBaseUrl}/positions`)
  if (!res.ok) {
    throw new Error(`Failed to fetch positions: ${res.status}`)
  }
  return res.json()
}
