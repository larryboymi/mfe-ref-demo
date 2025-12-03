import React, { useSyncExternalStore } from 'react'

export type SelectionSnapshot = {
  activeId: string | null
  ticks: number
}

type SelectionStore = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => SelectionSnapshot
  select: (id: string | null) => void
  reset: () => void
}

const createSelectionStore = (): SelectionStore => {
  let snapshot: SelectionSnapshot = { activeId: null, ticks: 0 }
  const listeners = new Set<() => void>()

  const notify = () => listeners.forEach((listener) => listener())

  const select = (id: string | null) => {
    snapshot = { activeId: id, ticks: snapshot.ticks + 1 }
    notify()
  }

  return {
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    select,
    reset: () => select(null),
  }
}

const SelectionContext = React.createContext<SelectionStore | null>(null)

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = React.useMemo(() => createSelectionStore(), [])
  return React.createElement(SelectionContext.Provider, { value: store, children })
}

const useStore = () => {
  const store = React.useContext(SelectionContext)
  if (!store) {
    throw new Error('SelectionProvider is missing')
  }
  return store
}

export const useSelectionSnapshot = () => {
  const store = useStore()
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}

export const useSelectionActions = () => {
  const store = useStore()
  return React.useMemo(
    () => ({
      select: store.select,
      reset: store.reset,
    }),
    [store],
  )
}
