import { useState, useEffect } from "react";
import { Question } from "../../../types/Question";

interface UseQuestionsProps {
  categoryColors: { [key: string]: string };
  difficulties: string[];
  getCategoryQuestions: (category: string) => Question[];
}

interface UseQuestionsReturn {
  currentQuestion: Question | null;
  answeredQuestions: { [key: string]: Set<string> };
  selectNextQuestion: (category: string) => void;
  handleAnswer: (correct: boolean) => void;
  resetQuestions: () => void;
}

export const useQuestions = ({
  categoryColors,
  difficulties,
  getCategoryQuestions,
}: UseQuestionsProps): UseQuestionsReturn => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    [key: string]: Set<string>;
  }>({});

  // Initialize answered questions map
  useEffect(() => {
    const initialAnsweredQuestions: { [key: string]: Set<string> } = {};
    Object.keys(categoryColors).forEach((category) => {
      difficulties.forEach((difficulty) => {
        initialAnsweredQuestions[`${category}-${difficulty}`] = new Set();
      });
    });
    setAnsweredQuestions(initialAnsweredQuestions);
  }, [categoryColors, difficulties]);

  // Select the next question in a specific category
  const selectNextQuestion = (category: string) => {
    const categoryQuestions = getCategoryQuestions(category);
    const availableQuestions = categoryQuestions.filter(
      (q) => !answeredQuestions[`${category}-${q.difficulty}`]?.has(String(q.id))
    );

    if (availableQuestions.length > 0) {
      const question =
        availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(question);
    } else {
      setCurrentQuestion(null); // No questions left
    }
  };

  // Handle answering a question
  const handleAnswer = (correct: boolean) => {
    if (!currentQuestion) return;

    const questionKey = `${currentQuestion.category}-${currentQuestion.difficulty}`;
    setAnsweredQuestions((prev) => {
      const updated = { ...prev };
      if (!updated[questionKey]) {
        updated[questionKey] = new Set();
      }
      if (correct) {
        updated[questionKey].add(String(currentQuestion.id));
      }
      return updated;
    });

    // Clear current question
    setCurrentQuestion(null);
  };

  // Reset all answered questions
  const resetQuestions = () => {
    const resetAnsweredQuestions: { [key: string]: Set<string> } = {};
    Object.keys(categoryColors).forEach((category) => {
      difficulties.forEach((difficulty) => {
        resetAnsweredQuestions[`${category}-${difficulty}`] = new Set();
      });
    });
    setAnsweredQuestions(resetAnsweredQuestions);
    setCurrentQuestion(null);
  };

  return {
    currentQuestion,
    answeredQuestions,
    selectNextQuestion,
    handleAnswer,
    resetQuestions,
  };
};
