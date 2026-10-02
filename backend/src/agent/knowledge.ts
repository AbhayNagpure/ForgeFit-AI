export type KnowledgeDocument = {
  id: string;
  title: string;
  tags: string[];
  content: string;
};

export const FITNESS_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: 'progressive-overload',
    title: 'Progressive overload',
    tags: ['strength', 'hypertrophy', 'progression', 'load', 'reps'],
    content: 'Progress when technique remains stable and the target rep range is achieved. Increase only one variable at a time: repetitions, load, sets, range of motion, or execution quality. Small load increases are usually more sustainable than large jumps.',
  },
  {
    id: 'rpe-rir',
    title: 'Using RPE and repetitions in reserve',
    tags: ['rpe', 'rir', 'fatigue', 'intensity'],
    content: 'RIR estimates how many technically sound repetitions remained at the end of a set. About 3 RIR corresponds to RPE 7, 2 RIR to RPE 8, 1 RIR to RPE 9, and 0 RIR to RPE 10. Most routine working sets should avoid repeated uncontrolled failure.',
  },
  {
    id: 'training-volume',
    title: 'Training volume and recovery',
    tags: ['volume', 'sets', 'recovery', 'deload', 'soreness'],
    content: 'Useful volume is the amount a person can recover from while performance remains stable or improves. Sudden increases in hard sets raise fatigue. Reduce volume or load when performance falls repeatedly, soreness persists, or joint discomfort increases.',
  },
  {
    id: 'protein',
    title: 'Protein target fundamentals',
    tags: ['nutrition', 'protein', 'muscle', 'diet'],
    content: 'For generally healthy resistance-training adults, a daily protein range around 1.6 to 2.2 grams per kilogram of body weight is a practical starting range. Individual medical needs can differ and should be discussed with a qualified clinician.',
  },
  {
    id: 'weight-trend',
    title: 'Interpreting body-weight changes',
    tags: ['weight', 'trend', 'fat loss', 'gain', 'scale'],
    content: 'Daily scale weight varies with hydration, sodium, carbohydrate intake, digestion, and menstrual cycle. Use consistent measurement conditions and compare weekly averages instead of treating a single measurement as a trend.',
  },
  {
    id: 'pain-safety',
    title: 'Pain and exercise safety boundary',
    tags: ['pain', 'injury', 'safety', 'medical'],
    content: 'Sharp, escalating, radiating, or unexplained pain is not a normal training target. Stop the provoking movement and seek assessment from a qualified professional when symptoms are severe, persistent, neurological, or associated with trauma.',
  },
  {
    id: 'sleep-recovery',
    title: 'Sleep and training readiness',
    tags: ['sleep', 'recovery', 'readiness', 'fatigue'],
    content: 'A single poor night does not always require skipping training, but repeated sleep loss can reduce performance and recovery. On low-readiness days, keep technique work and reduce load, volume, or proximity to failure.',
  },
];

function tokenize(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

export function searchKnowledge(query: string, limit = 3) {
  const queryTokens = tokenize(query);

  return FITNESS_KNOWLEDGE
    .map((document) => {
      const titleTokens = tokenize(`${document.title} ${document.tags.join(' ')}`);
      const contentTokens = tokenize(document.content);
      let score = 0;
      queryTokens.forEach((token) => {
        if (titleTokens.has(token)) score += 3;
        if (contentTokens.has(token)) score += 1;
      });
      return { ...document, score };
    })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(limit, 5)));
}
