import { SpriteGenerator } from './spriteGenerator.js';
import { globalGameState } from '../core/gameState.js';

export class OfficeRenderer {
  constructor(options = {}) {
    this.canvas = options.canvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.mapData = options.mapData || null;
    this.camera = { x: 0, y: 0 };
    this.viewportWidth = 800;
    this.viewportHeight = 600;
    this.gameState = options.gameState || globalGameState;
    this.interactionPrompt = '';
  }

  get cameraX() {
    return Math.round(this.camera.x);
  }

  get cameraY() {
    return Math.round(this.camera.y);
  }

  setInteractionPrompt(text) {
    this.interactionPrompt = text || '';
  }

  clearInteractionPrompt() {
    this.interactionPrompt = '';
  }

  init(canvas, mapData) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.mapData = mapData;
    this.viewportWidth = this.canvas.width;
    this.viewportHeight = this.canvas.height;
  }

  updateCamera(targetX, targetY, instant = false) {
    if (!this.mapData) return;

    const mapPixelW = this.mapData.width * this.mapData.tileSize;
    const mapPixelH = this.mapData.height * this.mapData.tileSize;

    // Center camera on target
    const desiredX = targetX - this.viewportWidth / 2 + 16;
    const desiredY = targetY - this.viewportHeight / 2 + 16;

    if (instant || !this.ctx) {
      this.camera.x = desiredX;
      this.camera.y = desiredY;
    } else {
      this.camera.x += (desiredX - this.camera.x) * 0.15;
      this.camera.y += (desiredY - this.camera.y) * 0.15;
    }

    // Clamp to map boundaries
    this.camera.x = Math.max(0, Math.min(mapPixelW - this.viewportWidth, this.camera.x));
    this.camera.y = Math.max(0, Math.min(mapPixelH - this.viewportHeight, this.camera.y));
  }

  draw(player, npcs = []) {
    if (!this.ctx || !this.mapData) return;

    const ctx = this.ctx;
    const tileSize = this.mapData.tileSize || 32;

    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);

    // Visible tile range
    const startCol = Math.max(0, Math.floor(this.camera.x / tileSize));
    const endCol = Math.min(this.mapData.width - 1, Math.ceil((this.camera.x + this.viewportWidth) / tileSize));
    const startRow = Math.max(0, Math.floor(this.camera.y / tileSize));
    const endRow = Math.min(this.mapData.height - 1, Math.ceil((this.camera.y + this.viewportHeight) / tileSize));

    // Draw map tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tileType = this.mapData.tiles[r][c];
        const screenX = c * tileSize - this.camera.x;
        const screenY = r * tileSize - this.camera.y;
        SpriteGenerator.drawTile(ctx, screenX, screenY, tileType, tileSize);
      }
    }

    // Draw NPCs
    for (const npc of npcs) {
      if (typeof npc.draw === 'function') {
        npc.draw(ctx, this.camera);
      }
    }

    // Draw Player
    if (player && typeof player.draw === 'function') {
      player.draw(ctx, this.camera);
    }

    // Draw interaction prompt bubble above player head
    if (this.interactionPrompt && player) {
      const px = player.x - this.camera.x + 16;
      const py = player.y - this.camera.y - 14;
      this.drawPromptBubble(ctx, px, py, this.interactionPrompt);
    }

    // Apply lighting overlay based on hour
    this.drawLightingOverlay(ctx);
  }

  drawPromptBubble(ctx, x, y, text) {
    ctx.save();
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const textW = ctx.measureText(text).width;
    const padX = 8;
    const h = 22;
    const w = textW + padX * 2;
    const boxX = x - w / 2;
    const boxY = y - h;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(boxX, boxY, w, h, 6);
    } else {
      ctx.rect(boxX, boxY, w, h);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, boxY + h / 2);
    ctx.restore();
  }

  drawLightingOverlay(ctx) {
    const hour = this.gameState.get('time.hour') || 9;
    let overlayColor = null;

    if (hour >= 18) {
      // Overtime / night
      overlayColor = 'rgba(15, 23, 42, 0.45)';
    } else if (hour >= 16) {
      // Late afternoon / sunset
      overlayColor = 'rgba(251, 146, 60, 0.12)';
    } else if (hour >= 12 && hour < 14) {
      // Lunch / warm noon
      overlayColor = 'rgba(254, 240, 138, 0.05)';
    }

    if (overlayColor) {
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);
    }
  }
}

export const globalOfficeRenderer = new OfficeRenderer();
