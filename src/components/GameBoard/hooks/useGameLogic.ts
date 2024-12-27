import { useState, useEffect, useRef } from "react";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";
import { throwDice } from "../../../utils/threeManager";
import { BoardCoordinates } from "../../../types/BoardCoordinates";

export const useGameLogic = (
  players: Player[],
  setPlayers: Function,
  numberOfPlayers: number
) => {
  const playerIndexRef = useRef(0);
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
  const [showRoulette, setShowRoulette] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [playerAnsweredCategories, setPlayerAnsweredCategories] = useState<{
    [key: string]: Set<string>;
  }>({});

  const handleRouletteSpinComplete = (category: string) => {
    console.log(`Roulette spin completed with category: ${category}`);
    // Logic for completed roulette spin
  };

  useEffect(() => {
    const initialPositions: { [key: string]: number } = {};
    players.forEach((player) => {
      initialPositions[player.color] = 0; // Start at the beginning of their route
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  const animateTokenMovement = (
    player: Player,
    startPosition: { x: number; z: number },
    endPosition: { x: number; z: number },
    isReversed: boolean,
    onComplete: () => void
  ) => {
    const token = player.token3D;
    if (!token) {
      console.warn(`Token for player ${player.name} is missing.`);
      return;
    }

    const duration = 1000; // Animation duration in milliseconds
    const steps = 60; // Number of steps for the animation
    const interval = duration / steps;

    let currentStep = 0;

    // Calculate deltas for X and Z
    const deltaX = (endPosition.x - startPosition.x) / steps;
    const deltaZ = (endPosition.z - startPosition.z) / steps;

    // Maximum height for the arch
    const maxHeight = 40;
    const startY = token.position.y;

    const animateStep = () => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;

        // Calculate current position
        const x = startPosition.x + deltaX * currentStep;
        const z = startPosition.z + deltaZ * currentStep;

        // Create an arch effect for the Y position
        const heightFactor = Math.sin(progress * Math.PI);
        const y = startY + maxHeight * heightFactor;

        // Update token position
        token.position.set(x, y, z);

        currentStep++;
        setTimeout(animateStep, interval);
      } else {
        // Reset Y position to ground level after animation
        token.position.set(endPosition.x, 0, endPosition.z);
        onComplete();
      }
    };

    animateStep();
  };

  const movePlayerToken = (player: Player, currentIndex: number, newIndex: number, isReversed: boolean, onComplete: () => void) => {
    const route = playerRoutes[player.color.toLowerCase()];
    const endPositionKey = route[newIndex];
    const endPosition = BoardCoordinates[endPositionKey];
    const startPositionKey = route[currentIndex];
    const startPosition = BoardCoordinates[startPositionKey];

    if (endPosition && player.token3D) {
      animateTokenMovement(player, startPosition, endPosition, isReversed, onComplete);
    } else {
      console.warn(`Unable to move ${player.name}: Missing coordinates or token3D.`);
    }
  };

  const handleDiceRollComplete = (diceScore: number) => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];

    console.log(`Current Position Index: ${currentPositionIndex}`);
    console.log(`Dice Score: ${diceScore}`);

    // Adjust dice score if the player is at the starting position
    const adjustedDiceScore = currentPositionIndex === 0 ? diceScore - 1 : diceScore;
    // Calculate the next position index
    const nextPositionIndex = Math.min(
      currentPositionIndex + adjustedDiceScore, // Move based on dice score
      currentRoute.length - 1 // Prevent going out of bounds
    );

    console.log(`Next Position Index: ${nextPositionIndex}`);

    // Update the player's position
    playerPositions[currentPlayerColor] = nextPositionIndex;
    // Get the next position from the route
    const nextPositionKey = currentRoute[nextPositionIndex];
    const nextPosition = BoardCoordinates[nextPositionKey];

    console.log(`Next Position for ${currentPlayer.name}:`, nextPosition);

    // Move the token if valid position
    if (nextPosition) {
    movePlayerToken(currentPlayer, currentPositionIndex, nextPositionIndex, false, () => {
      console.log(`${currentPlayer.name} moved to position ${nextPositionIndex}`);
      setPlayerPositions((prev) => ({
        ...prev,
        [currentPlayerColor]: nextPositionIndex,
      }));

      if (nextPositionIndex === currentRoute.length - 1) {
        console.log(`${currentPlayer.name} has reached the end!`);
        setWinner(currentPlayer);
      } else {
        playerIndexRef.current = (playerIndexRef.current + 1) % players.length;
        setCurrentPlayerIndex(playerIndexRef.current);
      }
    });

      // Update player's position
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
    } else {
      console.warn(
        `Missing coordinates for route position: ${nextPositionKey}`
      );
    }
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
      setDiceRoll(diceScore); // Update dice roll state
      handleDiceRollComplete(diceScore); // Move player and update state
      setTimeout(() => setCanThrowDice(true), 1000); // Enable rolling again
    });

    setCanThrowDice(false); // Disable rolling during animation
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
