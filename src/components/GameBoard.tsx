import React, { useState } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';
import { Question } from '../types/Question';
import QuestionCard from './QuestionCard';

interface GameBoardProps {
  players: Player[];
}

const questions: Question[] = [
  // Add your questions here
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

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    movePlayer(roll);
  };

  const movePlayer = (steps: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].position += steps;
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
  };

  const handleAnswer = (correct: boolean) => {
    if (!correct) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].position -= diceRoll;
    }
    setCurrentQuestion(null);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setDiceRoll(0);
  };

  return (
    <div className="game-board">
      <div className="board">
        <div className="starting-position">
          {players.map((player) => (
            <div key={player.id} className="player-token" style={{ transform: `translateX(${player.position * 10}px)` }}>
              {player.name}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <p>Current Player: {players[currentPlayerIndex].name}</p>
        {!currentQuestion && <button onClick={handleDiceRoll}>Roll Dice</button>}
        {diceRoll > 0 && <p>Dice Roll: {diceRoll}</p>}
      </div>
      {currentQuestion && <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />}
    </div>
  );
};

export default GameBoard;
