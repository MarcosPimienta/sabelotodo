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
  timeLeft: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, timeLeft }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
