import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let diceModel = null;
let diceArray = []; // Store all dice globally
let diceHasBeenThrown = false; // Global flag to track dice roll state

export function loadDiceModel(callback) {
  const loader = new GLTFLoader();
  loader.load(
    `${process.env.PUBLIC_URL}/3d-models/BlackDice.glb`,
    (gltf) => {
      diceModel = gltf.scene;
      diceModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });
      console.log('Dice model loaded:', diceModel);
      callback(diceModel);
    },
    undefined,
    (error) => {
      console.error('Error loading dice model:', error);
    }
  );
}

export function createDice(scene, physicsWorld) {
  if (!diceModel) {
    console.error('Dice model not loaded!');
    return null;
  }

  const diceMesh = diceModel.clone();
  diceMesh.scale.set(6, 6, 6); // Adjust scale as needed
  diceMesh.castShadow = true;
  scene.add(diceMesh);

  const diceBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // Adjust to match dice size
  });
  diceBody.position.set(0, 5, 0); // Initial position
  physicsWorld.addBody(diceBody);

  const dice = { mesh: diceMesh, body: diceBody };
  diceArray.push(dice);

  return dice;
}

function addDiceEvents(dice, scoreResult, onRollComplete) {
  console.log('Adding events to dice:', dice, 'Score result:', scoreResult);
  if (typeof onRollComplete !== 'function') {
    console.error('onRollComplete is not a function:', onRollComplete);
    return;
  }

  dice.body.addEventListener('sleep', (e) => {
    console.log('Dice sleep event triggered');
    if (!diceHasBeenThrown) return;
    diceHasBeenThrown = false;

    dice.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    e.target.quaternion.toEuler(euler);

    const eps = 0.1;
    let isZero = (angle) => Math.abs(angle) < eps;
    let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
    let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

    let score;
    if (isZero(euler.z)) {
      if (isZero(euler.x)) {
        score = 5;
      } else if (isHalfPi(euler.x)) {
        score = 6;
      } else if (isMinusHalfPi(euler.x)) {
        score = 1;
      } else if (isPiOrMinusPi(euler.x)) {
        score = 2;
      }
    } else if (isHalfPi(euler.z)) {
      score = 4;
    } else if (isMinusHalfPi(euler.z)) {
      score = 3;
    }

    if (score !== undefined) {
      if (scoreResult.innerHTML === '') {
        scoreResult.innerHTML += score;
      } else {
        scoreResult.innerHTML += '+' + score;
      }

      // Notify the game about the dice roll result
      console.log('Notifying game with score:', score);
      onRollComplete(score);
    }
  });
}

export function throwDice(scoreResult, onRollComplete) {
  if (diceArray.length === 0) {
    console.error('No dice to throw!');
    return;
  }

  diceHasBeenThrown = true; // Mark that the dice has been thrown
  scoreResult.innerHTML = ''; // Clear previous result

  diceArray.forEach((dice, index) => {
    // Reset velocity and angular velocity
    dice.body.velocity.setZero();
    dice.body.angularVelocity.setZero();

    // Adjust starting position for each dice (higher starting point)
    const startX = 5 + Math.random() * 2;
    const startY = 15 + index * 5;
    const startZ = 0;

    dice.body.position.set(startX, startY, startZ);
    dice.mesh.position.copy(dice.body.position);

    console.log(
      `Dice ${index + 1} starting position: [${startX}, ${startY}, ${startZ}]`
    );

    // Apply more dramatic initial rotation to the dice
    dice.mesh.rotation.set(
      Math.PI * Math.random() * 2,
      Math.PI * Math.random() * 2,
      Math.PI * Math.random() * 2
    );
    dice.body.quaternion.copy(dice.mesh.quaternion);

    // Apply stronger impulse for a more dynamic throw
    const force = 20 + 10 * Math.random();
    const randomDirection = Math.random() > 0.5 ? 1 : -1;
    const impulseX = randomDirection * force;
    const impulseY = force * 2;
    const impulseZ = randomDirection * force;

    dice.body.applyImpulse(
      new CANNON.Vec3(impulseX, impulseY, impulseZ),
      new CANNON.Vec3(0, 0, 0) // Point of application
    );

    console.log(`Applying impulse: [${impulseX}, ${impulseY}, ${impulseZ}]`);

    // Add angular velocity for more spinning effect
    const angularX = 10 * (Math.random() - 0.5);
    const angularY = 10 * (Math.random() - 0.5);
    const angularZ = 10 * (Math.random() - 0.5);

    dice.body.angularVelocity.set(angularX, angularY, angularZ);

    console.log(`Angular velocity: [${angularX}, ${angularY}, ${angularZ}]`);

    dice.body.allowSleep = true; // Enable sleep to stabilize after rolling
    addDiceEvents(dice, scoreResult, onRollComplete); // Attach events to dice
  });
}
