import React, { useState, useEffect, useRef } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';
import { playerRoutes } from '../types/PlayerRoutes';
import { predefinedCoordinates, BoardCoordinates } from '../types/BoardCoordinates';
import { boardPositionCategories } from '../types/BoardPositionCategories';
import { Question, questions } from '../types/Question';
import QuestionCard from './QuestionCard';
import { initDiceSystem, throwDice } from '../utils/diceSystem';

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const rollBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize player positions to starting positions
    const initialPositions: { [key: number]: number } = {};
    players.forEach((player) => {
      initialPositions[player.id] = 1; // All players start at the first position of their routes
    });
    setPlayerPositions(initialPositions);
  }, [players]);

  useEffect(() => {
    if (canvasRef.current && scoreRef.current && rollBtnRef.current) {
      initDiceSystem(canvasRef.current, scoreRef.current, rollBtnRef.current, handleDiceRollComplete);
    }
  }, []);

  const handleDiceRollComplete = (score: number) => {
    setDiceRoll(score);
    movePlayer(score);
  };

  const movePlayer = (steps: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let currentPosition = playerPositions[currentPlayer.id] || 1;
    const playerRoute = playerRoutes[currentPlayer.color];
    const newIndex = playerRoute.indexOf(currentPosition) + steps;
    currentPosition = playerRoute[newIndex] || playerRoute[playerRoute.length - 1];
    const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: currentPosition };
    setPlayerPositions(updatedPlayerPositions);

    const category = boardPositionCategories[currentPosition];
    const categoryQuestions = questions.filter(q => q.category === category);
    const availableQuestions = categoryQuestions.filter(q => !answeredQuestions.has(q.id));

    if (availableQuestions.length > 0) {
      const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(question);
    } else {
      setCurrentQuestion(null);
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (currentQuestion) {
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
    }
    if (!correct) {
      const currentPlayer = players[currentPlayerIndex];
      const currentPosition = playerPositions[currentPlayer.id];
      const playerRoute = playerRoutes[currentPlayer.color];
      const currentIndex = playerRoute.indexOf(currentPosition);
      const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: playerRoute[Math.max(currentIndex - diceRoll, 0)] };
      setPlayerPositions(updatedPlayerPositions);
    }
    setCurrentQuestion(null);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setDiceRoll(0);
  };

  const handleRollDice = () => {
    throwDice();
  };

  return (
    <div className="game-container">
      <div className="player-stats">
        <h3>Player Stats</h3>
        {players.map((player) => (
          <div key={player.id} className="player-stat">
            <span className={`player-token ${player.color}`}>{player.name}</span>
            <span>Position: {playerPositions[player.id]}</span>
          </div>
        ))}
      </div>
      <div className="game-board">
        {players.map((player) => {
          const position = playerPositions[player.id] || 1;
          const coordinates = position === 1 ? predefinedCoordinates[player.color] : BoardCoordinates[position];
          return (
            <div key={player.id} className="player-container" style={{ transform: `translate(${coordinates.x}px, ${coordinates.y}px)` }}>
              <div className="player-coordinates">
                X: {coordinates.x}, Y: {coordinates.y}
              </div>
              <div className={`player-token ${player.color}`}>
                {player.name}
              </div>
            </div>
          );
        })}
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
      <div className="game-controls">
        <p>Current Player: {players[currentPlayerIndex].name}</p>
        {!currentQuestion && <button ref={rollBtnRef} onClick={handleRollDice}>Roll Dice</button>}
        {diceRoll > 0 && <p>Dice Roll: {diceRoll}</p>}
        <div ref={scoreRef} id="score-result"></div>
      </div>
      {currentQuestion && (
        <div className="question-modal">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
