import React, { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import './App.css';
import GameBoard from './components/GameBoard';
import QuestionCard from './components/QuestionCard';
import PlayerToken from './components/PlayerToken';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';
import { getQuestions } from './redux/slices/questionsSlice';
import { getPlayers } from './redux/slices/playersSlice';
import { getGameSessions } from './redux/slices/gameSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getQuestions());
    dispatch(getPlayers());
    dispatch(getGameSessions());
  }, [dispatch]);

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
