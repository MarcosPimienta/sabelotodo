// src/components/RouletteWheel.tsx
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

  const spinWheel = () => {
    setSpinning(true);
    const randomAngle = Math.floor(Math.random() * 360) + 3600; // 10 full rotations + random angle
    setRotation(randomAngle);

    setTimeout(() => {
      setSpinning(false);
      const finalAngle = randomAngle % 360;
      const categoryIndex = Math.floor(finalAngle / 60); // 360 degrees divided by 6 sections (60 degrees each)
      const selectedCategory = categories[categoryIndex];
      setSelectedCategory(selectedCategory);
      onSpinComplete(selectedCategory);
    }, 3000); // Spin for 3 seconds
  };

  return (
    <div className="roulette-modal">
      <div className="roulette-wheel">
        <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rotation}deg)` }} />
        <button onClick={spinWheel} disabled={spinning}>
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
