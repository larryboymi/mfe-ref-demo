import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountsSummary from '../../src/widgets/AccountsSummary'

describe('AccountsSummary', () => {
  it('renders accounts and shows details when selected', async () => {
    const user = userEvent.setup()

    render(<AccountsSummary />)

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
