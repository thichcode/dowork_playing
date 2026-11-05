import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';
import { globalHUD } from '../ui/hud.js';

export const RANDOM_EVENTS_POOL = [
  {
    id: 'pizza_party',
    title: '🍕 Team mở tiệc Pizza trưa!',
    text: 'Đồng nghiệp trong phòng rủ nhau order pizza xúc xích phô mai. Bạn được ăn no nê mà không tốn đồng nào!',
    effects: { energy: 15, reputation: 5, stress: -5 }
  },
  {
    id: 'phishing_drill',
    title: '🎣 Diễn tập an ninh mạng: Email Phishing!',
    text: 'Có một email gửi đến với tiêu đề "Nhận quà tặng 500k từ Công đoàn". Bạn tỉnh táo không bấm vào link độc hại và report cho IT Security!',
    effects: { kpi: 8, reputation: 3 }
  },
  {
    id: 'laptop_lag',
    title: '💻 Laptop đột ngột dở chứng bị đơ!',
    text: 'Máy tính công ty bỗng nhiên ngốn 99% RAM vì Chrome mở 40 tabs. Bạn phải restart mất 15 phút.',
    effects: { stress: 8 }
  },
  {
    id: 'colleague_birthday',
    title: '🎂 Sinh nhật đồng nghiệp cùng team!',
    text: 'Cả team đứng quây quần hát chúc mừng sinh nhật QA Lead Trang và ăn bánh kem.',
    effects: { reputation: 8, stress: -5 }
  }
];

export class RandomEventsManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.hud = options.hud || globalHUD;
    this.pool = options.pool || RANDOM_EVENTS_POOL;

    this.eventBus.on('day:new-day', () => this.rollDaily());
  }

  rollDaily() {
    // 30% chance to trigger random event
    if (Math.random() <= 0.3) {
      const idx = Math.floor(Math.random() * this.pool.length);
      const event = this.pool[idx];
      this.triggerEvent(event.id);
    }
  }

  triggerEvent(id) {
    const event = this.pool.find((e) => e.id === id);
    if (!event) return null;

    const eff = event.effects || {};
    const player = this.gameState.get('player') || {};

    if (eff.energy) this.gameState.set('player.energy', Math.min(100, (player.energy || 100) + eff.energy));
    if (eff.stress) this.gameState.set('player.stress', Math.max(0, Math.min(100, (player.stress || 20) + eff.stress)));
    if (eff.kpi) this.gameState.set('player.kpi', Math.max(0, Math.min(100, (player.kpi || 50) + eff.kpi)));
    if (eff.reputation) this.gameState.set('player.reputation', Math.max(0, Math.min(100, (player.reputation || 50) + eff.reputation)));

    this.hud?.showNotification(`${event.title} (${event.text})`, 4500, 'info');
    this.eventBus.emit('story:random-event-triggered', event);
    return event;
  }
}

export const globalRandomEventsManager = new RandomEventsManager();
