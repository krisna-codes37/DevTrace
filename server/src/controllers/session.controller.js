import DebugSession from '../models/DebugSession.js';
import Experiment from '../models/Experiment.js';
import Hypothesis from '../models/Hypothesis.js';
import { NotFoundError } from '../utils/apiError.js';

const sortFields = {
  createdAt: { createdAt: 1 },
  '-createdAt': { createdAt: -1 },
  updatedAt: { updatedAt: 1 },
  '-updatedAt': { updatedAt: -1 },
  title: { title: 1 },
  '-title': { title: -1 },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ownedSessionFilter(userId, sessionId) {
  return {
    _id: sessionId,
    userId,
  };
}

export async function listSessions(request, response) {
  const { page, limit, search, status, technology, severity, sort } = request.query;
  const filter = { userId: request.user._id };

  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { title: expression },
      { description: expression },
      { errorMessage: expression },
      { projectName: expression },
      { technology: expression },
      { tags: expression },
      { rootCause: expression },
      { solution: expression },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (technology) {
    filter.technology = technology;
  }

  if (severity) {
    filter.severity = severity;
  }

  const [sessions, total] = await Promise.all([
    DebugSession.find(filter)
      .sort(sortFields[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    DebugSession.countDocuments(filter),
  ]);

  return response.json({
    success: true,
    data: sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getSession(request, response) {
  const session = await DebugSession.findOne(
    ownedSessionFilter(request.user._id, request.params.id),
  );

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  return response.json({
    success: true,
    data: session,
  });
}

export async function createSession(request, response) {
  const session = await DebugSession.create({
    ...request.body,
    userId: request.user._id,
  });

  return response.status(201).json({
    success: true,
    data: session,
  });
}

export async function updateSession(request, response) {
  const sessionUpdates = { ...request.body };
  delete sessionUpdates.userId;
  const session = await DebugSession.findOneAndUpdate(
    ownedSessionFilter(request.user._id, request.params.id),
    sessionUpdates,
    { new: true, runValidators: true },
  );

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  return response.json({
    success: true,
    data: session,
  });
}

export async function deleteSession(request, response) {
  const session = await DebugSession.findOneAndDelete(
    ownedSessionFilter(request.user._id, request.params.id),
  );

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  await Promise.all([
    Experiment.deleteMany({ sessionId: session._id }),
    Hypothesis.deleteMany({ sessionId: session._id }),
  ]);

  return response.json({
    success: true,
    message: 'Debug session deleted successfully',
  });
}
