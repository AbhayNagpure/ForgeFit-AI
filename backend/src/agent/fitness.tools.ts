import { Type } from '@google/genai';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';
import { calculateWeightTrend, calculateWorkoutStreak, groupWorkoutMinutesByWeek } from '../domain/progress';
import { searchKnowledge } from './knowledge';

export type ToolContext = {
  userId: string;
  runId: string;
  conversationId: string;
};

export type ToolResult = {
  message: string;
  data?: unknown;
  event?: string;
};

type ToolDefinition = {
  name: string;
  description: string;
  schema: z.ZodTypeAny;
  parameters: Record<string, unknown>;
  requiresApproval?: boolean;
  approvalDescription?: (args: Record<string, unknown>) => string;
  execute: (args: Record<string, unknown>, context: ToolContext) => Promise<ToolResult>;
};

const numberProperty = (description: string) => ({ type: Type.NUMBER, description });
const integerProperty = (description: string) => ({ type: Type.INTEGER, description });
const stringProperty = (description: string) => ({ type: Type.STRING, description });

const toolDefinitions: ToolDefinition[] = [
  {
    name: 'getRecentWorkouts',
    description: 'Read the athlete’s five most recent workout sessions and their exercises.',
    schema: z.object({}),
    parameters: { type: Type.OBJECT, properties: {} },
    execute: async (_args, { userId }) => {
      const workouts = await prisma.workout.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5,
        include: { exercises: { include: { completedSets: true }, orderBy: { order: 'asc' } } },
      });
      return { message: `Found ${workouts.length} recent workouts.`, data: workouts };
    },
  },
  {
    name: 'getProgressSummary',
    description: 'Calculate real workout consistency, recent weight trend, training minutes, and weekly activity.',
    schema: z.object({}),
    parameters: { type: Type.OBJECT, properties: {} },
    execute: async (_args, { userId }) => {
      const [workouts, weightLogs, records] = await Promise.all([
        prisma.workout.findMany({ where: { userId }, orderBy: { date: 'asc' } }),
        prisma.weightLog.findMany({ where: { userId }, orderBy: { date: 'asc' }, take: 90 }),
        prisma.personalRecord.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 5 }),
      ]);
      const data = {
        workoutCount: workouts.length,
        totalMinutes: workouts.reduce((sum, workout) => sum + workout.duration, 0),
        currentStreak: calculateWorkoutStreak(workouts),
        weightTrend: calculateWeightTrend(weightLogs),
        weeklyMinutes: groupWorkoutMinutesByWeek(workouts),
        recentPersonalRecords: records,
      };
      return { message: 'Calculated progress from stored athlete data.', data };
    },
  },
  {
    name: 'addWorkout',
    description: 'Log a completed workout session. Use only after the athlete clearly states that the session happened.',
    schema: z.object({
      name: z.string().trim().min(1).max(120),
      type: z.string().trim().min(1).max(60),
      duration: z.number().int().positive().max(600),
    }),
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: stringProperty('Workout name, such as Upper Body A'),
        type: stringProperty('Workout category, such as Strength or Cardio'),
        duration: integerProperty('Completed duration in minutes'),
      },
      required: ['name', 'type', 'duration'],
    },
    execute: async (args, { userId }) => {
      const workout = await prisma.workout.create({
        data: { userId, name: args.name as string, type: args.type as string, duration: args.duration as number },
      });
      return { message: `Logged ${workout.name}.`, data: workout, event: 'WORKOUT_ADDED' };
    },
  },
  {
    name: 'addExerciseToWorkout',
    description: 'Add one performed exercise to an existing workout owned by the athlete.',
    schema: z.object({
      workoutId: z.string().min(1),
      name: z.string().trim().min(1).max(120),
      sets: z.number().int().positive().max(30),
      reps: z.number().int().positive().max(1000),
      weight: z.number().nonnegative().max(1000).optional(),
    }),
    parameters: {
      type: Type.OBJECT,
      properties: {
        workoutId: stringProperty('ID returned by addWorkout or getRecentWorkouts'),
        name: stringProperty('Exercise name'),
        sets: integerProperty('Number of completed sets'),
        reps: integerProperty('Repetitions per set when individual set details are unavailable'),
        weight: numberProperty('Load in kilograms'),
      },
      required: ['workoutId', 'name', 'sets', 'reps'],
    },
    execute: async (args, { userId }) => {
      const workout = await prisma.workout.findFirst({ where: { id: args.workoutId as string, userId } });
      if (!workout) throw new AppError(404, 'Workout not found', 'WORKOUT_NOT_FOUND');
      const exercise = await prisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          name: args.name as string,
          sets: args.sets as number,
          reps: args.reps as number,
          weight: (args.weight as number | undefined) ?? null,
        },
      });
      return { message: `Added ${exercise.name} to ${workout.name}.`, data: exercise, event: 'EXERCISE_ADDED' };
    },
  },
  {
    name: 'deleteWorkout',
    description: 'Permanently delete one workout. This always pauses for athlete approval.',
    schema: z.object({ workoutId: z.string().min(1) }),
    parameters: {
      type: Type.OBJECT,
      properties: { workoutId: stringProperty('Workout ID to permanently delete') },
      required: ['workoutId'],
    },
    requiresApproval: true,
    approvalDescription: () => 'Permanently delete this workout and its recorded exercises?',
    execute: async (args, { userId }) => {
      const workout = await prisma.workout.findFirst({ where: { id: args.workoutId as string, userId } });
      if (!workout) throw new AppError(404, 'Workout not found', 'WORKOUT_NOT_FOUND');
      await prisma.workout.delete({ where: { id: workout.id } });
      return { message: `Deleted ${workout.name}.`, data: { id: workout.id }, event: 'WORKOUT_DELETED' };
    },
  },
  {
    name: 'addPersonalRecord',
    description: 'Log a personal record explicitly reported by the athlete.',
    schema: z.object({
      exerciseName: z.string().trim().min(1).max(120),
      weight: z.number().nonnegative().max(1000),
      reps: z.number().int().positive().max(1000).optional(),
    }),
    parameters: {
      type: Type.OBJECT,
      properties: {
        exerciseName: stringProperty('Exercise name'),
        weight: numberProperty('Weight in kilograms'),
        reps: integerProperty('Repetitions performed'),
      },
      required: ['exerciseName', 'weight'],
    },
    execute: async (args, { userId }) => {
      const record = await prisma.personalRecord.create({
        data: {
          userId,
          exerciseName: args.exerciseName as string,
          weight: args.weight as number,
          reps: (args.reps as number | undefined) ?? null,
        },
      });
      return { message: `Logged a ${record.exerciseName} personal record.`, data: record, event: 'PR_ADDED' };
    },
  },
  {
    name: 'logBodyMetrics',
    description: 'Log body measurements or sleep explicitly supplied by the athlete.',
    schema: z.object({
      bodyFat: z.number().min(1).max(70).optional(),
      chest: z.number().positive().max(300).optional(),
      arms: z.number().positive().max(150).optional(),
      waist: z.number().positive().max(300).optional(),
      thighs: z.number().positive().max(200).optional(),
      sleep: z.number().min(0).max(24).optional(),
    }).refine((value) => Object.values(value).some((item) => item !== undefined), 'At least one metric is required'),
    parameters: {
      type: Type.OBJECT,
      properties: {
        bodyFat: numberProperty('Body fat percentage'),
        chest: numberProperty('Chest measurement in centimetres'),
        arms: numberProperty('Arm measurement in centimetres'),
        waist: numberProperty('Waist measurement in centimetres'),
        thighs: numberProperty('Thigh measurement in centimetres'),
        sleep: numberProperty('Sleep duration in hours'),
      },
    },
    execute: async (args, { userId }) => {
      const metric = await prisma.bodyMetric.create({ data: { userId, ...args } });
      return { message: 'Logged the supplied body metrics.', data: metric, event: 'METRICS_LOGGED' };
    },
  },
  {
    name: 'logNutrition',
    description: 'Log food. When values are estimated, say so and provide an estimation confidence from 0 to 1.',
    schema: z.object({
      foodName: z.string().trim().min(1).max(200),
      calories: z.number().int().nonnegative().max(10000),
      protein: z.number().int().nonnegative().max(1000),
      carbs: z.number().int().nonnegative().max(2000).optional(),
      fat: z.number().int().nonnegative().max(1000).optional(),
      estimated: z.boolean().default(true),
      confidence: z.number().min(0).max(1).default(0.6),
    }),
    parameters: {
      type: Type.OBJECT,
      properties: {
        foodName: stringProperty('Food and portion description'),
        calories: integerProperty('Calories'),
        protein: integerProperty('Protein grams'),
        carbs: integerProperty('Carbohydrate grams'),
        fat: integerProperty('Fat grams'),
        estimated: { type: Type.BOOLEAN, description: 'Whether values were estimated rather than read from a label' },
        confidence: numberProperty('Estimation confidence from 0 to 1'),
      },
      required: ['foodName', 'calories', 'protein', 'estimated', 'confidence'],
    },
    execute: async (args, { userId }) => {
      const entry = await prisma.nutritionLog.create({
        data: {
          userId,
          foodName: args.foodName as string,
          calories: args.calories as number,
          protein: args.protein as number,
          carbs: (args.carbs as number | undefined) ?? null,
          fat: (args.fat as number | undefined) ?? null,
          source: args.estimated ? 'ai_estimate' : 'label',
          confidence: args.confidence as number,
        },
      });
      return { message: `Logged ${entry.foodName}.`, data: entry, event: 'NUTRITION_LOGGED' };
    },
  },
  {
    name: 'logWeight',
    description: 'Log the athlete’s body weight in kilograms and make it the current profile weight.',
    schema: z.object({ weight: z.number().positive().max(500) }),
    parameters: {
      type: Type.OBJECT,
      properties: { weight: numberProperty('Body weight in kilograms') },
      required: ['weight'],
    },
    execute: async (args, { userId }) => {
      const weight = args.weight as number;
      const entry = await prisma.weightLog.create({ data: { userId, weight } });
      await prisma.user.update({ where: { id: userId }, data: { weight } });
      return { message: `Logged body weight at ${weight} kg.`, data: entry, event: 'WEIGHT_LOGGED' };
    },
  },
  {
    name: 'updateUserProfile',
    description: 'Update athlete profile fields that the athlete explicitly provided or approved. Never infer age, sex, height, injuries, or equipment.',
    schema: z.object({
      goal: z.string().trim().min(1).max(300).optional(),
      height: z.number().positive().max(300).optional(),
      age: z.number().int().min(13).max(120).optional(),
      gender: z.string().trim().min(1).max(80).optional(),
      dailyCalories: z.number().int().min(800).max(10000).optional(),
      dailyProtein: z.number().int().min(10).max(1000).optional(),
      experienceLevel: z.string().trim().min(1).max(80).optional(),
      equipment: z.string().trim().min(1).max(300).optional(),
      workoutDays: z.number().int().min(1).max(7).optional(),
    }).refine((value) => Object.values(value).some((item) => item !== undefined), 'At least one profile field is required'),
    parameters: {
      type: Type.OBJECT,
      properties: {
        goal: stringProperty('Primary fitness goal'),
        height: numberProperty('Height in centimetres'),
        age: integerProperty('Age'),
        gender: stringProperty('User-provided gender or sex descriptor'),
        dailyCalories: integerProperty('Daily calorie target'),
        dailyProtein: integerProperty('Daily protein target in grams'),
        experienceLevel: stringProperty('Training experience level'),
        equipment: stringProperty('Available equipment'),
        workoutDays: integerProperty('Available training days per week'),
      },
    },
    execute: async (args, { userId }) => {
      const user = await prisma.user.update({ where: { id: userId }, data: args });
      return {
        message: 'Updated the athlete profile.',
        data: { goal: user.goal, height: user.height, age: user.age, gender: user.gender, dailyCalories: user.dailyCalories, dailyProtein: user.dailyProtein, experienceLevel: user.experienceLevel, equipment: user.equipment, workoutDays: user.workoutDays },
        event: 'PROFILE_UPDATED',
      };
    },
  },
  {
    name: 'rememberPreference',
    description: 'Store a stable athlete preference that will be useful in future conversations. Do not store temporary details, medical diagnoses, secrets, or guesses.',
    schema: z.object({
      key: z.string().regex(/^[a-z0-9_]{2,50}$/),
      value: z.string().trim().min(1).max(500),
      category: z.enum(['preference', 'constraint', 'communication']).default('preference'),
    }),
    parameters: {
      type: Type.OBJECT,
      properties: {
        key: stringProperty('Stable snake_case key, such as preferred_training_time'),
        value: stringProperty('User-stated preference'),
        category: { type: Type.STRING, enum: ['preference', 'constraint', 'communication'] },
      },
      required: ['key', 'value', 'category'],
    },
    execute: async (args, { userId }) => {
      const memory = await prisma.userMemory.upsert({
        where: { userId_key: { userId, key: args.key as string } },
        update: { value: args.value as string, category: args.category as string, source: 'user_statement', confidence: 1 },
        create: { userId, key: args.key as string, value: args.value as string, category: args.category as string, source: 'user_statement', confidence: 1 },
      });
      return { message: `Remembered ${memory.key}.`, data: memory, event: 'MEMORY_SAVED' };
    },
  },
  {
    name: 'searchFitnessKnowledge',
    description: 'Search the curated fitness knowledge base when a recommendation needs supporting principles or a safety check.',
    schema: z.object({ query: z.string().trim().min(2).max(300), limit: z.number().int().min(1).max(5).default(3) }),
    parameters: {
      type: Type.OBJECT,
      properties: { query: stringProperty('Focused fitness question or keywords'), limit: integerProperty('Maximum results, from 1 to 5') },
      required: ['query'],
    },
    execute: async (args) => {
      const results = searchKnowledge(args.query as string, (args.limit as number | undefined) ?? 3);
      return { message: `Retrieved ${results.length} relevant knowledge notes.`, data: results };
    },
  },
];

export const fitnessTools = new Map(toolDefinitions.map((tool) => [tool.name, tool]));

export const geminiToolDeclarations = toolDefinitions.map((tool) => ({
  name: tool.name,
  description: tool.description,
  parameters: tool.parameters,
}));

export function getTool(name: string) {
  const tool = fitnessTools.get(name);
  if (!tool) throw new AppError(400, `Unknown tool: ${name}`, 'UNKNOWN_TOOL');
  return tool;
}

export function validateToolArguments(name: string, args: unknown) {
  return getTool(name).schema.parse(args) as Record<string, unknown>;
}
