import { useState, useEffect } from "react";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";
import { initDiceSystem, throwDice } from "../../../utils/threeManager";
import { BoardCoordinates } from "../../../types/BoardCoordinates";

export const useGameLogic = (players: Player[], setPlayers: Function, numberOfPlayers: number) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [canThrowDice, setCanThrowDice] = useState(true);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: string]: number }>(() => {
    const initialPositions: { [key: string]: number } = {};
    players.forEach((player) => {
      initialPositions[player.color] = 0; // Starting index for each player
    });
    return initialPositions;
  });
  const [showRoulette, setShowRoulette] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: string]: Set<string>;}>({});

  useEffect(() => {
    const initialPositions: { [key: number]: number } = {};
    players.forEach((player) => {
      const route = playerRoutes[player.color];
      initialPositions[player.id] = route ? route[0] : 0;
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  const handleRollDice = () => {
  if (canThrowDice) {
    const scoreResult = document.querySelector('#score-result');
    if (!scoreResult) {
      console.error('Score result element is missing.');
      return;
    }

    throwDice(scoreResult, (score: number) => {
      console.log(`Dice roll completed with score: ${score}`);
      setDiceRoll(score); // Update the dice roll in state
      setTimeout(() => setCanThrowDice(true), 1000); // Re-enable button after delay
    });

    setCanThrowDice(false); // Disable button while rolling
  }
};

  /* const handleDiceRollComplete = (diceScore: number) => {
    const currentPlayerColor = players[currentPlayerIndex].color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];
    const nextPositionIndex = Math.min(currentPositionIndex + diceScore - 1, currentRoute.length - 1);

    setPlayerPositions((prev) => ({
      ...prev,
      [currentPlayerColor]: nextPositionIndex,
    }));

    const nextPosition = BoardCoordinates[currentRoute[nextPositionIndex]];
    if (nextPosition) {
      players[currentPlayerIndex].token3D?.position.set(nextPosition.x, 0, nextPosition.z);
    } else {
      console.warn(`Missing coordinates for route position: ${currentRoute[nextPositionIndex]}`);
    }

    if (nextPositionIndex === currentRoute.length - 1) {
      console.log(`${players[currentPlayerIndex].name} has reached the end!`);
      setWinner(players[currentPlayerIndex]);
    }

    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  }; */
  const handleDiceRollComplete = (diceScore: number) => {
    // Fetch the current player dynamically using currentPlayerIndex
    const currentPlayer = players[currentPlayerIndex];
    const currentPlayerColor = currentPlayer.color.toLowerCase(); // Get player's color

    const currentRoute = playerRoutes[currentPlayerColor]; // Route for the player
    const currentPositionIndex = playerPositions[currentPlayerColor]; // Current index

    const nextPositionIndex = Math.min(
      currentPositionIndex + diceScore, // New position based on dice roll
      currentRoute.length - 1 // Prevent out of bounds
    );

    // Update the token position
    const nextPosition = BoardCoordinates[currentRoute[nextPositionIndex]];

    if (nextPosition) {
      currentPlayer.token3D?.position.set(nextPosition.x, 0, nextPosition.z);
      console.log(`Moving ${currentPlayer.name}'s token to:`, nextPosition);
    } else {
      console.warn(`Missing coordinates for route position: ${currentRoute[nextPositionIndex]}`);
    }

    // Update the position state
    setPlayerPositions((prev) => ({
      ...prev,
      [currentPlayerColor]: nextPositionIndex,
    }));

    // Check if the player won
    if (nextPositionIndex === currentRoute.length - 1) {
      console.log(`${currentPlayer.name} has reached the end!`);
      setWinner(currentPlayer);
      return;
    }

    // Switch to the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length; // Cycle players
    console.log(`Switching turn: From ${currentPlayerIndex} to ${nextPlayerIndex}`);
    setCurrentPlayerIndex(nextPlayerIndex);
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
    currentQuestion,
    handleAnswer: () => {}, // Implement question answer logic
    handleRouletteSpinComplete: () => {}, // Implement roulette logic
    timeLeft,
    playerAnsweredCategories: {}, // Implement categories tracking
    categoryColors: {}, // Define category colors here
  };
};
