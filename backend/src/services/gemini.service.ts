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

    const systemInstruction = `You are ForgeFit AI, an elite autonomous personal fitness coach. Keep answers concise, factual, and data-driven.
You have full access to the user's database. If the user asks to log, update, or retrieve ANY data (workouts, exercises, PRs, weight, goals, body metrics), YOU MUST use the provided tools to execute it for them. NEVER tell the user to do it manually if a tool exists.

${userContext}`;

    const tools = [{
      functionDeclarations: [
        {
          name: 'addWorkout',
          description: 'Logs a new generic workout session.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Workout name (e.g., Leg Day)' },
              type: { type: Type.STRING, description: 'Category (e.g., Strength, Cardio)' },
              duration: { type: Type.INTEGER, description: 'Duration in minutes' }
            },
            required: ['name', 'type', 'duration']
          }
        },
        {
          name: 'addExerciseToWorkout',
          description: 'Adds a specific exercise (with sets, reps, weight) to an existing workout. You need the workoutId from addWorkout or getRecentWorkouts.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              workoutId: { type: Type.STRING },
              name: { type: Type.STRING, description: 'Exercise name' },
              sets: { type: Type.INTEGER },
              reps: { type: Type.INTEGER },
              weight: { type: Type.NUMBER, description: 'Weight lifted' }
            },
            required: ['workoutId', 'name', 'sets', 'reps']
          }
        },
        {
          name: 'getRecentWorkouts',
          description: 'Retrieves the users most recent workouts, including the specific exercises performed in them.',
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: 'deleteWorkout',
          description: 'Deletes a workout by ID if the user made a mistake.',
          parameters: { type: Type.OBJECT, properties: { workoutId: { type: Type.STRING } }, required: ['workoutId'] }
        },
        {
          name: 'addPersonalRecord',
          description: 'Logs a new personal record (PR) for a specific exercise.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              exerciseName: { type: Type.STRING },
              weight: { type: Type.NUMBER },
              reps: { type: Type.INTEGER }
            },
            required: ['exerciseName', 'weight']
          }
        },
        {
          name: 'getPersonalRecords',
          description: 'Retrieves all of the users personal records (PRs).',
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: 'logBodyMetrics',
          description: 'Logs advanced body metrics (body fat, chest, arms, waist, thighs).',
          parameters: {
            type: Type.OBJECT,
            properties: {
              bodyFat: { type: Type.NUMBER },
              chest: { type: Type.NUMBER },
              arms: { type: Type.NUMBER },
              waist: { type: Type.NUMBER },
              thighs: { type: Type.NUMBER }
            }
          }
        },
        {
          name: 'logWeight',
          description: 'Logs the users current body weight.',
          parameters: {
            type: Type.OBJECT,
            properties: { weight: { type: Type.NUMBER } },
            required: ['weight']
          }
        },
        {
          name: 'getWeightHistory',
          description: 'Retrieves the users weight logging history to analyze trends.',
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: 'updateUserProfile',
          description: 'Updates the users profile information such as weight, height, goal, age, or gender. Call this if the user says "my weight is now X" or "my new goal is Y".',
          parameters: {
            type: Type.OBJECT,
            properties: { 
              goal: { type: Type.STRING },
              weight: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
              age: { type: Type.INTEGER },
              gender: { type: Type.STRING }
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
        tools: tools as any,
        temperature: 0.7
      },
      history: contents
    });

    let response = await chat.sendMessage({ message });
    let actionsTaken: any[] = [];

    if (response.functionCalls && response.functionCalls.length > 0 && userId) {
      // Handle multiple sequential function calls if needed, but we'll process the first one for simplicity or iterate
      for (const toolCall of response.functionCalls) {
        const args = toolCall.args as any;
        let functionResponseResult = '';
        
        try {
          switch(toolCall.name) {
            case 'addWorkout':
              const workout = await prisma.workout.create({ data: { userId, name: args.name, type: args.type, duration: args.duration } });
              actionsTaken.push({ type: 'WORKOUT_ADDED', data: workout });
              functionResponseResult = `Workout created. ID: ${workout.id}`;
              break;
            case 'addExerciseToWorkout':
              const exercise = await prisma.workoutExercise.create({ data: { workoutId: args.workoutId, name: args.name, sets: args.sets, reps: args.reps, weight: args.weight || null } });
              actionsTaken.push({ type: 'EXERCISE_ADDED', data: exercise });
              functionResponseResult = `Exercise ${args.name} added to workout ${args.workoutId}.`;
              break;
            case 'getRecentWorkouts':
              const recentWorkouts = await prisma.workout.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 5, include: { exercises: true } });
              functionResponseResult = JSON.stringify(recentWorkouts);
              break;
            case 'deleteWorkout':
              await prisma.workout.delete({ where: { id: args.workoutId } });
              actionsTaken.push({ type: 'WORKOUT_DELETED', data: { id: args.workoutId } });
              functionResponseResult = `Workout deleted successfully.`;
              break;
            case 'addPersonalRecord':
              const pr = await prisma.personalRecord.create({ data: { userId, exerciseName: args.exerciseName, weight: args.weight, reps: args.reps || null } });
              actionsTaken.push({ type: 'PR_ADDED', data: pr });
              functionResponseResult = `PR logged successfully.`;
              break;
            case 'getPersonalRecords':
              const prs = await prisma.personalRecord.findMany({ where: { userId }, orderBy: { date: 'desc' } });
              functionResponseResult = JSON.stringify(prs);
              break;
            case 'logBodyMetrics':
              const metric = await prisma.bodyMetric.create({ data: { userId, bodyFat: args.bodyFat, chest: args.chest, arms: args.arms, waist: args.waist, thighs: args.thighs } });
              actionsTaken.push({ type: 'METRICS_LOGGED', data: metric });
              functionResponseResult = `Body metrics logged successfully.`;
              break;
            case 'logWeight':
              const weightLog = await prisma.weightLog.create({ data: { userId, weight: args.weight } });
              actionsTaken.push({ type: 'WEIGHT_LOGGED', data: weightLog });
              functionResponseResult = `Weight of ${args.weight} logged successfully.`;
              break;
            case 'getWeightHistory':
              const weightHistory = await prisma.weightLog.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 10 });
              functionResponseResult = JSON.stringify(weightHistory);
              break;
            case 'updateUserProfile':
              const updateData: any = {};
              if (args.goal) updateData.goal = args.goal;
              if (args.weight) updateData.weight = args.weight;
              if (args.height) updateData.height = args.height;
              if (args.age) updateData.age = args.age;
              if (args.gender) updateData.gender = args.gender;

              await prisma.user.update({ where: { id: userId }, data: updateData });
              
              // Also log the weight to WeightLog if weight was updated
              if (args.weight) {
                await prisma.weightLog.create({ data: { userId, weight: args.weight } });
              }
              
              actionsTaken.push({ type: 'PROFILE_UPDATED', data: updateData });
              functionResponseResult = `User profile updated successfully.`;
              break;
            default:
              functionResponseResult = `Unknown tool: ${toolCall.name}`;
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
    }

    return {
      reply: response.text || "I've processed your request.",
      actionsTaken
    };
  }
}
