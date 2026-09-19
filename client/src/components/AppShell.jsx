import { Activity, LogOut } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth.js';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true, state: { message: 'You have been logged out.' } });
  }

  return (
    <main className="product-shell">
      <header className="product-header">
        <Link className="brand-lockup" to="/dashboard" aria-label="DevTrace dashboard">
          <span className="brand-mark">
            <Activity size={19} strokeWidth={2.5} />
          </span>
          <span>DevTrace</span>
        </Link>
        <nav className="product-nav" aria-label="Primary navigation">
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/sessions">
            Sessions
          </NavLink>
        </nav>
        <div className="user-controls">
          <span className="user-chip">{user?.name}</span>
          <button className="icon-button" type="button" onClick={handleLogout} title="Log out">
            <LogOut size={17} aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </header>
      {location.state?.message && (
        <p className="success-message product-message">{location.state.message}</p>
      )}
      <Outlet />
    </main>
  );
}
