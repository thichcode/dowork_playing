import { globalEventBus } from './eventBus.js';
import { globalInputManager } from './inputManager.js';

export class GameLoop {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.inputManager = options.inputManager || globalInputManager;
    this.isRunning = false;
    this.lastTime = 0;
    this.boundTick = this.tick.bind(this);
    this.rafId = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.inputManager.start();
    this.rafId = requestAnimationFrame(this.boundTick);
    this.eventBus.emit('game:started');
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.inputManager.stop();
    this.eventBus.emit('game:stopped');
  }

  tick(currentTime) {
    if (!this.isRunning) return;
    let deltaTime = (currentTime - this.lastTime) / 1000;
    // Cap deltaTime to 100ms to avoid huge frame jumps when tab inactive
    if (deltaTime > 0.1) deltaTime = 0.1;
    this.lastTime = currentTime;

    // 1. Poll inputs for this frame
    this.inputManager.poll();

    // 2. Update logic
    this.eventBus.emit('game:update', deltaTime);

    // 3. Render
    this.eventBus.emit('game:render', deltaTime);

    this.rafId = requestAnimationFrame(this.boundTick);
  }
}

export const globalGameLoop = new GameLoop();
