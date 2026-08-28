import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addBodyMetric = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { bodyFat, chest, arms, waist, thighs } = req.body;

    const metric = await prisma.bodyMetric.create({
      data: {
        userId,
        bodyFat: bodyFat ? Number(bodyFat) : null,
        chest: chest ? Number(chest) : null,
        arms: arms ? Number(arms) : null,
        waist: waist ? Number(waist) : null,
        thighs: thighs ? Number(thighs) : null,
      },
    });

    res.status(201).json(metric);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding body metric' });
  }
};

export const getBodyMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

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
