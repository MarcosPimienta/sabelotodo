// src/components/RouletteWheel.tsx
import React, { useState } from 'react';
import '../styles/RouletteWheel.css';

const categories = [
  'Algorithms & Data Structures',
  'Programming Languages',
  'Web Development',
  'Data Bases',
  'DevOps & Dev Tools',
  'UNIX system terminal'
];

interface RouletteWheelProps {
  onSpinComplete: (category: string) => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ onSpinComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const spinWheel = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * categories.length);
    const selectedCategory = categories[randomIndex];
    setSelectedCategory(selectedCategory);

    setTimeout(() => {
      setSpinning(false);
      onSpinComplete(selectedCategory);
    }, 3000); // Spin for 3 seconds
  };

  return (
    <div className="roulette-wheel">
      <button onClick={spinWheel} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
      {selectedCategory && !spinning && (
        <p>Selected Category: {selectedCategory}</p>
      )}
    </div>
  );
};

export default RouletteWheel;
