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
      shoes: 0x1e293b,
      ...(options.palette || {})
    };

    this.hasGlasses = !!options.hasGlasses;
    this.hairStyle = options.hairStyle || 'short';
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
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const lanyardMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
    const badgeMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const shoeMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.palette.shoes) });

    // 1. Torso & Upper Body
    const torsoGeo = new THREE.BoxGeometry(0.56, 0.65, 0.32);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 0.72;
    this.torso.castShadow = true;
    this.mesh.add(this.torso);

    // Collar
    const collarGeo = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.set(0, 0.3, 0.15);
    collar.rotation.x = 0.2;
    collar.name = 'shirt_collar';
    this.torso.add(collar);

    // IT ID Badge & Lanyard
    const lanyardGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45);
    const lanyardLeft = new THREE.Mesh(lanyardGeo, lanyardMat);
    lanyardLeft.position.set(-0.08, 0.14, 0.18);
    lanyardLeft.rotation.z = -0.25;

    const lanyardRight = new THREE.Mesh(lanyardGeo, lanyardMat);
    lanyardRight.position.set(0.08, 0.14, 0.18);
    lanyardRight.rotation.z = 0.25;

    const lanyardGroup = new THREE.Group();
    lanyardGroup.name = 'lanyard';
    lanyardGroup.add(lanyardLeft);
    lanyardGroup.add(lanyardRight);
    this.torso.add(lanyardGroup);

    // ID Badge card
    const badgeGeo = new THREE.BoxGeometry(0.14, 0.2, 0.02);
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, -0.05, 0.2);
    badge.name = 'id_badge';

    // Mini blue strap on badge top
    const badgeHeaderGeo = new THREE.BoxGeometry(0.14, 0.04, 0.025);
    const badgeHeader = new THREE.Mesh(badgeHeaderGeo, lanyardMat);
    badgeHeader.position.set(0, 0.08, 0);
    badge.add(badgeHeader);

    this.torso.add(badge);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.16, 8);
    this.neck = new THREE.Mesh(neckGeo, skinMat);
    this.neck.position.y = 1.08;
    this.mesh.add(this.neck);

    // 3. Head & Facial Features
    const headGeo = new THREE.BoxGeometry(0.48, 0.48, 0.42);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.36;
    this.head.castShadow = true;
    this.mesh.add(this.head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, darkMat);
    leftEye.position.set(-0.12, 0.02, 0.22);
    leftEye.name = 'left_eye';
    this.head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, darkMat);
    rightEye.position.set(0.12, 0.02, 0.22);
    rightEye.name = 'right_eye';
    this.head.add(rightEye);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.1, 0.025, 0.02);
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.position.set(-0.12, 0.09, 0.22);
    this.head.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.position.set(0.12, 0.09, 0.22);
    this.head.add(rightBrow);

    // Nose
    const noseGeo = new THREE.BoxGeometry(0.06, 0.08, 0.06);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, -0.06, 0.23);
    nose.name = 'nose';
    this.head.add(nose);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.04, 0.1, 0.08);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.25, 0, 0);
    leftEar.name = 'left_ear';
    this.head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(0.25, 0, 0);
    rightEar.name = 'right_ear';
    this.head.add(rightEar);

    // Styled Hair
    const hairGroup = new THREE.Group();
    hairGroup.name = 'hair_mesh';
    const hairCapGeo = new THREE.BoxGeometry(0.52, 0.24, 0.46);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.18, -0.02);
    hairGroup.add(hairCap);

    // Hair Bangs / Front Layer
    const bangsGeo = new THREE.BoxGeometry(0.48, 0.1, 0.12);
    const bangs = new THREE.Mesh(bangsGeo, hairMat);
    bangs.position.set(0, 0.22, 0.18);
    hairGroup.add(bangs);

    if (this.hairStyle === 'bob' || this.hairStyle === 'female') {
      // Side hair tresses
      const tressGeo = new THREE.BoxGeometry(0.08, 0.35, 0.2);
      const leftTress = new THREE.Mesh(tressGeo, hairMat);
      leftTress.position.set(-0.24, 0.02, 0.05);
      hairGroup.add(leftTress);

      const rightTress = new THREE.Mesh(tressGeo, hairMat);
      rightTress.position.set(0.24, 0.02, 0.05);
      hairGroup.add(rightTress);
    } else if (this.hairStyle === 'ponytail') {
      // Ponytail band and tail at the back
      const bandGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8);
      const bandMat = new THREE.MeshLambertMaterial({ color: 0xec4899 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.set(0, 0.1, -0.24);
      band.rotation.x = Math.PI / 2;
      hairGroup.add(band);

      const tailGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.35, 8);
      const tail = new THREE.Mesh(tailGeo, hairMat);
      tail.position.set(0, -0.06, -0.26);
      tail.rotation.x = -0.2;
      hairGroup.add(tail);
    } else if (this.hairStyle === 'undercut') {
      // Pompadour / undercut top volume
      const pompGeo = new THREE.BoxGeometry(0.44, 0.12, 0.35);
      const pomp = new THREE.Mesh(pompGeo, hairMat);
      pomp.position.set(0, 0.32, 0.02);
      hairGroup.add(pomp);
    } else if (this.hairStyle === 'sidepart') {
      // Sidepart sweep
      const partGeo = new THREE.BoxGeometry(0.3, 0.08, 0.2);
      const part = new THREE.Mesh(partGeo, hairMat);
      part.position.set(0.12, 0.28, 0.1);
      hairGroup.add(part);
    }
    this.head.add(hairGroup);

    // Glasses (optional for devs / leads)
    if (this.hasGlasses) {
      const glassesGroup = new THREE.Group();
      glassesGroup.name = 'glasses';

      const rimGeo = new THREE.BoxGeometry(0.14, 0.1, 0.03);
      const frameMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      const lRim = new THREE.Mesh(rimGeo, frameMat);
      lRim.position.set(-0.12, 0.02, 0.235);
      glassesGroup.add(lRim);

      const rRim = new THREE.Mesh(rimGeo, frameMat);
      rRim.position.set(0.12, 0.02, 0.235);
      glassesGroup.add(rRim);

      const bridgeGeo = new THREE.BoxGeometry(0.08, 0.02, 0.03);
      const bridge = new THREE.Mesh(bridgeGeo, frameMat);
      bridge.position.set(0, 0.02, 0.235);
      glassesGroup.add(bridge);

      this.head.add(glassesGroup);
    }

    // 4. Arms with Hands
    const armGeo = new THREE.BoxGeometry(0.16, 0.42, 0.16);
    const handGeo = new THREE.BoxGeometry(0.13, 0.14, 0.13);

    // Left Arm
    this.leftArm = new THREE.Mesh(armGeo, shirtMat);
    this.leftArm.position.set(-0.38, 0.72, 0);
    this.leftArm.castShadow = true;

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0, -0.26, 0);
    leftHand.name = 'left_hand';
    this.leftArm.add(leftHand);
    this.mesh.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeo, shirtMat);
    this.rightArm.position.set(0.38, 0.72, 0);
    this.rightArm.castShadow = true;

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0, -0.26, 0);
    rightHand.name = 'right_hand';
    this.rightArm.add(rightHand);
    this.mesh.add(this.rightArm);

    // 5. Legs with Dual-Tone Sneakers
    const legGeo = new THREE.BoxGeometry(0.2, 0.42, 0.2);

    // Left Leg
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.16, 0.24, 0);
    this.leftLeg.castShadow = true;
    this.attachSneaker(this.leftLeg, 'left_shoe', whiteMat, shoeMat);
    this.mesh.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.16, 0.24, 0);
    this.rightLeg.castShadow = true;
    this.attachSneaker(this.rightLeg, 'right_shoe', whiteMat, shoeMat);
    this.mesh.add(this.rightLeg);
  }

  attachSneaker(legMesh, shoeName, whiteMat, shoeMat) {
    const THREE = this.THREE;
    const shoeGroup = new THREE.Group();
    shoeGroup.name = shoeName;

    // White rubber sole
    const soleGeo = new THREE.BoxGeometry(0.22, 0.08, 0.32);
    const sole = new THREE.Mesh(soleGeo, whiteMat);
    sole.position.set(0, -0.24, 0.04);
    sole.name = 'shoe_sole';
    shoeGroup.add(sole);

    // Upper shoe body
    const upperGeo = new THREE.BoxGeometry(0.2, 0.12, 0.28);
    const upper = new THREE.Mesh(upperGeo, shoeMat);
    upper.position.set(0, -0.16, 0.03);
    upper.name = 'shoe_upper';
    shoeGroup.add(upper);

    legMesh.add(shoeGroup);
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
      // Smooth reset to idle
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
