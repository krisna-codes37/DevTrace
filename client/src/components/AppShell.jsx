import { Activity, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth.js';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
          <button
            className="icon-button"
            type="button"
            onClick={() => setShowLogoutDialog(true)}
            title="Log out"
          >
            <LogOut size={17} aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </header>
      {location.state?.message && (
        <p className="success-message product-message">{location.state.message}</p>
      )}
      <Outlet />
      {showLogoutDialog && (
        <div className="dialog-backdrop" role="presentation">
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <p className="eyebrow">End session</p>
            <h2 id="logout-title">Log out of DevTrace?</h2>
            <p>You will need to sign in again to access your debugging journal.</p>
            <div className="dialog-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button className="danger-button" type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
