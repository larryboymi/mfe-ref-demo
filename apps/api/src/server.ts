import { createApp } from './app.js'

const port = Number(process.env.PORT) || 3050

const start = async () => {
  const { app } = await createApp()
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start API server', error)
  process.exit(1)
})
