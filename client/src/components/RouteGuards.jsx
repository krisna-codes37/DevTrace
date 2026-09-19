import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/useAuth.js';

function RouteLoading() {
  return (
    <main className="route-loading" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <p>Restoring your session...</p>
    </main>
  );
}

export function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <RouteLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
