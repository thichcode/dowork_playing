import { globalWindowManager } from './windowManager.js';
import { globalEventBus } from '../core/eventBus.js';
import { globalSlackChatApp } from './apps/slackChat.js';
import { globalJiraBoardApp } from './apps/jiraBoard.js';
import { globalTerminalApp } from './apps/terminal.js';
import { globalCodeEditorApp } from './apps/codeEditor.js';
import { globalBrowserApp } from './apps/browser.js';
import { globalFileManagerApp } from './apps/fileManager.js';

export class DesktopOS {
  constructor(options = {}) {
    this.windowManager = options.windowManager || globalWindowManager;
    this.eventBus = options.eventBus || globalEventBus;
    this.taskbarAppsEl = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || typeof document === 'undefined') return;
    this.taskbarAppsEl = document.getElementById('os-taskbar-apps');

    // Bind desktop shortcuts
    const shortcuts = document.querySelectorAll('.desktop-shortcut');
    shortcuts.forEach((btn) => {
      btn.addEventListener('click', () => {
        const appId = btn.getAttribute('data-app');
        this.openApp(appId);
      });
    });

    // Listen to window open/close to update taskbar tray
    this.eventBus.on('window:opened', ({ id, title }) => this.addToTaskbar(id, title));
    this.eventBus.on('window:closed', ({ id }) => this.removeFromTaskbar(id));

    // Handle app open requests
    this.eventBus.on('app:request-open', ({ appId }) => {
      this.openApp(appId);
    });

    this.isInitialized = true;
  }

  openApp(appId) {
    switch (appId) {
      case 'slack':
        return globalSlackChatApp.open();
      case 'jira':
        return globalJiraBoardApp.open();
      case 'terminal':
        return globalTerminalApp.open();
      case 'codeEditor':
        return globalCodeEditorApp.open();
      case 'browser':
        return globalBrowserApp.open();
      case 'fileManager':
        return globalFileManagerApp.open();
      default:
        console.warn(`Unknown app: ${appId}`);
    }
  }

  addToTaskbar(id, title) {
    if (!this.taskbarAppsEl) return;
    const existing = document.getElementById(`tb-item-${id}`);
    if (existing) return;

    const btn = document.createElement('button');
    btn.id = `tb-item-${id}`;
    btn.className = 'px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center space-x-1.5 transition border border-slate-700';
    btn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="truncate max-w-[120px]">${title}</span>`;

    btn.addEventListener('click', () => {
      const win = this.windowManager.getWindow(id);
      if (win) {
        if (win.isMinimized) {
          win.restore();
        } else {
          this.windowManager.focusWindow(id);
        }
      }
    });

    this.taskbarAppsEl.appendChild(btn);
  }

  removeFromTaskbar(id) {
    const el = document.getElementById(`tb-item-${id}`);
    if (el) el.remove();
  }
}

export const globalDesktopOS = new DesktopOS();
