import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { prefetchReferenceData } from '@demo/common'

const bootstrap = async () => {
  // Optional prefetch so MFEs see data instantly
  try {
    await prefetchReferenceData(queryClient)
  } catch {
    // Ignore startup errors here; hooks will still handle error state later
  }

  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
}

bootstrap()
