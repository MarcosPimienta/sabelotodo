// src/types/Board.ts
export interface Position {
  id: number;
  nextPositions: number[];
}

export interface Board {
  positions: Position[];
  startingPositions: { [key: string]: number[] }; // Keyed by player color/category
}

export const board: Board = {
  positions: [
    { id: 0, nextPositions: [1, 2, 3, 4, 5, 6] }, // Starting point
    // Define other positions and their next positions
    { id: 1, nextPositions: [7, 8] },
    { id: 2, nextPositions: [9, 10] },
    { id: 3, nextPositions: [11, 12] },
    { id: 4, nextPositions: [13, 14] },
    { id: 5, nextPositions: [15, 16] },
    { id: 6, nextPositions: [17, 18] },
    // Define more positions as needed
  ],
  startingPositions: {
    red: [1],
    blue: [2],
    green: [3],
    yellow: [4],
    purple: [5],
    orange: [6],
  },
};
