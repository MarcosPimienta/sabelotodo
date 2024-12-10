import React from "react";

const GameControls: React.FC<{
  currentPlayer: any;
  diceRoll: number | null;
  canThrowDice: boolean;
  setCanThrowDice: React.Dispatch<React.SetStateAction<boolean>>; // Add setCanThrowDice
  handleRollDice: () => void;
  rollBtnRef: React.RefObject<HTMLButtonElement>;
  scoreRef: React.RefObject<HTMLDivElement>;
  showRoulette: boolean;
  handleRouletteSpinComplete: (category: string) => void;
}> = ({ currentPlayer, diceRoll, canThrowDice, setCanThrowDice, handleRollDice, rollBtnRef, showRoulette }) => {
  React.useEffect(() => {
    if (!rollBtnRef.current) {
      console.error("rollBtnRef is null in GameControls.");
    }
  }, [rollBtnRef]);

  return (
    <div className="game-controls">
      <p>Current Player: {currentPlayer.name}</p>
      {canThrowDice && (
        <button
          className="dice-btn"
          ref={rollBtnRef}
          onClick={() => {
            handleRollDice();
            setTimeout(() => {
              // Re-enable the button after the dice roll
              setCanThrowDice(true);
            }, 1000); // Adjust delay as needed
          }}
        >
        </button>
      )}
      {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
    </div>
  );
};

export default GameControls;
