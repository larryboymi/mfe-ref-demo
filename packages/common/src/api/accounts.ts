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
  const data = (await res.json()) as Account[]
  return data
}

export const useAccounts = () =>
  useQuery<Account[]>({
    queryKey: accountsQueryKey,
    queryFn: fetchAccounts,
  })
