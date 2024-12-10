import React from "react";
import { Player } from "../../types/Player";

const PlayerStats: React.FC<{
  players: Player[];
  playerPositions: { [key: number]: number };
  playerAnsweredCategories: { [key: number]: Set<string> };
  categoryColors: { [key: string]: string };
}> = ({ players, playerPositions, playerAnsweredCategories, categoryColors }) => (
  <div className="player-stats">
    {players.map((player) => (
      <div key={player.id}>
        <p>{player.name}</p>
        <div className="categories">
          {Array.from(playerAnsweredCategories[player.id] || []).map((category) => (
            <span key={category} style={{ backgroundColor: categoryColors[category] }}>
              {category}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default PlayerStats;
