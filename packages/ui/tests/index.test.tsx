import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Card } from '../src'

describe('Card', () => {
  it('renders the title and children', () => {
    render(
      <Card title="Test Card">
        <span>Body content</span>
      </Card>,
    )

    expect(screen.getByRole('heading', { name: 'Test Card' })).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})

describe('Button', () => {
  it('forwards props and handles clicks', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button aria-label="cta" onClick={onClick}>
        Click me
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'cta' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
