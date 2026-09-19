import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import authRouter from './routes/auth.routes.js';
import healthRouter from './routes/health.routes.js';
import { hypothesisRouter, sessionHypothesisRouter } from './routes/hypothesis.routes.js';
import { experimentRouter, hypothesisExperimentRouter } from './routes/experiment.routes.js';
import sessionRouter from './routes/session.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions/:sessionId/hypotheses', sessionHypothesisRouter);
app.use('/api/hypotheses/:hypothesisId/experiments', hypothesisExperimentRouter);
app.use('/api/hypotheses', hypothesisRouter);
app.use('/api/experiments', experimentRouter);
app.use('/api/sessions', sessionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
