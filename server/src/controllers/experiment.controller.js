import DebugSession from '../models/DebugSession.js';
import Experiment from '../models/Experiment.js';
import Hypothesis from '../models/Hypothesis.js';
import { NotFoundError } from '../utils/apiError.js';

async function findOwnedHypothesis(userId, hypothesisId) {
  const hypothesis = await Hypothesis.findById(hypothesisId);

  if (!hypothesis) {
    throw new NotFoundError('Hypothesis not found');
  }

  const session = await DebugSession.findOne({ _id: hypothesis.sessionId, userId });

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  return { hypothesis, session };
}

async function findOwnedExperiment(userId, experimentId) {
  const experiment = await Experiment.findById(experimentId);

  if (!experiment) {
    throw new NotFoundError('Experiment not found');
  }

  const { hypothesis, session } = await findOwnedHypothesis(userId, experiment.hypothesisId);

  if (experiment.sessionId.toString() !== session._id.toString()) {
    throw new NotFoundError('Experiment not found');
  }

  return { experiment, hypothesis, session };
}

export async function listExperiments(request, response) {
  const { hypothesis } = await findOwnedHypothesis(request.user._id, request.params.hypothesisId);
  const experiments = await Experiment.find({
    hypothesisId: hypothesis._id,
    sessionId: hypothesis.sessionId,
  }).sort({ createdAt: 1 });

  return response.json({
    success: true,
    data: experiments,
  });
}

export async function createExperiment(request, response) {
  const { hypothesis, session } = await findOwnedHypothesis(
    request.user._id,
    request.params.hypothesisId,
  );
  const experiment = await Experiment.create({
    ...request.body,
    hypothesisId: hypothesis._id,
    sessionId: session._id,
  });

  return response.status(201).json({
    success: true,
    data: experiment,
  });
}

export async function updateExperiment(request, response) {
  const { experiment, session } = await findOwnedExperiment(request.user._id, request.params.id);
  const updates = { ...request.body };
  delete updates.hypothesisId;
  delete updates.sessionId;

  const updatedExperiment = await Experiment.findOneAndUpdate(
    {
      _id: experiment._id,
      hypothesisId: experiment.hypothesisId,
      sessionId: session._id,
    },
    updates,
    { new: true, runValidators: true },
  );

  if (!updatedExperiment) {
    throw new NotFoundError('Experiment not found');
  }

  return response.json({
    success: true,
    data: updatedExperiment,
  });
}

export async function deleteExperiment(request, response) {
  const { experiment, session } = await findOwnedExperiment(request.user._id, request.params.id);
  const result = await Experiment.deleteOne({
    _id: experiment._id,
    hypothesisId: experiment.hypothesisId,
    sessionId: session._id,
  });

  if (result.deletedCount !== 1) {
    throw new NotFoundError('Experiment not found');
  }

  return response.json({
    success: true,
    message: 'Experiment deleted successfully',
  });
}
