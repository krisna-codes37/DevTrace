import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createSession,
  deleteSession,
  fetchSession,
  fetchSessions,
  sessionKeys,
  updateSession,
} from '../api/sessions.js';

export function useSessions(params) {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => fetchSessions(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useSession(id) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => fetchSession(id),
    enabled: Boolean(id),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSession,
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKeys.detail(session._id), session);
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: sessionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
