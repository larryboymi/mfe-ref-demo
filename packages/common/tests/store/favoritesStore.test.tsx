/* @vitest-environment jsdom */
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { FavoritesProvider, useFavoritesActions, useFavoritesSnapshot } from '../../src/store/favoritesStore.ts'
import { mockLocalStorage } from './utils.ts'

describe('favorites store hooks', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  )

  it('toggles and clears favorites', () => {
    const { result: snap } = renderHook(() => useFavoritesSnapshot(), { wrapper })
    const { result: actions } = renderHook(() => useFavoritesActions(), { wrapper })

    expect(snap.current.state.ids).toEqual([])
    expect(snap.current.ticks).toBe(0)

    act(() => {
      actions.current.toggle('one')
      actions.current.toggle('two')
    })
    expect(new Set(snap.current.state.ids)).toEqual(new Set(['one', 'two']))
    expect(snap.current.ticks).toBe(2)

    act(() => {
      actions.current.toggle('one')
    })
    expect(snap.current.state.ids).toEqual(['two'])
    expect(snap.current.ticks).toBe(3)

    act(() => {
      actions.current.clear()
    })
    expect(snap.current.state.ids).toEqual([])
    expect(snap.current.ticks).toBe(0)
  })
})
