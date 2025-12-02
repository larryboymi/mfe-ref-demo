import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'
import { afterEach } from 'vitest'

const mockAccounts = [
  { id: '1', institutionId: 'inst-1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', institutionId: 'inst-2', name: 'Brokerage', balance: 55000 },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Accounts App', () => {
  it('renders accounts from the API and allows selection', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/accounts')) {
        return {
          ok: true,
          json: async () => mockAccounts,
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
      expect(screen.getByRole('heading', { name: /accounts \(accounts mfe\)/i })).toBeInTheDocument(),
    )

    expect(screen.getByRole('heading', { name: 'Retirement 401k' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brokerage' })).toBeInTheDocument()
  })
})
