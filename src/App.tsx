import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import QuestionCard from './components/QuestionCard';
import PlayerToken from './components/PlayerToken';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';

const App: React.FC = () => {
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

