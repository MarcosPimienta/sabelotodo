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

      <p>Current Player: {currentPlayer.name}</p>
      {canThrowDice && (
        <button
          className="dice-btn"
          ref={rollBtnRef}
          onClick={() => {
            handleRollDice();
            setTimeout(() => setCanThrowDice(true), 500);
          }}
        >
          Roll Dice
        </button>
      )}
      {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
      <label>
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
      )}
      {/* Debug Button: Fill badges and force win check */}
      <button
        className="debug-btn"
        onClick={() => {
          console.log("DEBUG: Current player id:", currentPlayer.name);
          console.log("DEBUG: Filling badges for player", currentPlayer.name);
          fillBadgesForPlayer(currentPlayer.id);
        }}
      >
        Debug: Fill Badges & Check Win
      </button>
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
