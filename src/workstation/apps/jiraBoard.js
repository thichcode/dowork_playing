import { globalEventBus } from '../../core/eventBus.js';
import { globalGameState } from '../../core/gameState.js';
import { globalWindowManager } from '../windowManager.js';
import { globalTicketSystem } from '../ticketSystem.js';

export class JiraBoardApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.windowManager = options.windowManager || globalWindowManager;
    this.ticketSystem = options.ticketSystem || globalTicketSystem;
  }

  open() {
    const win = this.windowManager.createWindow({
      id: 'jira',
      title: '📋 JiraBoard — ProjectX Kanban Sprint',
      width: 680,
      height: 440
    });

    win.setContent(this.renderDOM());
    this.bindEvents(win.bodyEl);
    return win;
  }

  renderDOM() {
    const role = this.gameState.get('player.role') || 'frontend';
    const chapter = this.gameState.get('chapter') || 1;
    const tickets = this.ticketSystem.getTicketsForChapter(chapter, role);
    const activeTicketId = this.gameState.get('activeTicket');

    const todoTickets = tickets.filter((t) => !this.ticketSystem.isTicketCompleted(t.id) && t.id !== activeTicketId);
    const inProgressTickets = tickets.filter((t) => t.id === activeTicketId);
    const doneTickets = tickets.filter((t) => this.ticketSystem.isTicketCompleted(t.id));

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 select-none font-sans p-3';

    container.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center space-x-2">
          <span class="text-xl">📋</span>
          <div>
            <div class="font-bold text-xs text-indigo-400">Sprint Board: ProjectX</div>
            <div class="text-[10px] text-slate-400 font-mono">Role: ${role.toUpperCase()} • Chương ${chapter}</div>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 font-mono">
          Hoàn thành: <span class="text-emerald-400 font-bold">${doneTickets.length}/${tickets.length}</span>
        </div>
      </div>

      <!-- Kanban 3 Columns -->
      <div class="flex-1 grid grid-cols-3 gap-3 pt-3 overflow-hidden">
        <!-- TO DO Column -->
        <div class="flex flex-col bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-300">Cần làm (To Do)</span>
            <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">${todoTickets.length}</span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-2 pr-1">
            ${todoTickets.map((t) => this.renderTicketCard(t, 'todo')).join('')}
          </div>
        </div>

        <!-- IN PROGRESS Column -->
        <div class="flex flex-col bg-indigo-950/20 border border-indigo-900/40 rounded-lg p-2.5 overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-indigo-300">Đang làm (In Progress)</span>
            <span class="text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-400 font-mono">${inProgressTickets.length}</span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-2 pr-1">
            ${inProgressTickets.map((t) => this.renderTicketCard(t, 'in_progress')).join('')}
          </div>
        </div>

        <!-- DONE Column -->
        <div class="flex flex-col bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2.5 overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-emerald-300">Đã xong (Done)</span>
            <span class="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono">${doneTickets.length}</span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-2 pr-1">
            ${doneTickets.map((t) => this.renderTicketCard(t, 'done')).join('')}
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderTicketCard(ticket, status) {
    const diffColor = {
      easy: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      medium: 'bg-amber-950 text-amber-400 border-amber-800',
      hard: 'bg-rose-950 text-rose-400 border-rose-800'
    }[ticket.difficulty] || 'bg-slate-800 text-slate-400 border-slate-700';

    return `
      <div class="ticket-card bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 shadow hover:border-indigo-500 transition cursor-pointer" data-id="${ticket.id}">
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-mono text-[10px] font-bold text-indigo-400">${ticket.id}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase ${diffColor}">${ticket.difficulty}</span>
        </div>
        <div class="text-xs font-semibold text-slate-200 line-clamp-2 mb-2">${ticket.title}</div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <span>🎯 +${ticket.rewards.kpi} KPI</span>
          ${status === 'todo' ? `
            <button class="btn-start-ticket px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold transition" data-id="${ticket.id}">
              Bắt đầu ▶
            </button>
          ` : status === 'in_progress' ? `
            <span class="text-amber-400 font-semibold animate-pulse">Đang giải quyết...</span>
          ` : `
            <span class="text-emerald-400 font-semibold">✓ Pass</span>
          `}
        </div>
      </div>
    `;
  }

  bindEvents(bodyEl) {
    if (!bodyEl) return;

    // Start Ticket Button
    bodyEl.querySelectorAll('.btn-start-ticket').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticketId = btn.getAttribute('data-id');
        this.ticketSystem.startTicket(ticketId);
        // Refresh Jira Board
        const win = this.windowManager.getWindow('jira');
        if (win) win.setContent(this.renderDOM());
        this.bindEvents(win.bodyEl);
      });
    });

    // Click card to view detail
    bodyEl.querySelectorAll('.ticket-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const ticket = this.ticketSystem.getTicketById(id);
        if (!ticket) return;

        alert(`[${ticket.id}] ${ticket.title}\n\nMô tả:\n${ticket.description}\n\nGợi ý:\n${ticket.hint}\n\nThời gian: ${ticket.timeLimit}s | Thưởng: +${ticket.rewards.kpi} KPI, +${ticket.rewards.reputation} Rep`);
      });
    });
  }
}

export const globalJiraBoardApp = new JiraBoardApp();
