import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createPlayerMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.5,
    roughness: 0.6,
  });
}

export function loadPlayerTokenModel(playerColor = '#FFFFFF', callback) {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to loadPlayerTokenModel.');
    return;
  }

  const loader = new GLTFLoader();
  loader.load(
    `${process.env.PUBLIC_URL}/3d-models/Pawn.glb`, // Ensure the path to the GLB file is correct
    (gltf) => {
      const tokenModel = gltf.scene;

      // Create material dynamically based on the player's color
      const material = new THREE.MeshStandardMaterial({ color: playerColor });

      tokenModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true; // Allow the token to cast shadows
          node.material = material; // Assign the material
        }
      });

      // Debug: Log tokenModel details to ensure it loads correctly
      console.log('Player Token Model Loaded:', tokenModel);

      callback(tokenModel);
    },
    undefined,
    (error) => {
      console.error('Error loading player token model:', error);
    }
  );
}
