import React, { useState } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);

  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    movePlayer(roll);
  };

  const movePlayer = (steps: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].position += steps;
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  return (
    <div className="game-board">
      <div className="board">
        {/* Render the board here */}
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
        <button onClick={handleDiceRoll}>Roll Dice</button>
        <p>Dice Roll: {diceRoll}</p>
      </div>
    </div>
  );
};

export default GameBoard;
