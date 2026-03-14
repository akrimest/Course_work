export type AnswerKey = 'A' | 'B' | 'C';

export interface Question {
  id: string;
  text: string;
  answers: [string, string, string];
  correct: AnswerKey;
  difficulty: 1 | 2 | 3;
  category: string;
}
