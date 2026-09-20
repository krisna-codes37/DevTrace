import axios from 'axios';

const tokenStorageKey = 'devtrace.accessToken';

export const tokenStorage = {
  get() {
    return window.localStorage.getItem(tokenStorageKey);
  },
  set(token) {
    window.localStorage.setItem(tokenStorageKey, token);
  },
  clear() {
    window.localStorage.removeItem(tokenStorageKey);
  },
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error) {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (!error.response) {
    return 'Unable to reach the DevTrace API. Start the backend and check VITE_API_URL.';
  }

  return 'Something went wrong. Please try again.';
}

export default apiClient;
