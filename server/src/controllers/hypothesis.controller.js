import DebugSession from '../models/DebugSession.js';
import Hypothesis from '../models/Hypothesis.js';
import { NotFoundError } from '../utils/apiError.js';

async function findOwnedSession(userId, sessionId) {
  const session = await DebugSession.findOne({ _id: sessionId, userId });

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  return session;
}

async function findOwnedHypothesis(userId, hypothesisId) {
  const hypothesis = await Hypothesis.findById(hypothesisId);

  if (!hypothesis) {
    throw new NotFoundError('Hypothesis not found');
  }

  await findOwnedSession(userId, hypothesis.sessionId);
  return hypothesis;
}

export async function listHypotheses(request, response) {
  await findOwnedSession(request.user._id, request.params.sessionId);
  const hypotheses = await Hypothesis.find({ sessionId: request.params.sessionId }).sort({
    createdAt: 1,
  });

  return response.json({
    success: true,
    data: hypotheses,
  });
}

export async function createHypothesis(request, response) {
  await findOwnedSession(request.user._id, request.params.sessionId);
  const hypothesis = await Hypothesis.create({
    ...request.body,
    sessionId: request.params.sessionId,
  });

  return response.status(201).json({
    success: true,
    data: hypothesis,
  });
}

export async function updateHypothesis(request, response) {
  await findOwnedHypothesis(request.user._id, request.params.id);
  const updates = { ...request.body };
  delete updates.sessionId;

  const hypothesis = await Hypothesis.findOneAndUpdate({ _id: request.params.id }, updates, {
    new: true,
    runValidators: true,
  });

  return response.json({
    success: true,
    data: hypothesis,
  });
}

export async function deleteHypothesis(request, response) {
  await findOwnedHypothesis(request.user._id, request.params.id);
  await Hypothesis.deleteOne({ _id: request.params.id });

  return response.json({
    success: true,
    message: 'Hypothesis deleted successfully',
  });
}
