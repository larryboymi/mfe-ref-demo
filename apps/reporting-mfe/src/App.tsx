import PositionsTable from './widgets/PositionsTable'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient, SelectionProvider } from '@demo/common'
import React from 'react'
import SelectionTree from './widgets/SelectionTree'

const App: React.FC = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <SelectionProvider>
      <QueryClientProvider client={queryClient}>
        <PositionsTable />
        <SelectionTree />
      </QueryClientProvider>
    </SelectionProvider>
  )
}

export default App
