import React, { useState, useEffect } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';
import { predefinedCoordinates } from '../types/BoardCoordinates';
import { Question, questions } from '../types/Question';
import QuestionCard from './QuestionCard';

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({});

  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    movePlayer(roll);
  };

  const movePlayer = (steps: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let currentPosition = playerPositions[currentPlayer.id] || 1;
    currentPosition += steps;
    if (currentPosition > Object.keys(predefinedCoordinates).length) {
      currentPosition = Object.keys(predefinedCoordinates).length;
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
    <div className="game-container">
      <div className="player-stats">
        <h3>Player Stats</h3>
        {players.map((player) => (
          <div key={player.id} className="player-stat">
            <span className={`player-token ${player.color}`}>{player.name}</span>
            <span>Position: {playerPositions[player.id]}</span>
          </div>
        ))}
      </div>
      <div className="game-board">
        {players.map((player) => {
          const coordinates = predefinedCoordinates[player.color];
          return (
            <div key={player.id} className="player-container" style={{ transform: `translate(${coordinates.x}px, ${coordinates.y}px)` }}>
              <div className="player-coordinates">
                X: {coordinates.x}, Y: {coordinates.y}
              </div>
              <div className={`player-token ${player.color}`}>
                {player.name}
              </div>
            </div>
          );
        })}
      </div>
      <div className="game-controls">
        <p>Current Player: {players[currentPlayerIndex].name}</p>
        {!currentQuestion && <button onClick={handleDiceRoll}>Roll Dice</button>}
        {diceRoll > 0 && <p>Dice Roll: {diceRoll}</p>}
      </div>
      {currentQuestion && (
        <div className="question-modal">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
