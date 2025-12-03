import React from 'react'
import { createPersistentStore, createStoreContext } from './baseStore.ts'
import type { StoreSnapshot } from './baseStore.ts'

type SelectionState = { activeId: string | null }
export type SelectionSnapshot = StoreSnapshot<SelectionState>

export const selectionStore = createPersistentStore<SelectionState>('demo-selection', { activeId: null })
const { Provider: SelectionProvider, useSnapshot: useSelectionSnapshot, useStore } =
  createStoreContext(selectionStore)

export { SelectionProvider, useSelectionSnapshot }

export const useSelectionActions = () => {
  const store = useStore()
  return React.useMemo(
    () => ({
      select: (id: string | null) => store.update(() => ({ activeId: id })),
      reset: () => store.reset(),
    }),
    [store],
  )
}
