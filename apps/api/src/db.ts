import initSqlJs, { Database } from 'sql.js'
import { seedAccounts, seedPositions } from './data.js'
import type { Account, Position } from '@demo/types'

export const createDb = async (): Promise<Database> => {
  const SQL = await initSqlJs({})
  const db = new SQL.Database()
  seed(db)
  return db
}

const seed = (db: Database) => {
  db.run(`
    CREATE TABLE accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      balance REAL NOT NULL
    );
    CREATE TABLE positions (
      id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      value REAL NOT NULL
    );
  `)

  const insertAccount = db.prepare('INSERT INTO accounts (id, name, balance) VALUES (?, ?, ?)')
  for (const acct of seedAccounts) {
    insertAccount.run([acct.id, acct.name, acct.balance])
  }
  insertAccount.free()

  const insertPosition = db.prepare('INSERT INTO positions (id, symbol, quantity, value) VALUES (?, ?, ?, ?)')
  for (const pos of seedPositions) {
    insertPosition.run([pos.id, pos.symbol, pos.quantity, pos.value])
  }
  insertPosition.free()
}

export const getAccounts = (db: Database): Account[] => {
  const stmt = db.prepare('SELECT id, name, balance FROM accounts')
  const rows: Account[] = []
  while (stmt.step()) {
    const [id, name, balance] = stmt.get() as [string, string, number]
    rows.push({ id, name, balance })
  }
  stmt.free()
  return rows
}

export const getPositions = (db: Database): Position[] => {
  const stmt = db.prepare('SELECT id, symbol, quantity, value FROM positions')
  const rows: Position[] = []
  while (stmt.step()) {
    const [id, symbol, quantity, value] = stmt.get() as [string, string, number, number]
    rows.push({ id, symbol, quantity, value })
  }
  stmt.free()
  return rows
}
