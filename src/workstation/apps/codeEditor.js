import { globalEventBus } from '../../core/eventBus.js';
import { globalWindowManager } from '../windowManager.js';

export class CodeEditorApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.windowManager = options.windowManager || globalWindowManager;
    this.currentPath = 'src/components/LoginForm.css';
    this.currentContent = `.login-card {\n  display: flex;\n  flex-direction: column;\n  padding: 24px;\n  border-radius: 12px;\n  background: #1e293b;\n}\n\n.btn-submit {\n  margin-top: 16px;\n  background-color: #6366f1;\n  color: #ffffff;\n  padding: 8px 16px;\n  border-radius: 6px;\n}\n`;
  }

  open(path, content) {
    if (path) this.currentPath = path;
    if (content !== undefined) this.currentContent = content;

    const win = this.windowManager.createWindow({
      id: 'codeEditor',
      title: `📝 CodeEditor — ${this.currentPath}`,
      width: 640,
      height: 420
    });

    win.setContent(this.renderDOM());
    this.bindEvents(win.bodyEl);
    return win;
  }

  loadFile(path, content) {
    this.currentPath = path;
    this.currentContent = content;
    const win = this.windowManager.getWindow('codeEditor');
    if (win) {
      win.title = `📝 CodeEditor — ${path}`;
      const titleText = win.el?.querySelector('.os-titlebar span');
      if (titleText) titleText.textContent = win.title;
      const textarea = win.bodyEl?.querySelector('#editor-textarea');
      if (textarea) textarea.value = content;
    }
  }

  getContent() {
    const win = this.windowManager.getWindow('codeEditor');
    const textarea = win?.bodyEl?.querySelector('#editor-textarea');
    return textarea ? textarea.value : this.currentContent;
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 font-mono text-xs select-text';

    container.innerHTML = `
      <!-- Toolbar -->
      <div class="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400">
        <div class="flex items-center space-x-2">
          <span>📄</span>
          <span class="text-slate-200 font-semibold truncate" id="editor-filepath">${this.currentPath}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-[10px] text-emerald-400">● UTF-8</span>
          <button id="btn-save-code" class="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-sans text-[10px] font-semibold transition">
            Lưu file
          </button>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Line Numbers Gutter -->
        <div class="w-10 bg-slate-900/80 border-r border-slate-800 py-3 text-right pr-2 text-slate-600 select-none text-[11px] leading-relaxed">
          1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15
        </div>
        <!-- Textarea -->
        <textarea id="editor-textarea" class="flex-1 bg-transparent p-3 text-slate-200 resize-none outline-none font-mono text-xs leading-relaxed border-none focus:ring-0" spellcheck="false">${this.currentContent}</textarea>
      </div>
    `;

    return container;
  }

  bindEvents(bodyEl) {
    if (!bodyEl) return;
    const saveBtn = bodyEl.querySelector('#btn-save-code');
    const textarea = bodyEl.querySelector('#editor-textarea');

    saveBtn?.addEventListener('click', () => {
      this.currentContent = textarea.value;
      this.eventBus.emit('file:saved', {
        path: this.currentPath,
        content: this.currentContent
      });
      alert(`Đã lưu file ${this.currentPath} thành công!`);
    });
  }
}

export const globalCodeEditorApp = new CodeEditorApp();
