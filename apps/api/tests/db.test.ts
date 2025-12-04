import { describe, expect, it } from '@jest/globals'

describe('database seeding edge cases', () => {
  it('coerces optional institution fields through null/undefined paths', async () => {
    const data = await import('../src/data.js')
    const originalInstitutions = [...data.seedInstitutions]
    const originalAccounts = [...data.seedAccounts]
    const originalPositions = [...data.seedPositions]

    data.seedInstitutions.splice(0, data.seedInstitutions.length, { id: 'inst-null', name: 'Nullables R Us' })
    data.seedAccounts.splice(0, data.seedAccounts.length, {
      id: 'acct-null',
      institutionId: 'inst-null',
      name: 'No Frills',
      balance: 1,
    })
    data.seedPositions.splice(0, data.seedPositions.length, {
      id: 'pos-null',
      institutionId: 'inst-null',
      symbol: 'NONE',
      quantity: 0,
      value: 0,
    })

    const { createDb, getInstitutions, getAccounts, getPositions } = await import('../src/db.js')
    const db = await createDb()

    expect(getInstitutions(db)).toEqual([
      {
        id: 'inst-null',
        name: 'Nullables R Us',
        shortName: undefined,
        logoUrl: undefined,
        primaryColor: undefined,
      },
    ])
    expect(getAccounts(db)).toEqual([
      { id: 'acct-null', institutionId: 'inst-null', name: 'No Frills', balance: 1 },
    ])
    expect(getPositions(db)).toEqual([
      { id: 'pos-null', institutionId: 'inst-null', symbol: 'NONE', quantity: 0, value: 0 },
    ])

    data.seedInstitutions.splice(0, data.seedInstitutions.length, ...originalInstitutions)
    data.seedAccounts.splice(0, data.seedAccounts.length, ...originalAccounts)
    data.seedPositions.splice(0, data.seedPositions.length, ...originalPositions)
  })
})
