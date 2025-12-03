import AccountsSummary from './widgets/AccountsSummary'
import SelectionMirror from './widgets/SelectionMirror'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient, SelectionProvider } from '@demo/common'
import React from 'react'

const App: React.FC = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <SelectionProvider>
      <QueryClientProvider client={queryClient}>
        <AccountsSummary />
        <SelectionMirror />
      </QueryClientProvider>
    </SelectionProvider>
  )
}

export default App
