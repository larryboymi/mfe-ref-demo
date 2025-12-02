import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient, prefetchReferenceData } from '@demo/common'

const AccountsApp = React.lazy(() => import('accounts/App'))
const ReportingApp = React.lazy(() => import('reporting/App'))

const linkStyle: React.CSSProperties = { marginRight: '1rem' }

const Nav = () => (
  <nav style={{ marginBottom: '1rem' }}>
    <NavLink to="/" style={linkStyle}>Home</NavLink>
    <NavLink to="/accounts" style={linkStyle}>Accounts</NavLink>
    <NavLink to="/reporting" style={linkStyle}>Reporting</NavLink>
  </nav>
)

const App = () => {
  const [queryClient] = React.useState(() => createQueryClient())

  React.useEffect(() => {
    prefetchReferenceData(queryClient).catch(() => {
      // ignore prefetch errors; widgets will handle their own error states
    })
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Nav />
        <React.Suspense fallback={<div>Loading remote module…</div>}>
          <Routes>
            <Route path="/" element={<div>Shell host app</div>} />
            <Route path="/accounts" element={<AccountsApp />} />
            <Route path="/reporting" element={<ReportingApp />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
