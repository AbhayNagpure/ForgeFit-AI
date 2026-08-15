import { Router } from 'express';
import { createWorkout, getWorkouts } from '../controllers/workout.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createWorkout);
router.get('/', requireAuth, getWorkouts);

export default router;
