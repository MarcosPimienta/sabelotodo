import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { physicsWorld } from './physics';

export function createFloor(scene, physicsWorld) {
  console.log('Adding floor to the scene...');

  // Floor material for THREE.js
  const floorMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
    /* roughness: 0.8, */
  });

  // Create the THREE.js floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000), // Adjust size to match your scene
    floorMaterial
  );
  floor.receiveShadow = true;
  floor.position.y = -1;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  console.log('Floor added to the scene:', floor);

  // Create the physics floor for CANNON
  const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Match rotation
  floorBody.position.set(0, 5, 0);
  physicsWorld.addBody(floorBody);
  console.log('Floor added to the physics world.');

  // Load and overlay SVG design
  const loader = new SVGLoader();
  loader.load(
    `${process.env.PUBLIC_URL}/textures/JustTechBoard.svg`, // Path to your SVG file
    (data) => {
      console.log('SVG loaded successfully.');

      const paths = data.paths;
      const group = new THREE.Group();

      // Iterate through SVG paths
      paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(path.userData.style.fill || '#000000'), // Default to black if no color is defined
          opacity: path.userData.style.fillOpacity || 1,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        // Convert SVG paths to 3D shapes
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        });
      });

      // Scale and position the SVG group on the floor
      group.scale.set(0.44, 0.44, 0.44); // Adjust to match floor size
      const boundingBox = new THREE.Box3().setFromObject(group);
      const boxCenter = new THREE.Vector3();
      boundingBox.getCenter(boxCenter);

      group.position.set(-boxCenter.x, 0, -boxCenter.y); // Center and slightly above the floor
      group.rotation.x = Math.PI / 2; // Lay flat on the floor
      scene.add(group);

      console.log('SVG texture added to the scene.');
    },
    (xhr) => {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.error('Error loading SVG:', error);
    }
  );
}
