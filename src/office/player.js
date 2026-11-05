import { globalInputManager } from '../core/inputManager.js';
import { SpriteGenerator } from './spriteGenerator.js';

export class Player {
  constructor(options = {}) {
    this.x = options.startX ?? 3 * 32;
    this.y = options.startY ?? 7 * 32;
    this.tileSize = options.tileSize || 32;
    this.baseSpeed = options.speed || 96; // pixels per second (~3 tiles/s)
    this.sprintSpeed = options.sprintSpeed || 165; // ~5.2 tiles/s (1.7x boost)
    this.speed = this.baseSpeed;
    this.isSprinting = false;
    this.vx = 0;
    this.vy = 0;
    this.acceleration = 1800; // px/s^2 for responsive, smooth acceleration
    this.friction = 900; // px/s^2 for smooth deceleration glide
    this.direction = 0; // 0=down, 1=up, 2=right, 3=left
    this.animFrame = 0;
    this.animTimer = 0;
    this.isMoving = false;
    this.inputManager = options.inputManager || globalInputManager;
    this.palette = options.palette || {
      hair: '#1e293b',
      shirt: '#6366f1',
      pants: '#0f172a',
      skin: '#fed7aa'
    };
  }

  get currentVelocity() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  get tileX() {
    return Math.floor((this.x + 16) / this.tileSize);
  }

  get tileY() {
    return Math.floor((this.y + 24) / this.tileSize);
  }

  update(deltaTime, collisionMap = []) {
    let inputDx = 0;
    let inputDy = 0;

    if (this.inputManager.isKeyDown('w') || this.inputManager.isKeyDown('arrowup')) {
      inputDy -= 1;
      this.direction = 1;
    }
    if (this.inputManager.isKeyDown('s') || this.inputManager.isKeyDown('arrowdown')) {
      inputDy += 1;
      this.direction = 0;
    }
    if (this.inputManager.isKeyDown('a') || this.inputManager.isKeyDown('arrowleft')) {
      inputDx -= 1;
      this.direction = 3;
    }
    if (this.inputManager.isKeyDown('d') || this.inputManager.isKeyDown('arrowright')) {
      inputDx += 1;
      this.direction = 2;
    }

    const hasInput = inputDx !== 0 || inputDy !== 0;

    // Check sprint modifier
    this.isSprinting = hasInput && (this.inputManager.isKeyDown('shift') || this.inputManager.isKeyDown('Shift'));
    const targetMaxSpeed = this.isSprinting ? this.sprintSpeed : this.baseSpeed;
    this.speed = targetMaxSpeed;

    // Normalize diagonal input vector
    if (inputDx !== 0 && inputDy !== 0) {
      inputDx *= 0.7071;
      inputDy *= 0.7071;
    }

    const targetVx = inputDx * targetMaxSpeed;
    const targetVy = inputDy * targetMaxSpeed;

    // Smooth momentum-based acceleration & friction deceleration
    const rate = hasInput ? this.acceleration : this.friction;
    const maxChange = rate * deltaTime;

    const diffX = targetVx - this.vx;
    if (Math.abs(diffX) <= maxChange) {
      this.vx = targetVx;
    } else {
      this.vx += Math.sign(diffX) * maxChange;
    }

    const diffY = targetVy - this.vy;
    if (Math.abs(diffY) <= maxChange) {
      this.vy = targetVy;
    } else {
      this.vy += Math.sign(diffY) * maxChange;
    }

    this.isMoving = Math.abs(this.vx) > 3 || Math.abs(this.vy) > 3;

    if (this.isMoving) {
      const moveX = this.vx * deltaTime;
      const moveY = this.vy * deltaTime;
      const targetX = this.x + moveX;
      const targetY = this.y + moveY;

      // Check collision on X axis
      if (!this.checkCollision(targetX, this.y, collisionMap)) {
        this.x = targetX;
      } else {
        this.vx = 0;
      }

      // Check collision on Y axis
      if (!this.checkCollision(this.x, targetY, collisionMap)) {
        this.y = targetY;
      } else {
        this.vy = 0;
      }

      // Cycle animation (faster cycle when sprinting)
      const animInterval = this.isSprinting ? 0.09 : 0.15;
      this.animTimer += deltaTime;
      if (this.animTimer >= animInterval) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      this.animFrame = 0;
      this.vx = 0;
      this.vy = 0;
    }
  }

  checkCollision(x, y, collisionMap) {
    if (!collisionMap || collisionMap.length === 0) return false;

    // Player collision bounding box (bottom half: feet)
    const boxLeft = x + 8;
    const boxRight = x + 24;
    const boxTop = y + 16;
    const boxBottom = y + 28;

    const minTileX = Math.floor(boxLeft / this.tileSize);
    const maxTileX = Math.floor(boxRight / this.tileSize);
    const minTileY = Math.floor(boxTop / this.tileSize);
    const maxTileY = Math.floor(boxBottom / this.tileSize);

    const mapH = collisionMap.length;
    const mapW = collisionMap[0].length;

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        if (ty < 0 || ty >= mapH || tx < 0 || tx >= mapW) return true; // Out of bounds
        if (collisionMap[ty][tx] === 1) return true; // Blocked tile
      }
    }
    return false;
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;
    SpriteGenerator.drawCharacter(ctx, screenX, screenY, this.direction, this.animFrame, this.palette);
  }
}
