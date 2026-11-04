import { globalInputManager } from '../core/inputManager.js';
import { SpriteGenerator } from './spriteGenerator.js';

export class Player {
  constructor(options = {}) {
    this.x = options.startX ?? 3 * 32;
    this.y = options.startY ?? 7 * 32;
    this.tileSize = options.tileSize || 32;
    this.speed = options.speed || 96; // pixels per second (~3 tiles/s)
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

  get tileX() {
    return Math.floor((this.x + 16) / this.tileSize);
  }

  get tileY() {
    return Math.floor((this.y + 24) / this.tileSize);
  }

  update(deltaTime, collisionMap = []) {
    let dx = 0;
    let dy = 0;

    if (this.inputManager.isKeyDown('w') || this.inputManager.isKeyDown('arrowup')) {
      dy -= 1;
      this.direction = 1;
    }
    if (this.inputManager.isKeyDown('s') || this.inputManager.isKeyDown('arrowdown')) {
      dy += 1;
      this.direction = 0;
    }
    if (this.inputManager.isKeyDown('a') || this.inputManager.isKeyDown('arrowleft')) {
      dx -= 1;
      this.direction = 3;
    }
    if (this.inputManager.isKeyDown('d') || this.inputManager.isKeyDown('arrowright')) {
      dx += 1;
      this.direction = 2;
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      // Normalize vector for diagonals
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const moveDist = this.speed * deltaTime;
      const targetX = this.x + dx * moveDist;
      const targetY = this.y + dy * moveDist;

      // Check collision on X axis
      if (!this.checkCollision(targetX, this.y, collisionMap)) {
        this.x = targetX;
      }
      // Check collision on Y axis
      if (!this.checkCollision(this.x, targetY, collisionMap)) {
        this.y = targetY;
      }

      // Cycle animation
      this.animTimer += deltaTime;
      if (this.animTimer >= 0.15) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      this.animFrame = 0;
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
