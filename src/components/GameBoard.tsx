import React from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  return (
    <div className="game-board">
      <div className="board">
        {/* Render the board here */}
        <div className="starting-position">
          {players.map((player) => (
            <div key={player.id} className="player-token">
              {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
