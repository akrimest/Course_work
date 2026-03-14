import { Question } from './types';

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Which planet is known as the Red Planet?',
    answers: ['Mars', 'Venus', 'Jupiter'],
    correct: 'A',
    difficulty: 1,
    category: 'space',
  },
  {
    id: 'q2',
    text: 'What is the capital of France?',
    answers: ['Berlin', 'Paris', 'Rome'],
    correct: 'B',
    difficulty: 1,
    category: 'geography',
  },
  {
    id: 'q3',
    text: 'Which data structure uses FIFO order?',
    answers: ['Stack', 'Queue', 'Tree'],
    correct: 'B',
    difficulty: 1,
    category: 'cs',
  },
];

export function getQuestionBank(): Question[] {
  return QUESTIONS.slice();
}

export function generateSequence(seed: number, count: number): Question[] {
  const bank = getQuestionBank();
  const rng = mulberry32(seed);
  const shuffled = bank.slice();

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
