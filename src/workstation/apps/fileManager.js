import { globalEventBus } from '../../core/eventBus.js';
import { globalWindowManager } from '../windowManager.js';
import { PROJECT_FILES } from '../../data/projectFiles.js';
import { globalCodeEditorApp } from './codeEditor.js';

export class FileManagerApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.windowManager = options.windowManager || globalWindowManager;
    this.root = options.root || PROJECT_FILES;
  }

  open() {
    const win = this.windowManager.createWindow({
      id: 'fileManager',
      title: '📁 Files — ProjectX Workspace Explorer',
      width: 540,
      height: 380
    });

    win.setContent(this.renderDOM());
    this.bindEvents(win.bodyEl);
    return win;
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 font-sans text-xs select-none p-3';

    container.innerHTML = `
      <div class="font-bold text-xs text-indigo-400 mb-2 flex items-center space-x-2">
        <span>📂</span>
        <span>/home/developer/workspace/projectx</span>
      </div>
      <div class="flex-1 border border-slate-800 bg-slate-900/60 rounded-lg p-3 overflow-y-auto space-y-1">
        ${this.renderTree(this.root, '')}
      </div>
    `;

    return container;
  }

  renderTree(node, currentPath) {
    const path = currentPath ? `${currentPath}/${node.name}` : node.name;

    if (node.type === 'folder') {
      return `
        <div class="tree-folder">
          <div class="flex items-center space-x-1.5 py-1 px-1.5 rounded hover:bg-slate-800 text-slate-300 font-semibold cursor-pointer">
            <span>📁</span>
            <span>${node.name}</span>
          </div>
          <div class="pl-4 border-l border-slate-800 space-y-1 my-0.5">
            ${(node.children || []).map((child) => this.renderTree(child, path)).join('')}
          </div>
        </div>
      `;
    } else {
      const extIcons = {
        js: '🟡',
        jsx: '⚛️',
        css: '🔵',
        json: '🟢',
        yml: '⚙️',
        md: '📄'
      };
      const icon = extIcons[node.ext] || '📄';

      return `
        <div class="tree-file flex items-center space-x-1.5 py-1 px-1.5 rounded hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-400 cursor-pointer transition" data-path="${path}">
          <span>${icon}</span>
          <span class="truncate font-mono text-[11px]">${node.name}</span>
        </div>
      `;
    }
  }

  findFile(root, targetPath) {
    const search = (node, cur) => {
      const path = cur ? `${cur}/${node.name}` : node.name;
      if (path === targetPath) return node;
      if (node.children) {
        for (const child of node.children) {
          const res = search(child, path);
          if (res) return res;
        }
      }
      return null;
    };
    return search(root, '');
  }

  bindEvents(bodyEl) {
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.tree-file').forEach((el) => {
      el.addEventListener('click', () => {
        const path = el.getAttribute('data-path');
        const fileNode = this.findFile(this.root, path);
        if (fileNode && fileNode.content) {
          globalCodeEditorApp.open(path, fileNode.content);
        }
      });
    });
  }
}

export const globalFileManagerApp = new FileManagerApp();
