import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini client once for the entire application
const ai = new GoogleGenAI({});

export class GeminiService {
  /**
   * Generates a response from the AI coach based on user input.
   */
  static async generateCoachResponse(message: string): Promise<string> {
    if (!message) {
      throw new Error("Message cannot be empty.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ 
            text: `You are ForgeFit AI, a highly professional, data-driven personal fitness coach. Keep answers concise, factual, and focused on fitness/health. User message: ${message}` 
          }]
        }
      ]
    });

    return response.text || "No response generated.";
  }
}
