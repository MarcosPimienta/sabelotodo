import React, { useEffect } from "react";
import { Player } from "../../types/Player";
import { BoardCoordinates } from "../../types/BoardCoordinates";
import { loadPlayerTokenModel } from "../../utils/threeManager";
import { scene } from "../../utils/dice/scene";
import { Object3D } from "three";

interface PlayerTokensProps {
  players: Player[];
  playerPositions: { [key: number]: number };
}

const PlayerTokens: React.FC<PlayerTokensProps> = ({ players, playerPositions }) => {
  useEffect(() => {
    // Load 3D player tokens and place them on the board
    loadPlayerTokenModel((tokenModel: Object3D) => {
      players.forEach((player) => {
        const playerToken = tokenModel.clone();
        const initialPosition = BoardCoordinates[playerPositions[player.id] || 1];
        playerToken.position.set(initialPosition.x, 0, initialPosition.z); // Adjust Y if needed
        player.token3D = playerToken; // Store the 3D token in the player object
        scene.add(playerToken); // Add the token to the Three.js scene
      });
    });
  }, [players, playerPositions]);

  useEffect(() => {
    // Update player token positions when playerPositions changes
    players.forEach((player) => {
      const playerToken = player.token3D;
      if (playerToken) {
        const newPosition = BoardCoordinates[playerPositions[player.id] || 1];
        playerToken.position.set(newPosition.x, 0, newPosition.z); // Adjust Y if needed
      }
    });
  }, [playerPositions, players]);

  return null; // This component only interacts with the Three.js scene
};

export default PlayerTokens;
