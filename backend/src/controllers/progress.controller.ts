import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { calculateWeightTrend, calculateWorkoutStreak, groupWorkoutMinutesByWeek } from '../domain/progress';

export async function getProgressSummary(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const [workouts, weights, records, metrics] = await Promise.all([
    prisma.workout.findMany({ where: { userId }, orderBy: { date: 'asc' } }),
    prisma.weightLog.findMany({ where: { userId }, orderBy: { date: 'asc' }, take: 180 }),
    prisma.personalRecord.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 8 }),
    prisma.bodyMetric.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 30 }),
  ]);

  res.json({
    currentStreak: calculateWorkoutStreak(workouts),
    totalWorkouts: workouts.length,
    totalMinutes: workouts.reduce((sum, workout) => sum + workout.duration, 0),
    weightTrend: calculateWeightTrend(weights),
    weightHistory: weights.map(({ date, weight }) => ({ date, weight })),
    weeklyMinutes: groupWorkoutMinutesByWeek(workouts),
    personalRecords: records,
    bodyMetrics: metrics,
  });
}
