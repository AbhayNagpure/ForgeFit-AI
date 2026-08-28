import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addPersonalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { exerciseName, weight, reps } = req.body;

    if (!exerciseName || weight === undefined) {
      res.status(400).json({ message: 'Exercise name and weight are required' });
      return;
    }

    const pr = await prisma.personalRecord.create({
      data: {
        userId,
        exerciseName,
        weight: Number(weight),
        reps: reps ? Number(reps) : null,
      },
    });

    res.status(201).json(pr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding personal record' });
  }
};

export const getPersonalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

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

export const deletePersonalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

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
