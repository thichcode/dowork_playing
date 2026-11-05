import { globalEventBus } from './core/eventBus.js';
import { globalGameState } from './core/gameState.js';
import { globalInputManager } from './core/inputManager.js';
import { globalGameLoop } from './core/gameLoop.js';
import { globalViewManager } from './core/viewManager.js';
import { globalTimeSystem } from './office/timeSystem.js';
import { globalHUD } from './ui/hud.js';
import { Player } from './office/player.js';
import { globalOfficeRenderer } from './office/officeRenderer.js';
import { globalNPCManager } from './office/npcManager.js';
import { globalDialogueSystem } from './office/dialogueSystem.js';
import { globalInteractionZones } from './office/interactionZones.js';
import { globalDesktopOS } from './workstation/desktopOS.js';
import { globalMinigameManager } from './minigames/minigameManager.js';

console.log('MegaSoft Corp: 60 Ngày Thử Việc — Initializing modules...');

let player = null;
let mapData = null;

function showEndOfDayModal() {
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const day = globalGameState.get('time.day') || 1;
  const kpi = Math.round(globalGameState.get('player.kpi') || 50);
  const stress = Math.round(globalGameState.get('player.stress') || 20);

  modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
      <div class="text-4xl mb-3">🔔</div>
      <h3 class="text-lg font-bold text-slate-100 mb-1">Đã hết giờ làm việc! (18:00)</h3>
      <p class="text-xs text-slate-400 mb-4">Kết thúc ca làm Ngày ${day}. Hiện tại KPI: <span class="text-amber-400 font-bold">${kpi}</span> | Stress: <span class="text-rose-400 font-bold">${stress}%</span>.</p>
      
      <div class="flex flex-col space-y-2.5">
        <button id="btn-go-home" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition shadow flex items-center justify-center space-x-2">
          <span>🏠</span>
          <span>Về nhà nghỉ ngơi (Hồi +20 Energy, -10 Stress)</span>
        </button>
        <button id="btn-do-ot" class="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs transition shadow flex items-center justify-center space-x-2">
          <span>💪</span>
          <span>Ở lại tăng ca (OT đến 20:00, +15 Stress)</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-go-home')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    globalTimeSystem.nextDay();
    globalHUD.showNotification(`🌅 Bắt đầu Ngày mới ${globalGameState.get('time.day')}! Tinh thần sảng khoái.`, 3000, 'success');
  });

  document.getElementById('btn-do-ot')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    globalTimeSystem.enableOT();
    globalHUD.showNotification('⚡ Bạn chọn ở lại OT! Nhớ chú ý mức độ Stress.', 3000, 'warning');
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize view elements
  const officeEl = document.getElementById('office-container');
  const workstationEl = document.getElementById('workstation-os');
  globalViewManager.init(officeEl, workstationEl);

  // 2. Wire workstation exit button & OS init
  globalDesktopOS.init();
  const btnLeave = document.getElementById('btn-leave-workstation');
  if (btnLeave) {
    btnLeave.addEventListener('click', () => {
      globalViewManager.switch('office');
    });
  }

  // 3. Load map data
  try {
    const res = await fetch('assets/maps/office.json');
    mapData = await res.json();
    if (mapData.zones) {
      globalInteractionZones.setZones(mapData.zones);
    }
  } catch (err) {
    console.error('Failed to load map data:', err);
  }

  // 4. Initialize Player & Office Renderer
  const canvas = document.getElementById('game-canvas');
  if (canvas && mapData) {
    globalOfficeRenderer.init(canvas, mapData);
    player = new Player({
      startX: 3 * mapData.tileSize,
      startY: 7 * mapData.tileSize,
      tileSize: mapData.tileSize
    });
  }

  // 5. Game Loop Handlers
  globalEventBus.on('game:update', (deltaTime) => {
    if (globalViewManager.currentView === 'office' && player && mapData) {
      if (!globalDialogueSystem.isActive()) {
        player.update(deltaTime, mapData.collision);
        globalNPCManager.checkProximity(player.tileX, player.tileY);
        globalInteractionZones.checkZone(player.tileX, player.tileY);
      }
      globalOfficeRenderer.updateCamera(player.x, player.y);
    }

    // Handle [E] keypress for interaction
    if (globalInputManager.isKeyPressed('e')) {
      if (globalDialogueSystem.isActive()) {
        globalDialogueSystem.handleKeyPress();
      } else if (globalViewManager.currentView === 'office') {
        const nearbyNpc = globalNPCManager.nearbyNpc;
        if (nearbyNpc) {
          const chapter = globalGameState.get('chapter') || 1;
          const dialogue = globalDialogueSystem.getDialogueForNPC(nearbyNpc.id, chapter);
          if (dialogue) {
            globalDialogueSystem.start(dialogue);
            return;
          }
        }

        // If no NPC, check interaction zones (desk, coffee, sofa)
        if (globalInteractionZones.currentZone) {
          globalInteractionZones.interactWithZone();
        }
      }
    }
  });

  globalEventBus.on('game:render', () => {
    if (globalViewManager.currentView === 'office' && player && mapData) {
      globalOfficeRenderer.draw(player, globalNPCManager.npcs);
    }
  });

  // End of Day & Force End OT listeners
  globalEventBus.on('time:end-of-day', () => {
    showEndOfDayModal();
  });

  globalEventBus.on('time:force-end-ot', () => {
    const modal = document.getElementById('modal-container');
    if (modal) modal.classList.add('hidden');
    globalTimeSystem.nextDay();
    globalHUD.showNotification('🌙 Đã 20:00! Bảo vệ tắt điện đóng cửa, bạn bắt buộc phải về nhà ngủ.', 3500, 'info');
  });

  // 6. Load saved state or use initial state
  globalGameState.load();
  globalHUD.updateAll();

  // 7. Start Game Loop
  globalGameLoop.start();

  console.log('Office Map, Player, NPCs, Dialogue & Zones initialized successfully!');
});
