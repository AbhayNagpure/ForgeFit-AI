import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { GeminiService } from '../services/gemini.service';

export class AIController {
  /**
   * Handles POST /api/chat requests
   */
  static async handleChat(req: AuthRequest, res: Response) {
    try {
      const { message, history } = req.body;
      const userId = req.user?.userId;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      let userContext = '';
      if (userId) {
        const user = await prisma.user.findUnique({ 
          where: { id: userId },
          include: { 
            workouts: { orderBy: { date: 'desc' }, take: 5 },
            weightLogs: { orderBy: { date: 'desc' }, take: 1 }
          }
        });
        
        if (user) {
          const currentWeight = user.weightLogs.length > 0 ? user.weightLogs[0].weight : 'Unknown';
          userContext = `
User Info:
- Name: ${user.name || 'Unknown'}
- Goal: ${user.goal || 'General Fitness'}
- Current Weight: ${currentWeight}
- Recent Workouts: ${JSON.stringify(user.workouts.map((w: any) => ({ name: w.name, type: w.type, duration: w.duration, date: w.date })))}
`;
        }
      }

      // Delegate the actual AI processing to the service layer
      const response = await GeminiService.generateCoachResponse(message, history || [], userContext, userId);


      res.json(response);
    } catch (error) {
      console.error('Gemini API Error in Controller:', error);
      res.status(500).json({ error: 'Failed to generate AI response.' });
    }
  }
}
