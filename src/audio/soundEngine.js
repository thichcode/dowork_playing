import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';

export class SoundEngine {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.ctx = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.currentBgm = null;
    this.bgmTimer = null;

    if (typeof window !== 'undefined') {
      // Lazy init AudioContext on first user interaction
      const initAudio = () => {
        this.getAudioContext();
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
      };
      window.addEventListener('click', initAudio);
      window.addEventListener('keydown', initAudio);
    }
  }

  getAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setVolume(type, value) {
    const clamped = Math.max(0, Math.min(1.0, value));
    if (type === 'music') {
      this.musicVolume = clamped;
    } else if (type === 'sfx') {
      this.sfxVolume = clamped;
    }
  }

  playTone(freq, duration, type = 'square', gainVal = 0.1) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio error in silent environments
    }
  }

  playSFX(name) {
    switch (name) {
      case 'footstep':
        this.playTone(120, 0.05, 'triangle', 0.05);
        break;

      case 'keyboard':
        this.playTone(800 + Math.random() * 400, 0.03, 'sine', 0.05);
        break;

      case 'slackDing':
        this.playTone(587.33, 0.1, 'sine', 0.15); // D5
        setTimeout(() => this.playTone(880, 0.2, 'sine', 0.15), 100); // A5
        break;

      case 'coffee':
        this.playTone(200, 0.25, 'triangle', 0.1);
        setTimeout(() => this.playTone(260, 0.2, 'triangle', 0.08), 150);
        break;

      case 'success':
        // C-E-G arpeggio
        this.playTone(523.25, 0.1, 'square', 0.1);
        setTimeout(() => this.playTone(659.25, 0.1, 'square', 0.1), 100);
        setTimeout(() => this.playTone(783.99, 0.25, 'square', 0.12), 200);
        break;

      case 'fail':
        // Descending tones
        this.playTone(400, 0.15, 'sawtooth', 0.12);
        setTimeout(() => this.playTone(320, 0.15, 'sawtooth', 0.12), 120);
        setTimeout(() => this.playTone(220, 0.3, 'sawtooth', 0.15), 240);
        break;

      case 'alert':
        // Emergency siren
        this.playTone(880, 0.15, 'square', 0.2);
        setTimeout(() => this.playTone(660, 0.15, 'square', 0.2), 150);
        break;

      case 'phoneRing':
        // Dual tone phone ring
        this.playTone(440, 0.1, 'sine', 0.18);
        setTimeout(() => this.playTone(480, 0.1, 'sine', 0.18), 80);
        setTimeout(() => this.playTone(440, 0.15, 'sine', 0.18), 160);
        break;

      case 'duckSqueak':
        // Rising squeak
        this.playTone(700, 0.08, 'sine', 0.15);
        setTimeout(() => this.playTone(1100, 0.15, 'sine', 0.18), 60);
        break;

      case 'keyClick':
        // Mechanical switch click
        this.playTone(1400 + Math.random() * 300, 0.02, 'triangle', 0.08);
        break;

      default:
        this.playTone(440, 0.08, 'square', 0.05);
        break;
    }
  }

  playBGM(trackName) {
    this.stopBGM();
    this.currentBgm = trackName;

    // Simple 8-bit melody sequencer
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C5
    let noteIdx = 0;

    this.bgmTimer = setInterval(() => {
      if (this.musicVolume > 0) {
        this.playTone(notes[noteIdx % notes.length], 0.12, 'square', 0.03 * this.musicVolume);
        noteIdx++;
      }
    }, 600);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentBgm = null;
  }
}

export const globalSoundEngine = new SoundEngine();
