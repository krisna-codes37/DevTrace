import apiClient from './client.js';

export async function analyzeSession(sessionId) {
  const { data } = await apiClient.post('/ai/analyze-session', { sessionId });
  return data.data.analysis;
}
