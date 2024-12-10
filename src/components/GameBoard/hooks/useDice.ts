import { throwDice } from "../../../utils/threeManager";

export const useDice = (onRollComplete: (score: number) => void) => {
  const rollDice = () => {
    throwDice();
    // Simulate dice roll result for demonstration
    const simulatedScore = Math.floor(Math.random() * 6) + 1;
    onRollComplete(simulatedScore);
  };

  return { rollDice };
};
