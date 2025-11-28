import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

const AccountsApp = React.lazy(() => import('accounts/App'));
const ReportingApp = React.lazy(() => import('reporting/App'));

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
          <Route path="/accounts" element={<AccountsApp />} />
          <Route path="/reporting" element={<ReportingApp />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
