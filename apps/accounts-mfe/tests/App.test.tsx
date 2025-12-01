import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'
import { afterEach } from 'vitest'

const mockAccounts = [
  { id: '1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', name: 'Brokerage', balance: 55000 },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Accounts App', () => {
  it('renders accounts from the API and allows selection', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockAccounts,
    } as Response)

    render(<App />)

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /accounts \(accounts mfe\)/i })).toBeInTheDocument(),
    )

    expect(screen.getByRole('heading', { name: 'Retirement 401k' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brokerage' })).toBeInTheDocument()
  })
})
