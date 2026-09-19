import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { getCurrentUser, login, logout, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase } from '../middleware/database.js';
import { validate } from '../middleware/validate.js';
import { sendError } from '../utils/apiResponse.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_request, response) =>
      sendError(
        response,
        429,
        'RATE_LIMITED',
        'Too many authentication attempts. Try again later.',
      ),
  }),
);
authRouter.use(requireDatabase);

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.get('/me', requireAuth, getCurrentUser);
authRouter.post('/logout', requireAuth, logout);

export default authRouter;
