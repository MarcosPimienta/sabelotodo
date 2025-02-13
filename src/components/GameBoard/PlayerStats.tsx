import React from "react";
import { Player } from "../../types/Player";

interface PlayerStatsProps {
  players: Player[];
  playerPositions: { [key: string]: number };
  playerAnsweredCategories: { [key: string]: Set<string> };
  categoryColors: { [key: string]: string };
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  players,
  playerPositions,
  playerAnsweredCategories,
  categoryColors,
}) => (
  <div className="player-stats">
    {players.map((player) => (
      <div key={player.id} className="player-stat">
        <p>{player.name}</p>
        <div className="categories">
          {Array.from(playerAnsweredCategories[player.id] || []).map((category) => (
            <span
              key={category}
              className="category-square"
              style={{ backgroundColor: categoryColors[category] }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default PlayerStats;