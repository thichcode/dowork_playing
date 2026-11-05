import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';
import { globalTimeSystem } from '../office/timeSystem.js';
import { MVP_TICKETS } from '../data/tickets.js';

export class TicketSystem {
  constructor(options = {}) {
    this.tickets = options.tickets || MVP_TICKETS;
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.timeSystem = options.timeSystem || globalTimeSystem;
  }

  getTicketsForChapter(chapter, role) {
    return this.tickets.filter((t) => t.role === role && t.chapter <= chapter);
  }

  getTicketById(id) {
    return this.tickets.find((t) => t.id === id);
  }

  isTicketCompleted(id) {
    const completed = this.gameState.get('completedTickets') || [];
    return completed.includes(id);
  }

  startTicket(id) {
    const ticket = this.getTicketById(id);
    if (!ticket) return null;

    this.gameState.set('activeTicket', id);
    this.eventBus.emit('minigame:start', ticket);
    return ticket;
  }

  completeTicket(id, result = {}) {
    const ticket = this.getTicketById(id);
    if (!ticket) return null;

    const { score = 0, maxScore = 1, timeRatio = 1.0 } = result;
    const ratio = maxScore > 0 ? score / maxScore : 0;

    let rank = 'failed';
    let kpiMultiplier = 0;
    let stressDelta = ticket.penalties?.stress || 10;
    let repDelta = 0;

    if (ratio >= 1.0 && timeRatio <= 0.6) {
      rank = 'perfect';
      kpiMultiplier = 1.5;
      stressDelta = -5;
      repDelta = ticket.rewards?.reputation || 5;
    } else if (ratio >= 0.7) {
      rank = 'good';
      kpiMultiplier = 1.0;
      stressDelta = 0;
      repDelta = ticket.rewards?.reputation || 5;
    } else if (ratio >= 0.4) {
      rank = 'barely';
      kpiMultiplier = 0.5;
      stressDelta = 5;
      repDelta = 0;
    } else {
      rank = 'failed';
      kpiMultiplier = 0;
      stressDelta = ticket.penalties?.stress || 15;
      repDelta = ticket.penalties?.reputation || -5;
    }

    const baseKpi = ticket.rewards?.kpi || 10;
    const awardedKpi = Math.round(baseKpi * kpiMultiplier);

    // Update Player Stats
    const currentKpi = this.gameState.get('player.kpi') || 50;
    const currentRep = this.gameState.get('player.reputation') || 50;
    const currentStress = this.gameState.get('player.stress') || 20;

    const newKpi = Math.max(0, Math.min(100, currentKpi + (rank === 'failed' ? (ticket.penalties?.kpi || -5) : awardedKpi)));
    const newRep = Math.max(0, Math.min(100, currentRep + repDelta));
    const newStress = Math.max(0, Math.min(100, currentStress + stressDelta));

    this.gameState.set('player.kpi', newKpi);
    this.gameState.set('player.reputation', newRep);
    this.gameState.set('player.stress', newStress);

    // Mark as completed in state
    const completed = this.gameState.get('completedTickets') || [];
    if (!completed.includes(id)) {
      this.gameState.set('completedTickets', [...completed, id]);
    }
    this.gameState.set('activeTicket', null);

    // Advance in-game time
    if (this.timeSystem && ticket.gameDuration) {
      this.timeSystem.advanceMinutes(ticket.gameDuration);
    }

    const summary = {
      ticketId: id,
      rank,
      awardedKpi,
      repDelta,
      stressDelta,
      score,
      maxScore
    };

    this.eventBus.emit('ticket:completed', summary);
    return summary;
  }
}

export const globalTicketSystem = new TicketSystem();
