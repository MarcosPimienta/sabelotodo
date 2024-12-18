import { useState, useEffect } from "react";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";
import { throwDice } from "../../../utils/threeManager";
import { BoardCoordinates } from "../../../types/BoardCoordinates";

let newPlayerIndex = 0;

export const useGameLogic = (
  players: Player[],
  setPlayers: Function,
  numberOfPlayers: number
) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [canThrowDice, setCanThrowDice] = useState(true);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: string]: number }>(() =>
    players.reduce((acc: any, player: any) => {
      acc[player.color] = 0; // Start index for each player
      return acc;
    }, {})
  );
  const [winner, setWinner] = useState<Player | null>(null);
  // Add these states if they are required
  const [showRoulette, setShowRoulette] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [playerAnsweredCategories, setPlayerAnsweredCategories] = useState<{
    [key: string]: Set<string>;
  }>({});

  const handleRouletteSpinComplete = (category: string) => {
    console.log(`Roulette spin completed with category: ${category}`);
    // Implement the logic to handle the completed roulette spin
  };

  useEffect(() => {
    const initialPositions: { [key: string]: number } = {};
    players.forEach((player) => {
      initialPositions[player.color] = 0; // Start at the beginning of their route
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  const movePlayerToken = (player: Player, newIndex: number) => {
    const route = playerRoutes[player.color.toLowerCase()];
    const nextPosition = route ? BoardCoordinates[route[newIndex]] : null;

    if (nextPosition && player.token3D) {
      player.token3D.position.set(nextPosition.x, 0, nextPosition.z);
      console.log(`${player.name} token moved to:`, nextPosition);
    } else {
      console.warn(
        `Unable to move ${player.name}: Missing coordinates or token3D.`
      );
    }
  };

  const handleDiceRollComplete = (diceScore: number) => {
    // Get the current player's information based on currentPlayerIndex
    const currentPlayer = players[newPlayerIndex]; // Ensure the correct player is fetched
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];

    // Calculate the next position index
    const nextPositionIndex = Math.min(
      currentPositionIndex + diceScore - 1, // Dice score determines the move
      currentRoute.length - 1 // Prevent going out of bounds
    );

    // Move the current player's token
    movePlayerToken(currentPlayer, nextPositionIndex);

    // Update the player's position in the state
    setPlayerPositions((prev) => ({
      ...prev,
      [currentPlayerColor]: nextPositionIndex,
    }));

    // Check if the player has reached the end
    if (nextPositionIndex === currentRoute.length - 1) {
      console.log(`${currentPlayer.name} has reached the end!`);
      setWinner(currentPlayer);
      return; // Stop turn rotation if the player wins
    }

    // Switch to the next player **after** all operations
    newPlayerIndex = (newPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(newPlayerIndex);
  };

  const handleRollDice = () => {
    if (!canThrowDice) return; // Prevent multiple rolls

    const scoreResult = document.querySelector("#score-result");
    if (!scoreResult) {
      console.error("Score result element is missing.");
      return;
    }

    throwDice(scoreResult, (diceScore: number) => {
      console.log(`Dice roll completed with score: ${diceScore}`);
      setDiceRoll(diceScore); // Store the dice score
      handleDiceRollComplete(diceScore); // Move player and update state
      setTimeout(() => setCanThrowDice(true), 1000); // Enable dice rolling again
    });

    setCanThrowDice(false); // Disable dice rolling during animation
  };

  return {
    currentPlayer: players[currentPlayerIndex],
    diceRoll,
    canThrowDice,
    setCanThrowDice,
    handleRollDice,
    handleDiceRollComplete,
    playerPositions,
    winner,
    showRoulette,
    setShowRoulette,
    timeLeft,
    setTimeLeft,
    playerAnsweredCategories,
    setPlayerAnsweredCategories,
    handleRouletteSpinComplete,
  };
};
