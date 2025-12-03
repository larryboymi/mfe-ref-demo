/* @vitest-environment jsdom */
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { createPersistentStore, createStoreContext, __storeTestUtils } from '../../src/store/baseStore.ts'
import { mockLocalStorage } from './utils.ts'

describe('createPersistentStore', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('provides test access to localStorage helper', () => {
    const storage = mockLocalStorage()
    expect(__storeTestUtils.getLocalStorage()).toBe(storage)
    vi.unstubAllGlobals()
    vi.stubGlobal('localStorage', undefined as unknown as Storage)
    expect(__storeTestUtils.getLocalStorage()).toBeNull()
  })

  it('returns null storage when accessing localStorage fails', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
      get: () => {
        throw new Error('no access')
      },
      configurable: true,
    })

    const store = createPersistentStore('denied', { ok: true })
    expect(store.getSnapshot()).toEqual({ state: { ok: true }, ticks: 0 })

    const globalWithStorage = globalThis as typeof globalThis & { localStorage?: Storage }
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', originalDescriptor)
    } else {
      delete globalWithStorage.localStorage
    }
  })

  it('restores a stored snapshot and persists updates', () => {
    const storage = mockLocalStorage()
    storage.setItem('demo', JSON.stringify({ state: { count: 2 }, ticks: 4 }))
    const store = createPersistentStore('demo', { count: 0 })

    expect(store.getSnapshot()).toEqual({ state: { count: 2 }, ticks: 4 })

    act(() => {
      store.update((prev) => ({ count: prev.count + 1 }))
    })

    const persisted = JSON.parse(storage.getItem('demo') || '{}')
    expect(persisted.state.count).toBe(3)
    expect(persisted.ticks).toBe(5)
  })

  it('normalizes parsed snapshots with missing ticks', () => {
    const storage = mockLocalStorage()
    storage.setItem('coerce', JSON.stringify({ state: { count: 5 }, ticks: 'oops' }))
    const store = createPersistentStore('coerce', { count: 0 })
    expect(store.getSnapshot()).toEqual({ state: { count: 5 }, ticks: 0 })
  })

  it('falls back when storage is missing or invalid', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('localStorage', undefined as unknown as Storage)
    const noStorageStore = createPersistentStore('missing', { label: 'x' })
    act(() => {
      noStorageStore.update((prev) => prev)
    })
    expect(noStorageStore.getSnapshot()).toEqual({ state: { label: 'x' }, ticks: 1 })

    const storage = mockLocalStorage()
    storage.setItem('broken', '{not-json')
    const brokenStore = createPersistentStore('broken', { label: 'y' })
    expect(brokenStore.getSnapshot()).toEqual({ state: { label: 'y' }, ticks: 0 })
  })

  it('notifies subscribers and respects unsubscription', () => {
    mockLocalStorage()
    const store = createPersistentStore('sub-test', { count: 0 })
    const calls: number[] = []
    const unsubscribe = store.subscribe(() => calls.push(store.getSnapshot().ticks))

    act(() => {
      store.update((prev) => ({ count: prev.count + 1 }))
    })
    expect(calls).toEqual([1])

    act(() => {
      unsubscribe()
      store.update((prev) => ({ count: prev.count + 1 }))
    })
    expect(calls).toEqual([1])
  })

  it('resets to the initial state and ignores persistence errors', () => {
    const throwingStorage: Storage = {
      get length() {
        return 0
      },
      clear: () => {},
      getItem: () => null,
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error('nope')
      },
    }
    vi.stubGlobal('localStorage', throwingStorage)
    const store = createPersistentStore('throwing', { done: false })
    const calls: Array<{ done: boolean; ticks: number }> = []
    store.subscribe(() => calls.push(store.getSnapshot()))

    act(() => {
      store.update(() => ({ done: true }))
    })
    expect(store.getSnapshot()).toEqual({ state: { done: true }, ticks: 1 })

    act(() => {
      store.reset()
    })

    expect(store.getSnapshot()).toEqual({ state: { done: false }, ticks: 0 })
    expect(calls[calls.length - 1]).toEqual({ state: { done: false }, ticks: 0 })
  })
})

describe('createStoreContext', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('throws when hooks are used without a provider', () => {
    const store = createPersistentStore('missing-provider', { ready: false })
    const { useStore } = createStoreContext(store)
    expect(() => renderHook(() => useStore())).toThrow('StoreProvider is missing')
  })

  it('provides snapshot updates through the hook', () => {
    const store = createPersistentStore<{ val: string }>('ctx-test', { val: 'a' })
    const { Provider, useSnapshot, useStore } = createStoreContext(store)
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>

    const { result: snapResult } = renderHook(() => useSnapshot(), { wrapper })
    const { result: storeResult } = renderHook(() => useStore(), { wrapper })

    expect(snapResult.current.state.val).toBe('a')

    act(() => {
      storeResult.current.update(() => ({ val: 'b' }))
    })

    expect(snapResult.current.state.val).toBe('b')
    expect(snapResult.current.ticks).toBe(1)
  })
})
