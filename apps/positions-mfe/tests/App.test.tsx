import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'
import { afterEach } from 'vitest'

const mockPositions = [
  { id: '1', institutionId: 'inst-1', symbol: 'AAPL', quantity: 50, value: 9500 },
  { id: '2', institutionId: 'inst-2', symbol: 'TSLA', quantity: 10, value: 2500 },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Positions App', () => {
  it('renders positions from the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/positions')) {
        return {
          ok: true,
          json: async () => mockPositions,
        } as Response
      }
      if (url.includes('/reference-data')) {
        return {
          ok: true,
          json: async () => ({ institutions: [] }),
        } as Response
      }
      throw new Error(`Unhandled fetch url: ${url}`)
    })

    render(<App />)

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /positions mfe/i })).toBeInTheDocument(),
    )

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('TSLA')).toBeInTheDocument()
  })
})
