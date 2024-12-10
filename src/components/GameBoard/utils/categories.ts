import { Question } from "../../../types/Question";

// Example category colors
export const categoryColors: { [key: string]: string } = {
  "Algorithms & Data Structures": "#C23334",
  "Programming Languages": "#FFFFFF",
  "Web Development": "#000000",
  "Data Bases": "#447DAB",
  "DevOps & Dev Tools": "#939393",
  "UNIX system terminal": "#208F43",
};

// Example difficulties
export const difficulties = ["easy", "medium", "hard"];

// Retrieve questions for a given category
export const getCategoryQuestions = (category: string, allQuestions: Question[]): Question[] => {
  return allQuestions.filter((question) => question.category === category);
};
