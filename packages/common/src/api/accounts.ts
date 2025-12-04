import { useQuery } from '@tanstack/react-query'
import type { Account } from '@demo/types'
import type { ApiQueryKey } from '../queryClient.ts'
import { fetchFromApi } from '../queryClient.ts'

export const accountsQueryKey = ['GET', '/accounts'] as const satisfies ApiQueryKey

export const fetchAccounts = async (): Promise<Account[]> => fetchFromApi<Account[]>(accountsQueryKey)

export const useAccounts = () =>
  useQuery<Account[]>({
    queryKey: accountsQueryKey,
  })
