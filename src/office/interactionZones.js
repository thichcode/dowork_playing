import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';
import { globalTimeSystem } from './timeSystem.js';
import { globalViewManager } from '../core/viewManager.js';
import { globalHUD } from '../ui/hud.js';

export class InteractionZones {
  constructor(options = {}) {
    this.zones = options.zones || [];
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.timeSystem = options.timeSystem || globalTimeSystem;
    this.viewManager = options.viewManager || globalViewManager;
    this.hud = options.hud || globalHUD;
    this.promptEl = options.promptEl || (typeof document !== 'undefined' ? document.getElementById('interaction-prompt') : null);
    this.currentZone = null;
  }

  setZones(zones) {
    this.zones = zones || [];
  }

  checkZone(playerTileX, playerTileY) {
    for (const zone of this.zones) {
      // Check 1 tile proximity
      const dist = Math.abs(zone.x - playerTileX) + Math.abs(zone.y - playerTileY);
      if (dist <= 1) {
        this.currentZone = zone;
        this.updatePrompt(zone);
        return zone;
      }
    }
    this.currentZone = null;
    this.updatePrompt(null);
    return null;
  }

  updatePrompt(zone) {
    if (!this.promptEl) return;
    if (zone) {
      this.promptEl.classList.remove('hidden');
      this.promptEl.innerHTML = `Nhấn <span class="bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded shadow">E</span> để: ${zone.label}`;
    } else {
      this.promptEl.classList.add('hidden');
    }
  }

  interactWithZone(zone = this.currentZone) {
    if (!zone) return { success: false, reason: 'no_zone' };

    switch (zone.type) {
      case 'desk': {
        this.viewManager.switch('workstation');
        this.hud?.showNotification('🖥️ Đã ngồi vào bàn làm việc CyberWork OS!', 2000, 'info');
        return { success: true, action: 'entered_workstation' };
      }

      case 'coffee': {
        const count = this.gameState.get('coffeeCount') || 0;
        if (count >= 3) {
          this.hud?.showNotification('⚠️ Bạn đã uống đủ 3 ly cà phê hôm nay rồi! Đừng để tim đập nhanh quá.', 3000, 'warning');
          return { success: false, reason: 'coffee_limit_reached' };
        }

        const energy = Math.min(100, (this.gameState.get('player.energy') || 0) + 30);
        const stress = Math.max(0, (this.gameState.get('player.stress') || 0) - 10);
        this.gameState.set('player.energy', energy);
        this.gameState.set('player.stress', stress);
        this.gameState.set('coffeeCount', count + 1);
        this.timeSystem.advanceMinutes(15);

        this.hud?.showNotification(`☕ Nhâm nhi cà phê (+30 Energy, -10 Stress). Ly thứ ${count + 1}/3 trong ngày.`, 3000, 'success');
        return { success: true, action: 'drank_coffee' };
      }

      case 'sofa': {
        const energy = Math.min(100, (this.gameState.get('player.energy') || 0) + 20);
        const stress = Math.max(0, (this.gameState.get('player.stress') || 0) - 15);
        this.gameState.set('player.energy', energy);
        this.gameState.set('player.stress', stress);
        this.timeSystem.advanceMinutes(30);

        this.hud?.showNotification('🛋️ Chợp mắt nghỉ ngơi 30 phút trên sofa (+20 Energy, -15 Stress).', 3000, 'success');
        return { success: true, action: 'rested_sofa' };
      }

      case 'scrum_board': {
        this.eventBus.emit('ui:show-scrum-board');
        this.hud?.showNotification('📋 Mở bảng Scrum Board của team!', 2000, 'info');
        return { success: true, action: 'viewed_scrum' };
      }

      case 'server_rack': {
        this.eventBus.emit('ui:show-server-rack');
        this.hud?.showNotification('🔧 Kiểm tra hệ thống Server Rack: Đèn LED đang nhấp nháy bình thường.', 2500, 'info');
        return { success: true, action: 'inspected_server' };
      }

      default:
        return { success: false, reason: 'unknown_type' };
    }
  }
}

export const globalInteractionZones = new InteractionZones();
