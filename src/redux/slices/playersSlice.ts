import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlayers } from '../../services/api';

interface Player {
  id: number;
  name: string;
  position: number;
  score: number;
}

interface PlayersState {
  players: Player[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  status: 'idle',
  error: null,
};

export const getPlayers = createAsyncThunk('players/getPlayers', async () => {
  const players = await fetchPlayers();
  return players;
});

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players = action.payload;
      })
      .addCase(getPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export default playersSlice.reducer;
