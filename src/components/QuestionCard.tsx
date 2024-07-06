import React, { useState, useEffect } from 'react';
import '../styles/QuestionCard.css';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    switch (question.difficulty) {
      case 'easy':
        setTimeLeft(30);
        break;
      case 'medium':
        setTimeLeft(20);
        break;
      case 'hard':
        setTimeLeft(10);
        break;
      default:
        setTimeLeft(30);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onAnswer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, onAnswer]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === question.answer;
    setTimeout(() => onAnswer(isCorrect), 1000);
  };

  return (
    <div className="question-card">
      <h3>{question.category}</h3>
      <p>{question.question}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            disabled={!!selectedOption}
          >
            {option}
          </button>
        ))}
      </div>
      <p>Time left: {timeLeft} seconds</p>
    </div>
  );
};

export default QuestionCard;
