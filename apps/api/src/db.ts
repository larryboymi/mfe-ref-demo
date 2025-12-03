import initSqlJs, { Database } from 'sql.js'
import { seedAccounts, seedPositions, seedInstitutions } from './data.js'
import type { Account, Position } from '@demo/types'

export const createDb = async (): Promise<Database> => {
  const SQL = await initSqlJs({})
  const db = new SQL.Database()
  seed(db)
  return db
}

const seed = (db: Database) => {
  db.run(`
    CREATE TABLE institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      shortName TEXT,
      logoUrl TEXT,
      primaryColor TEXT
    );
    CREATE TABLE accounts (
      id TEXT PRIMARY KEY,
      institutionId TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL NOT NULL,
      FOREIGN KEY (institutionId) REFERENCES institutions(id)
    );
    CREATE TABLE positions (
      id TEXT PRIMARY KEY,
      institutionId TEXT NOT NULL,
      symbol TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      value REAL NOT NULL,
      FOREIGN KEY (institutionId) REFERENCES institutions(id)
    );
  `)

  const insertInstitution = db.prepare(
    'INSERT INTO institutions (id, name, shortName, logoUrl, primaryColor) VALUES (?, ?, ?, ?, ?)',
  )
  for (const inst of seedInstitutions) {
    insertInstitution.run([inst.id, inst.name, inst.shortName ?? null, inst.logoUrl ?? null, inst.primaryColor ?? null])
  }
  insertInstitution.free()

  const insertAccount = db.prepare('INSERT INTO accounts (id, institutionId, name, balance) VALUES (?, ?, ?, ?)')
  for (const acct of seedAccounts) {
    insertAccount.run([acct.id, acct.institutionId, acct.name, acct.balance])
  }
  insertAccount.free()

  const insertPosition = db.prepare(
    'INSERT INTO positions (id, institutionId, symbol, quantity, value) VALUES (?, ?, ?, ?, ?)',
  )
  for (const pos of seedPositions) {
    insertPosition.run([pos.id, pos.institutionId, pos.symbol, pos.quantity, pos.value])
  }
  insertPosition.free()
}

export const getAccounts = (db: Database): Account[] => {
  const stmt = db.prepare('SELECT id, institutionId, name, balance FROM accounts')
  const rows: Account[] = []
  while (stmt.step()) {
    const [id, institutionId, name, balance] = stmt.get() as [string, string, string, number]
    rows.push({ id, institutionId, name, balance })
  }
  stmt.free()
  return rows
}

export const getPositions = (db: Database): Position[] => {
  const stmt = db.prepare('SELECT id, institutionId, symbol, quantity, value FROM positions')
  const rows: Position[] = []
  while (stmt.step()) {
    const [id, institutionId, symbol, quantity, value] = stmt.get() as [string, string, string, number, number]
    rows.push({ id, institutionId, symbol, quantity, value })
  }
  stmt.free()
  return rows
}
