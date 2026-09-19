import { Router } from 'express';

import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.js';

const dashboardRouter = Router();

dashboardRouter.get('/stats', requireAuth, getDashboardStats);

export default dashboardRouter;
