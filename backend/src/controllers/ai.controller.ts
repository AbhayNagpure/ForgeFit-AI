import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';

export class AIController {
  /**
   * Handles POST /api/chat requests
   */
  static async handleChat(req: Request, res: Response) {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Delegate the actual AI processing to the service layer
      const reply = await GeminiService.generateCoachResponse(message);

      res.json({ reply });
    } catch (error) {
      console.error('Gemini API Error in Controller:', error);
      res.status(500).json({ error: 'Failed to generate AI response.' });
    }
  }
}
