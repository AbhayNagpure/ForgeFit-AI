import { prisma } from '../lib/prisma';

export async function buildAgentContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workouts: { orderBy: { date: 'desc' }, take: 5, include: { exercises: true } },
      weightLogs: { orderBy: { date: 'desc' }, take: 5 },
      bodyMetrics: { orderBy: { date: 'desc' }, take: 3 },
      personalRecords: { orderBy: { date: 'desc' }, take: 5 },
      memories: { orderBy: { updatedAt: 'desc' }, take: 20 },
    },
  });

  if (!user) return 'No athlete profile was found.';

  const safeProfile = {
    name: user.name,
    goal: user.goal,
    weightKg: user.weight,
    heightCm: user.height,
    age: user.age,
    gender: user.gender,
    calorieTarget: user.dailyCalories,
    proteinTargetGrams: user.dailyProtein,
    experienceLevel: user.experienceLevel,
    equipment: user.equipment,
    workoutDaysPerWeek: user.workoutDays,
  };

  return [
    `ATHLETE PROFILE\n${JSON.stringify(safeProfile)}`,
    `STABLE MEMORIES\n${JSON.stringify(user.memories.map(({ key, value, category }) => ({ key, value, category })))}`,
    `RECENT WEIGHTS\n${JSON.stringify(user.weightLogs.map(({ weight, date }) => ({ weightKg: weight, date })))}`,
    `RECENT WORKOUTS\n${JSON.stringify(user.workouts.map(({ id, name, type, duration, date, exercises }) => ({ id, name, type, duration, date, exercises })))}`,
    `RECENT BODY METRICS\n${JSON.stringify(user.bodyMetrics)}`,
    `RECENT PERSONAL RECORDS\n${JSON.stringify(user.personalRecords)}`,
  ].join('\n\n');
}
