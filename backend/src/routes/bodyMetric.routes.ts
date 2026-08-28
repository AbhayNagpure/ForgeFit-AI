import express from 'express';
import { addBodyMetric, getBodyMetrics } from '../controllers/bodyMetric.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', requireAuth, addBodyMetric);
router.get('/', requireAuth, getBodyMetrics);

export default router;
