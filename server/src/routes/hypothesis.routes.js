import { Router } from 'express';

import {
  createHypothesis,
  deleteHypothesis,
  listHypotheses,
  updateHypothesis,
} from '../controllers/hypothesis.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase } from '../middleware/database.js';
import { validate } from '../middleware/validate.js';
import {
  createHypothesisSchema,
  hypothesisParamsSchema,
  sessionHypothesisParamsSchema,
  updateHypothesisSchema,
} from '../validators/hypothesis.validator.js';

const sessionHypothesisRouter = Router({ mergeParams: true });
sessionHypothesisRouter.use(requireDatabase, requireAuth);
sessionHypothesisRouter.get('/', validate(sessionHypothesisParamsSchema, 'params'), listHypotheses);
sessionHypothesisRouter.post(
  '/',
  validate(sessionHypothesisParamsSchema, 'params'),
  validate(createHypothesisSchema),
  createHypothesis,
);

const hypothesisRouter = Router();
hypothesisRouter.use(requireDatabase, requireAuth);
hypothesisRouter.patch(
  '/:id',
  validate(hypothesisParamsSchema, 'params'),
  validate(updateHypothesisSchema),
  updateHypothesis,
);
hypothesisRouter.delete('/:id', validate(hypothesisParamsSchema, 'params'), deleteHypothesis);

export { hypothesisRouter, sessionHypothesisRouter };
