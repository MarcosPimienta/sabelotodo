import { BoardCoordinates } from "../../../types/BoardCoordinates";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";

// Move a player along their route
export const movePlayer = (
  playerId: number,
  steps: number,
  playerPositions: { [key: number]: number },
  players: Player[]
): { [key: number]: number } => {
  const currentPlayer = players.find((player) => player.id === playerId);
  if (!currentPlayer) {
    console.error(`Player with ID ${playerId} not found.`);
    return playerPositions;
  }

  const currentPosition = playerPositions[playerId] || 1;
  const playerRoute = playerRoutes[currentPlayer.color];
  if (!playerRoute) {
    console.error(`Route not found for color: ${currentPlayer.color}`);
    return playerPositions;
  }

  let newIndex = playerRoute.indexOf(currentPosition) + steps;
  if (newIndex >= playerRoute.length) {
    newIndex = playerRoute.length - 1; // Cap movement at the end of the route
  }

  const updatedPositions = { ...playerPositions };
  updatedPositions[playerId] = playerRoute[newIndex];
  return updatedPositions;
};

// Retrieve new coordinates for a player's token
export const getPlayerTokenCoordinates = (
  playerId: number,
  playerPositions: { [key: number]: number }
) => {
  const position = playerPositions[playerId] || 1;
  return BoardCoordinates[position];
};
