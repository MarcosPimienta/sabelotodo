import { useState, useEffect } from "react";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";
import { throwDice } from "../../../utils/threeManager";
import { BoardCoordinates } from "../../../types/BoardCoordinates";

export const useGameLogic = (
  players: Player[],
  setPlayers: Function,
  numberOfPlayers: number
) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [canThrowDice, setCanThrowDice] = useState(true);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({});
  const [showRoulette, setShowRoulette] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: string]: Set<string> }>({});

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    const initialPositions: { [key: number]: number } = {};
    players.forEach((player) => {
      const route = playerRoutes[player.color];
      initialPositions[player.id] = route ? route[0] : 0;
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  const handleMovePlayer = (diceScore: number) => {
    const currentRoute = playerRoutes[currentPlayer.color];
    const currentPositionIndex = playerPositions[currentPlayerIndex];

    const newPositionIndex = Math.min(currentPositionIndex + diceScore, currentRoute.length - 1);

    setPlayerPositions((prevPositions) => ({
      ...prevPositions,
      [currentPlayerIndex]: newPositionIndex,
    }));

    const boardCoordinateKey = currentRoute[newPositionIndex];
    const newCoordinates = BoardCoordinates[boardCoordinateKey];
    if (currentPlayer.token3D && newCoordinates) {
      currentPlayer.token3D.position.set(newCoordinates.x, 0, newCoordinates.z);
    }

    if (newPositionIndex === currentRoute.length - 1) {
      setWinner(currentPlayer);
    }

    setDiceRoll(null);
  };

  const handleRollDice = () => {
    if (canThrowDice) {
      const scoreResult = document.querySelector('#score-result');
      if (!scoreResult) {
        console.error('Score result element is missing.');
        return;
      }

      throwDice(scoreResult, (score: number) => {
        console.log(`Dice roll completed with score: ${score}`);
        setDiceRoll(score); // Update the dice roll state
        handleMovePlayer(score); // Trigger player movement
        setTimeout(() => setCanThrowDice(true), 1000); // Re-enable the button after delay
      });

      setCanThrowDice(false); // Disable the button while rolling
    }
  };

  const handleDiceRollComplete = (score: number) => {
    console.log(`Dice rolled: ${score}`);
    setDiceRoll(score);
  };

  return {
    currentPlayer,
    diceRoll,
    canThrowDice,
    setCanThrowDice,
    handleRollDice,
    handleDiceRollComplete, // <-- Added here
    playerPositions,
    winner,
    showRoulette,
    currentQuestion,
    handleAnswer: () => {}, // Implement question answer logic
    handleRouletteSpinComplete: () => {}, // Implement roulette logic
    timeLeft,
    playerAnsweredCategories: {},
    categoryColors: {},
  };
};
