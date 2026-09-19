import { Router } from 'express';

import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase } from '../middleware/database.js';

const dashboardRouter = Router();

dashboardRouter.get('/stats', requireDatabase, requireAuth, getDashboardStats);

export default dashboardRouter;
