// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import GameBoard from './components/GameBoard';
import QuestionCard from './components/QuestionCard';
import PlayerToken from './components/PlayerToken';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [continueGame, setContinueGame] = useState(false);

  const handleNewGame = () => {
    setGameStarted(true);
    setContinueGame(false);
    // Initialize new game session logic here
  };

  const handleContinueGame = () => {
    setContinueGame(true);
    setGameStarted(true);
    // Load saved game session logic here
  };

  if (!gameStarted) {
    return <MainMenu onNewGame={handleNewGame} onContinueGame={handleContinueGame} />;
  }

  return (
    <div className="App">
      <GameBoard />
      <QuestionCard />
      <PlayerToken />
      <ScoreBoard />
      <GameControls />
    </div>
  );
};

export default App;
