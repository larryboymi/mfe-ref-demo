import { createApp } from '../src/app.js'
import { createDb, getAccounts, getPositions } from '../src/db.js'

describe('API server', () => {
  it('serves accounts and positions from the in-memory database', async () => {
    const db = await createDb()

    expect(getAccounts(db)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Retirement 401k', balance: 150000 }),
        expect.objectContaining({ id: '2', name: 'Brokerage', balance: 55000 }),
      ]),
    )

    expect(getPositions(db)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', symbol: 'AAPL', quantity: 50, value: 9500 }),
        expect.objectContaining({ id: '2', symbol: 'TSLA', quantity: 10, value: 2500 }),
      ]),
    )
  })

  it('responds to health checks', async () => {
    const { app } = await createApp()
    const response = await new Promise((resolve) => {
      const req = { url: '/health', method: 'GET' } satisfies { url: string; method: string }
      const headers = new Map<string, string>()
      const res = {
        statusCode: 200,
        setHeader: (name: string, value: string) => headers.set(name.toLowerCase(), value),
        getHeader: (name: string) => headers.get(name.toLowerCase()),
        end: (body?: unknown) => resolve(body),
        json: (body: unknown) => resolve(body),
        status: function (code: number) {
          this.statusCode = code
          return this
        },
      }
      app.handle(req, res, () => resolve({ status: 'not ok' }))
    })

    expect(response).toEqual({ status: 'ok' })
  })
})
