export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const questions: Question[] = [
  {
    id: 1,
    category: 'General Knowledge',
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    answer: 'Paris',
    difficulty: 'easy',
  },
  // Add more questions as needed
];
