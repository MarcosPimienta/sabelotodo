import React from "react";
import QuestionCard from "../QuestionCard";

interface QuestionModalProps {
  question: any; // Replace with the actual Question type
  onAnswer: (correct: boolean, spacesMoved: number) => void;
  timeLeft: number;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswer,
  timeLeft,
}) => {
  const handleAnswer = (correct: boolean) => {
    onAnswer(correct, 0); // Assuming spacesMoved is 0 for now
  };
  return (
    <div className="question-modal">
      <QuestionCard question={question} onAnswer={handleAnswer} timeLeft={timeLeft} />
        {/* <p>Time Left: {timeLeft}s</p> */}
    </div>
  );
};

export default QuestionModal;
