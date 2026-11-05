import * as THREE_DEFAULT from 'three';
import { globalEventBus } from '../core/eventBus.js';
import { tileTo3D, calcFacingAngle } from './coord3D.js';
import { ThreeOfficeScene } from './threeOfficeScene.js';
import { OfficeBuilder3D } from './officeBuilder3D.js';
import { Character3D } from './character3D.js';
import { NPCManager3D } from './npcManager3D.js';

export const ROLE_PALETTES = {
  frontend: { shirt: 0xec4899, hair: 0x1e293b, pants: 0x0f172a, skin: 0xfed7aa },
  backend: { shirt: 0x0284c7, hair: 0x334155, pants: 0x1e293b, skin: 0xffedd5 },
  qa: { shirt: 0x8b5cf6, hair: 0xd97706, pants: 0x0f172a, skin: 0xfed7aa },
  devops: { shirt: 0xef4444, hair: 0x0f172a, pants: 0x0f172a, skin: 0xffedd5 }
};

export class OfficeRenderer3D {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE_DEFAULT;
    this.eventBus = options.eventBus || globalEventBus;

    this.is3DMode = true;
    this.promptText = '';

    this.container3D = options.container3D || null;
    this.container2D = options.container2D || null;
    this.canvas = options.canvas || null;

    this.scene = null;
    this.officeBuilder = null;
    this.playerAvatar = null;
    this.npcManager = null;

    this.lastPlayerTileX = 20;
    this.lastPlayerTileY = 14;
    this.isInitialized = false;

