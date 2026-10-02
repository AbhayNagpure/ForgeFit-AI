import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../lib/errors';
import { getProgressSummary } from '../controllers/progress.controller';

const router = Router();
router.get('/summary', requireAuth, asyncHandler(getProgressSummary));
export default router;
