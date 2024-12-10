import { renderer, scene, camera, controls } from './scene.js';
import { physicsWorld } from './physics.js';

export function render(diceArray) {
  if (!scene || !camera || !renderer) {
    console.error('Render failed: Scene, camera, or renderer not initialized.');
    return;
  }
  physicsWorld.fixedStep();
  diceArray.forEach((dice) => {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(() => render(diceArray));
}
