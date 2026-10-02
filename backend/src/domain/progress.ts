type DatedWorkout = { date: Date; duration: number };
type WeightEntry = { date: Date; weight: number };

const dayKey = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.toISOString().slice(0, 10);
};

export function calculateWorkoutStreak(workouts: DatedWorkout[], now = new Date()) {
  const workoutDays = new Set(workouts.map((workout) => dayKey(workout.date)));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  if (!workoutDays.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (workoutDays.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function calculateWeightTrend(entries: WeightEntry[]) {
  if (entries.length === 0) return { current: null, change: null };
  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  const current = sorted[sorted.length - 1].weight;
  return { current, change: Number((current - sorted[0].weight).toFixed(2)) };
}

export function groupWorkoutMinutesByWeek(workouts: DatedWorkout[], weeks = 8, now = new Date()) {
  const startOfCurrentWeek = new Date(now);
  const day = (startOfCurrentWeek.getDay() + 6) % 7;
  startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - day);
  startOfCurrentWeek.setHours(0, 0, 0, 0);

  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = new Date(startOfCurrentWeek);
    weekStart.setDate(weekStart.getDate() - (weeks - 1 - index) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const minutes = workouts
      .filter((workout) => workout.date >= weekStart && workout.date < weekEnd)
      .reduce((sum, workout) => sum + workout.duration, 0);
    return {
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes,
    };
  });
}
