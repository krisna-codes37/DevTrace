import apiClient from './client.js';

export const dashboardKeys = {
  stats: ['dashboard', 'stats'],
};

export async function fetchDashboardStats() {
  const { data } = await apiClient.get('/dashboard/stats');
  return data.data;
}
