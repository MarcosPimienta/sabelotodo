import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import "../../styles/GameBoard.css";
import { Player } from "../../types/Player";
import { algorithms, programmingLanguages, webDevelopment, dataBases, devOps, unixSystem } from '../../types/Question';
import { useGameLogic } from "./hooks/useGameLogic";
import { useQuestions } from "./hooks/useQuestion";
import PlayerStats from "./PlayerStats";
import QuestionCategories from "./QuestionCategories";
import PlayerTokens from "./PlayerTokens";
import GameControls from "./GameControls";
import QuestionModal from "./QuestionModal";
import { initDiceSystem } from "../../utils/threeManager";

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

  useEffect(() => {
    if (canvasRef.current && rollBtnRef.current && scoreRef.current) {
      initDiceSystem(
        canvasRef.current,
        scoreRef.current,
        rollBtnRef.current,
        handleDiceRollComplete // Pass the callback here
      );
    } else {
      console.error("Refs are missing:", {
        canvasRef: canvasRef.current,
        rollBtnRef: rollBtnRef.current,
        scoreRef: scoreRef.current,
      });
    }
  }, [canvasRef, rollBtnRef, scoreRef]);

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

      {/* Ensure this is always rendered */}
      <div ref={scoreRef} id="score-result" className="score-controls"></div>
      <canvas ref={canvasRef} id="canvas" className="game-canvas"></canvas>
      <GameControls
        currentPlayer={currentPlayer}
        diceRoll={diceRoll}
        canThrowDice={canThrowDice}
        setCanThrowDice={setCanThrowDice} // Pass setCanThrowDice here
        handleRollDice={handleRollDice}
        rollBtnRef={rollBtnRef}
        scoreRef={scoreRef}
        showRoulette={showRoulette}
        handleRouletteSpinComplete={handleRouletteSpinComplete}
      />
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLeft={timeLeft ?? 0}
        />
      )}
    </div>
  );
};

export default GameBoard;