    // Dust particles & Foliage sway
    this.particleGroup = new this.THREE.Group();
    this.particleGroup.name = 'dust_particles';
    this.particles = [];
    this.plants = [];
    this.particleSpawnTimer = 0;
    this.initParticlePool(16);
  }

  initParticlePool(count = 16) {
    const THREE = this.THREE;
    const geo = new THREE.DodecahedronGeometry(0.06);
    const mat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.65 });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.visible = false;
      p.active = false;
      p.life = 0;
      p.maxLife = 0.35;
      this.particles.push(p);
      this.particleGroup.add(p);
    }
  }

  spawnDustParticle(x, y, z) {
    const p = this.particles.find(part => !part.active);
    if (!p) return null;

    p.active = true;
    p.visible = true;
    p.life = 0;
    p.position.set(x + (Math.random() - 0.5) * 0.15, y + 0.04, z + (Math.random() - 0.5) * 0.15);
    p.scale.set(1.0, 1.0, 1.0);
    return p;
  }

  getActiveParticleCount() {
    return this.particles.filter(p => p.active).length;
  }

  updateParticles(deltaTime) {
    for (const p of this.particles) {
      if (!p.active) continue;

      p.life += deltaTime;
      if (p.life >= p.maxLife) {
        p.active = false;
        p.visible = false;
      } else {
        const progress = p.life / p.maxLife;
        const scale = (1.0 - progress) * 1.2;
        p.scale.set(scale, scale, scale);
        p.position.y += deltaTime * 0.25;
      }
    }
  }

  updateFoliageSway(deltaTime, playerX, playerZ, isMoving = false) {
    if (!this.plants || this.plants.length === 0) return;

    for (const plant of this.plants) {
      if (!plant) continue;
      const dx = plant.position.x - playerX;
      const dz = plant.position.z - playerZ;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.0 && isMoving) {
        plant.swayTimer = (plant.swayTimer || 0) + deltaTime * 8;
        const intensity = (1 - dist / 2.0) * 0.12;
        plant.rotation.z = Math.sin(plant.swayTimer) * intensity;
      } else {
        plant.rotation.z *= Math.max(0, 1 - deltaTime * 6);
      }
    }
  }

  init(options = {}) {
    const THREE = this.THREE;
    this.canvas = options.canvas || this.canvas || (typeof document !== 'undefined' ? document.getElementById('game-canvas-3d') : null);
    this.container3D = options.container3D || this.container3D || (typeof document !== 'undefined' ? document.getElementById('office3d-container') : null);
    this.container2D = options.container2D || this.container2D || (typeof document !== 'undefined' ? document.getElementById('office-container') : null);

    const mapData = options.mapData || { width: 32, height: 20, tileSize: 32 };
    const role = options.role || 'frontend';

    if (!this.canvas) return;

    // 1. Initialize Scene & Camera
    this.scene = new ThreeOfficeScene({ THREE, canvas: this.canvas, container: this.container3D });
    this.scene.init();

    // 2. Build 3D Office Environment
    this.officeBuilder = new OfficeBuilder3D({ THREE });
    const officeGroup = this.officeBuilder.buildOffice(mapData);
    if (this.scene.scene) {
      this.scene.scene.add(officeGroup);
      this.scene.scene.add(this.particleGroup);
    }

    const plantGroup = officeGroup.getObjectByName('plants');
    if (plantGroup) {
      this.plants = plantGroup.children;
    }

    // 3. Build Player 3D Avatar
    const palette = ROLE_PALETTES[role] || ROLE_PALETTES.frontend;
    this.playerAvatar = new Character3D({ THREE, name: 'player_3d_avatar', palette });
    const startPos = tileTo3D(20, 13, 1.5);
    this.playerAvatar.setPosition(startPos.x, 0, startPos.z);
    if (this.scene.scene) {
      this.scene.scene.add(this.playerAvatar.mesh);
    }

    // 4. Initialize 3D NPC Manager
    this.npcManager = new NPCManager3D({ THREE, npcs: options.npcs });
    if (this.scene.scene && this.npcManager.group) {
      this.scene.scene.add(this.npcManager.group);
    }

    // Center camera on player initially
    this.scene.setTarget(startPos.x, 0, startPos.z, false);
    this.isInitialized = true;
  }

  toggleDimension() {
    this.is3DMode = !this.is3DMode;
    const mode = this.is3DMode ? '3d' : '2d';

    if (this.container3D && this.container2D) {
      if (this.is3DMode) {
        this.container3D.classList.remove('hidden');
        this.container2D.classList.add('hidden');
      } else {
        this.container3D.classList.add('hidden');
        this.container2D.classList.remove('hidden');
      }
    }

    const labelEl = typeof document !== 'undefined' ? document.getElementById('dimension-label') : null;
    if (labelEl) {
      labelEl.textContent = this.is3DMode ? '3D Mode' : '2D Mode';
    }

    this.eventBus.emit('view:dimension-changed', mode);
    return mode;
  }

  update(deltaTime, player) {
    if (!player) return;

    const tileSize = player.tileSize || 32;
    const tileX = player.x / tileSize;
    const tileY = player.y / tileSize;
    const pos3D = tileTo3D(tileX, tileY, 1.5);

    // Update Player Avatar in 3D
    if (this.playerAvatar) {
      this.playerAvatar.setPosition(pos3D.x, 0, pos3D.z);

      // Facing angle based on direction
      const dirMap = {
        down: 0,
        up: Math.PI,
        left: -Math.PI / 2,
        right: Math.PI / 2
      };
      const angle = dirMap[player.direction] ?? 0;
      this.playerAvatar.setFacing(angle, true);

      // Compute turn angle delta for cornering banking
      let turnDiff = 0;
      if (this.playerAvatar.mesh && this.playerAvatar.mesh.rotation) {
        turnDiff = angle - this.playerAvatar.mesh.rotation.y;
        while (turnDiff < -Math.PI) turnDiff += Math.PI * 2;
        while (turnDiff > Math.PI) turnDiff -= Math.PI * 2;
      }

      // Animate walk cycle with sprint & banking
      this.playerAvatar.updateAnimation(deltaTime, !!player.isMoving, !!player.isSprinting, turnDiff);
    }

    // Footstep dust particles when sprinting
    if (player.isMoving && player.isSprinting) {
      this.particleSpawnTimer = (this.particleSpawnTimer || 0) + deltaTime;
      if (this.particleSpawnTimer >= 0.08) {
        this.particleSpawnTimer = 0;
        this.spawnDustParticle(pos3D.x, 0, pos3D.z);
      }
    }
    this.updateParticles(deltaTime);

    // Responsive foliage sway on nearby plants
    this.updateFoliageSway(deltaTime, pos3D.x, pos3D.z, !!player.isMoving);

    // Smooth camera follow target
    if (this.scene && typeof this.scene.setTarget === 'function') {
      this.scene.setTarget(pos3D.x, 0, pos3D.z, true);
    }

    // Update NPCs idle animation & check proximity
    if (this.npcManager) {
      this.npcManager.update(deltaTime);
      this.npcManager.checkProximity(pos3D.x, pos3D.z);
    }
  }

  setPrompt(text) {
    this.promptText = text || '';
    const el = typeof document !== 'undefined' ? document.getElementById('interaction-prompt-3d') : null;
    if (el) {
      if (this.promptText) {
        el.textContent = this.promptText;
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  }

  clearPrompt() {
    this.setPrompt('');
  }

  render() {
    if (this.is3DMode && this.scene && typeof this.scene.render === 'function') {
      this.scene.render();
    }
  }
}

export const globalOfficeRenderer3D = new OfficeRenderer3D();
