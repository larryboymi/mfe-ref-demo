import React from 'react'
import { createPersistentStore, createStoreContext } from './baseStore.ts'
import type { StoreSnapshot } from './baseStore.ts'

type FavoritesState = { ids: string[] }
export type FavoritesSnapshot = StoreSnapshot<FavoritesState>

export const favoritesStore = createPersistentStore<FavoritesState>('demo-favorites', { ids: [] })
const { Provider: FavoritesProvider, useSnapshot: useFavoritesSnapshot, useStore } =
  createStoreContext(favoritesStore)

export { FavoritesProvider, useFavoritesSnapshot }

export const useFavoritesActions = () => {
  const store = useStore()
  return React.useMemo(
    () => ({
      toggle: (id: string) =>
        store.update((prev) => {
          const set = new Set(prev.ids)
          if (set.has(id)) {
            set.delete(id)
          } else {
            set.add(id)
          }
          return { ids: Array.from(set) }
        }),
      clear: () => store.reset(),
    }),
    [store],
  )
}
