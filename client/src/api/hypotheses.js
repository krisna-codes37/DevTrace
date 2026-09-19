import apiClient from './client.js';

export const hypothesisKeys = {
  all: ['hypotheses'],
  list: (sessionId) => ['hypotheses', 'session', sessionId],
};

export async function fetchHypotheses(sessionId) {
  const { data } = await apiClient.get(`/sessions/${sessionId}/hypotheses`);
  return data.data;
}

export async function createHypothesis({ sessionId, payload }) {
  const { data } = await apiClient.post(`/sessions/${sessionId}/hypotheses`, payload);
  return data.data;
}

export async function updateHypothesis({ id, payload }) {
  const { data } = await apiClient.patch(`/hypotheses/${id}`, payload);
  return data.data;
}

export async function deleteHypothesis({ id }) {
  const { data } = await apiClient.delete(`/hypotheses/${id}`);
  return data;
}
