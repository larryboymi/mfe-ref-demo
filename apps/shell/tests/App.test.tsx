import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

describe('App shell', () => {
  it('renders nav links and loads remotes when navigating', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Accounts' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reporting' })).toBeInTheDocument()

    expect(screen.getByText('Shell host app')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Accounts' }))
    expect(await screen.findByTestId('accounts-summary-mock')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Reporting' }))
    expect(await screen.findByTestId('positions-table-mock')).toBeInTheDocument()
  })
})
