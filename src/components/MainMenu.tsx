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
      <button onClick={onNewGame} data-augmented-ui="tl-clip br-clip border">New Game</button>
      <button onClick={onContinueGame} data-augmented-ui="tl-clip br-clip border">Continue Game</button>
    </div>
  );
};

export default MainMenu;
