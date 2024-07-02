import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  currentTurn: number;
  isStarted: boolean;
}

const initialState: GameState = {
  currentTurn: 0,
  isStarted: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      state.isStarted = true;
    },
    endGame(state) {
      state.isStarted = false;
    },
    nextTurn(state) {
      state.currentTurn += 1;
    },
  },
});

export const { startGame, endGame, nextTurn } = gameSlice.actions;
export default gameSlice.reducer;
