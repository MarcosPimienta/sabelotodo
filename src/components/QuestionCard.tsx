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

const categoryColors: { [key: string]: string } = {
  'Algorithms & Data Structures': '#C23334',
  'Programming Languages': '#FFFFFF',
  'Web Development': '#000000',
  'Data Bases': '#447DAB',
  'DevOps & Dev Tools': '#939393',
  'UNIX system terminal': '#208F43'
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, timeLeft }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === question.answer;
    setTimeout(() => onAnswer(isCorrect), 1000);
  };

  const buttonColor = categoryColors[question.category] || '#000000';
  const textColor = question.category === 'Programming Languages' ? 'black' : 'white';

  return (
    <div className="question-card" data-augmented-ui="border tl-clip-x tr-clip-x bl-clip br-round">
      <h3>{question.category}</h3>
      <p>{question.question}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            disabled={!!selectedOption}
            data-augmented-ui="tl-clip border"
            style={{ backgroundColor: buttonColor, color: textColor }}
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
