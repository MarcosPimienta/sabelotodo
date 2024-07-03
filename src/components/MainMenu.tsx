import React from 'react';
import '../styles/MainMenu.css';

interface MainMenuProps {
  onNewGame: () => void;
  onContinueGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onContinueGame }) => {
  return (
    <div className="main-menu">
      <h1>Welcome to Sabelotodo</h1>
      <button onClick={onNewGame}>New Game</button>
      <button onClick={onContinueGame}>Continue Game</button>
    </div>
  );
};

export default MainMenu;
