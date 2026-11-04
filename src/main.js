import { globalEventBus } from './core/eventBus.js';
import { globalGameState } from './core/gameState.js';
import { globalInputManager } from './core/inputManager.js';
import { globalGameLoop } from './core/gameLoop.js';
import { globalViewManager } from './core/viewManager.js';
import { globalTimeSystem } from './office/timeSystem.js';
import { globalHUD } from './ui/hud.js';

console.log('MegaSoft Corp: 60 Ngày Thử Việc — Initializing core modules...');

window.addEventListener('DOMContentLoaded', () => {
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

  // 3. Load saved state or use initial state
  globalGameState.load();
  globalHUD.updateAll();

  // 4. Start Game Loop
  globalGameLoop.start();

  console.log('Core Engine + TimeSystem + HUD initialized successfully!');
});
