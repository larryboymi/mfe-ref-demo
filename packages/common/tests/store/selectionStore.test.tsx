/* @vitest-environment jsdom */
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { SelectionProvider, useSelectionActions, useSelectionSnapshot } from '../../src/store/selectionStore.ts'
import { mockLocalStorage } from './utils.ts'

describe('selection store hooks', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SelectionProvider>{children}</SelectionProvider>
  )

  it('selects and resets while tracking ticks', () => {
    const { result: snap } = renderHook(() => useSelectionSnapshot(), { wrapper })
    const { result: actions } = renderHook(() => useSelectionActions(), { wrapper })

    expect(snap.current.state.activeId).toBeNull()
    expect(snap.current.ticks).toBe(0)

    act(() => {
      actions.current.select('abc')
    })
    expect(snap.current.state.activeId).toBe('abc')
    expect(snap.current.ticks).toBe(1)

    act(() => {
      actions.current.reset()
    })
    expect(snap.current.state.activeId).toBeNull()
    expect(snap.current.ticks).toBe(0)
  })
})
