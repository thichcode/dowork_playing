import * as THREE_DEFAULT from 'three';

export class Character3D {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE_DEFAULT;
    const THREE = this.THREE;

    this.palette = {
      hair: 0x1e293b,
      shirt: 0x3b82f6,
      pants: 0x0f172a,
      skin: 0xfed7aa,
      ...(options.palette || {})
    };

    this.walkTimer = 0;
    this.mesh = new THREE.Group();
    this.mesh.name = options.name || 'character_3d';

    this.buildHierarchy();
  }

  buildHierarchy() {
    const THREE = this.THREE;

    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.palette.skin) });
    const hairMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.palette.hair) });
    const shirtMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.palette.shirt) });
    const pantsMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.palette.pants) });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.65, 0.32);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 0.72;
    this.torso.castShadow = true;
    this.mesh.add(this.torso);

    // 2. Head
    const headGeo = new THREE.BoxGeometry(0.48, 0.48, 0.42);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.32;
    this.head.castShadow = true;
    this.mesh.add(this.head);

    // Hair cap
    const hairGeo = new THREE.BoxGeometry(0.52, 0.22, 0.46);
    this.hair = new THREE.Mesh(hairGeo, hairMat);
    this.hair.position.set(0, 0.18, -0.02);
    this.head.add(this.hair);

    // 3. Legs
    const legGeo = new THREE.BoxGeometry(0.2, 0.48, 0.2);

    // Left Leg
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.16, 0.24, 0);
    this.leftLeg.castShadow = true;
    this.mesh.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.16, 0.24, 0);
    this.rightLeg.castShadow = true;
    this.mesh.add(this.rightLeg);

    // 4. Arms
    const armGeo = new THREE.BoxGeometry(0.16, 0.5, 0.16);

    // Left Arm
    this.leftArm = new THREE.Mesh(armGeo, shirtMat);
    this.leftArm.position.set(-0.38, 0.75, 0);
    this.leftArm.castShadow = true;
    this.mesh.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeo, shirtMat);
    this.rightArm.position.set(0.38, 0.75, 0);
    this.rightArm.castShadow = true;
    this.mesh.add(this.rightArm);
  }

  updateAnimation(deltaTime, isMoving) {
    if (isMoving) {
      this.walkTimer += deltaTime * 12;
      const swing = Math.sin(this.walkTimer) * 0.65;

      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;

      this.leftArm.rotation.x = -swing * 0.8;
      this.rightArm.rotation.x = swing * 0.8;

      // Vertical bobbing
      this.mesh.position.y = Math.abs(Math.sin(this.walkTimer)) * 0.08;
    } else {
      // Smooth reset to idle based on deltaTime
      const decay = Math.max(0, 1 - deltaTime * 8);
      this.leftLeg.rotation.x *= decay;
      this.rightLeg.rotation.x *= decay;
      this.leftArm.rotation.x *= decay;
      this.rightArm.rotation.x *= decay;
      this.mesh.position.y *= decay;
    }
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  setFacing(angleRad, smooth = true) {
    if (smooth) {
      let diff = angleRad - this.mesh.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.mesh.rotation.y += diff * 0.25;
    } else {
      this.mesh.rotation.y = angleRad;
    }
  }
}
