import React from 'react';
import { Player } from '../../types/Player';
import "../../styles/GameBoard.css";

interface WinnerModalProps {
  winner: Player;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner }) => {
  return (
      <div className="winner-message">
        <h2>Congratulations!</h2>
        <p>Player {winner.name} has won the game!</p>
      </div>
  );
};

export default WinnerModal;
