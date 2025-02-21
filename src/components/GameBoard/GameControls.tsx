import React, { useState, useEffect } from "react";
import "../../styles/GameControls.css";
import RouletteWheel from "../RouletteWheel";
import WinnerModal from "./WinnerModal";
import { Player } from "../../types/Player";

interface GameControlsProps {
  currentPlayer: any;
  diceRoll: number | null;
  canThrowDice: boolean;
  setCanThrowDice: React.Dispatch<React.SetStateAction<boolean>>;
  handleRollDice: () => void;
  rollBtnRef: React.RefObject<HTMLButtonElement>;
  scoreRef: React.RefObject<HTMLDivElement>;
  showRoulette: boolean;
  handleRouletteSpinComplete: (category: string) => void;
  toggleDummyToken: (enabled: boolean) => void;
  updateDummyTokenPosition: (x: number, z: number) => void;
  fillBadgesForPlayer: (playerId: number) => void;
  winner: Player | null;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  diceRoll,
  canThrowDice,
  setCanThrowDice,
  handleRollDice,
  rollBtnRef,
  scoreRef,
  showRoulette,
  handleRouletteSpinComplete,
  toggleDummyToken,
  updateDummyTokenPosition,
  fillBadgesForPlayer,
  winner,
}) => {
  const [isDummyEnabled, setIsDummyEnabled] = useState(false);
  const [dummyX, setDummyX] = useState(0);
  const [dummyZ, setDummyZ] = useState(0);
  const playerColorHex: { [key: string]: string } = {
    red: '#C23334',
    white: '#FFFFFF',
    black: '#000000',
    blue: '#447DAB',
    gray: '#939393',
    green: '#208F43'
  };
  const currentPlayerColor = currentPlayer ? playerColorHex[currentPlayer.color] : '#FFFFFF';
  const currentPlayerStyle = {
    background: `repeating-linear-gradient(
      45deg,
      transparent 25px,
      transparent 25px,
      ${currentPlayerColor} 16px,
      #999 30px
    ),
    linear-gradient(
      to bottom,
      #eee,
      #999
    )`
  };

  useEffect(() => {
    if (!rollBtnRef.current) {
      console.error("rollBtnRef is null in GameControls.");
    }
  }, [rollBtnRef]);

  const handleToggleDummy = () => {
    setIsDummyEnabled(!isDummyEnabled);
    toggleDummyToken(!isDummyEnabled);
  };

  const handlePositionChange = (axis: "x" | "z", value: number) => {
    if (axis === "x") {
      setDummyX(value);
      updateDummyTokenPosition(value, dummyZ);
    } else {
      setDummyZ(value);
      updateDummyTokenPosition(dummyX, value);
    }
  };

  return (
    <div className="game-controls">
      {/* WinnerModal rendered within GameControls */}
      {winner && <WinnerModal winner={winner} />}
      <div className="current-player" style={currentPlayerStyle} data-augmented-ui="tl-clip br-clip border">
        <p
          className="player-text"
          style={currentPlayer.color === 'white' ? { color: '#000000'} : { color: '#ffffff'}}
          >Current Player: {currentPlayer.name}
        </p>
      </div>
      {!winner && canThrowDice && (
        <button
          className="dice-btn"
          ref={rollBtnRef}
          onClick={() => {
            handleRollDice();
            setTimeout(() => setCanThrowDice(true), 500);
          }}
        >
        </button>
      )}
      {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
      {/* <label>
        Enable Dummy Token:
        <input
          type="checkbox"
          checked={isDummyEnabled}
          onChange={handleToggleDummy}
        />
      </label>
      {isDummyEnabled && (
        <div className="dummy-token-controls">
          <label>
            X Pos:
            <input
              type="number"
              value={dummyX}
              onChange={(e) =>
                handlePositionChange("x", Number(e.target.value))
              }
            />
          </label>
          <label>
            Z Pos:
            <input
              type="number"
              value={dummyZ}
              onChange={(e) =>
                handlePositionChange("z", Number(e.target.value))
              }
            />
          </label>
        </div>
      )} */}
      {/* Debug Button: Fill badges and force win check */}
      {/* <button
        className="debug-btn"
        onClick={() => {
          console.log("DEBUG: Current player id:", currentPlayer.name);
          console.log("DEBUG: Filling badges for player", currentPlayer.name);
          fillBadgesForPlayer(currentPlayer.id);
        }}
      >
        Debug: Fill Badges & Check Win
      </button> */}
      {showRoulette && (
        <>
          {console.log("Showing Roulette Wheel")}
          <RouletteWheel onSpinComplete={handleRouletteSpinComplete} />
        </>
      )}
    </div>
  );
};

export default GameControls;
