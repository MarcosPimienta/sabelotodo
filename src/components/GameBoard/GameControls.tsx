import React, { useState } from "react";
import "../../styles/GameControls.css";

const GameControls: React.FC<{
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
}> = ({
  currentPlayer,
  diceRoll,
  canThrowDice,
  setCanThrowDice,
  handleRollDice,
  rollBtnRef,
  showRoulette,
  toggleDummyToken,
  updateDummyTokenPosition,
}) => {
  const [isDummyEnabled, setIsDummyEnabled] = useState(false);
  const [dummyX, setDummyX] = useState(0);
  const [dummyZ, setDummyZ] = useState(0);

  React.useEffect(() => {
    if (!rollBtnRef.current) {
      console.error("rollBtnRef is null in GameControls.");
    }
  }, [rollBtnRef]);

  const handleToggleDummy = () => {
    setIsDummyEnabled(!isDummyEnabled);
    toggleDummyToken(!isDummyEnabled); // Notify parent to show/hide dummy token
  };

  const handlePositionChange = (axis: "x" | "z", value: number) => {
    if (axis === "x") {
      setDummyX(value);
      updateDummyTokenPosition(value, dummyZ); // Update parent with new X value
    } else {
      setDummyZ(value);
      updateDummyTokenPosition(dummyX, value); // Update parent with new Z value
    }
  };

  return (
    <div className="game-controls">
      <p>Current Player: {currentPlayer.name}</p>
      {canThrowDice && (
        <button
          className="dice-btn"
          ref={rollBtnRef}
          onClick={() => {
            handleRollDice();
            setTimeout(() => setCanThrowDice(true), 500); // Adjust delay
          }}
        >
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
              onChange={(e) => handlePositionChange("x", Number(e.target.value))}
            />
          </label>
          <label>
            Z Pos:
            <input
              type="number"
              value={dummyZ}
              onChange={(e) => handlePositionChange("z", Number(e.target.value))}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default GameControls;
