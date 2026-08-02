import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini (Automatically uses GEMINI_API_KEY from .env)
const ai = new GoogleGenAI({});

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('ForgeFit API is running!');
});

// AI Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are ForgeFit AI, a highly professional, data-driven personal fitness coach. Keep answers concise, factual, and focused on fitness/health. User message: ${message}` }]
        }
      ]
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});