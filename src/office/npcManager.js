import { globalEventBus } from '../core/eventBus.js';
import { NPCS_DATA } from '../data/npcs.js';
import { SpriteGenerator } from './spriteGenerator.js';

export class NPCManager {
  constructor(options = {}) {
    this.npcs = options.npcs || NPCS_DATA;
    this.eventBus = options.eventBus || globalEventBus;
    this.nearbyNpc = null;
    this.tileSize = options.tileSize || 32;
  }

  checkProximity(playerTileX, playerTileY) {
    let closest = null;
    let minDistance = Infinity;

    for (const npc of this.npcs) {
      // Manhattan distance in tiles
      const dist = Math.abs(npc.tileX - playerTileX) + Math.abs(npc.tileY - playerTileY);
      if (dist <= 2 && dist < minDistance) {
        minDistance = dist;
        closest = npc;
      }
    }

    this.nearbyNpc = closest;
    return closest;
  }

  draw(ctx, camera) {
    for (const npc of this.npcs) {
      const screenX = npc.tileX * this.tileSize - camera.x;
      const screenY = npc.tileY * this.tileSize - camera.y;

      // Draw NPC Character
      SpriteGenerator.drawCharacter(ctx, screenX, screenY, 0, 0, npc.palette);

      // If this NPC is nearby player, draw [!] indicator bubble above head
      if (this.nearbyNpc && this.nearbyNpc.id === npc.id) {
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY - 4, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', screenX + 16, screenY - 3);
        ctx.restore();
      }
    }
  }
}

export const globalNPCManager = new NPCManager();
