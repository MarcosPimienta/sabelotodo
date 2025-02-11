import { useState, useEffect } from "react";
import { Question } from "../../../types/Question";

interface UseQuestionsProps {
  categoryColors: { [key: string]: string };
  difficulties: string[];
  getCategoryQuestions: (category: string) => Question[];
  onTimeout?: () => void;
}

interface UseQuestionsReturn {
  currentQuestion: Question | null;
  answeredQuestions: { [key: string]: Set<string> };
  selectNextQuestion: (category: string) => void;
  handleAnswer: (correct: boolean) => void;
  resetQuestions: () => void;
  timeLeft: number | null;
  setTimeLeft: React.Dispatch<React.SetStateAction<number | null>>;
}

export const useQuestions = ({
  categoryColors,
  difficulties,
  getCategoryQuestions,
  onTimeout,
}: UseQuestionsProps): UseQuestionsReturn => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    [key: string]: Set<string>;
  }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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

  // Timer effect: counts down the timeLeft whenever a question is active.
  useEffect(() => {
    if (currentQuestion && timeLeft !== null) {
      if (timeLeft <= 0) {
        // Time is up, treat as an incorrect answer.
        if (onTimeout) {
          onTimeout();
        }
        handleAnswer(false)
      } else {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeLeft, currentQuestion]);

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

      // Set timer based on difficulty
      switch (question.difficulty) {
        case "easy":
          setTimeLeft(10);
          break;
        case "medium":
          setTimeLeft(20);
          break;
        case "hard":
          setTimeLeft(30);
          break;
        default:
          setTimeLeft(30);
      }
    } else {
      setCurrentQuestion(null);
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

    // Clear current question and reset timer
    setCurrentQuestion(null);
    setTimeLeft(null);
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
    setTimeLeft(null);
  };

  return {
    currentQuestion,
    answeredQuestions,
    selectNextQuestion,
    handleAnswer,
    resetQuestions,
    timeLeft,
    setTimeLeft,
  };
};
