import { initScene, scene, updateSceneSize } from './dice/scene';
import { initPhysics } from './dice/physics';
import { createFloor } from './dice/floor';
import { loadDiceModel, createDice, throwDice } from './dice/dice';
import { loadPlayerTokenModel } from './player/token';
import { render } from './dice/render';

export const initDiceSystem = (
  canvasEl,
  scoreResult,
  rollBtn,
  onRollComplete
) => {
  console.log('Initializing Dice System...');
  const physicsWorld = initPhysics(); // Initialize physics
  initScene(canvasEl); // Initialize scene
  console.log('Scene initialized.');

  // Load the floor
  console.log('Adding floor...');
  createFloor(scene, physicsWorld); // Add floor to scene and physics

  const diceArray = []; // Declare diceArray in the correct scope

  loadDiceModel(() => {
    console.log('Dice model loaded.');
    for (let i = 0; i < 1; i++) {
      const dice = createDice(scene, physicsWorld);
      if (dice) {
        diceArray.push(dice); // Ensure dice is added to the array
      }
    }
    console.log('DiceArray after creation:', diceArray);

    rollBtn.addEventListener('click', () => {
      console.log('Dice roll triggered.');
      if (diceArray.length > 0) {
        throwDice(diceArray, physicsWorld, onRollComplete); // Pass diceArray to throwDice
      } else {
        console.error('No dice available to roll!');
      }
    });

    render(diceArray); // Start rendering
    console.log('Rendering started.');
  });

  loadPlayerTokenModel((model) => {
    console.log('Player token model loaded:', model);
  });

  window.addEventListener('resize', updateSceneSize);
};

export function initPlayerTokens(scene, players) {
  players.forEach((player, index) => {
    const playerColor = player.color; // Ensure the color is available from the player object

    loadPlayerTokenModel(playerColor, (tokenModel) => {
      const playerToken = tokenModel.clone();

      // Adjust token scale for visibility
      playerToken.scale.set(3, 3, 3);

      // Calculate dynamic starting positions based on player index or board coordinates
      const initialPosition = { x: index * 10, y: 0, z: 0 };
      playerToken.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z
      );

      // Debug: Log token position and color
      console.log(
        `Player ${player.name} token position:`,
        playerToken.position,
        'Color:',
        playerColor
      );

      // Add token to the scene
      scene.add(playerToken);

      // Attach token to the player object
      player.token3D = playerToken;
    });
  });
}

export { loadPlayerTokenModel, throwDice };
