import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SelectionDemo } from '../src/SelectionDemo'

describe('SelectionDemo', () => {
  const setup = () => {
    const onSelect = vi.fn()
    const onReset = vi.fn()
    render(
      <SelectionDemo
        activeId={null}
        ticks={2}
        values={['a', 'b']}
        onSelect={onSelect}
        onReset={onReset}
      />,
    )
    return { onSelect, onReset }
  }

  it('renders current state and triggers select', () => {
    const { onSelect } = setup()

    expect(screen.getByText('Active: none')).toBeInTheDocument()
    expect(screen.getByText('Updates: 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Select a'))
    expect(onSelect).toHaveBeenCalledWith('a')
  })

  it('fires burst update and reset', () => {
    vi.useFakeTimers()
    const { onSelect, onReset } = setup()

    fireEvent.click(screen.getByText('Burst updates'))
    vi.runAllTimers()
    expect(onSelect).toHaveBeenCalled()

    fireEvent.click(screen.getByText('Reset'))
    expect(onReset).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
