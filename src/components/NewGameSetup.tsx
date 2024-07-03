// src/components/NewGameSetup.tsx
import React, { useState, useEffect } from 'react';
import '../styles/NewGameSetup.css';
interface Player {
  id: number;
  name: string;
  diceRoll: number;
}

interface NewGameSetupProps {
  onSetupComplete: (players: Player[]) => void;
}

const NewGameSetup: React.FC<NewGameSetupProps> = ({ onSetupComplete }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setPlayers(new Array(numberOfPlayers).fill(null).map((_, index) => ({ id: index + 1, name: '', diceRoll: 0 })));
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
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
    </div>
  );
};

export default NewGameSetup;