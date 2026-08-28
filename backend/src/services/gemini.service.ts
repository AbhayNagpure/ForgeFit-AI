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
          description: 'Adds a new workout log to the user database. Call this when the user asks you to log a workout.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Workout name (e.g., Leg Day)' },
              type: { type: Type.STRING, description: 'Workout category (e.g., Strength, Cardio)' },
              duration: { type: Type.INTEGER, description: 'Duration in minutes' }
            },
            required: ['name', 'type', 'duration']
          }
        },
        {
          name: 'addPersonalRecord',
          description: 'Logs a new personal record (PR) for a specific exercise.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              exerciseName: { type: Type.STRING, description: 'Name of the exercise (e.g., Bench Press)' },
              weight: { type: Type.NUMBER, description: 'Weight lifted (in lbs or kg depending on user preference)' },
              reps: { type: Type.INTEGER, description: 'Number of reps performed' }
            },
            required: ['exerciseName', 'weight']
          }
        },
        {
          name: 'getPersonalRecords',
          description: 'Retrieves the user\'s personal records.',
          parameters: {
            type: Type.OBJECT,
            properties: {},
          }
        },
        {
          name: 'logBodyMetrics',
          description: 'Logs body metrics such as body fat, chest size, waist size, etc.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              bodyFat: { type: Type.NUMBER, description: 'Body fat percentage' },
              chest: { type: Type.NUMBER, description: 'Chest measurement in inches or cm' },
              arms: { type: Type.NUMBER, description: 'Arm measurement' },
              waist: { type: Type.NUMBER, description: 'Waist measurement' },
              thighs: { type: Type.NUMBER, description: 'Thigh measurement' }
            }
          }
        }
      ]
    }];

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
      history: contents
    });

    let response = await chat.sendMessage({ message });
    let actionsTaken = [];

    if (response.functionCalls && response.functionCalls.length > 0 && userId) {
      const toolCall = response.functionCalls[0];
      const args = toolCall.args as any;
      let functionResponseResult = '';
      
      try {
        if (toolCall.name === 'addWorkout') {
          const workout = await prisma.workout.create({
            data: { userId, name: args.name, type: args.type, duration: args.duration }
          });
          actionsTaken.push({ type: 'WORKOUT_ADDED', data: workout });
          functionResponseResult = `Workout successfully logged in the database. ID: ${workout.id}`;
        } 
        else if (toolCall.name === 'addPersonalRecord') {
          const pr = await prisma.personalRecord.create({
            data: { userId, exerciseName: args.exerciseName, weight: args.weight, reps: args.reps || null }
          });
          actionsTaken.push({ type: 'PR_ADDED', data: pr });
          functionResponseResult = `Personal record for ${args.exerciseName} logged successfully.`;
        }
        else if (toolCall.name === 'getPersonalRecords') {
          const prs = await prisma.personalRecord.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
          });
          functionResponseResult = `User PRs: ${JSON.stringify(prs)}`;
        }
        else if (toolCall.name === 'logBodyMetrics') {
          const metric = await prisma.bodyMetric.create({
            data: { 
              userId, 
              bodyFat: args.bodyFat || null, 
              chest: args.chest || null, 
              arms: args.arms || null, 
              waist: args.waist || null, 
              thighs: args.thighs || null 
            }
          });
          actionsTaken.push({ type: 'METRICS_LOGGED', data: metric });
          functionResponseResult = `Body metrics logged successfully.`;
        }

        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: toolCall.name,
              response: { result: functionResponseResult }
            }
          }]
        });
      } catch (error: any) {
        console.error("Error executing tool:", error);
        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: toolCall.name,
              response: { result: `Error executing tool: ${error.message}` }
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
