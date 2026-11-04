export class InputManager {
  constructor() {
    this.keysDown = new Set();
    this.keysPressedThisFrame = new Set();
    this.buffer = new Set();
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.isListening = false;
  }

  start() {
    if (this.isListening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    this.isListening = true;
  }

  stop() {
    if (!this.isListening || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.keysDown.clear();
    this.keysPressedThisFrame.clear();
    this.buffer.clear();
    this.isListening = false;
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    if (!this.keysDown.has(key)) {
      this.buffer.add(key);
    }
    this.keysDown.add(key);
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    this.keysDown.delete(key);
  }

  poll() {
    this.keysPressedThisFrame = new Set(this.buffer);
    this.buffer.clear();
  }

  isKeyDown(key) {
    return this.keysDown.has(key.toLowerCase());
  }

  isKeyPressed(key) {
    return this.keysPressedThisFrame.has(key.toLowerCase());
  }
}

export const globalInputManager = new InputManager();
