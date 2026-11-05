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

      // Animate walk cycle
      this.playerAvatar.updateAnimation(deltaTime, !!player.isMoving);
    }

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
