import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export let scene, camera, renderer, controls;

export function initScene(canvasEl) {
  console.log('Initializing Scene with Canvas:', canvasEl);
  renderer = new THREE.WebGLRenderer({
    alpha: true, // For transparency
    antialias: true,
    canvas: canvasEl,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();

  // Add a neutral background color to make the floor and dice visible
  scene.background = new THREE.Color('#a0a0a0');

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 600, 600);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 50;
  controls.maxDistance = 1000;
  controls.target.set(0, 0, 0);

  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Point light for shadows

  const topLight = new THREE.PointLight(0xffffff, 1000);
  topLight.position.set(10, 1100, 0);
  topLight.castShadow = true;
  topLight.shadow.mapSize.width = 2048;
  topLight.shadow.mapSize.height = 2048;
  topLight.shadow.camera.near = 5;
  topLight.shadow.camera.far = 400;
  scene.add(topLight);

  updateSceneSize();
  window.addEventListener('resize', updateSceneSize);
}

export function updateSceneSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
