import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let renderer, scene, camera, diceModel, physicsWorld, controls;
const params = { numberOfDice: 1 };
const diceArray = [];

export const initDiceSystem = (
  canvasEl,
  scoreResult,
  rollBtn,
  onRollComplete
) => {
  initPhysics();
  initScene(canvasEl, scoreResult, rollBtn, onRollComplete);
  window.addEventListener('resize', updateSceneSize);
};

function initScene(canvasEl, scoreResult, rollBtn, onRollComplete) {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvasEl,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 600, 600); // Angle view for the board
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Initialize OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 50;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0, 0);

  updateSceneSize();

  const ambientLight = new THREE.AmbientLight(0xffffff, 500);
  scene.add(ambientLight);
  const topLight = new THREE.PointLight(0xffffff, 1000);
  topLight.position.set(10, 1100, 0);
  topLight.castShadow = true;
  topLight.shadow.mapSize.width = 2048;
  topLight.shadow.mapSize.height = 2048;
  topLight.shadow.camera.near = 5;
  topLight.shadow.camera.far = 400;
  scene.add(topLight);

  createFloor();

  loadDiceModel(() => {
    for (let i = 0; i < params.numberOfDice; i++) {
      diceArray.push(createDice());
      addDiceEvents(diceArray[i], scoreResult, onRollComplete);
    }
    render();
  });

  rollBtn.addEventListener('click', () => {
    scoreResult.innerHTML = ''; // Clear previous result
    throwDice();
  });
}

function initPhysics() {
  physicsWorld = new CANNON.World({
    allowSleep: true,
    gravity: new CANNON.Vec3(0, -50, 0),
  });
  physicsWorld.defaultContactMaterial.restitution = 0.3;
}

/* function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.ShadowMaterial({ opacity: 0.1 })
  );
  floor.receiveShadow = true;
  floor.position.y = -7;
  floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5);
  scene.add(floor);

  const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  floorBody.position.copy(floor.position);
  floorBody.quaternion.copy(floor.quaternion);
  physicsWorld.addBody(floorBody);
} */

function createFloor() {
  // Load the texture for the floor (optional base texture)
  /* const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load('/textures/JustTechBoard.png');

  // Configure texture scaling and wrapping
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1); */

  // Apply the texture to the floor material
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#808080',
    roughness: 0.8,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), floorMaterial);
  floor.receiveShadow = true;
  floor.position.y = -7;
  floor.rotation.x = -Math.PI / 2; // Ensure the plane is horizontal
  scene.add(floor);

  // Create the physics floor
  const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  floorBody.position.copy(floor.position);
  floorBody.quaternion.copy(floor.quaternion);
  physicsWorld.addBody(floorBody);

  // Load and overlay SVG on the floor
  const loader = new SVGLoader();

  loader.load(
    '/textures/JustTechBoard.svg', // Update with the correct SVG path
    function (data) {
      const paths = data.paths;
      const group = new THREE.Group();

      // Iterate through each path in the SVG
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(path.userData.style.fill), // Default color if SVG lacks color
          opacity: path.userData.style.fillOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const shapes = SVGLoader.createShapes(path);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      group.scale.set(0.44, 0.44, 0.44); // Adjust scale to fit the floor dimensions

      // Recalculate the bounding box of the scaled group
      const boundingBox = new THREE.Box3().setFromObject(group);
      const boxCenter = new THREE.Vector3();
      boundingBox.getCenter(boxCenter);

      // Position the SVG just above the floor
      group.position.set(-boxCenter.x, -6.9, -boxCenter.y); // Slightly above the floor
      group.rotation.x = Math.PI / 2; // Ensure it's flat on the floor
      scene.add(group);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
      console.log('An error happened:', error);
    }
  );
}

function loadDiceModel(callback) {
  const loader = new GLTFLoader();
  loader.load(
    '/3d-models/BlackDice.glb',
    (gltf) => {
      diceModel = gltf.scene;
      diceModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });
      callback();
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}

function createDice() {
  const mesh = diceModel.clone();
  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.9)),
    sleepTimeLimit: 0.1,
  });
  physicsWorld.addBody(body);

  return { mesh, body };
}

function addDiceEvents(dice, scoreResult, onRollComplete) {
  dice.body.addEventListener('sleep', (e) => {
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
      } else {
        dice.body.allowSleep = true;
      }
    } else if (isHalfPi(euler.z)) {
      score = 4;
    } else if (isMinusHalfPi(euler.z)) {
      score = 3;
    } else {
      dice.body.allowSleep = true;
    }

    if (score !== undefined) {
      if (scoreResult.innerHTML === '') {
        scoreResult.innerHTML += score;
      } else {
        scoreResult.innerHTML += '+' + score;
      }

      onRollComplete(score);
    }
  });
}

function render() {
  physicsWorld.fixedStep();
  for (const dice of diceArray) {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
  }

  controls.update(); // Update the orbit controls
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function updateSceneSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function throwDice() {
  const scoreResult = document.querySelector('#score-result');
  scoreResult.innerHTML = '';
  diceArray.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();
    d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
    d.mesh.position.copy(d.body.position);
    d.mesh.rotation.set(
      2 * Math.PI * Math.random(),
      0,
      2 * Math.PI * Math.random()
    );
    d.body.quaternion.copy(d.mesh.quaternion);
    const force = 3 + 5 * Math.random();
    d.body.applyImpulse(
      new CANNON.Vec3(-force, force, 0),
      new CANNON.Vec3(0, 0, 0.2)
    );
    d.body.allowSleep = true;
  });
  physicsWorld.fixedStep();
  render();
}
