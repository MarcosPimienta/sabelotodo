import { useState, useEffect, useRef, useMemo } from "react";
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
      // Use player's color as key for position (as you do elsewhere)
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
  const [playerAnsweredCategories, setPlayerAnsweredCategories] = useState<{
    [key: string]: Set<string>;
  }>({});
  const [playerPositions, setPlayerPositions] = useState<{ [key: string]: number }>(
    playerPositionsRef.current
  );
  const [currentQuestionCategory, setCurrentQuestionCategory] = useState<string | null>(null);

  // Memoized badge count using player's ID as key
  const currentBadgeCount = useMemo(() => {
    const currentPlayer = players[playerIndexRef.current];
    if (!currentPlayer) return 0;
    return playerAnsweredCategories[String(currentPlayer.id)]?.size || 0;
  }, [playerAnsweredCategories, players, currentPlayerIndex]);

  const winConditionMet = useMemo(() => {
    const currentPlayer = players[playerIndexRef.current];
    if (!currentPlayer) return false;
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPosition = playerPositions[currentPlayerColor];
    console.log(
      `Memoized win check: ${currentPlayer.name} at position ${currentPosition}, badge count: ${currentBadgeCount}`
    );
    return currentPosition === currentRoute[currentRoute.length - 1] && currentBadgeCount >= 6;
  }, [currentBadgeCount, players, currentPlayerIndex, playerPositions]);

  /* useEffect(() => {
    const currentPlayer = players[playerIndexRef.current];
    if (!currentPlayer) return;
    if (winConditionMet) {
      setWinner(currentPlayer);
      console.log(`🏆 ${currentPlayer.name} wins via memoized win check`);
    }
  }, [winConditionMet, players]); */

  const handleRouletteSpinComplete = (category: string) => {
    console.log(`🎡 Roulette spin completed: ${category}`);
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];
    const atEnd = currentPositionIndex === currentRoute.length - 1;
    const answeredCategories = playerAnsweredCategories[String(currentPlayer.id)] || new Set();
    setTimeout(() => {
      setShowRoulette(false);
      if (atEnd && answeredCategories.has(category)) {
        console.log(`ℹ️ ${currentPlayer.name} already has the ${category} badge. Passing turn.`);
        moveToNextPlayer();
      } else {
        setCurrentQuestionCategory(category);
        selectNextQuestion(category);
      }
    }, 800);
  };

  const updatePlayerPosition = (color: string, newPosition: number) => {
    playerPositionsRef.current[color] = newPosition;
    setPlayerPositions({ ...playerPositionsRef.current });
  };

  // Helper: Fill badges for a given player (for testing purposes).
  // Now takes a playerId (number) and uses String(playerId) as key.

  const fillBadgesForPlayer = (playerId: number) => {
    console.log(`Filling badges for player ${playerId} for testing.`);
    setPlayerAnsweredCategories((prev) => ({
      ...prev,
      [String(playerId)]: new Set([
        "Algorithms & Data Structures",
        "Programming Languages",
        "Web Development",
        "Data Bases",
        "DevOps & Dev Tools",
        "UNIX system terminal",
      ]),
    }));
  };

  useEffect(() => {
    const initialPositions: { [key: string]: number } = {};
    const initialCategories: { [key: string]: Set<string> } = {};
    players.forEach((player) => {
      initialPositions[player.color] = 0;
      initialCategories[String(player.id)] = new Set();
    });
    setPlayerPositions(initialPositions);
    setPlayerAnsweredCategories(initialCategories);
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
    const duration = 500;
    const steps = 60;
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
    console.log(`Moving ${player.name} from ${startPositionKey} to ${endPositionKey}\n
                 Start Position: ${startPosition}\n
                 End Position: ${endPosition}\n
                 Is Reversed: ${isReversed}`);
    if (endPosition && player.token3D) {
      animateTokenMovement(player, startPosition, endPosition, isReversed, onComplete);
    } else {
      console.warn(`Unable to move ${player.name}: Missing coordinates or token3D.`);
    }
  };

  const handleAnswerComplete = (correct: boolean) => {
    if (correct && currentQuestionCategory) {
      const currentPlayer = players[playerIndexRef.current];
      setPlayerAnsweredCategories((prev) => {
        const prevSet = prev[String(currentPlayer.id)] || new Set<string>();
        prevSet.add(currentQuestionCategory);
        return { ...prev, [String(currentPlayer.id)]: prevSet };
      });
    }
    setCurrentQuestionCategory(null);
    handleAnswer(correct);
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];
    let nextPositionIndex = currentPositionIndex;
    if (!correct) {
      const lastMove = lastMoveRef.current[currentPlayerColor] || 1;
      nextPositionIndex = Math.max(currentPositionIndex - lastMove, 0);
    }
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
    console.log("⏳ Question timed out. Penalizing player with backward movement.");
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];
    const nextPositionIndex = Math.max(currentPositionIndex - spacesMoved, 0);
    console.log(`
      🚨 Timeout for ${currentPlayer.name}
      Current Position: ${currentPositionIndex}
      Moving Back by: ${spacesMoved} spaces
      New Position: ${nextPositionIndex}
    `);
    movePlayerToken(
      currentPlayer,
      currentPositionIndex,
      nextPositionIndex,
      true,
      () => {
        console.log(`${currentPlayer.name} moved back to position ${nextPositionIndex} after timeout.`);
        playerPositionsRef.current[currentPlayerColor] = nextPositionIndex;
        setPlayerPositions((prev) => ({
          ...prev,
          [currentPlayerColor]: nextPositionIndex,
        }));
        moveToNextPlayer();
      }
    );
  };

  const handleDiceRollComplete = (diceScore: number) => {
    const movingPlayer = players[playerIndexRef.current]; // capture current player
    const currentPlayerColor = movingPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];
    const nextPositionIndex = Math.min(
      currentPositionIndex + diceScore,
      currentRoute.length - 1
    );
    lastMoveRef.current[currentPlayerColor] = diceScore;
    movePlayerToken(
      movingPlayer,
      currentPositionIndex,
      nextPositionIndex,
      false,
      () => {
        playerPositionsRef.current[currentPlayerColor] = nextPositionIndex;
        setPlayerPositions((prev) => ({
          ...prev,
          [currentPlayerColor]: nextPositionIndex,
        }));

        const category = boardPositionCategories[currentRoute[nextPositionIndex]];
        if (category && category === "Roulette") {
          setShowRoulette(true);
          console.log("🎡 Landing on Roulette. Showing the roulette wheel.");
        } else if (category) {
          console.log(`❓ Asking question from category: ${category}`);
          setCurrentQuestionCategory(category);
          selectNextQuestion(category, diceScore);
        } else {
          console.log("🔄 No question required, moving to next player.");
          moveToNextPlayer();
        }
      }
    );
  };

  const handleRollDice = () => {
    const currentPlayer = players[playerIndexRef.current];
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPositionIndex = playerPositionsRef.current[currentPlayerColor];
    if (currentPositionIndex === currentRoute.length - 1) {
      console.log(`${currentPlayer.name} is at the end. Enabling roulette.`);
      setShowRoulette(true);
      return;
    }
    if (!canThrowDice) return;
    const scoreResult = document.querySelector("#score-result");
    if (!scoreResult) {
      console.error("⚠️ Score result element is missing.");
      return;
    }
    setCanThrowDice(false);
    throwDice(scoreResult, (diceScore: number) => {
      console.log(`🎲 Dice roll completed with score: ${diceScore}`);
      setDiceRoll(diceScore);
      handleDiceRollComplete(diceScore);
      setTimeout(() => setCanThrowDice(true), 1000);
    });
  };

  useEffect(() => {
    const currentPlayer = players[playerIndexRef.current];
    if (!currentPlayer) return;
    const currentPlayerColor = currentPlayer.color.toLowerCase();
    const currentRoute = playerRoutes[currentPlayerColor];
    const currentPosition = playerPositionsRef.current[currentPlayerColor];
    if (currentPosition === currentRoute[currentRoute.length - 1]) {
      const latestBadgeCount = playerAnsweredCategories[String(currentPlayer.id)]?.size || 0;
      console.log(
        `Updated win check for ${currentPlayer.name}: position ${currentPosition}, badges ${latestBadgeCount}`
      );
      if (latestBadgeCount >= 6) {
        setWinner(currentPlayer);
        console.log(`🏆 ${currentPlayer.name} wins via updated win check`);
      }
    }
  }, [playerAnsweredCategories, players, playerRoutes]);

  /* useEffect(() => {
    console.log("Updated player badges:", playerAnsweredCategories);
  }, [playerAnsweredCategories]); */

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
    playerAnsweredCategories,
    setPlayerAnsweredCategories,
    handleRouletteSpinComplete,
    handleAnswerComplete,
    handleTimeout,
    fillBadgesForPlayer,
  };
};

export default useGameLogic;
