import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

const AccountsSummary = React.lazy(() => import('accounts/AccountsSummary'));
const PositionsTable = React.lazy(() => import('reporting/PositionsTable'));

const linkStyle: React.CSSProperties = { marginRight: '1rem' };

function Nav() {
  return (
    <nav style={{ marginBottom: '1rem' }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>
      <NavLink to="/accounts" style={linkStyle}>Accounts</NavLink>
      <NavLink to="/reporting" style={linkStyle}>Reporting</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <React.Suspense fallback={<div>Loading remote module…</div>}>
        <Routes>
          <Route path="/" element={<div>Shell host app</div>} />
          <Route path="/accounts" element={<AccountsSummary />} />
          <Route path="/reporting" element={<PositionsTable />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
