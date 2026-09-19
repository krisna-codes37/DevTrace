import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import { ProtectedRoutes, PublicRoutes } from './components/RouteGuards.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SessionDetailsPage from './pages/SessionDetailsPage.jsx';
import SessionFormPage from './pages/SessionFormPage.jsx';
import SessionsPage from './pages/SessionsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/sessions/new" element={<SessionFormPage mode="create" />} />
            <Route path="/sessions/:id" element={<SessionDetailsPage />} />
            <Route path="/sessions/:id/edit" element={<SessionFormPage mode="edit" />} />
            <Route path="/profile" element={<PlaceholderPage />} />
            <Route path="/settings" element={<PlaceholderPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
