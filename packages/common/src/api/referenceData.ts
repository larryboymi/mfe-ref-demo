import { getEnv } from '../index'
import type { ReferenceData, Institution, InstitutionId } from '@demo/types'
import { useQuery, QueryClient } from '@tanstack/react-query'

export const referenceDataQueryKey = ['referenceData'] as const

export const fetchReferenceData = async (): Promise<ReferenceData> => {
  const { apiBaseUrl } = await getEnv()
  const res = await fetch(`${apiBaseUrl}/reference-data`)
  if (!res.ok) {
    throw new Error(`Failed to fetch reference data: ${res.status}`)
  }
  return res.json()
}

export const useReferenceData = () =>
  useQuery<ReferenceData>({
    queryKey: referenceDataQueryKey,
    queryFn: fetchReferenceData,
    staleTime: 60 * 60 * 1000,
  })

export const useInstitutions = () => {
  const { data, isLoading, error } = useReferenceData()
  return {
    institutions: data?.institutions ?? [],
    loading: isLoading,
    error: error as Error | null | undefined,
  }
}

export const useInstitutionById = (id: InstitutionId | null | undefined) => {
  const { institutions } = useInstitutions()
  if (!id) return undefined
  return institutions.find((inst) => inst.id === id)
}

export const prefetchReferenceData = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: referenceDataQueryKey,
    queryFn: fetchReferenceData,
    staleTime: 60 * 60 * 1000,
  })
}
