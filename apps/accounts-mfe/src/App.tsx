import AccountsSummary from './widgets/AccountsSummary'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './queryClient'
import React from 'react'

const App: React.FC = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AccountsSummary />
    </QueryClientProvider>
  )
}

export default App
