import { globalEventBus } from '../core/eventBus.js';

export class WindowInstance {
  constructor(config = {}, manager) {
    this.id = config.id;
    this.title = config.title || 'Window';
    this.width = config.width || 600;
    this.height = config.height || 420;
    this.x = config.x || 80;
    this.y = config.y || 40;
    this.zIndex = config.zIndex || 10;
    this.isMinimized = false;
    this.isMaximized = false;
    this.manager = manager;
    this.contentEl = config.content || null;
    this.el = null;

    if (typeof document !== 'undefined') {
      this.createDOM();
    }
  }

  createDOM() {
    const el = document.createElement('div');
    el.id = `win-${this.id}`;
    el.className = 'os-window absolute bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-shadow duration-200';
    el.style.width = `${this.width}px`;
    el.style.height = `${this.height}px`;
    el.style.left = `${this.x}px`;
    el.style.top = `${this.y}px`;
    el.style.zIndex = this.zIndex;

    // Titlebar
    const titlebar = document.createElement('div');
    titlebar.className = 'os-titlebar h-8 bg-slate-800 border-b border-slate-700 px-3 flex items-center justify-between cursor-move select-none text-xs';
    titlebar.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-indigo-400 font-bold">${this.title}</span>
      </div>
      <div class="flex items-center space-x-1.5">
        <button class="win-btn-min w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400" title="Thu nhỏ"></button>
        <button class="win-btn-max w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400" title="Phóng to"></button>
        <button class="win-btn-close w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400" title="Đóng"></button>
      </div>
    `;

    // Window Body
    const body = document.createElement('div');
    body.className = 'win-body flex-1 overflow-auto bg-slate-950 p-2 text-xs relative';
    if (this.contentEl) {
      if (typeof this.contentEl === 'string') {
        body.innerHTML = this.contentEl;
      } else {
        body.appendChild(this.contentEl);
      }
    }

    el.appendChild(titlebar);
    el.appendChild(body);
    this.el = el;
    this.bodyEl = body;

    // Events
    el.addEventListener('mousedown', () => this.manager.focusWindow(this.id));

    // Dragging
    this.initDragging(titlebar, el);

    // Buttons
    titlebar.querySelector('.win-btn-min')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });
    titlebar.querySelector('.win-btn-max')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMaximize();
    });
    titlebar.querySelector('.win-btn-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.manager.closeWindow(this.id);
    });
  }

  initDragging(titlebar, windowEl) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    titlebar.addEventListener('mousedown', (e) => {
      if (this.isMaximized) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseInt(windowEl.style.left, 10) || 0;
      initialTop = parseInt(windowEl.style.top, 10) || 0;

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        this.x = Math.max(0, initialLeft + dx);
        this.y = Math.max(0, initialTop + dy);
        windowEl.style.left = `${this.x}px`;
        windowEl.style.top = `${this.y}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  minimize() {
    this.isMinimized = true;
    if (this.el) this.el.classList.add('hidden');
    this.manager.eventBus.emit('window:minimized', { id: this.id });
  }

  restore() {
    this.isMinimized = false;
    if (this.el) this.el.classList.remove('hidden');
    this.manager.focusWindow(this.id);
    this.manager.eventBus.emit('window:restored', { id: this.id });
  }

  toggleMaximize() {
    if (this.isMaximized) {
      this.isMaximized = false;
      if (this.el) {
        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
      }
    } else {
      this.isMaximized = true;
      if (this.el) {
        this.el.style.left = '0px';
        this.el.style.top = '0px';
        this.el.style.width = '100%';
        this.el.style.height = '100%';
      }
    }
  }

  setContent(htmlOrEl) {
    if (!this.bodyEl) return;
    this.bodyEl.innerHTML = '';
    if (typeof htmlOrEl === 'string') {
      this.bodyEl.innerHTML = htmlOrEl;
    } else if (htmlOrEl) {
      this.bodyEl.appendChild(htmlOrEl);
    }
  }
}

export class WindowManager {
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('os-desktop') : null);
    this.eventBus = options.eventBus || globalEventBus;
    this.windows = new Map();
    this.topZ = 10;
  }

  setContainer(container) {
    this.container = container;
  }

  hasWindow(id) {
    return this.windows.has(id);
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  createWindow(config) {
    if (this.windows.has(config.id)) {
      const existing = this.windows.get(config.id);
      if (existing.isMinimized) existing.restore();
      this.focusWindow(config.id);
      return existing;
    }

    this.topZ += 1;
    const win = new WindowInstance({ ...config, zIndex: this.topZ }, this);
    this.windows.set(config.id, win);

    if (this.container && win.el) {
      this.container.appendChild(win.el);
    }

    this.eventBus.emit('window:opened', { id: win.id, title: win.title });
    return win;
  }

  focusWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    this.topZ += 1;
    win.zIndex = this.topZ;
    if (win.el) {
      win.el.style.zIndex = this.topZ;
    }
    this.eventBus.emit('window:focused', { id });
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    if (this.container && win.el) {
      this.container.removeChild(win.el);
    }
    this.windows.delete(id);
    this.eventBus.emit('window:closed', { id });
  }

  closeAll() {
    for (const id of Array.from(this.windows.keys())) {
      this.closeWindow(id);
    }
  }
}

export const globalWindowManager = new WindowManager();
