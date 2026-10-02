import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWeightTrend, calculateWorkoutStreak, groupWorkoutMinutesByWeek } from './progress';

test('calculates a streak ending today', () => {
  const now = new Date('2026-10-02T12:00:00Z');
  const workouts = ['2026-10-02', '2026-10-01', '2026-09-30'].map((date) => ({ date: new Date(`${date}T12:00:00Z`), duration: 45 }));
  assert.equal(calculateWorkoutStreak(workouts, now), 3);
});

test('allows an active streak to end yesterday', () => {
  const now = new Date('2026-10-02T12:00:00Z');
  const workouts = ['2026-10-01', '2026-09-30'].map((date) => ({ date: new Date(`${date}T12:00:00Z`), duration: 45 }));
  assert.equal(calculateWorkoutStreak(workouts, now), 2);
});

test('calculates weight change chronologically', () => {
  const result = calculateWeightTrend([
    { date: new Date('2026-10-02'), weight: 78.2 },
    { date: new Date('2026-09-02'), weight: 80 },
  ]);
  assert.deepEqual(result, { current: 78.2, change: -1.8 });
});

test('groups workout minutes into calendar weeks', () => {
  const weeks = groupWorkoutMinutesByWeek([
    { date: new Date('2026-09-29T12:00:00Z'), duration: 40 },
    { date: new Date('2026-10-01T12:00:00Z'), duration: 50 },
  ], 2, new Date('2026-10-02T12:00:00Z'));
  assert.equal(weeks[1].minutes, 90);
});
