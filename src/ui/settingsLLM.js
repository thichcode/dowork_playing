import { globalGameState } from '../core/gameState.js';
import { globalLLMProvider } from '../core/llmProvider.js';
import { globalHUD } from './hud.js';

export class SettingsLLMModal {
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('modal-container') : null);
    this.gameState = options.gameState || globalGameState;
    this.llmProvider = options.llmProvider || globalLLMProvider;
    this.hud = options.hud || globalHUD;
  }

  show() {
    if (!this.container) return;
    this.container.classList.remove('hidden');

    const cfg = this.gameState.get('settings.llm') || {
      enabled: false,
      provider: 'gemini',
      apiKey: '',
      baseUrl: ''
    };

    this.container.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl select-none font-sans text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div class="flex items-center space-x-2">
            <span class="text-xl">⚙️</span>
            <span class="font-bold text-sm text-indigo-400">Cài Đặt Cốt Truyện & LLM</span>
          </div>
          <button id="btn-close-settings" class="text-slate-400 hover:text-white text-base">✕</button>
        </div>

        <div class="space-y-4">
          <!-- Story Mode Toggle -->
          <div>
            <label class="block font-bold text-slate-300 mb-2">Chế độ cốt truyện:</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center space-x-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                <input type="radio" name="story_mode" value="offline" ${!cfg.enabled ? 'checked' : ''} class="text-indigo-600">
                <div>
                  <div class="font-bold text-slate-200">Tĩnh (Offline)</div>
                  <div class="text-[10px] text-slate-400">Không cần API Key</div>
                </div>
              </label>
              <label class="flex items-center space-x-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                <input type="radio" name="story_mode" value="llm" ${cfg.enabled ? 'checked' : ''} class="text-indigo-600">
                <div>
                  <div class="font-bold text-indigo-300">Động (AI LLM)</div>
                  <div class="text-[10px] text-slate-400">Sinh truyện mỗi lần chơi</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Provider Select -->
          <div>
            <label class="block font-bold text-slate-300 mb-1">Mô hình AI (LLM Provider):</label>
            <select id="setting-provider" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500">
              <option value="gemini" ${cfg.provider === 'gemini' ? 'selected' : ''}>Google Gemini (Gemini 2.0 Flash - Miễn phí & Cực nhanh)</option>
              <option value="openai" ${cfg.provider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o mini)</option>
            </select>
          </div>

          <!-- API Key Input -->
          <div>
            <label class="block font-bold text-slate-300 mb-1">API Key:</label>
            <input type="password" id="setting-apikey" value="${cfg.apiKey || ''}" placeholder="Nhập khóa API (ví dụ: AIzaSy...)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono">
            <p class="text-[10px] text-slate-500 mt-1 italic">Khóa API chỉ được lưu trên trình duyệt của bạn (LocalStorage) và gọi trực tiếp, không bao giờ gửi về máy chủ trung gian.</p>
          </div>
        </div>

        <div class="mt-6 flex space-x-2">
          <button id="btn-save-settings" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition">
            Lưu cài đặt
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#btn-close-settings');
    const saveBtn = this.container.querySelector('#btn-save-settings');

    closeBtn?.addEventListener('click', () => {
      this.container.classList.add('hidden');
    });

    saveBtn?.addEventListener('click', () => {
      const mode = this.container.querySelector('input[name="story_mode"]:checked')?.value;
      const provider = this.container.querySelector('#setting-provider')?.value || 'gemini';
      const apiKey = this.container.querySelector('#setting-apikey')?.value.trim() || '';

      const isEnabled = mode === 'llm' && !!apiKey;

      this.gameState.set('settings.llm', {
        enabled: isEnabled,
        provider,
        apiKey
      });

      this.llmProvider.updateConfig({
        enabled: isEnabled,
        provider,
        apiKey
      });

      this.container.classList.add('hidden');
      this.hud?.showNotification(
        isEnabled ? `✨ Đã kích hoạt chế độ Cốt truyện Động (${provider.toUpperCase()})!` : '💾 Đã lưu: Chế độ Cốt truyện Tĩnh (Offline).',
        3000,
        'success'
      );
    });
  }
}

export const globalSettingsLLMModal = new SettingsLLMModal();
