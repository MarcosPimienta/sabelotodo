// src/components/NewGameSetup.tsx
import React, { useState, useEffect } from 'react';
import '../styles/NewGameSetup.css';
import { Player } from '../types/Player';

interface NewGameSetupProps {
  onSetupComplete: (players: Player[]) => void;
}

const possibleColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const NewGameSetup: React.FC<NewGameSetupProps> = ({ onSetupComplete }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

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

  const handleDiceRoll = (index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].diceRoll = Math.floor(Math.random() * 6) + 1;
    setPlayers(updatedPlayers);
  };

  const handleColorChange = (index: number, color: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].color = color;
    setPlayers(updatedPlayers);
  };

  const validateStep2 = () => {
    if (players.some(player => player.name === '' || player.diceRoll === 0)) {
      setWarningMessage('All players must enter their names and roll the dice.');
    } else {
      setWarningMessage(null);
      setCurrentStep(3);
    }
  };

  const validateStep3 = () => {
    if (players.some(player => player.color === '')) {
      setWarningMessage('All players must select a unique route.');
    } else {
      setWarningMessage(null);
      handleStartGame();
    }
  };

  const handleStartGame = () => {
    let sortedPlayers = [...players].sort((a, b) => b.diceRoll - a.diceRoll);

    // Check for ties and re-roll if necessary
    let hasTies = true;
    while (hasTies) {
      hasTies = false;
      for (let i = 0; i < sortedPlayers.length - 1; i++) {
        if (sortedPlayers[i].diceRoll === sortedPlayers[i + 1].diceRoll) {
          handleDiceRoll(i);
          handleDiceRoll(i + 1);
          sortedPlayers = [...players].sort((a, b) => b.diceRoll - a.diceRoll);
          hasTies = true;
        }
      }
    }

    onSetupComplete(sortedPlayers);
  };

  return (
    <div className="new-game-setup">
      {currentStep === 1 && (
        <div>
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
        <div>
          <h2>Enter Player Names and Roll Dice</h2>
          {players.map((player, index) => (
            <div key={index} className="player-setup">
              <label>Player {index + 1} Name:</label>
              <input type="text" value={player.name} onChange={(e) => handlePlayerNameChange(index, e.target.value)} />
              <button onClick={() => handleDiceRoll(index)}>Roll Dice</button>
              <span>{player.diceRoll > 0 ? `Dice Roll: ${player.diceRoll}` : ''}</span>
            </div>
          ))}
          {warningMessage && <p className="warning">{warningMessage}</p>}
          <button onClick={validateStep2} disabled={!players.every(player => player.name !== '' && player.diceRoll > 0)}>Next</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
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
          {warningMessage && <p className="warning">{warningMessage}</p>}
          <button onClick={validateStep3} disabled={!players.every(player => player.color !== '')}>Start Game</button>
        </div>
      )}
    </div>
  );
};

export default NewGameSetup;
