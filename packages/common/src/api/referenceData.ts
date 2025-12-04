import type { ReferenceData, InstitutionId, Institution } from '@demo/types'
import { useQuery, QueryClient } from '@tanstack/react-query'
import type { ApiQueryKey } from '../queryClient.ts'
import { fetchFromApi } from '../queryClient.ts'

export const referenceDataQueryKey = ['GET', '/reference-data'] as const satisfies ApiQueryKey

export const fetchReferenceData = async (): Promise<ReferenceData> =>
  fetchFromApi<ReferenceData>(referenceDataQueryKey)

export const useReferenceData = () =>
  useQuery<ReferenceData>({
    queryKey: referenceDataQueryKey,
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
  return institutions.find((inst: Institution) => inst.id === id)
}

export const prefetchReferenceData = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: referenceDataQueryKey,
    staleTime: 60 * 60 * 1000,
  })
}
