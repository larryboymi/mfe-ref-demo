import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountsSummary from '../../src/widgets/AccountsSummary'
import { afterEach } from 'vitest'
import { FavoritesProvider, SelectionProvider, createQueryClient } from '@demo/common'

afterEach(() => {
  vi.restoreAllMocks()
})
import type { Account } from '@demo/types'

const mockAccounts: Account[] = [
  { id: '1', institutionId: 'inst-1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', institutionId: 'inst-2', name: 'Brokerage', balance: 55000 },
]

const renderWithClient = async (responseOverride?: Response) => {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false, queryFn: client.getDefaultOptions().queries?.queryFn } })

  const fetchMock = vi.spyOn(globalThis, 'fetch')
  fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/accounts')) {
      return (
        responseOverride ??
        ({
          ok: true,
          json: async () => mockAccounts,
        } as Response)
      )
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
          <AccountsSummary />
        </SelectionProvider>
      </FavoritesProvider>
    </QueryClientProvider>,
  )

  return { client }
}

describe('AccountsSummary', () => {
  it('renders accounts and shows details when selected', async () => {
    const user = userEvent.setup()

    await renderWithClient()

    await waitFor(() => expect(screen.getByText('Accounts MFE')).toBeInTheDocument())

    expect(screen.getByRole('heading', { name: /accounts mfe/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Retirement 401k' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brokerage' })).toBeInTheDocument()

    expect(screen.queryByText(/selected account/i)).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: /view details/i })[0])

    expect(screen.getByRole('heading', { name: /selected account/i })).toBeInTheDocument()
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Name: Retirement 401k/)).toBeInTheDocument()
  })

  it('shows an error message when loading fails', async () => {
    await renderWithClient({
      ok: false,
      status: 500,
      json: async () => [],
    } as Response)

    await waitFor(() => expect(screen.getByText(/unable to load accounts/i)).toBeInTheDocument())
  })
})
