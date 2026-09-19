import { Router } from 'express';

import {
  createExperiment,
  deleteExperiment,
  listExperiments,
  updateExperiment,
} from '../controllers/experiment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase } from '../middleware/database.js';
import { validate } from '../middleware/validate.js';
import {
  createExperimentSchema,
  experimentParamsSchema,
  experimentParentParamsSchema,
  updateExperimentSchema,
} from '../validators/experiment.validator.js';

const hypothesisExperimentRouter = Router({ mergeParams: true });
hypothesisExperimentRouter.use(requireDatabase, requireAuth);
hypothesisExperimentRouter.get(
  '/',
  validate(experimentParentParamsSchema, 'params'),
  listExperiments,
);
hypothesisExperimentRouter.post(
  '/',
  validate(experimentParentParamsSchema, 'params'),
  validate(createExperimentSchema),
  createExperiment,
);

const experimentRouter = Router();
experimentRouter.use(requireDatabase, requireAuth);
experimentRouter.patch(
  '/:id',
  validate(experimentParamsSchema, 'params'),
  validate(updateExperimentSchema),
  updateExperiment,
);
experimentRouter.delete('/:id', validate(experimentParamsSchema, 'params'), deleteExperiment);

export { experimentRouter, hypothesisExperimentRouter };
