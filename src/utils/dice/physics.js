import * as CANNON from 'cannon-es';

export let physicsWorld;

export function initPhysics() {
  const floorMaterial = new CANNON.Material('floorMaterial');
  const diceMaterial = new CANNON.Material('diceMaterial');

  physicsWorld = new CANNON.World({
    allowSleep: true,
    gravity: new CANNON.Vec3(0, -200, 0),
  });

  const contactMaterial = new CANNON.ContactMaterial(
    floorMaterial,
    diceMaterial,
    {
      friction: 0.4,
      restitution: 0.1,
    }
  );

  physicsWorld.addContactMaterial(contactMaterial);
  physicsWorld.defaultContactMaterial = contactMaterial;

  console.log('Physics world initialized.');
  return physicsWorld; // Ensure physicsWorld is returned
}
