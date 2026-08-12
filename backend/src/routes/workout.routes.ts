import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Route: GET /api/workouts
router.get('/', requireAuth, WorkoutController.getWorkouts);

// Route: POST /api/workouts
router.post('/', requireAuth, WorkoutController.createWorkout);

export default router;
