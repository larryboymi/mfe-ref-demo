import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import PositionsTable from '../../src/widgets/PositionsTable'
import { afterEach } from 'vitest'
import { FavoritesProvider, SelectionProvider } from '@demo/common'

const mockPositions = [
  { id: '1', institutionId: 'inst-1', symbol: 'AAPL', quantity: 50, value: 9500 },
  { id: '2', institutionId: 'inst-2', symbol: 'TSLA', quantity: 10, value: 2500 },
]

const renderWithClient = async () => {
  const client = new QueryClient()
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
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

  render(
    <QueryClientProvider client={client}>
      <FavoritesProvider>
        <SelectionProvider>
          <PositionsTable />
        </SelectionProvider>
      </FavoritesProvider>
    </QueryClientProvider>,
  )

  await waitFor(() => expect(screen.getByText(/positions mfe/i)).toBeInTheDocument())
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PositionsTable', () => {
  it('renders positions and totals', async () => {
    await renderWithClient()

    expect(screen.getByRole('heading', { name: /positions mfe/i })).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Symbol' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: 'AAPL' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'TSLA' })).toBeInTheDocument()
    expect(screen.getByText('$9,500')).toBeInTheDocument()
    expect(screen.getByText('$2,500')).toBeInTheDocument()
    expect(screen.getByText('$12,000')).toBeInTheDocument()
  })

  it('shows an error message when loading fails', async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/positions')) {
        return {
          ok: false,
          status: 500,
          json: async () => [],
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

    render(
      <QueryClientProvider client={client}>
        <FavoritesProvider>
          <SelectionProvider>
            <PositionsTable />
          </SelectionProvider>
        </FavoritesProvider>
      </QueryClientProvider>,
    )

    await waitFor(() => expect(screen.getByText(/unable to load positions/i)).toBeInTheDocument())
  })
})
