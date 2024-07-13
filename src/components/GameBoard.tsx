import React, { useState, useEffect } from 'react';
import '../styles/GameBoard.css';
import { Player } from '../types/Player';
import { playerRoutes } from '../types/PlayerRoutes';
import { predefinedCoordinates, BoardCoordinates } from '../types/BoardCoordinates';
import { boardPositionCategories } from '../types/BoardPositionCategories';
import { Question, algorithms, programmingLanguages, webDevelopment, dataBases, devOps, unixSystem } from '../types/Question';
import QuestionCard from './QuestionCard';
import RouletteWheel from './RouletteWheel';

interface GameBoardProps {
  players: Player[];
}

const categoryColors: { [key: string]: string } = {
  'Algorithms & Data Structures': 'red',
  'Programming Languages': 'white',
  'Web Development': 'black',
  'Data Bases': 'blue',
  'DevOps & Dev Tools': 'gray',
  'UNIX system terminal': 'green'
};

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ [key: number]: number }>({});
  const [showRoulette, setShowRoulette] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [playerAnsweredCategories, setPlayerAnsweredCategories] = useState<{ [key: number]: Set<string> }>({});
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    // Initialize player positions to starting positions
    const initialPositions: { [key: number]: number } = {};
    const initialCategories: { [key: number]: Set<string> } = {};
    players.forEach((player) => {
      initialPositions[player.id] = 1; // Starting at position 1 in their route
      initialCategories[player.id] = new Set(); // Initialize answered categories
    });
    setPlayerPositions(initialPositions);
    setPlayerAnsweredCategories(initialCategories);
  }, [players]);

  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    movePlayer(roll);
  };

  const movePlayer = (steps: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let currentPosition = playerPositions[currentPlayer.id] || 1;
    const playerRoute = playerRoutes[currentPlayer.color];
    const newIndex = playerRoute.indexOf(currentPosition) + steps;
    currentPosition = playerRoute[newIndex] || playerRoute[playerRoute.length - 1];
    const updatedPlayerPositions = { ...playerPositions, [currentPlayer.id]: currentPosition };
    setPlayerPositions(updatedPlayerPositions);

    if (currentPosition === 0) {
      checkWinCondition(currentPlayer.id);
    } else {
      const category = boardPositionCategories[currentPosition];
      if (category === 'Roulete') {
        setShowRoulette(true);
      } else {
        askQuestion(category);
      }
    }
  };

  const askQuestion = (category: string) => {
    const categoryQuestions = getCategoryQuestions(category);
    const availableQuestions = categoryQuestions.filter(q => !answeredQuestions.has(q.id));
    if (availableQuestions.length > 0) {
      const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(question);
    } else {
      setCurrentQuestion(null);
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }
  };

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

  const handleRouletteSpinComplete = (category: string) => {
    setShowRoulette(false);
    askQuestion(category);
  };

  const handleAnswer = (correct: boolean) => {
    const currentPlayer = players[currentPlayerIndex];
    const playerId = currentPlayer.id;
    if (currentQuestion) {
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
      if (correct) {
        const updatedAnsweredCategories = new Set(playerAnsweredCategories[playerId]);
        updatedAnsweredCategories.add(currentQuestion.category);
        setPlayerAnsweredCategories(prev => ({ ...prev, [playerId]: updatedAnsweredCategories }));
        checkWinCondition(playerId);
      } else {
        const currentPosition = playerPositions[playerId];
        const playerRoute = playerRoutes[currentPlayer.color];
        const currentIndex = playerRoute.indexOf(currentPosition);
        const updatedPlayerPositions = { ...playerPositions, [playerId]: playerRoute[Math.max(currentIndex - diceRoll, 0)] };
        setPlayerPositions(updatedPlayerPositions);
      }
    }
    setCurrentQuestion(null);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setDiceRoll(0);
  };

  const checkWinCondition = (playerId: number) => {
    const currentPlayer = players.find(player => player.id === playerId);
    if (currentPlayer) {
      const playerRoute = playerRoutes[currentPlayer.color];
      const playerCategories = playerAnsweredCategories[playerId];
      if (playerPositions[playerId] === 0 && playerCategories && playerCategories.size >= 6) {
        setWinner(currentPlayer);
      }
    }
  };

  return (
    <div className="game-container">
      {winner && <div className="winner-message">Player {winner.name} has won the game!</div>}
      <div className="player-stats">
        <h3>Player Stats</h3>
        {players.map((player) => (
          <div key={player.id} className="player-stat">
            <span className={`player-token ${player.color}`}>{player.name}</span>
            <span>Position: {playerPositions[player.id]}</span>
            <div className="categories">
              {playerAnsweredCategories[player.id] && Array.from(playerAnsweredCategories[player.id]).map(category => (
                <span
                  key={category}
                  className="category-square"
                  style={{ backgroundColor: categoryColors[category] }}
                  title={category}
                ></span>
              ))}
            </div>
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
      </div>
      <div className="game-controls">
        <p>Current Player: {players[currentPlayerIndex].name}</p>
        {!currentQuestion && !showRoulette && <button onClick={handleDiceRoll}>Roll Dice</button>}
        {diceRoll > 0 && <p>Dice Roll: {diceRoll}</p>}
      </div>
      {showRoulette && <RouletteWheel onSpinComplete={handleRouletteSpinComplete} />}
      {currentQuestion && (
        <div className="question-modal">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
