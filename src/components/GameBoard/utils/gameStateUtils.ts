import { Player } from "../../../types/Player";
import { Question } from "../../../types/Question";

// Initialize answered questions
export const initializeAnsweredQuestions = (categories: string[], difficulties: string[]): {
  [key: string]: Set<string>;
} => {
  const answeredQuestions: { [key: string]: Set<string> } = {};
  categories.forEach((category) => {
    difficulties.forEach((difficulty) => {
      answeredQuestions[`${category}-${difficulty}`] = new Set();
    });
  });
  return answeredQuestions;
};

// Initialize player stats
export const initializePlayerStats = (numberOfPlayers: number): Player[] => {
  return new Array(numberOfPlayers).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Player ${index + 1}`,
    diceRoll: 0,
    position: 0,
    color: "", // Assign dynamically later
    token3D: null, // Placeholder for 3D token
  }));
};

// Check win condition
export const checkWinCondition = (
  playerId: number,
  playerPositions: { [key: number]: number },
  playerRoutes: { [key: string]: number[] },
  playerCategories: { [key: number]: Set<string> }
): boolean => {
  const playerRoute = playerRoutes[playerId];
  const playerCategoryCount = playerCategories[playerId]?.size || 0;

  // Example win condition: player must reach the end of the route and answer all categories
  return (
    playerPositions[playerId] === playerRoute[playerRoute.length - 1] &&
    playerCategoryCount >= 6
  );
};
