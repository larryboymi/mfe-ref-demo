import React, { useSyncExternalStore } from 'react'

export type StoreSnapshot<S> = {
  state: S
  ticks: number
}

export type StoreApi<S> = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => StoreSnapshot<S>
  update: (updater: (prev: S) => S) => void
  reset: () => void
}

const getLocalStorage = (): Storage | null => {
  try {
    const storage = globalThis?.localStorage
    if (!storage) return null
    return storage as Storage
  } catch {
    return null
  }
}

export const createPersistentStore = <S>(storageKey: string, initialState: S): StoreApi<S> => {
  const ls = getLocalStorage()

  const loadSnapshot = (): StoreSnapshot<S> => {
    if (!ls) return { state: initialState, ticks: 0 }
    try {
      const raw = ls.getItem(storageKey)
      if (!raw) return { state: initialState, ticks: 0 }
      const parsed = JSON.parse(raw) as StoreSnapshot<S>
      return {
        state: parsed.state ?? initialState,
        ticks: Number.isFinite(parsed.ticks) ? parsed.ticks : 0,
      }
    } catch {
      return { state: initialState, ticks: 0 }
    }
  }

  const persistSnapshot = (snapshot: StoreSnapshot<S>) => {
    if (!ls) return
    try {
      ls.setItem(storageKey, JSON.stringify(snapshot))
    } catch {
      /* ignore persistence errors */
    }
  }

  let snapshot: StoreSnapshot<S> = loadSnapshot()
  const listeners = new Set<() => void>()

  const notify = () => listeners.forEach((listener) => listener())

  return {
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    update: (updater) => {
      const nextState = updater(snapshot.state)
      snapshot = { state: nextState, ticks: snapshot.ticks + 1 }
      persistSnapshot(snapshot)
      notify()
    },
    reset: () => {
      snapshot = { state: initialState, ticks: 0 }
      persistSnapshot(snapshot)
      notify()
    },
  }
}

export const createStoreContext = <S>(store: StoreApi<S>) => {
  const StoreContext = React.createContext<StoreApi<S> | null>(null)

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(StoreContext.Provider, { value: store, children })

  const useStore = () => {
    const ctx = React.useContext(StoreContext)
    if (!ctx) {
      throw new Error('StoreProvider is missing')
    }
    return ctx
  }

  const useSnapshot = () => {
    const storeApi = useStore()
    return useSyncExternalStore(storeApi.subscribe, storeApi.getSnapshot, storeApi.getSnapshot)
  }

  return { Provider, useStore, useSnapshot }
}

export const __storeTestUtils = { getLocalStorage }
