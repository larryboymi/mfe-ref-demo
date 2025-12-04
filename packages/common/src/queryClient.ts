import { QueryClient } from '@tanstack/react-query'
import type { QueryFunction, QueryFunctionContext, QueryKey } from '@tanstack/react-query'

import { getEnv } from './env.ts'

export type ApiQueryKey<Params extends Record<string, unknown> = Record<string, unknown>> =
  readonly [string, string, Params?]

const buildUrl = (baseUrl: string, path: string, params: Record<string, unknown>) => {
  const url = new URL(`${baseUrl}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)))
      return
    }
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

export const fetchFromApi = async <T>(queryKey: ApiQueryKey, signal?: AbortSignal): Promise<T> => {
  const [method, path, params = {}] = queryKey
  const { apiBaseUrl } = await getEnv()
  const target = buildUrl(apiBaseUrl, path, params as Record<string, unknown>)

  const response = await fetch(target, { method, signal })
  if (!response.ok) {
    throw new Error(`Request for ${method} ${path} failed: ${response.status}`)
  }

  return (await response.json()) as T
}

const ensureApiQueryKey = (queryKey: QueryKey): ApiQueryKey => {
  const [method, path, params] = queryKey
  if (typeof method !== 'string' || typeof path !== 'string') {
    throw new Error('Query key must be [method, path, params?]')
  }
  return [method, path, (params as Record<string, unknown> | undefined)] as ApiQueryKey
}

const defaultQueryFn: QueryFunction = async ({ queryKey, signal }: QueryFunctionContext) =>
  fetchFromApi(ensureApiQueryKey(queryKey), signal)

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
        queryFn: defaultQueryFn,
      },
    },
  })
