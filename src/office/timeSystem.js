import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';

export class TimeSystem {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.accumulatedSeconds = 0;
    this.isEodTriggered = false;

    // Listen to game update loop if in browser
    this.eventBus.on('game:update', (dt) => this.update(dt));
  }

  update(deltaTime) {
    this.accumulatedSeconds += deltaTime;
    // Every 1 real second = 1 in-game minute
    while (this.accumulatedSeconds >= 1.0) {
      this.accumulatedSeconds -= 1.0;
      this.stepMinute();
    }
  }

  stepMinute() {
    let hour = this.gameState.get('time.hour') || 9;
    let minute = this.gameState.get('time.minute') || 0;

    minute += 1;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }

    this.gameState.set('time.hour', hour);
    this.gameState.set('time.minute', minute);
    this.eventBus.emit('time:tick', { hour, minute });

    // Check End of Day at 18:00
    if (hour >= 18 && !this.isEodTriggered) {
      this.isEodTriggered = true;
      this.eventBus.emit('time:end-of-day', { hour, minute });
    }

    // Force end of OT at 20:00
    if (hour >= 20) {
      this.eventBus.emit('time:force-end-ot');
    }
  }

  advanceMinutes(minutes) {
    let hour = this.gameState.get('time.hour') || 9;
    let minute = this.gameState.get('time.minute') || 0;

    minute += minutes;
    while (minute >= 60) {
      hour += 1;
      minute -= 60;
    }

    this.gameState.set('time.hour', hour);
    this.gameState.set('time.minute', minute);
    this.eventBus.emit('time:tick', { hour, minute });

    if (hour >= 18 && !this.isEodTriggered) {
      this.isEodTriggered = true;
      this.eventBus.emit('time:end-of-day', { hour, minute });
    }
  }

  enableOT() {
    this.isEodTriggered = true; // prevent re-triggering EOD
    // OT adds stress
    const stress = Math.min(100, (this.gameState.get('player.stress') || 0) + 15);
    this.gameState.set('player.stress', stress);
    this.eventBus.emit('time:ot-started');
  }

  nextDay() {
    const currentDay = this.gameState.get('time.day') || 1;
    this.gameState.set('time.day', currentDay + 1);
    this.gameState.set('time.hour', 9);
    this.gameState.set('time.minute', 0);
    this.gameState.set('coffeeCount', 0); // Review Focus 2: Reset coffee count
    this.isEodTriggered = false;

    // Natural recovery over night
    const energy = Math.min(100, (this.gameState.get('player.energy') || 0) + 20);
    const stress = Math.max(0, (this.gameState.get('player.stress') || 0) - 10);
    this.gameState.set('player.energy', energy);
    this.gameState.set('player.stress', stress);

    this.eventBus.emit('day:new-day', { day: currentDay + 1 });
  }
}

export const globalTimeSystem = new TimeSystem();
