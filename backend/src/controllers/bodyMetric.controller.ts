import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth.middleware';

const bodyMetricSchema = z.object({
  bodyFat: z.coerce.number().min(1).max(70).optional(),
  chest: z.coerce.number().positive().max(300).optional(),
  arms: z.coerce.number().positive().max(150).optional(),
  waist: z.coerce.number().positive().max(300).optional(),
  thighs: z.coerce.number().positive().max(200).optional(),
  sleep: z.coerce.number().min(0).max(24).optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), 'At least one metric is required');

export const addBodyMetric = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const values = bodyMetricSchema.parse(req.body);

    const metric = await prisma.bodyMetric.create({
      data: {
        userId,
        bodyFat: values.bodyFat,
        chest: values.chest,
        arms: values.arms,
        waist: values.waist,
        thighs: values.thighs,
        sleep: values.sleep,
      },
    });

    res.status(201).json(metric);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding body metric' });
  }
};

export const getBodyMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const metrics = await prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching body metrics' });
  }
};
