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
import { globalChapterManager } from './story/chapterManager.js';
import { globalRandomEventsManager } from './story/randomEvents.js';
import { globalMenuScreen } from './ui/menuScreen.js';
import { globalResultScreen } from './ui/resultScreen.js';
import { globalSettingsLLMModal } from './ui/settingsLLM.js';
import { globalLLMProvider } from './core/llmProvider.js';
import { globalDeskView } from './office/deskView.js';
import { globalGuideSystem } from './ui/guideSystem.js';
import { globalGuideModal } from './ui/guideModal.js';
import { globalLocationManager } from './office/locationManager.js';
import { globalNPCDeskManager } from './office/npcDeskManager.js';
import { globalSoundEngine } from './audio/soundEngine.js';
import { globalRoomTracker } from './office/roomTracker.js';

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
  // 1. Initialize First-Person Desk View & Guide System
  globalDeskView.render();
  globalGuideSystem.renderGuideBar();

  // Mount workstation-os inside monitor-screen-mount
  const monitorMount = document.getElementById('monitor-screen-mount');
  const workstationEl = document.getElementById('workstation-os');
  if (monitorMount && workstationEl) {
    monitorMount.appendChild(workstationEl);
    workstationEl.classList.remove('hidden');
  }

  // Initialize ViewManager with office container & desk view
  const officeEl = document.getElementById('office-container');
  const deskViewEl = document.getElementById('desk-view');
  if (officeEl && deskViewEl) {
    globalViewManager.init(officeEl, deskViewEl);
    globalViewManager.switch('office');
  }

  // 2. Wire workstation exit button & OS init
  globalDesktopOS.init();
  const btnLeave = document.getElementById('btn-leave-workstation');
  if (btnLeave) {
    btnLeave.addEventListener('click', () => {
      if (globalDeskView.isZoomed) {
        globalDeskView.zoomOut();
      } else {
        globalViewManager.switch('office');
      }
    });
  }

  // Stand-up from desk event -> switch back to office walking mode
  globalEventBus.on('desk:stand-up', () => {
    globalViewManager.switch('office');
    globalHUD.showNotification('🚶‍♂️ Bạn đã đứng dậy khỏi bàn làm việc để đi dạo văn phòng!', 2500, 'info');
  });

  // Wire hover tooltips on desk items
  const bindTooltip = (elementId, itemId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('mouseenter', (e) => globalGuideSystem.showTooltip(itemId, e.clientX, e.clientY));
    el.addEventListener('mouseleave', () => globalGuideSystem.hideTooltip());
  };
  bindTooltip('desk-coffee-cup', 'coffee');
  bindTooltip('desk-phone', 'phone');
  bindTooltip('desk-duck', 'duck');
  bindTooltip('desk-sticky-note', 'notes');
  bindTooltip('btn-zoom-toggle', 'monitor');

  // Wire Guide modal buttons
  document.getElementById('btn-open-guide-hud')?.addEventListener('click', () => globalGuideModal.show());
  document.getElementById('btn-open-guide-modal')?.addEventListener('click', () => globalGuideModal.show());

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
      startX: 20 * mapData.tileSize,
      startY: 13 * mapData.tileSize,
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
        globalRoomTracker.update(player.tileX, player.tileY);

        // Update floating interaction prompt on OfficeRenderer
        const nearbyNpc = globalNPCManager.nearbyNpc;
        const nearbyZone = globalInteractionZones.currentZone;
        if (nearbyNpc) {
          globalOfficeRenderer.setInteractionPrompt(`[E] Trò chuyện với ${nearbyNpc.name}`);
        } else if (nearbyZone) {
          globalOfficeRenderer.setInteractionPrompt(`[E] ${nearbyZone.label}`);
        } else {
          globalOfficeRenderer.clearInteractionPrompt();
        }
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
          globalDialogueSystem.startWithNPC(nearbyNpc.id, chapter);
          return;
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
  const savedLLM = globalGameState.get('settings.llm');
  if (savedLLM) {
    globalLLMProvider.updateConfig(savedLLM);
  }
  globalHUD.updateAll();

  // Settings Modal button
  const btnSettings = document.getElementById('btn-open-settings');
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      globalSettingsLLMModal.show();
    });
  }

  // Show Menu Screen on boot
  globalMenuScreen.show();

  // 7. Start Game Loop
  globalGameLoop.start();

  // Global Keyboard Shortcuts handler (Space, 1, 2, 3, P, M, ?, Esc)
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea';

    if (e.key === 'Escape') {
      const modal = document.getElementById('modal-container');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
      if (globalGuideModal.isOpen()) {
        globalGuideModal.close();
      }
      if (globalLocationManager.getLocation() !== 'desk') {
        globalLocationManager.switchLocation('desk');
      }
      if (globalDeskView.isZoomed) {
        globalDeskView.zoomOut();
      } else if (globalViewManager.currentView === 'workstation') {
        globalViewManager.switch('office');
      }
      if (globalDialogueSystem.isActive()) {
        globalDialogueSystem.close();
      }
      return;
    }

    if (isTyping) return;

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      globalDeskView.toggleZoom();
      globalSoundEngine.playSFX('keyClick');
    } else if (e.key === '1') {
      if (globalDeskView.drinkCoffee()) {
        globalSoundEngine.playSFX('coffee');
      }
    } else if (e.key === '2') {
      if (globalDeskView.isPhoneRinging) {
        globalDeskView.answerPhone();
      } else {
        globalHUD.showNotification('☎️ Điện thoại im ắng. Khi có sự cố, chuông sẽ reo!', 2500, 'info');
      }
    } else if (e.key === '3') {
      globalDeskView.squeakDuck();
      globalSoundEngine.playSFX('duckSqueak');
    } else if (e.key.toLowerCase() === 'p') {
      globalLocationManager.switchLocation(globalLocationManager.getLocation() === 'pantry' ? 'desk' : 'pantry');
    } else if (e.key.toLowerCase() === 'm') {
      globalLocationManager.switchLocation(globalLocationManager.getLocation() === 'meeting' ? 'desk' : 'meeting');
    } else if (e.key === '?') {
      globalGuideModal.show();
    }
  });

  // Day 1 Onboarding Guided Walkthrough
  globalEventBus.on('game:started', () => {
    globalViewManager.switch('office');
    globalHUD.showNotification('🏢 Chào mừng đến MegaSoft! Dùng [WASD / Mũi tên] để đi bộ khám phá 4 phòng ban.', 4000, 'info');
  });

  globalEventBus.on('game:continued', () => {
    globalViewManager.switch('office');
  });

  globalEventBus.on('game:role-selected', () => {
    globalViewManager.switch('office');
    setTimeout(() => {
      globalNPCDeskManager.spawnNPC(
        'tuan_anh',
        'happy',
        '🎉 Chào mừng em gia nhập MegaSoft Corp! Hãy đi dạo khám phá văn phòng hoặc nhấn [E] tại bàn để mở CyberWork OS!'
      );
    }, 600);
  });

  // Plot Twist phone notification
  globalEventBus.on('plottwist:triggered', (twist) => {
    globalDeskView.triggerPhoneRing(twist.title);
    globalSoundEngine.playSFX('phoneRing');
  });

  globalEventBus.on('desk:call-answered', ({ reason }) => {
    globalNPCDeskManager.spawnNPC('pm_hung', 'panic', `🔥 ALO EM ƠI! ${reason}. Hãy kiểm tra lại ticket ngay nhé!`);
  });

  // Fade out & dismiss preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 500);
  }

  console.log('Office Map, Player, NPCs, Dialogue & Zones initialized successfully!');
});
