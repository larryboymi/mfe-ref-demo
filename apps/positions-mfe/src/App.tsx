import PositionsTable from './widgets/PositionsTable'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient, SelectionProvider, FavoritesProvider } from '@demo/common'
import React from 'react'
import SelectionTree from './widgets/SelectionTree'

const App: React.FC = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <FavoritesProvider>
      <SelectionProvider>
        <QueryClientProvider client={queryClient}>
          <PositionsTable />
          <SelectionTree />
        </QueryClientProvider>
      </SelectionProvider>
    </FavoritesProvider>
  )
}

export default App
