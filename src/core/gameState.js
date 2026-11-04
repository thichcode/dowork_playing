import { globalEventBus } from './eventBus.js';

export const DEFAULT_INITIAL_STATE = {
  player: {
    name: 'Tân Binh IT',
    role: 'frontend', // 'frontend' | 'backend' | 'qa' | 'devops'
    energy: 100,      // 0 - 100
    stress: 20,       // 0 - 100, >= 95 triggers burnout
    kpi: 50,          // 0 - 100
    reputation: 50    // 0 - 100
  },
  chapter: 1,         // 1 - 4
  chapterProgress: 0,
  time: {
    day: 1,
    hour: 9,
    minute: 0
  },
  activeView: 'office', // 'office' | 'workstation'
  completedTickets: [],
  activeTicket: null,
  dialogueFlags: {},
  eventFlags: {},
  coffeeCount: 0,
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.7,
    llm: {
      enabled: false,
      provider: 'gemini',
      apiKey: '',
      baseUrl: ''
    }
  }
};

export class GameState {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.storageKey = options.storageKey || 'megasoft_probation_save_v1';
    this.state = JSON.parse(JSON.stringify(options.initialState || DEFAULT_INITIAL_STATE));
  }

  get(path) {
    if (!path) return this.state;
    const parts = path.split('.');
    let curr = this.state;
    for (const part of parts) {
      if (curr === undefined || curr === null) return undefined;
      curr = curr[part];
    }
    return curr;
  }

  set(path, value) {
    const parts = path.split('.');
    let curr = this.state;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in curr) || typeof curr[part] !== 'object' || curr[part] === null) {
        curr[part] = {};
      }
      curr = curr[part];
    }
    const lastKey = parts[parts.length - 1];
    curr[lastKey] = value;

    // Emit change events
    this.eventBus.emit(`state:changed:${path}`, value);
    this.eventBus.emit('state:changed', { path, value, state: this.state });

    // Review Focus Check 1: Stress >= 95 immediately triggers Burnout ending
    if (path === 'player.stress' || path.startsWith('player')) {
      const stress = this.get('player.stress');
      if (stress >= 95) {
        this.eventBus.emit('game:burnout', { stress });
      }
    }

    this.save();
  }

  mutate(mutatorFn) {
    mutatorFn(this.state);
    this.eventBus.emit('state:changed', { state: this.state });
    const stress = this.get('player.stress');
    if (stress >= 95) {
      this.eventBus.emit('game:burnout', { stress });
    }
    this.save();
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const loaded = JSON.parse(raw);
          this.state = { ...JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE)), ...loaded };
          this.eventBus.emit('state:loaded', this.state);
          return this.state;
        }
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
    return null;
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    this.save();
    this.eventBus.emit('state:reset', this.state);
  }
}

export const globalGameState = new GameState();
