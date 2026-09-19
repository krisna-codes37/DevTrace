import { useQuery } from '@tanstack/react-query';

import { dashboardKeys, fetchDashboardStats } from '../api/dashboard.js';

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: fetchDashboardStats,
  });
}
