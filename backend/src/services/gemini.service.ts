import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();

const ai = new GoogleGenAI({});

export class GeminiService {
  static async generateCoachResponse(
    message: string, 
    history: any[], 
    userContext: string,
    userId?: string
  ): Promise<{ reply: string, actionsTaken: any[] }> {
    if (!message) {
      throw new Error("Message cannot be empty.");
    }

    const systemInstruction = `You are ForgeFit AI, a highly professional, data-driven personal fitness coach. Keep answers concise, factual, and focused on fitness/health.
You have access to the user's data and can perform actions on their behalf using tools.

${userContext}`;

    const tools = [{
      functionDeclarations: [
        {
          name: 'addWorkout',
          description: 'Adds a new workout log to the user database. Call this when the user asks you to log a workout, add a workout plan, or mentions they completed a workout.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The name of the workout, e.g., "Leg Day", "Morning Run"'
              },
              type: {
                type: Type.STRING,
                description: 'The category of the workout, e.g., "Strength", "Cardio", "Flexibility"'
              },
              duration: {
                type: Type.INTEGER,
                description: 'Duration of the workout in minutes'
              }
            },
            required: ['name', 'type', 'duration']
          }
        }
      ]
    }];

    // Map history to Google Gen AI format
    const contents = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        tools,
        temperature: 0.7
      },
      history: contents // This passes the past messages
    });

    // Send the current message
    let response = await chat.sendMessage({ message });
    let actionsTaken = [];

    // Handle tool calls if any
    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolCall = response.functionCalls[0];
      
      if (toolCall.name === 'addWorkout' && userId) {
        const args = toolCall.args as any;
        
        // Execute the tool (Write to Database)
        const workout = await prisma.workout.create({
          data: {
            userId,
            name: args.name,
            type: args.type,
            duration: args.duration
          }
        });

        actionsTaken.push({
          type: 'WORKOUT_ADDED',
          data: workout
        });

                // Send tool response back to Gemini to get final text
        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: toolCall.name,
              response: { result: 'Workout successfully logged in the database.', workoutId: workout.id }
            }
          }]
        });
      }
    }

    return {
      reply: response.text || "I've processed your request.",
      actionsTaken
    };
  }
}
