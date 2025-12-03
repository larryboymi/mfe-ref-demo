/* @vitest-environment jsdom */
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createPersistentStore, createStoreContext } from '../../src/store/baseStore.ts'

describe('createStoreContext hooks', () => {
  it('provides snapshot updates through hook', () => {
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
