import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/GameBoard.css";
import { Player } from "../../types/Player";
import { algorithms, programmingLanguages, webDevelopment, dataBases, devOps, unixSystem } from '../../types/Question';
import { useGameLogic } from "./hooks/useGameLogic";
import { useQuestions } from "./hooks/useQuestion";
import PlayerStats from "./PlayerStats";
import QuestionCategories from "./QuestionCategories";
import GameControls from "./GameControls";
import QuestionModal from "./QuestionModal";
import { scene } from '../../utils/dice/scene';
import { initDiceSystem, initPlayerTokens } from "../../utils/threeManager";
import { loadPlayerTokenModel } from "../../utils/player/token";

interface GameBoardProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
}

const categoryColors = {
  "Algorithms & Data Structures": "#C23334",
  "Programming Languages": "#FFFFFF",
  "Web Development": "#000000",
  "Data Bases": "#447DAB",
  "DevOps & Dev Tools": "#939393",
  "UNIX system terminal": "#208F43",
};

const difficulties = ["easy", "medium", "hard"];

const getCategoryQuestions = (category: string) => {
  switch (category) {
    case 'Algorithms & Data Structures':
      return algorithms;
    case 'Programming Languages':
      return programmingLanguages;
    case 'Web Development':
      return webDevelopment;
    case 'Data Bases':
      return dataBases;
    case 'DevOps & Dev Tools':
      return devOps;
    case 'UNIX system terminal':
      return unixSystem;
    default:
      return [];
  }
};

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  setPlayers,
  numberOfPlayers,
}) => {
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
    timeLeft,
    playerAnsweredCategories,
  } = useGameLogic(players, setPlayers, numberOfPlayers);

  const {
    currentQuestion,
    answeredQuestions,
    selectNextQuestion,
    handleAnswer,
    resetQuestions
  } = useQuestions({
    categoryColors,
    difficulties,
    getCategoryQuestions
  });

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

      loadPlayerTokenModel((tokenModel: any) => {
        const token = tokenModel.clone();
        token.scale.set(10, 10, 10);
        token.position.set(0, 5, 0);
        scene.add(token);
      });
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
          onAnswer={handleAnswer}
          timeLeft={timeLeft ?? 0}
        />
      )}
      {/* Inputs for moving dummy token */}
      <div className="dummy-token-controls">
        <label>
          X Position:
          <input
            type="number"
            value={xPos}
            onChange={(e) => setXPos(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Z Position:
          <input
            type="number"
            value={zPos}
            onChange={(e) => setZPos(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default GameBoard;