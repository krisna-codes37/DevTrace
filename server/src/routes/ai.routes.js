import { Router } from 'express';
import { z } from 'zod';

import { analyzeSession } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase } from '../middleware/database.js';
import { validate } from '../middleware/validate.js';

const aiRouter = Router();
const analyzeSessionSchema = z
  .object({ sessionId: z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId') })
  .strict();

aiRouter.post('/analyze-session', requireDatabase, requireAuth, validate(analyzeSessionSchema), analyzeSession);

export default aiRouter;
