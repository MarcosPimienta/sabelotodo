import { useState, useEffect, useRef } from "react";
import { Player } from "../../../types/Player";
import { playerRoutes } from "../../../types/PlayerRoutes";
import { throwDice } from "../../../utils/threeManager";
import { BoardCoordinates } from "../../../types/BoardCoordinates";
import { boardPositionCategories } from "../../../types/BoardPositionCategories";

export const useGameLogic = (
  players: Player[],
  setPlayers: Function,
  numberOfPlayers: number,
  selectNextQuestion: (category: string) => void,
  handleAnswer: (correct: boolean) => void
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
    selectNextQuestion(category);
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

    const deltaX = (endPosition.x - startPosition.x) / steps;
    const deltaZ = (endPosition.z - startPosition.z) / steps;

    const maxHeight = 40;
    const startY = token.position.y;

    const animateStep = () => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;

        const x = startPosition.x + deltaX * currentStep;
        const z = startPosition.z + deltaZ * currentStep;

        const heightFactor = Math.sin(progress * Math.PI);
        const y = startY + maxHeight * heightFactor;

        token.position.set(x, y, z);

        currentStep++;
        setTimeout(animateStep, interval);
      } else {
        token.position.set(endPosition.x, 0, endPosition.z);
        onComplete();
      }
    };

    animateStep();
  };

  const movePlayerToken = (
    player: Player,
    currentIndex: number,
    newIndex: number,
    isReversed: boolean,
    onComplete: () => void
  ) => {
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

  const movePlayerForward = (onComplete: () => void) => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];
    const nextPositionIndex = Math.min(
      currentPositionIndex + 1,
      currentRoute.length - 1
    );

    movePlayerToken(currentPlayer, currentPositionIndex, nextPositionIndex, false, () => {
      setPlayerPositions((prev) => ({
        ...prev,
        [currentPlayerColor]: nextPositionIndex,
      }));
      onComplete();
    });
  };

  const movePlayerBack = (onComplete: () => void) => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];
    const previousPositionIndex = Math.max(currentPositionIndex - 1, 0);

    movePlayerToken(currentPlayer, currentPositionIndex, previousPositionIndex, true, () => {
      setPlayerPositions((prev) => ({
        ...prev,
        [currentPlayerColor]: previousPositionIndex,
      }));
      onComplete();
    });
  };

  const moveToNextPlayer = () => {
    const nextPlayerIndex = (playerIndexRef.current + 1) % players.length;
    playerIndexRef.current = nextPlayerIndex; // Update the reference
    setCurrentPlayerIndex(nextPlayerIndex); // Update the state
    console.log(`Next player turn: ${players[nextPlayerIndex].name}`);
  };

  const handleAnswerComplete = (correct: boolean) => {
    console.log(`Answer was ${correct ? "correct" : "incorrect"}.`);
    handleAnswer(correct); // Process the answer (update states, etc.)

    const onComplete = () => {
      console.log("Player turn complete.");
      moveToNextPlayer(); // Move to the next player
    };

    if (correct) {
      movePlayerForward(onComplete);
    } else {
      movePlayerBack(onComplete);
    }
  };

  const handleTimeout = () => {
    console.log("Question timed out. Moving player back.");
    const onComplete = () => {
      console.log("Timeout resolved. Moving to the next player.");
      moveToNextPlayer();
    };
    movePlayerBack(onComplete); // Penalize the player by moving back
  };

  const handleDiceRollComplete = (diceScore: number) => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositions[currentPlayerColor];

    console.log(`Current Position Index: ${currentPositionIndex}`);
    console.log(`Dice Score: ${diceScore}`);

    const adjustedDiceScore = currentPositionIndex === 0 ? diceScore - 1 : diceScore;
    const nextPositionIndex = Math.min(
      currentPositionIndex + adjustedDiceScore,
      currentRoute.length - 1
    );

    console.log(`Next Position Index: ${nextPositionIndex}`);

    playerPositions[currentPlayerColor] = nextPositionIndex;
    const nextPositionKey = currentRoute[nextPositionIndex];
    const nextPosition = BoardCoordinates[nextPositionKey];
    const category = boardPositionCategories[nextPositionKey];

    console.log(`Next Position for ${currentPlayer.name}:`, nextPosition);

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
        } else if (category && category !== "Roulette") {
          selectNextQuestion(category);
        } else {
          moveToNextPlayer();
        }
      });
    } else {
      console.warn(
        `Missing coordinates for route position: ${nextPositionKey}`
      );
    }
  };

  const handleRollDice = () => {
    if (!canThrowDice) return;

    const scoreResult = document.querySelector("#score-result");
    if (!scoreResult) {
      console.error("Score result element is missing.");
      return;
    }

    throwDice(scoreResult, (diceScore: number) => {
      console.log(`Dice roll completed with score: ${diceScore}`);
      setDiceRoll(diceScore);
      handleDiceRollComplete(diceScore);
      setTimeout(() => setCanThrowDice(true), 1000);
    });

    setCanThrowDice(false);
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
    movePlayerForward,
    movePlayerBack,
    handleAnswerComplete,
    handleTimeout
  };
};
