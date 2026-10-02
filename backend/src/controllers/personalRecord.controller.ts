import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth.middleware';

const personalRecordSchema = z.object({
  exerciseName: z.string().trim().min(1).max(120),
  weight: z.coerce.number().nonnegative().max(1000),
  reps: z.coerce.number().int().positive().max(1000).optional(),
});

export const addPersonalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { exerciseName, weight, reps } = personalRecordSchema.parse(req.body);

    const pr = await prisma.personalRecord.create({
      data: {
        userId,
        exerciseName,
        weight,
        reps: reps ?? null,
      },
    });

    res.status(201).json(pr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding personal record' });
  }
};

export const getPersonalRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const prs = await prisma.personalRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json(prs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching personal records' });
  }
};

export const deletePersonalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const pr = await prisma.personalRecord.findUnique({ where: { id: id as string } });

    if (!pr || pr.userId !== userId) {
      res.status(404).json({ message: 'Personal record not found or unauthorized' });
      return;
    }

    await prisma.personalRecord.delete({ where: { id: id as string } });

    res.status(200).json({ message: 'Personal record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting personal record' });
  }
};
