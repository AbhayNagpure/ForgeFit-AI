import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  type: z.string().min(1, "Workout type is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
});

export class WorkoutController {
  
  /**
   * Create a new workout log
   * POST /api/workouts
   */
  static async createWorkout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const parsedData = workoutSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.issues[0].message });
        return;
      }

      const { name, type, duration } = parsedData.data;

      const workout = await prisma.workout.create({
        data: {
          userId,
          name,
          type,
          duration,
        }
      });

      res.status(201).json(workout);
    } catch (error) {
      console.error("Create workout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get all workouts for the logged-in user
   * GET /api/workouts
   */
  static async getWorkouts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const workouts = await prisma.workout.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      res.status(200).json(workouts);
    } catch (error) {
      console.error("Get workouts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
