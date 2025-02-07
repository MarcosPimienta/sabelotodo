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
  selectNextQuestion: (category: string, spacesMoved?: number) => void,
  handleAnswer: (correct: boolean) => void
) => {
  const playerIndexRef = useRef(0);
  const playerPositionsRef = useRef<{ [key: string]: number }>(
    players.reduce((acc: any, player: any) => {
      acc[player.color] = 0;
      return acc;
    }, {})
  );
  const lastMoveRef = useRef<{ [key: string]: number }>(
    players.reduce((acc: any, player: any) => {
      acc[player.color] = 0; // Tracks the last move per player
      return acc;
    }, {})
  );

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [canThrowDice, setCanThrowDice] = useState(true);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showRoulette, setShowRoulette] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [playerAnsweredCategories, setPlayerAnsweredCategories] = useState<{
    [key: string]: Set<string>;
  }>({});
  const [playerPositions, setPlayerPositions] = useState<{ [key: string]: number }>(playerPositionsRef.current);

  const handleRouletteSpinComplete = (category: string) => {
    console.log('Roulette spin completed with category: ${category}');
    selectNextQuestion(category);
  };

  const updatePlayerPosition = (color: string, newPosition: number) => {
    playerPositionsRef.current[color] = newPosition;
    setPlayerPositions({ ...playerPositionsRef.current }); // Trigger re-render
  };

  useEffect(() => {
    const initialPositions: { [key: string]: number } = {};
    players.forEach((player) => {
      initialPositions[player.color] = 0; // Start at the beginning of their route
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  const moveToNextPlayer = () => {
    const nextPlayerIndex = (playerIndexRef.current + 1) % players.length;
    playerIndexRef.current = nextPlayerIndex;
    setCurrentPlayerIndex(nextPlayerIndex);
    console.log(`🔄 Next Player Turn: ${players[nextPlayerIndex].name}`);
  };

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

    const duration = 500; // Animation duration in milliseconds
    const steps = 60; // Number of steps for the animation
    const interval = duration / steps;

    let currentStep = 0;

    const deltaX = (endPosition.x - startPosition.x) / steps;
    const deltaZ = (endPosition.z - startPosition.z) / steps;

    const maxHeight = 60;
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

    console.log(`Moving ${player.name} from ${startPositionKey} to ${endPositionKey}`);
    console.log(`Start Position: ${startPosition}`);
    console.log(`End Position: ${endPosition}`);
    console.log(`Is Reversed: ${isReversed}`);

    if (endPosition && player.token3D) {
      animateTokenMovement(player, startPosition, endPosition, isReversed, onComplete);
    } else {
      console.warn(`Unable to move ${player.name}: Missing coordinates or token3D.`);
    }
  };

  const handleAnswerComplete = (correct: boolean) => {
    handleAnswer(correct);

    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];

    let nextPositionIndex = currentPositionIndex;
    if (!correct) {
      const lastMove = lastMoveRef.current[currentPlayerColor] || 1; // Move back by last move
      nextPositionIndex = Math.max(currentPositionIndex - lastMove, 0);
    }

    console.log(`
      🎮 Player: ${currentPlayer.name}
      📍 Current Position: ${currentPositionIndex}
      🔙 Last Move: ${lastMoveRef.current[currentPlayerColor]}
      ⬅ Moving Back: ${!correct ? lastMoveRef.current[currentPlayerColor] : 0}
      🎯 Next Position: ${nextPositionIndex}
      ✅ Answer Correct?: ${correct}
    `);

    movePlayerToken(
      currentPlayer,
      currentPositionIndex,
      nextPositionIndex,
      !correct,
      () => {
        updatePlayerPosition(currentPlayerColor, nextPositionIndex);
        moveToNextPlayer();
      }
    );
  };

  const handleTimeout = (spacesMoved: number) => {
    console.log("Question timed out. Penalizing player with backward movement.");

    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentPositionIndex = playerPositions[currentPlayerColor];

    const nextPositionIndex = Math.max(currentPositionIndex - spacesMoved, 0);

    movePlayerToken(
      currentPlayer,
      currentPositionIndex,
      nextPositionIndex,
      true, // Reverse movement
      () => {
        console.log(
          '${currentPlayer.name} moved to position ${nextPositionIndex} after timeout.'
        );

        setPlayerPositions((prev) => ({
          ...prev,
          [currentPlayerColor]: nextPositionIndex,
        }));

        moveToNextPlayer();
      }
    );
  };

  const handleDiceRollComplete = (diceScore: number) => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];

    console.log(`🎲 Dice Roll: ${diceScore}`);
    console.log(`👤 Player: ${currentPlayer.name} (${currentPlayerColor})`);
    console.log(`📍 Current Position Index: ${currentPositionIndex}`);
    console.log(`🛤️ Route Path: ${currentRoute.join(" → ")}`);

    const nextPositionIndex = Math.min(
      currentPositionIndex + diceScore,
      currentRoute.length - 1
    );

    console.log(`🔜 Next Position Index: ${nextPositionIndex}`);
    console.log(`📌 Moving from ${currentRoute[currentPositionIndex]} → ${currentRoute[nextPositionIndex]}`);

    lastMoveRef.current[currentPlayerColor] = diceScore;

    movePlayerToken(
      currentPlayer,
      currentPositionIndex,
      nextPositionIndex,
      false,
      () => {
        console.log(`✅ ${currentPlayer.name} moved to position ${nextPositionIndex}`);

        playerPositionsRef.current[currentPlayerColor] = nextPositionIndex;
        setPlayerPositions((prev) => ({
          ...prev,
          [currentPlayerColor]: nextPositionIndex,
        }));

        const category = boardPositionCategories[currentRoute[nextPositionIndex]];
        if (category && category === "Roulette") {
          setShowRoulette(true);
          console.log("🎡 Landing on Roulette. Showing the roulette wheel.");
          // The RouletteWheel component should call handleRouletteSpinComplete(category)
          // after the spin animation completes.
        } else if (category) {
          console.log(`❓ Asking question from category: ${category}`);
          selectNextQuestion(category, diceScore);
        } else {
          console.log("🔄 No question required, moving to next player.");
          moveToNextPlayer();
        }
      }
    );
  };

  const handleRollDice = () => {
    if (!canThrowDice) return;

    const scoreResult = document.querySelector("#score-result");
    if (!scoreResult) {
      console.error("⚠️ Score result element is missing.");
      return;
    }

    throwDice(scoreResult, (diceScore: number) => {
      console.log(`🎲 Dice roll completed with score: ${diceScore}`);
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
    handleAnswerComplete,
    handleTimeout
  };
};