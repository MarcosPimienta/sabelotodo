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
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({});
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


  const handleDiceRollComplete = (score: number) => {
    console.log(`Dice rolled: ${score}`);
    setDiceRoll(score);
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
