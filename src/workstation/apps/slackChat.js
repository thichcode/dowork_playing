import { globalEventBus } from '../../core/eventBus.js';
import { globalGameState } from '../../core/gameState.js';
import { globalWindowManager } from '../windowManager.js';
import { CHOICE_EFFECT_TEMPLATES } from '../../office/dialogueSystem.js';

export class SlackChatApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.windowManager = options.windowManager || globalWindowManager;
    this.activeChannel = 'general';
    this.channels = ['general', 'dev-team', 'incidents', 'random-gossip'];
    this.messages = {
      general: [
        { sender: 'PM Hùng', text: 'Chào cả team! Sprint tuần này rất quan trọng, mọi người cố gắng nhé! 🚀', time: '09:05' },
        { sender: 'HR Lan', text: 'Nhắc nhẹ: Thứ 6 này có tiệc trà sữa lúc 16h ở Pantry nha! 🧋', time: '09:12' }
      ],
      'dev-team': [
        { sender: 'Senior Dev Minh', text: 'Ai vừa commit đè lên branch dev thế? Nhớ pull rebase trước khi push!', time: '09:20' },
        { sender: 'QA Lead Trang', text: 'Ticket TK-FE-1 bị lỗi layout trên Safari kìa Dev ơi.', time: '09:30' }
      ],
      incidents: [
        { sender: 'DevOps Khoa', text: 'Hệ thống Production đang ổn định. CPU 34%, Memory 62%.', time: '09:00' }
      ],
      'random-gossip': [
        { sender: 'Ẩn danh', text: 'Nghe đồn đợt thử việc này gắt lắm, chỉ pass tầm 70% thôi á...', time: '09:15' }
      ]
    };
  }

  open() {
    const win = this.windowManager.createWindow({
      id: 'slack',
      title: '💬 SlackChat — MegaSoft Workspace',
      width: 620,
      height: 420
    });

    win.setContent(this.renderDOM());
    this.bindEvents(win.bodyEl);
    return win;
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex bg-slate-900 text-slate-200 select-text font-sans';

    // Left Channels Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'w-44 bg-slate-950 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0';
    sidebar.innerHTML = `
      <div>
        <div class="font-bold text-xs text-indigo-400 mb-3 flex items-center space-x-1">
          <span>🏢</span>
          <span class="truncate">MegaSoft HQ</span>
        </div>
        <div class="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">Kênh Chat</div>
        <div class="flex flex-col space-y-1">
          ${this.channels.map((ch) => `
            <button data-channel="${ch}" class="channel-btn text-left px-2 py-1.5 rounded text-xs transition flex items-center space-x-1.5 ${ch === this.activeChannel ? 'bg-indigo-600/30 text-indigo-300 font-semibold border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}">
              <span>#</span>
              <span class="truncate">${ch}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="text-[10px] text-slate-500 font-mono">
        Online: 42 members
      </div>
    `;

    // Right Message Area
    const chatArea = document.createElement('div');
    chatArea.className = 'flex-1 flex flex-col bg-slate-900';

    const msgList = document.createElement('div');
    msgList.id = 'slack-message-list';
    msgList.className = 'flex-1 p-3 overflow-y-auto space-y-3';
    this.renderMessagesInto(msgList);

    // Reply Box
    const replyBox = document.createElement('div');
    replyBox.className = 'p-2 bg-slate-950 border-t border-slate-800 flex items-center space-x-2';
    replyBox.innerHTML = `
      <input type="text" id="slack-input" placeholder="Gửi tin nhắn vào #${this.activeChannel}..." class="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
      <button id="slack-send-btn" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition">Gửi</button>
    `;

    chatArea.appendChild(msgList);
    chatArea.appendChild(replyBox);

    container.appendChild(sidebar);
    container.appendChild(chatArea);
    return container;
  }

  renderMessagesInto(container) {
    const list = this.messages[this.activeChannel] || [];
    container.innerHTML = list.map((m) => `
      <div class="flex items-start space-x-2.5">
        <div class="w-7 h-7 rounded bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
          ${m.sender.charAt(0)}
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-xs text-slate-200">${m.sender}</span>
            <span class="text-[10px] text-slate-500 font-mono">${m.time}</span>
          </div>
          <div class="text-xs text-slate-300 mt-0.5">${m.text}</div>
          ${m.choices ? `
            <div class="mt-2 flex space-x-2">
              ${m.choices.map((c, i) => `
                <button data-type="${c.type}" class="slack-reply-btn px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-800 border border-indigo-600/60 rounded text-[11px] text-indigo-200 transition">
                  ${c.text}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }

  bindEvents(bodyEl) {
    if (!bodyEl) return;

    // Switch channels
    bodyEl.querySelectorAll('.channel-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeChannel = btn.getAttribute('data-channel');
        const list = bodyEl.querySelector('#slack-message-list');
        const input = bodyEl.querySelector('#slack-input');
        if (input) input.placeholder = `Gửi tin nhắn vào #${this.activeChannel}...`;
        if (list) this.renderMessagesInto(list);

        // Update active class
        bodyEl.querySelectorAll('.channel-btn').forEach((b) => {
          const isCurrent = b.getAttribute('data-channel') === this.activeChannel;
          b.className = `channel-btn text-left px-2 py-1.5 rounded text-xs transition flex items-center space-x-1.5 ${isCurrent ? 'bg-indigo-600/30 text-indigo-300 font-semibold border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`;
        });
      });
    });

    // Send custom message
    const sendBtn = bodyEl.querySelector('#slack-send-btn');
    const input = bodyEl.querySelector('#slack-input');
    const onSend = () => {
      const text = input.value.trim();
      if (!text) return;
      const playerName = this.gameState.get('player.name') || 'Bạn';
      const time = `${String(this.gameState.get('time.hour') || 9).padStart(2, '0')}:${String(this.gameState.get('time.minute') || 0).padStart(2, '0')}`;
      if (!this.messages[this.activeChannel]) this.messages[this.activeChannel] = [];
      this.messages[this.activeChannel].push({ sender: playerName, text, time });
      input.value = '';
      const list = bodyEl.querySelector('#slack-message-list');
      if (list) this.renderMessagesInto(list);
    };

    sendBtn?.addEventListener('click', onSend);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onSend();
    });
  }

  addMessage(channel, sender, text, choices = null) {
    if (!this.messages[channel]) this.messages[channel] = [];
    const time = `${String(this.gameState.get('time.hour') || 9).padStart(2, '0')}:${String(this.gameState.get('time.minute') || 0).padStart(2, '0')}`;
    this.messages[channel].push({ sender, text, time, choices });

    this.eventBus.emit('slack:new-message', { channel, sender, text });
  }
}

export const globalSlackChatApp = new SlackChatApp();
