import express from 'express';
import { addBodyMetric, getBodyMetrics } from '../controllers/bodyMetric.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, addBodyMetric);
router.get('/', protect, getBodyMetrics);

export default router;
