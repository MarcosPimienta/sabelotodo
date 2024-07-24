import React, { useState } from 'react';
import '../styles/RouletteWheel.css';

const categories = [
  'Algorithms & Data Structures', // Red
  'Programming Languages',        // White
  'Web Development',              // Black
  'Data Bases',                   // Blue
  'DevOps & Dev Tools',           // Gray
  'UNIX system terminal'          // Green
];

interface RouletteWheelProps {
  onSpinComplete: (category: string) => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ onSpinComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rotation, setRotation] = useState(0);
  const [finalAngle, setFinalAngle] = useState(0);

  const spinWheel = () => {
    setSpinning(true);
    const randomAngle = Math.floor(Math.random() * 360) + 3600; // 10 full rotations + random angle
    setRotation(randomAngle);

    setTimeout(() => {
      setSpinning(false);
      const finalAngle = randomAngle % 360; // Calculate the final angle after the spin
      setFinalAngle(finalAngle);
      const categoryIndex = Math.floor((360 - finalAngle) / 60); // Determine which 60-degree section the final angle falls into
      const selectedCategory = categories[categoryIndex];
      setSelectedCategory(selectedCategory);

      // Wait for 4 seconds before proceeding to the question phase
      setTimeout(() => {
        onSpinComplete(selectedCategory);
      }, 4000);
    }, 3000); // Spin for 3 seconds
  };

  return (
    <div className="roulette-modal" data-augmented-ui="tr-clip-x bl-clip border">
      <div className="roulette-wheel">
        <div className="wheel-container">
          <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rotation}deg)` }} />
          <div className="arrow-marker" />
        </div>
        <button onClick={spinWheel} disabled={spinning} data-augmented-ui="bl-clip br-clip">
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
        {selectedCategory && !spinning && (
          <p>Selected Category: {selectedCategory}</p>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel;
