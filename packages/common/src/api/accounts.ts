import { useQuery } from '@tanstack/react-query'
import type { Account } from '@demo/types'
import type { ApiQueryKey } from '../queryClient.ts'

export const accountsQueryKey = ['GET', '/accounts'] as const satisfies ApiQueryKey

export const useAccounts = () =>
  useQuery<Account[]>({
    queryKey: accountsQueryKey,
  })
