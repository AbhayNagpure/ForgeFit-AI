import { searchKnowledge } from '../agent/knowledge';

const cases = [
  { query: 'How should I add weight or reps over time?', expected: 'progressive-overload' },
  { query: 'What does two reps in reserve mean?', expected: 'rpe-rir' },
  { query: 'I have sharp pain during squats', expected: 'pain-safety' },
  { query: 'Does bad sleep affect my workout?', expected: 'sleep-recovery' },
  { query: 'How much protein supports muscle?', expected: 'protein' },
  { query: 'My scale weight changes every morning', expected: 'weight-trend' },
];

let passed = 0;
for (const evaluation of cases) {
  const topResult = searchKnowledge(evaluation.query, 1)[0]?.id;
  const success = topResult === evaluation.expected;
  if (success) passed += 1;
  console.log(`${success ? 'PASS' : 'FAIL'} | ${evaluation.query} | expected=${evaluation.expected} actual=${topResult ?? 'none'}`);
}

const score = passed / cases.length;
console.log(`\nRetrieval top-1 accuracy: ${(score * 100).toFixed(1)}% (${passed}/${cases.length})`);
if (score < 0.8) process.exitCode = 1;
