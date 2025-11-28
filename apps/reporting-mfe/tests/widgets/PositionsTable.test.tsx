import { render, screen } from '@testing-library/react'
import PositionsTable from '../../src/widgets/PositionsTable'

describe('PositionsTable', () => {
  it('renders positions and totals', () => {
    render(<PositionsTable />)

    expect(screen.getByRole('heading', { name: /positions \(reporting mfe\)/i })).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Symbol' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: 'AAPL' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'TSLA' })).toBeInTheDocument()
    expect(screen.getByText('$9,500')).toBeInTheDocument()
    expect(screen.getByText('$2,500')).toBeInTheDocument()
    expect(screen.getByText('$12,000')).toBeInTheDocument()
  })
})
