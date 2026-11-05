import { globalEventBus } from '../../core/eventBus.js';
import { globalWindowManager } from '../windowManager.js';

export class BrowserApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.windowManager = options.windowManager || globalWindowManager;
    this.currentUrl = 'https://projectx.megasoft.local';
    this.currentHtml = `<div class="p-6 text-center text-slate-300">
      <h1 class="text-xl font-bold text-indigo-400 mb-2">MegaSoft ProjectX SaaS Portal</h1>
      <p class="text-xs text-slate-400">Ứng dụng quản lý doanh nghiệp tích hợp dành cho nội bộ.</p>
      <div class="mt-4 p-4 border border-slate-700 bg-slate-900 rounded-lg max-w-sm mx-auto">
        <div class="text-xs text-emerald-400 font-bold mb-2">Trạng thái: Hoạt động bình thường</div>
        <button class="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Trang đăng nhập</button>
      </div>
    </div>`;
  }

  open(url, html) {
    if (url) this.currentUrl = url;
    if (html) this.currentHtml = html;

    const win = this.windowManager.createWindow({
      id: 'browser',
      title: '🌐 Browser — ProjectX Web Inspector',
      width: 660,
      height: 440
    });

    win.setContent(this.renderDOM());
    return win;
  }

  loadPage(html, url = 'https://projectx.megasoft.local') {
    this.currentHtml = html;
    this.currentUrl = url;
    const win = this.windowManager.getWindow('browser');
    if (win) {
      const urlBar = win.bodyEl?.querySelector('#browser-url');
      if (urlBar) urlBar.value = url;
      const content = win.bodyEl?.querySelector('#browser-page-content');
      if (content) content.innerHTML = html;
    }
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-900 font-sans text-xs select-none';

    container.innerHTML = `
      <!-- Browser Toolbar / Address Bar -->
      <div class="h-9 bg-slate-950 border-b border-slate-800 px-3 flex items-center space-x-2 shrink-0">
        <button class="text-slate-400 hover:text-white" title="Back">←</button>
        <button class="text-slate-400 hover:text-white" title="Forward">→</button>
        <button class="text-slate-400 hover:text-white" title="Refresh">↻</button>
        <div class="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 font-mono text-[11px] flex items-center space-x-1.5">
          <span class="text-emerald-400">🔒</span>
          <input type="text" id="browser-url" value="${this.currentUrl}" readonly class="w-full bg-transparent border-none outline-none text-slate-200">
        </div>
      </div>

      <!-- Rendered Page Frame -->
      <div id="browser-page-content" class="flex-1 overflow-auto bg-slate-950 p-4 select-text">
        ${this.currentHtml}
      </div>
    `;

    return container;
  }
}

export const globalBrowserApp = new BrowserApp();
