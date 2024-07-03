import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import NewGameSetup from './components/NewGameSetup';
import GameBoard from './components/GameBoard';
import QuestionCard from './components/QuestionCard';
import PlayerToken from './components/PlayerToken';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';
import { Player } from './types/Player';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [continueGame, setContinueGame] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const handleNewGame = () => {
    setGameStarted(true);
    setContinueGame(false);
  };

  const handleContinueGame = () => {
    setContinueGame(true);
    setGameStarted(true);
    // Load saved game session logic here
  };

  const handleSetupComplete = (sortedPlayers: Player[]) => {
    const initializedPlayers = sortedPlayers.map((player) => ({ ...player, position: 0 }));
    setPlayers(initializedPlayers);
    // Transition to the game board or next phase of the game here
  };

  if (!gameStarted) {
    return <MainMenu onNewGame={handleNewGame} onContinueGame={handleContinueGame} />;
  }

  if (!continueGame && players.length === 0) {
    return <NewGameSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="App">
      <GameBoard players={players} />
      <QuestionCard />
      <PlayerToken />
      <ScoreBoard />
      <GameControls />
    </div>
  );
};

export default App;
