import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Player {
  id: number;
  name: string;
  position: number;
  score: number;
}

interface PlayersState {
  players: Player[];
}

const initialState: PlayersState = {
  players: [],
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer(state, action: PayloadAction<Player>) {
      state.players.push(action.payload);
    },
    updatePlayer(state, action: PayloadAction<Player>) {
      const index = state.players.findIndex(player => player.id === action.payload.id);
      if (index !== -1) {
        state.players[index] = action.payload;
      }
    },
  },
});

export const { addPlayer, updatePlayer } = playersSlice.actions;
export default playersSlice.reducer;
