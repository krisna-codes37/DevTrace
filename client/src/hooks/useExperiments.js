import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createExperiment,
  deleteExperiment,
  experimentKeys,
  fetchExperiments,
  updateExperiment,
} from '../api/experiments.js';

export function useExperiments(hypothesisId) {
  return useQuery({
    queryKey: experimentKeys.list(hypothesisId),
    queryFn: () => fetchExperiments(hypothesisId),
    enabled: Boolean(hypothesisId),
  });
}

export function useCreateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExperiment,
    onSuccess: (_experiment, variables) => {
      queryClient.invalidateQueries({ queryKey: experimentKeys.list(variables.hypothesisId) });
    },
  });
}

export function useUpdateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExperiment,
    onSuccess: (experiment) => {
      queryClient.invalidateQueries({ queryKey: experimentKeys.list(experiment.hypothesisId) });
    },
  });
}

export function useDeleteExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExperiment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: experimentKeys.list(variables.hypothesisId) });
    },
  });
}
