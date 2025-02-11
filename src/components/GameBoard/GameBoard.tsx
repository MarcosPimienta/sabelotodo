import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/GameBoard.css";
import { Player } from "../../types/Player";
import { useGameLogic } from "./hooks/useGameLogic";
import { useQuestions } from "./hooks/useQuestion";
import PlayerStats from "./PlayerStats";
import QuestionCategories from "./QuestionCategories";
import GameControls from "./GameControls";
import QuestionModal from "./QuestionModal";
import { scene } from '../../utils/dice/scene';
import { initDiceSystem, initPlayerTokens } from "../../utils/threeManager";
import { categoryColors, difficulties, getCategoryQuestions } from "./utils/categories";
import { loadPlayerTokenModel } from "../../utils/player/token";

interface GameBoardProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  setPlayers,
  numberOfPlayers,
}) => {
  const {
    currentQuestion,
    answeredQuestions,
    selectNextQuestion,
    handleAnswer,
    resetQuestions,
    timeLeft,
    setTimeLeft
  } = useQuestions({
    categoryColors,
    difficulties,
    getCategoryQuestions,
    onTimeout: () => {
      // Time ran out. Call game logic’s answer completion with false.
      handleAnswerComplete(false);
    }
  });

  const {
    currentPlayer,
    diceRoll,
    canThrowDice,
    setCanThrowDice,
    handleRollDice,
    handleDiceRollComplete,
    playerPositions,
    winner,
    showRoulette,
    handleRouletteSpinComplete,
    playerAnsweredCategories,
    handleAnswerComplete,
    handleTimeout
  } = useGameLogic(
    players,
    setPlayers,
    numberOfPlayers,
    selectNextQuestion,
    handleAnswer
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rollBtnRef = useRef<HTMLButtonElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  const [xPos, setXPos] = useState(0);
  const [zPos, setZPos] = useState(0);
  const [dummyToken, setDummyToken] = useState<THREE.Object3D | null>(null);

  const toggleDummyToken = (enabled: boolean) => {
    if (enabled) {
      loadPlayerTokenModel("#800080", (dummy: THREE.Object3D ) => { // Purple color
        const dummyToken = dummy.clone();
        dummyToken.scale.set(3, 3, 3);
        dummyToken.position.set(0, 0, 0); // Default position
        scene.add(dummyToken);
        setDummyToken(dummyToken);
      });
    } else if (dummyToken) {
      scene.remove(dummyToken);
      setDummyToken(null);
    }
  };

  const updateDummyTokenPosition = (x: number, z: number) => {
    if (dummyToken) {
      dummyToken.position.set(x, dummyToken.position.y, z);
    }
  };

  useEffect(() => {
    if (canvasRef.current && rollBtnRef.current && scoreRef.current) {
      initDiceSystem(
        canvasRef.current,
        scoreRef.current,
        rollBtnRef.current,
        handleDiceRollComplete // Pass the callback here
      );
      initPlayerTokens(scene, players);
    } else {
      console.error("Refs are missing:", {
        canvasRef: canvasRef.current,
        rollBtnRef: rollBtnRef.current,
        scoreRef: scoreRef.current,
      });
    }
  }, [canvasRef, rollBtnRef, scoreRef]);

  useEffect(() => {
    updateDummyTokenPosition(xPos, zPos);
  }, [xPos, zPos]);

  return (
    <div className="game-container">
      {winner && (
        <div className="winner-modal">
          <h2>Congratulations!</h2>
          <p>Player {winner.name} has won the game!</p>
        </div>
      )}
      <PlayerStats
        players={players}
        playerPositions={playerPositions}
        playerAnsweredCategories={playerAnsweredCategories}
        categoryColors={categoryColors}
      />
      <QuestionCategories
        categoryColors={categoryColors}
        difficulties={difficulties}
        answeredQuestions={answeredQuestions}
        getCategoryQuestions={getCategoryQuestions}
      />

      <div ref={scoreRef} id="score-result" className="score-controls"></div>
      <canvas ref={canvasRef} id="canvas" className="game-canvas"></canvas>
      <GameControls
        currentPlayer={currentPlayer}
        diceRoll={diceRoll}
        canThrowDice={canThrowDice}
        setCanThrowDice={setCanThrowDice}
        handleRollDice={handleRollDice}
        rollBtnRef={rollBtnRef}
        scoreRef={scoreRef}
        showRoulette={showRoulette}
        handleRouletteSpinComplete={handleRouletteSpinComplete}
        toggleDummyToken={toggleDummyToken}
        updateDummyTokenPosition={updateDummyTokenPosition}
      />
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswerComplete}
          timeLeft={timeLeft ?? 0}
        />
      )}
    </div>
  );
};

export default GameBoard;
