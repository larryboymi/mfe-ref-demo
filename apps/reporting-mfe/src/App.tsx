import PositionsTable from './widgets/PositionsTable'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@demo/common'
import React from 'react'

const App: React.FC = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <PositionsTable />
    </QueryClientProvider>
  )
}

export default App
