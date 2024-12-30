import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";

// Initialize player positions
export const initializePlayerPositions = (players: Player[]): { [key: number]: number } => {
  const initialPositions: { [key: number]: number } = {};
  players.forEach((player) => {
    const route = playerRoutes[player.color];
    if (route) {
      initialPositions[player.id] = route[0]; // Start at the beginning of the route
    } else {
      console.warn(`No route found for color: ${player.color}`);
    }
  });
  return initialPositions;
};
