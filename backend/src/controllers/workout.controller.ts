import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

const workoutSchema = z.object({
  name: z.string(),
  type: z.string(),
  duration: z.number().positive(),
  date: z.string().optional(),
});

export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { name, type, duration, date } = workoutSchema.parse(req.body);
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        type,
        duration,
        ...(date && { date: new Date(date) }),
      },
    });
    res.status(201).json({ workout });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.status(200).json({ workouts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
