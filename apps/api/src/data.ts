import type { Account, Position, Institution } from '@demo/types'

export const seedInstitutions: Institution[] = [
  { id: 'inst-1', name: 'Acme Bank', shortName: 'Acme' },
  { id: 'inst-2', name: 'Contoso Investments', shortName: 'Contoso' },
]

export const seedAccounts: Account[] = [
  { id: '1', institutionId: 'inst-1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', institutionId: 'inst-2', name: 'Brokerage', balance: 55000 },
]

export const seedPositions: Position[] = [
  { id: '1', institutionId: 'inst-1', symbol: 'AAPL', quantity: 50, value: 9500 },
  { id: '2', institutionId: 'inst-2', symbol: 'TSLA', quantity: 10, value: 2500 },
]
