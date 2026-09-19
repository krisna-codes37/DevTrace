import { Router } from 'express';

import {
  createSession,
  deleteSession,
  getSession,
  listSessions,
  updateSession,
} from '../controllers/session.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createSessionSchema,
  listSessionsQuerySchema,
  sessionIdSchema,
  updateSessionSchema,
} from '../validators/session.validator.js';

const sessionRouter = Router();

sessionRouter.use(requireAuth);
sessionRouter.get('/', validate(listSessionsQuerySchema, 'query'), listSessions);
sessionRouter.post('/', validate(createSessionSchema), createSession);
sessionRouter.get('/:id', validate(sessionIdSchema, 'params'), getSession);
sessionRouter.patch(
  '/:id',
  validate(sessionIdSchema, 'params'),
  validate(updateSessionSchema),
  updateSession,
);
sessionRouter.delete('/:id', validate(sessionIdSchema, 'params'), deleteSession);

export default sessionRouter;
