import { algorithms, programmingLanguages, webDevelopment, dataBases, devOps, unixSystem } from '../../../types/Question';

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
export const getCategoryQuestions = (category: string) => {
  switch (category) {
    case 'Algorithms & Data Structures':
      return algorithms;
    case 'Programming Languages':
      return programmingLanguages;
    case 'Web Development':
      return webDevelopment;
    case 'Data Bases':
      return dataBases;
    case 'DevOps & Dev Tools':
      return devOps;
    case 'UNIX system terminal':
      return unixSystem;
    default:
      return [];
  }
};
