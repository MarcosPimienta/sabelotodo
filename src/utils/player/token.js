import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadPlayerTokenModel(callback) {
  const loader = new GLTFLoader();
  loader.load(
    '/3d-models/Pawn.glb', // Ensure the path to the GLB file is correct
    (gltf) => {
      const tokenModel = gltf.scene;
      tokenModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true; // Allow the token to cast shadows
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
