import { describe, expect, it, vi } from 'vitest'
import { createPersistentStore } from '../../src/store/baseStore'
import { favoritesStore } from '../../src/store/favoritesStore'
import { selectionStore } from '../../src/store/selectionStore'

describe('createPersistentStore', () => {
  const key = 'store-test'

  const ensureLocalStorage = () => {
    let store: Record<string, string> = {}
    const ls: any = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
      clear: () => {
        store = {}
      },
      key: (i: number) => Object.keys(store)[i] ?? null,
      get length() {
        return Object.keys(store).length
      },
    }
    // @ts-ignore
    globalThis.localStorage = ls
    globalThis.localStorage.clear()
  }

  const makeStore = () => {
    ensureLocalStorage()
    return createPersistentStore<{ count: number }>(key, { count: 0 })
  }

  it('initializes with defaults and updates', () => {
    const store = makeStore()
    const notifications: number[] = []
    store.subscribe(() => notifications.push(store.getSnapshot().ticks))

    expect(store.getSnapshot()).toEqual({ state: { count: 0 }, ticks: 0 })

    store.update((prev) => ({ count: prev.count + 1 }))
    expect(store.getSnapshot()).toEqual({ state: { count: 1 }, ticks: 1 })
    expect(notifications).toEqual([1])
  })

  it('resets and notifies subscribers', () => {
    const store = makeStore()
    store.update(() => ({ count: 5 }))
    const calls: number[] = []
    store.subscribe(() => calls.push(store.getSnapshot().ticks))

    store.reset()
    expect(store.getSnapshot()).toEqual({ state: { count: 0 }, ticks: 0 })
    expect(calls).toEqual([0])
  })

  it('persists and restores across instances', () => {
    const store1 = makeStore()
    store1.update(() => ({ count: 3 }))
    const store2 = createPersistentStore<{ count: number }>(key, { count: 0 })
    expect(store2.getSnapshot()).toEqual({ state: { count: 3 }, ticks: 1 })
  })
})

describe('selection/favorites stores', () => {
  it('selection actions update snapshot', () => {
    selectionStore.reset()
    const snap1 = selectionStore.getSnapshot()
    expect(snap1.state.activeId).toBeNull()
    selectionStore.update(() => ({ activeId: 'x' }))
    const snap2 = selectionStore.getSnapshot()
    expect(snap2.state.activeId).toBe('x')
  })

  it('favorites toggle adds and removes ids', () => {
    favoritesStore.reset()
    favoritesStore.update(() => ({ ids: [] }))
    favoritesStore.update(() => ({ ids: ['a'] }))
    favoritesStore.update((prev) => ({ ids: prev.ids.includes('a') ? prev.ids : [...prev.ids, 'a'] }))
    expect(favoritesStore.getSnapshot().state.ids).toContain('a')
  })
})
