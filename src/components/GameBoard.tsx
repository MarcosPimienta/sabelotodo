// src/components/GameBoard.tsx
import React, { useState } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';
import { board, Position } from '../types/Board';
import { Question, questions } from '../types/Question';
import QuestionCard from './QuestionCard';

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({}); // Player ID to position mapping

  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    movePlayer(roll);
  };

  const movePlayer = (steps: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let currentPosition = playerPositions[currentPlayer.id] || 0;
    for (let i = 0; i < steps; i++) {
      const position = board.positions.find(pos => pos.id === currentPosition);
      if (position) {
        currentPosition = position.nextPositions[Math.floor(Math.random() * position.nextPositions.length)];
      }
    }
    const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: currentPosition };
    setPlayerPositions(updatedPlayerPositions);
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
  };

  const handleAnswer = (correct: boolean) => {
    if (!correct) {
      const currentPlayer = players[currentPlayerIndex];
      const currentPosition = playerPositions[currentPlayer.id];
      const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: currentPosition - diceRoll };
      setPlayerPositions(updatedPlayerPositions);
    }
    setCurrentQuestion(null);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setDiceRoll(0);
  };

  const selectDirection = (position: number) => {
    const currentPlayer = players[currentPlayerIndex];
    const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: position };
    setPlayerPositions(updatedPlayerPositions);
  };

  return (
    <div className="game-board">
      <div className="board">
        <div className="starting-position">
          {players.map((player) => (
            <div key={player.id} className={`player-token ${player.color}`} style={{ transform: `translateX(${playerPositions[player.id] * 10}px)` }}>
              {player.name}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <p>Current Player: {players[currentPlayerIndex].name}</p>
        {!playerPositions[players[currentPlayerIndex].id] && (
          <div>
            <p>Select your starting direction:</p>
            {board.startingPositions[players[currentPlayerIndex].color].map((pos) => (
              <button key={pos} onClick={() => selectDirection(pos)}>Go to {pos}</button>
            ))}
          </div>
        )}
        {playerPositions[players[currentPlayerIndex].id] && !currentQuestion && <button onClick={handleDiceRoll}>Roll Dice</button>}
        {diceRoll > 0 && <p>Dice Roll: {diceRoll}</p>}
      </div>
      {currentQuestion && <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />}
    </div>
  );
};

export default GameBoard;
