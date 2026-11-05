import { globalEventBus } from '../core/eventBus.js';
import { globalTicketSystem } from '../workstation/ticketSystem.js';
import { globalWindowManager } from '../workstation/windowManager.js';
import { globalHUD } from '../ui/hud.js';

import { CssLayoutFixMinigame } from './frontend/cssLayoutFix.js';
import { BugHuntUIMinigame } from './frontend/bugHuntUI.js';
import { ApiPipelineMinigame } from './backend/apiPipeline.js';
import { LogDetectiveMinigame } from './backend/logDetective.js';
import { BugSpotterMinigame } from './qa/bugSpotter.js';
import { TestCaseBuilderMinigame } from './qa/testCaseBuilder.js';
import { YamlSurgeonMinigame } from './devops/yamlSurgeon.js';
import { IncidentCommanderMinigame } from './devops/incidentCommander.js';

export class MinigameManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.ticketSystem = options.ticketSystem || globalTicketSystem;
    this.windowManager = options.windowManager || globalWindowManager;
    this.hud = options.hud || globalHUD;

    this.activeTicket = null;
    this.activeMinigame = null;
    this.isActive = false;
    this.timeRemaining = 0;
    this.initialTime = 0;

    // Listen to start minigame event
    this.eventBus.on('minigame:start', (ticket) => this.start(ticket));
    this.eventBus.on('game:update', (dt) => this.update(dt));
  }

  createMinigameInstance(type) {
    switch (type) {
      // Frontend
      case 'cssLayoutFix':
        return new CssLayoutFixMinigame();
      case 'bugHuntUI':
        return new BugHuntUIMinigame();
      // Backend
      case 'apiPipeline':
        return new ApiPipelineMinigame();
      case 'logDetective':
        return new LogDetectiveMinigame();
      // QA
      case 'bugSpotter':
        return new BugSpotterMinigame();
      case 'testCaseBuilder':
        return new TestCaseBuilderMinigame();
      // DevOps
      case 'yamlSurgeon':
        return new YamlSurgeonMinigame();
      case 'incidentCommander':
        return new IncidentCommanderMinigame();
      default:
        console.warn(`Minigame type ${type} not registered`);
        return null;
    }
  }

  start(ticket) {
    if (!ticket) return;

    this.activeTicket = ticket;
    this.initialTime = ticket.timeLimit || 90;
    this.timeRemaining = this.initialTime;
    this.isActive = true;

    this.activeMinigame = this.createMinigameInstance(ticket.minigameType);
    if (!this.activeMinigame) {
      console.warn(`Minigame type ${ticket.minigameType} not yet registered`);
      return;
    }

    if (this.windowManager && typeof document !== 'undefined') {
      const win = this.windowManager.createWindow({
        id: 'minigame',
        title: `⚡ Thử Thách Kỹ Thuật: ${ticket.title}`,
        width: 720,
        height: 480
      });

      win.setContent(this.activeMinigame.renderDOM());
      this.activeMinigame.bindEvents(win.bodyEl, (result) => {
        this.complete(result);
      });
    }

    this.hud?.showNotification(`🎮 Bắt đầu thử thách! Thời gian: ${this.timeRemaining}s`, 3000, 'info');
  }

  update(deltaTime) {
    if (!this.isActive) return;

    this.timeRemaining -= deltaTime;

    // Review Focus 4: Minigame timer expiring auto-submits current score
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      const currentScore = this.activeMinigame?.checkCompletion() || { score: 0, maxScore: 1 };
      this.hud?.showNotification('⏰ Hết giờ làm bài! Tự động nộp bài.', 3000, 'warning');
      this.complete(currentScore);
    }
  }

  complete(result) {
    if (!this.isActive || !this.activeTicket) return;

    this.isActive = false;
    const timeSpent = this.initialTime - this.timeRemaining;
    const timeRatio = this.initialTime > 0 ? timeSpent / this.initialTime : 1.0;

    const summary = this.ticketSystem.completeTicket(this.activeTicket.id, {
      score: result.score,
      maxScore: result.maxScore,
      timeRatio
    }) || { rank: 'good', awardedKpi: 10, repDelta: 5, stressDelta: 0 };

    // Close minigame window
    if (this.windowManager) {
      this.windowManager.closeWindow('minigame');
    }

    const rankEmotes = {
      perfect: '🌟 XUẤT SẮC (⭐⭐⭐)',
      good: '👍 TỐT (⭐⭐)',
      barely: '⚠️ VỪA ĐỦ ĐẠT (⭐)',
      failed: '💀 THẤT BẠI (0 sao)'
    };

    const msg = `${rankEmotes[summary.rank]} — Nhận: +${summary.awardedKpi} KPI, Rep: ${summary.repDelta >= 0 ? '+' : ''}${summary.repDelta}, Stress: +${summary.stressDelta}`;
    this.hud?.showNotification(msg, 4000, summary.rank === 'failed' ? 'danger' : 'success');

    this.activeTicket = null;
    this.activeMinigame = null;
  }
}

export const globalMinigameManager = new MinigameManager();
