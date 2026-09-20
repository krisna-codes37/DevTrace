import DebugSession from '../models/DebugSession.js';
import Experiment from '../models/Experiment.js';
import Hypothesis from '../models/Hypothesis.js';
import { analyzeDebugSession } from '../services/ai/gemini.js';
import { NotFoundError } from '../utils/apiError.js';

function buildInvestigation(session, hypotheses, experiments) {
  const hypothesisById = new Map(hypotheses.map((hypothesis) => [hypothesis._id.toString(), hypothesis]));
  const rejectedHypotheses = hypotheses.filter(({ status }) => status === 'REJECTED');
  const confirmedHypotheses = hypotheses.filter(({ status }) => status === 'CONFIRMED');

  return {
    session: {
      title: session.title,
      description: session.description,
      errorMessage: session.errorMessage,
      technology: session.technology,
      status: session.status,
      rootCause: session.rootCause,
      solution: session.solution,
      lessonLearned: session.lessonLearned,
    },
    counts: {
      hypotheses: hypotheses.length,
      rejectedHypotheses: rejectedHypotheses.length,
      confirmedHypotheses: confirmedHypotheses.length,
      experiments: experiments.length,
    },
    hypotheses: hypotheses.map(({ description, reasoning, confidence, status, createdAt }) => ({
      description,
      reasoning,
      confidence,
      status,
      createdAt,
    })),
    experiments: experiments.map((experiment) => ({
      hypothesis: hypothesisById.get(experiment.hypothesisId.toString())?.description,
      testDescription: experiment.testDescription,
      expectedResult: experiment.expectedResult,
      actualResult: experiment.actualResult,
      evidence: experiment.evidence,
      conclusion: experiment.conclusion,
      createdAt: experiment.createdAt,
    })),
  };
}

export async function analyzeSession(request, response) {
  const session = await DebugSession.findOne({
    _id: request.body.sessionId,
    userId: request.user._id,
  }).lean();

  if (!session) {
    throw new NotFoundError('Debug session not found');
  }

  const [hypotheses, experiments] = await Promise.all([
    Hypothesis.find({ sessionId: session._id }).sort({ createdAt: 1 }).lean(),
    Experiment.find({ sessionId: session._id }).sort({ createdAt: 1 }).lean(),
  ]);
  const analysis = await analyzeDebugSession(buildInvestigation(session, hypotheses, experiments));

  return response.json({ success: true, data: { analysis } });
}
