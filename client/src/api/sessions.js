import apiClient from './client.js';

export const sessionKeys = {
  all: ['sessions'],
  list: (params) => ['sessions', 'list', params],
  detail: (id) => ['sessions', id],
};

export async function fetchSessions(params) {
  const { data } = await apiClient.get('/sessions', { params });
  return data;
}

export async function fetchSession(id) {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data.data;
}

export async function createSession(payload) {
  const { data } = await apiClient.post('/sessions', payload);
  return data.data;
}

export async function updateSession({ id, payload }) {
  const { data } = await apiClient.patch(`/sessions/${id}`, payload);
  return data.data;
}

export async function deleteSession(id) {
  const { data } = await apiClient.delete(`/sessions/${id}`);
  return data;
}
