import apiClient from './client.js';

export const experimentKeys = {
  list: (hypothesisId) => ['experiments', 'hypothesis', hypothesisId],
};

export async function fetchExperiments(hypothesisId) {
  const { data } = await apiClient.get(`/hypotheses/${hypothesisId}/experiments`);
  return data.data;
}

export async function createExperiment({ hypothesisId, payload }) {
  const { data } = await apiClient.post(`/hypotheses/${hypothesisId}/experiments`, payload);
  return data.data;
}

export async function updateExperiment({ id, payload }) {
  const { data } = await apiClient.patch(`/experiments/${id}`, payload);
  return data.data;
}

export async function deleteExperiment({ id }) {
  const { data } = await apiClient.delete(`/experiments/${id}`);
  return data;
}
