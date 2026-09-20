import { Activity, BookOpen, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth.js';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [theme, setTheme] = useState(() => window.localStorage.getItem('devtrace.theme') ?? 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('devtrace.theme', theme);
  }, [theme]);

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
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/guide">
            <BookOpen size={15} aria-hidden="true" /> Guide
          </NavLink>
        </nav>
        <div className="user-controls">
          <span className="user-chip">{user?.name}</span>
          <button
            className="icon-button"
            type="button"
            onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span className="sr-only">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</span>
          </button>
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
      <footer className="product-footer">Developed by Krishna Mandal</footer>
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
