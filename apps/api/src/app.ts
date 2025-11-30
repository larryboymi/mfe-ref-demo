import express from 'express'
import cors from 'cors'
import { createDb, getAccounts, getPositions } from './db.js'

export const createApp = async () => {
  const db = await createDb()
  const app = express()

  app.use(
    cors({
      origin: '*',
    }),
  )

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.get('/accounts', (_req, res) => {
    res.json(getAccounts(db))
  })

  app.get('/positions', (_req, res) => {
    res.json(getPositions(db))
  })

  return { app, db }
}
