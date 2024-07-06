import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGameSessions } from '../../services/api';

interface GameSession {
  id: number;
  startTime: Date;
  endTime: Date;
  players: number[];
}

interface GameState {
  currentTurn: number;
  isStarted: boolean;
  sessions: GameSession[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GameState = {
  currentTurn: 0,
  isStarted: false,
  sessions: [],
  status: 'idle',
  error: null,
};

export const getGameSessions = createAsyncThunk('game/getGameSessions', async () => {
  const sessions = await fetchGameSessions();
  return sessions;
});

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
  extraReducers: (builder) => {
    builder
      .addCase(getGameSessions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getGameSessions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessions = action.payload;
      })
      .addCase(getGameSessions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { startGame, endGame, nextTurn } = gameSlice.actions;
export default gameSlice.reducer;
