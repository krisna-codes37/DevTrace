import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createHypothesis,
  deleteHypothesis,
  fetchHypotheses,
  hypothesisKeys,
  updateHypothesis,
} from '../api/hypotheses.js';

export function useHypotheses(sessionId) {
  return useQuery({
    queryKey: hypothesisKeys.list(sessionId),
    queryFn: () => fetchHypotheses(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useCreateHypothesis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHypothesis,
    onSuccess: (_hypothesis, variables) => {
      queryClient.invalidateQueries({ queryKey: hypothesisKeys.list(variables.sessionId) });
    },
  });
}

export function useUpdateHypothesis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHypothesis,
    onSuccess: (_hypothesis, variables) => {
      queryClient.invalidateQueries({ queryKey: hypothesisKeys.list(variables.sessionId) });
    },
  });
}

export function useDeleteHypothesis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHypothesis,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: hypothesisKeys.list(variables.sessionId) });
    },
  });
}
