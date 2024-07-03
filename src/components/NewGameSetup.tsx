import React, { useState } from 'react';
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

  const handleNumberOfPlayersChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfPlayers(parseInt(event.target.value, 10));
    setPlayers(new Array(parseInt(event.target.value, 10)).fill(null).map((_, index) => ({ id: index + 1, name: '', diceRoll: 0 })));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  const handleDiceRoll = () => {
    const updatedPlayers = players.map(player => ({ ...player, diceRoll: Math.floor(Math.random() * 6) + 1 }));
    setPlayers(updatedPlayers);
    setCurrentStep(3);
  };

  const handleStartGame = () => {
    const sortedPlayers = [...players].sort((a, b) => b.diceRoll - a.diceRoll);
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
          <h2>Enter Player Names</h2>
          {players.map((player, index) => (
            <div key={index}>
              <label>Player {index + 1} Name:</label>
              <input type="text" value={player.name} onChange={(e) => handlePlayerNameChange(index, e.target.value)} />
            </div>
          ))}
          <button onClick={handleDiceRoll}>Decide Order</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Player Order</h2>
          <ul>
            {players.map(player => (
              <li key={player.id}>{player.name}: Dice Roll {player.diceRoll}</li>
            ))}
          </ul>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
    </div>
  );
};

export default NewGameSetup;