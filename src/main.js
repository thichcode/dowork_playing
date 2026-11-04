import { globalEventBus } from './core/eventBus.js';
import { globalGameState } from './core/gameState.js';
import { globalInputManager } from './core/inputManager.js';
import { globalGameLoop } from './core/gameLoop.js';
import { globalViewManager } from './core/viewManager.js';
import { globalTimeSystem } from './office/timeSystem.js';
import { globalHUD } from './ui/hud.js';
import { Player } from './office/player.js';
import { globalOfficeRenderer } from './office/officeRenderer.js';

console.log('MegaSoft Corp: 60 Ngày Thử Việc — Initializing modules...');

let player = null;
let mapData = null;

window.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize view elements
  const officeEl = document.getElementById('office-container');
  const workstationEl = document.getElementById('workstation-os');
  globalViewManager.init(officeEl, workstationEl);

  // 2. Wire workstation exit button
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
      player.update(deltaTime, mapData.collision);
      globalOfficeRenderer.updateCamera(player.x, player.y);
    }
  });

  globalEventBus.on('game:render', () => {
    if (globalViewManager.currentView === 'office' && player && mapData) {
      globalOfficeRenderer.draw(player);
    }
  });

  // 6. Load saved state or use initial state
  globalGameState.load();
  globalHUD.updateAll();

  // 7. Start Game Loop
  globalGameLoop.start();

  console.log('Office Map & Player initialized successfully!');
});
