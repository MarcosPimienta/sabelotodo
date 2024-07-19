import React, { useState, useEffect } from 'react';
import '../styles/NewGameSetup.css';
import { Player } from '../types/Player';

interface NewGameSetupProps {
  onSetupComplete: (players: Player[]) => void;
}

const possibleColors = ['red', 'blue', 'green', 'white', 'gray', 'black'];

const NewGameSetup: React.FC<NewGameSetupProps> = ({ onSetupComplete }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setPlayers(new Array(numberOfPlayers).fill(null).map((_, index) => ({
      id: index + 1,
      name: '',
      diceRoll: 0,
      position: 0,
      color: ''
    })));
  }, [numberOfPlayers]);

  const handleNumberOfPlayersChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfPlayers(parseInt(event.target.value, 10));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  const randomizePlayersOrder = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    setPlayers(shuffledPlayers);
  };

  const handleColorChange = (index: number, color: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].color = color;
    setPlayers(updatedPlayers);
  };

  const validateStep2 = () => {
    setCurrentStep(3);
  };

  const validateStep3 = () => {
    handleStartGame();
  };

  const handleStartGame = () => {
    onSetupComplete(players);
  };

  return (
    <div className="new-game-background">
      <div className="new-game-setup">
        {currentStep === 1 && (
          <div className="setup-step centered-column">
            <h2>Select Number of Players</h2>
            <select value={numberOfPlayers} onChange={handleNumberOfPlayersChange}>
              {[...Array(5)].map((_, i) => (
                <option key={i + 2} value={i + 2}>{i + 2}</option>
              ))}
            </select>
            <button onClick={() => setCurrentStep(2)}>Next</button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="setup-step centered-column">
            <h2>Enter Player Names and Randomize Order</h2>
            <div className="players-list">
              {players.map((player, index) => (
                <div key={index} className="player-setup">
                  <label>Player {index + 1} Name:</label>
                  <input type="text" value={player.name} onChange={(e) => handlePlayerNameChange(index, e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={randomizePlayersOrder} disabled={!players.every(player => player.name !== '')}>Randomize</button>
            <button onClick={validateStep2}>Next</button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="setup-step centered-column">
            <h2>Select Starting Route</h2>
            {players.map((player, index) => (
              <div key={index} className="player-setup">
                <label>Player {player.name}'s Route:</label>
                {possibleColors.map((color) => (
                  <label key={color}>
                    <input
                      type="radio"
                      name={`color-${index}`}
                      value={color}
                      checked={player.color === color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      disabled={players.some(p => p.color === color && p !== player)}
                    />
                    {color}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={validateStep3} disabled={!players.every(player => player.color !== '')}>Start Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewGameSetup;
