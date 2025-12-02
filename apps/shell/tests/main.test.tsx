import { waitFor } from '@testing-library/react'
import { vi } from 'vitest'

const createRootMock = vi.fn(() => ({ render: vi.fn() }))

vi.mock('react-dom/client', () => ({
  createRoot: (...args: unknown[]) => createRootMock(...args),
}))

vi.mock('@demo/common', () => ({
  prefetchReferenceData: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../src/App', () => ({
  default: () => <div data-testid="app-root">App Component</div>,
}))

describe('main entry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    createRootMock.mockClear()
  })

  it('mounts the app into #root', async () => {
    await import('../src/main')

    await waitFor(() => expect(createRootMock).toHaveBeenCalledTimes(1))
    const mountArg = createRootMock.mock.calls[0]?.[0]
    expect(mountArg).toBe(document.getElementById('root'))
  })
})
