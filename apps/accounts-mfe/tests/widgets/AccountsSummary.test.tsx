import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountsSummary from '../../src/widgets/AccountsSummary'
import { afterEach } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
})
import type { Account } from '@demo/types'

const mockAccounts: Account[] = [
  { id: '1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', name: 'Brokerage', balance: 55000 },
]

const renderWithClient = async () => {
  const client = new QueryClient()
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => mockAccounts,
  } as Response)

  render(
    <QueryClientProvider client={client}>
      <AccountsSummary />
    </QueryClientProvider>,
  )

  await waitFor(() => expect(screen.getByText('Accounts (Accounts MFE)')).toBeInTheDocument())
}

describe('AccountsSummary', () => {
  it('renders accounts and shows details when selected', async () => {
    const user = userEvent.setup()

    await renderWithClient()

    expect(screen.getByRole('heading', { name: /accounts \(accounts mfe\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Retirement 401k' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brokerage' })).toBeInTheDocument()

    expect(screen.queryByText(/selected account/i)).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: /view details/i })[0])

    expect(screen.getByRole('heading', { name: /selected account/i })).toBeInTheDocument()
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Name: Retirement 401k/)).toBeInTheDocument()
  })
})
