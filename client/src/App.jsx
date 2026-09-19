import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import { ProtectedRoutes, PublicRoutes } from './components/RouteGuards.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

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
            <Route path="/dashboard" element={<PlaceholderPage />} />
            <Route path="/sessions" element={<PlaceholderPage />} />
            <Route path="/sessions/new" element={<PlaceholderPage />} />
            <Route path="/sessions/:id" element={<PlaceholderPage />} />
            <Route path="/sessions/:id/edit" element={<PlaceholderPage />} />
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
