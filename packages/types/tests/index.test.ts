import { expectTypeOf } from 'vitest'
import type { Account, Position } from '../src'

describe('Account type', () => {
  it('matches the expected shape', () => {
    const sample: Account = {
      id: 'acc-1',
      name: 'Primary',
      balance: 123_456,
    }

    expectTypeOf(sample.id).toBeString()
    expectTypeOf(sample.name).toBeString()
    expectTypeOf(sample.balance).toBeNumber()
    expectTypeOf(sample).toMatchTypeOf<Account>()
  })
})

describe('Position type', () => {
  it('matches the expected shape', () => {
    const sample: Position = {
      id: 'pos-1',
      symbol: 'AAPL',
      quantity: 42,
      value: 10_000,
    }

    expectTypeOf(sample.id).toBeString()
    expectTypeOf(sample.symbol).toBeString()
    expectTypeOf(sample.quantity).toBeNumber()
    expectTypeOf(sample.value).toBeNumber()
    expectTypeOf(sample).toMatchTypeOf<Position>()
  })
})
