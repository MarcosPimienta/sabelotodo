import React from "react";
import QuestionCard from "../QuestionCard";

interface QuestionModalProps {
  question: any; // Replace with the actual Question type
  onAnswer: (correct: boolean) => void;
  timeLeft: number;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswer,
  timeLeft,
}) => {
  return (
    <div className="question-modal">
      <div className="question-header">
        <h2>{question.category}</h2>
        <p>Time Left: {timeLeft}s</p>
      </div>
      <QuestionCard question={question} onAnswer={onAnswer} timeLeft={timeLeft} />
    </div>
  );
};

export default QuestionModal;
