import { combineReducers } from '@reduxjs/toolkit';
import gameSlice from './slices/gameSlice';
import playersSlice from './slices/playersSlice';
import questionsSlice from './slices/questionsSlice';

const rootReducer = combineReducers({
  game: gameSlice,
  players: playersSlice,
  questions: questionsSlice,
});

export default rootReducer;
