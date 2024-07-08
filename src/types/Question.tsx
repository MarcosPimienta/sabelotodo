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

export const algorithms: Question[] = [
  {
    id: 1,
    category: 'Algorithms & Data Structures',
    question: 'What is a binary search tree?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    difficulty: 'easy',
  },
  // Add more questions as needed
];

export const programmingLanguages: Question[] = [
  {
    id: 1,
    category: 'Programming Languages',
    question: 'Which language is used for web development?',
    options: ['JavaScript', 'Python', 'Java', 'C++'],
    answer: 'JavaScript',
    difficulty: 'easy',
  },
  // Add more questions as needed
];

export const webDevelopment: Question[] = [
  {
    id: 1,
    category: 'Web Development',
    question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'HyperText Markdown Language', 'HighText Markup Language', 'None of the above'],
    answer: 'HyperText Markup Language',
    difficulty: 'easy',
  },
  // Add more questions as needed
];

export const dataBases: Question[] = [
  {
    id: 1,
    category: 'Data Bases',
    question: 'What is SQL?',
    options: ['Structured Query Language', 'Simple Query Language', 'Structured Question Language', 'None of the above'],
    answer: 'Structured Query Language',
    difficulty: 'easy',
  },
  // Add more questions as needed
];

export const devOps: Question[] = [
  {
    id: 1,
    category: 'DevOps & Dev Tools',
    question: 'What is Docker used for?',
    options: ['Containerization', 'Virtualization', 'Orchestration', 'None of the above'],
    answer: 'Containerization',
    difficulty: 'easy',
  },
  // Add more questions as needed
];

export const unixSystem: Question[] = [
  {
    id: 1,
    category: 'UNIX system terminal',
    question: 'What command is used to list files in a directory?',
    options: ['ls', 'dir', 'list', 'show'],
    answer: 'ls',
    difficulty: 'easy',
  },
  // Add more questions as needed
];
