import { useEffect, useState } from 'react';

import apiClient, { getApiErrorMessage, tokenStorage } from '../api/client.js';
import { AuthContext } from './auth-context.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.data.user);
      })
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials);
    tokenStorage.set(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }

  async function register(details) {
    const { data } = await apiClient.post('/auth/register', details);
    tokenStorage.set(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }

  async function logout() {
    try {
      if (tokenStorage.get()) {
        await apiClient.post('/auth/logout');
      }
    } catch {
      // The local session is still cleared when the API is unavailable.
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    getApiErrorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
