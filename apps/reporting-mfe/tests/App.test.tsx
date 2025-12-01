import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'
import { afterEach } from 'vitest'

const mockPositions = [
  { id: '1', symbol: 'AAPL', quantity: 50, value: 9500 },
  { id: '2', symbol: 'TSLA', quantity: 10, value: 2500 },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Reporting App', () => {
  it('renders positions from the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockPositions,
    } as Response)

    render(<App />)

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /positions \(reporting mfe\)/i })).toBeInTheDocument(),
    )

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('TSLA')).toBeInTheDocument()
  })
})
