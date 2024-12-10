import { Object3D } from 'three';

export interface Player {
  id: number;
  name: string;
  position: number;
  diceRoll: number;
  color: string; // Add this line
  token3D?: Object3D | null;
}
