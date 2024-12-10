import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadPlayerTokenModel(callback) {
  const loader = new GLTFLoader();
  loader.load('/3d-models/Pawn.glb', (gltf) => {
    const tokenModel = gltf.scene;
    tokenModel.traverse((node) => {
      if (node.isMesh) node.castShadow = true;
    });
    callback(tokenModel);
  });
}
