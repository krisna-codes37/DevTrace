import { useQueries } from '@tanstack/react-query';

import { experimentKeys, fetchExperiments } from '../api/experiments.js';
import { useHypotheses } from './useHypotheses.js';

export function useJourneyTimeline(session) {
  const hypothesesQuery = useHypotheses(session?._id);
  const hypotheses = hypothesesQuery.data ?? [];
  const experimentQueries = useQueries({
    queries: hypotheses.map((hypothesis) => ({
      queryKey: experimentKeys.list(hypothesis._id),
      queryFn: () => fetchExperiments(hypothesis._id),
      enabled: Boolean(hypothesis._id),
    })),
  });

  const isLoadingExperiments = experimentQueries.some((query) => query.isLoading);
  const events = buildJourneyEvents(session, hypotheses, experimentQueries);

  return {
    events,
    error: hypothesesQuery.error || experimentQueries.find((query) => query.error)?.error,
    isLoading: hypothesesQuery.isLoading || isLoadingExperiments,
  };
}

function buildJourneyEvents(session, hypotheses, experimentQueries) {
  if (!session) return [];

  const events = [
    {
      id: `session-created-${session._id}`,
      type: 'created',
      title: 'Session created',
      description: session.title,
      timestamp: session.createdAt,
    },
  ];

  hypotheses.forEach((hypothesis, index) => {
    events.push({
      id: `hypothesis-added-${hypothesis._id}`,
      type: 'hypothesis',
      title: 'Hypothesis added',
      description: hypothesis.description,
      timestamp: hypothesis.createdAt,
    });

    if (hypothesis.updatedAt && hypothesis.updatedAt !== hypothesis.createdAt) {
      events.push({
        id: `hypothesis-status-${hypothesis._id}`,
        type: 'status',
        title: 'Hypothesis status changed',
        description: formatStatus(hypothesis.status),
        timestamp: hypothesis.updatedAt,
      });
    }

    const experiments = experimentQueries[index]?.data ?? [];
    experiments.forEach((experiment) => {
      events.push({
        id: `experiment-${experiment._id}`,
        type: 'experiment',
        title: 'Experiment performed',
        description: experiment.testDescription,
        timestamp: experiment.createdAt,
      });
    });
  });

  if (session.rootCause) {
    events.push({
      id: `root-cause-${session._id}`,
      type: 'rootCause',
      title: 'Root cause recorded',
      description: session.rootCause,
      timestamp: session.updatedAt,
    });
  }

  if (session.solution) {
    events.push({
      id: `solution-${session._id}`,
      type: 'solution',
      title: 'Solution recorded',
      description: session.solution,
      timestamp: session.updatedAt,
    });
  }

  if (session.status === 'SOLVED') {
    events.push({
      id: `session-solved-${session._id}`,
      type: 'solved',
      title: 'Session solved',
      description: 'The debugging journey was marked solved.',
      timestamp: session.solvedAt || session.updatedAt,
    });
  }

  return events.sort((first, second) => new Date(first.timestamp) - new Date(second.timestamp));
}

function formatStatus(status) {
  return status
    ? status
        .toLowerCase()
        .replace('_', ' ')
        .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
    : 'Status updated';
}
