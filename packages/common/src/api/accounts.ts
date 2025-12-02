import { getEnv } from '../index.ts'
import { useQuery } from '@tanstack/react-query'
import type { Account } from '@demo/types'

export const accountsQueryKey = ['accounts'] as const

export const fetchAccounts = async (): Promise<Account[]> => {
  const { apiBaseUrl } = await getEnv()
  const res = await fetch(`${apiBaseUrl}/accounts`)
  if (!res.ok) {
    throw new Error(`Failed to fetch accounts: ${res.status}`)
  }
  return res.json()
}

export const useAccounts = () =>
  useQuery<Account[]>({
    queryKey: accountsQueryKey,
    queryFn: fetchAccounts,
  })
