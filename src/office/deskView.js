import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';

export class DeskView {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('desk-view') : null);

    this.isZoomed = false;
    this.isPhoneRinging = false;
    this.activeCallReason = '';

    // Listen to day reset to reset coffee visual
    this.eventBus.on('time:new-day', () => {
      this.updateCoffeeVisual();
    });
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    this.eventBus.emit('desk:zoom-changed', { isZoomed: this.isZoomed });
    this.updateZoomClass();
    return this.isZoomed;
  }

  zoomIn() {
    if (!this.isZoomed) {
      this.isZoomed = true;
      this.eventBus.emit('desk:zoom-changed', { isZoomed: true });
      this.updateZoomClass();
    }
  }

  zoomOut() {
    if (this.isZoomed) {
      this.isZoomed = false;
      this.eventBus.emit('desk:zoom-changed', { isZoomed: false });
      this.updateZoomClass();
    }
  }

  updateZoomClass() {
    if (!this.container) return;
    const monitorFrame = this.container.querySelector('#desk-monitor-frame');
    const deskSurface = this.container.querySelector('#desk-surface');
    const zoomBtn = this.container.querySelector('#btn-zoom-toggle');

    if (this.isZoomed) {
      monitorFrame?.classList.add('desk-monitor-zoomed');
      deskSurface?.classList.add('desk-surface-hidden');
      if (zoomBtn) zoomBtn.innerHTML = '<span>🔍</span><span>Thu nhỏ [Space]</span>';
    } else {
      monitorFrame?.classList.remove('desk-monitor-zoomed');
      deskSurface?.classList.remove('desk-surface-hidden');
      if (zoomBtn) zoomBtn.innerHTML = '<span>🔎</span><span>Phóng to [Space]</span>';
    }
  }

  drinkCoffee() {
    const currentCount = this.gameState.get('time.coffeeCount') || 0;
    if (currentCount >= 3) {
      this.eventBus.emit('notification:show', {
        message: '☕ Bạn đã uống 3 cốc cà phê hôm nay rồi! Uống nữa sẽ say cà phê tim đập nhanh.',
        type: 'warning'
      });
      return false;
    }

    const currentEnergy = this.gameState.get('player.energy') || 50;
    const currentStress = this.gameState.get('player.stress') || 20;

    const newEnergy = Math.min(100, currentEnergy + 15);
    const newStress = Math.max(0, currentStress - 5);

    this.gameState.set('player.energy', newEnergy);
    this.gameState.set('player.stress', newStress);
    this.gameState.set('time.coffeeCount', currentCount + 1);

    this.updateCoffeeVisual();
    this.eventBus.emit('desk:coffee-drunk', { count: currentCount + 1 });
    return true;
  }

  updateCoffeeVisual() {
    if (!this.container) return;
    const coffeeCup = this.container.querySelector('#desk-coffee-cup');
    const coffeeLevel = this.container.querySelector('#desk-coffee-level');
    const currentCount = this.gameState.get('time.coffeeCount') || 0;
    const remaining = Math.max(0, 3 - currentCount);

    if (coffeeLevel) {
      const heightPercent = remaining * 33;
      coffeeLevel.style.height = `${heightPercent}%`;
    }
    if (coffeeCup) {
      coffeeCup.setAttribute('title', `Cốc Cà Phê (Còn ${remaining}/3 cốc hôm nay)`);
    }
  }

  triggerPhoneRing(reason = 'Cuộc gọi khẩn cấp từ PM!') {
    this.isPhoneRinging = true;
    this.activeCallReason = reason;

    if (this.container) {
      const phoneEl = this.container.querySelector('#desk-phone');
      phoneEl?.classList.add('phone-ringing');
      const badge = this.container.querySelector('#desk-phone-badge');
      if (badge) badge.classList.remove('hidden');
    }

    this.eventBus.emit('desk:phone-ringing', { reason });
  }

  answerPhone() {
    if (!this.isPhoneRinging) return false;

    this.isPhoneRinging = false;
    const reason = this.activeCallReason;
    this.activeCallReason = '';

    if (this.container) {
      const phoneEl = this.container.querySelector('#desk-phone');
      phoneEl?.classList.remove('phone-ringing');
      const badge = this.container.querySelector('#desk-phone-badge');
      if (badge) badge.classList.add('hidden');
    }

    this.eventBus.emit('desk:call-answered', { reason });
    return true;
  }

  squeakDuck() {
    const currentStress = this.gameState.get('player.stress') || 20;
    const newStress = Math.max(0, currentStress - 2);
    this.gameState.set('player.stress', newStress);

    if (this.container) {
      const duckEl = this.container.querySelector('#desk-duck');
      duckEl?.classList.add('duck-squeak');
      setTimeout(() => duckEl?.classList.remove('duck-squeak'), 300);
    }

    this.eventBus.emit('desk:duck-squeaked');
    return newStress;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="relative w-full h-full flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 select-none overflow-hidden font-sans">
        
        <!-- Office Room Background View -->
        <div id="desk-bg-office" class="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-950 to-black">
          <div class="absolute top-4 left-1/2 -translate-x-1/2 w-4/5 h-24 border-b border-indigo-500/20 flex justify-between items-end px-12 text-slate-600 text-xs">
            <span>🏢 MegaSoft Office • Floor 18</span>
            <span>🌆 View Landmark 81</span>
          </div>
        </div>

        <!-- NPC Face-to-Face Appearance Stage -->
        <div id="desk-npc-stage" class="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300">
          <!-- NPC sprites / speech injected dynamically by NPCDeskManager -->
        </div>

        <!-- Center Workspace: Monitor Bezel + Desk Items -->
        <div class="relative flex-1 w-full h-full flex flex-col items-center justify-center p-2 z-10">
          
          <!-- Monitor Frame Container -->
          <div id="desk-monitor-frame" class="relative w-[92%] h-[82%] max-w-6xl bg-slate-950 border-[10px] border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
            
            <!-- Webcam taped on top center -->
            <div class="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-700 rounded-full flex items-center justify-center z-30 pointer-events-none">
              <div class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
            </div>

            <!-- Sticky Note dán viền trên màn hình -->
            <div id="desk-sticky-note" class="absolute top-2 right-4 z-30 bg-amber-200 text-amber-950 p-2 rounded shadow-md text-[10px] font-sans font-medium w-36 rotate-2 border border-amber-300 cursor-pointer hover:rotate-0 transition">
              <div class="font-bold border-b border-amber-400 pb-0.5 mb-1 flex justify-between items-center">
                <span>📌 To-Do Hôm Nay:</span>
                <span class="text-[9px] text-amber-800">[Tab]</span>
              </div>
              <div id="desk-sticky-text" class="text-[10px] leading-tight">Hoàn thành ticket Onboarding & uống cafe!</div>
            </div>

            <!-- Zoom Toggle Button on Top Right -->
            <button id="btn-zoom-toggle" class="absolute top-3 left-4 z-30 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border border-slate-700 rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1">
              <span>🔎</span>
              <span>Phóng to [Space]</span>
            </button>

            <!-- Stand up / Explore Office Button -->
            <button id="btn-stand-up" class="absolute top-3 left-44 z-30 px-2.5 py-1 bg-slate-900/90 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1" title="Rời bàn làm việc và đi dạo trong văn phòng [Esc]">
              <span>🚶‍♂️</span>
              <span>Đứng dậy [Esc]</span>
            </button>

            <!-- Monitor Screen Canvas / CyberWork OS Mount Target -->
            <div id="monitor-screen-mount" class="relative flex-1 w-full h-full overflow-hidden bg-slate-900">
              <!-- workstation-os element will be mounted here -->
            </div>
          </div>

          <!-- Physical Desk Surface Layer (below monitor) -->
          <div id="desk-surface" class="relative w-full h-32 bg-gradient-to-t from-amber-950/80 via-slate-900 to-slate-950 border-t-4 border-slate-800 flex items-center justify-between px-10 z-20 transition-all duration-300">
            
            <!-- Left Items: Desk Phone + Rubber Duck -->
            <div class="flex items-center space-x-6">
              <!-- Desk Phone -->
              <div id="desk-phone" class="relative cursor-pointer p-2 rounded-xl hover:bg-slate-800/60 transition group flex flex-col items-center">
                <div class="text-4xl filter drop-shadow">☎️</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5 group-hover:text-amber-400">Điện Thoại [2]</div>
                <span id="desk-phone-badge" class="hidden absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">!</span>
              </div>

              <!-- Rubber Duck -->
              <div id="desk-duck" class="cursor-pointer p-2 rounded-xl hover:bg-slate-800/60 transition group flex flex-col items-center">
                <div class="text-3xl filter drop-shadow hover:scale-110 active:scale-95 transition">🦆</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5 group-hover:text-amber-300">Vịt Cao Su [3]</div>
              </div>
            </div>

            <!-- Center Item: RGB Mechanical Keyboard + Mousepad -->
            <div class="flex flex-col items-center justify-center">
              <div class="w-80 h-10 bg-slate-950 border border-slate-800 rounded-lg shadow-inner flex items-center justify-center space-x-1 px-2 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse pointer-events-none"></div>
                <span class="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Mechanical RGB Keyboard • Press Space to Focus</span>
              </div>
            </div>

            <!-- Right Items: Ceramic Coffee Mug -->
            <div class="flex items-center space-x-6">
              <!-- Coffee Cup -->
              <div id="desk-coffee-cup" class="relative cursor-pointer p-2 rounded-xl hover:bg-slate-800/60 transition group flex flex-col items-center">
                <div class="relative w-10 h-12 border-2 border-slate-600 rounded-b-xl overflow-hidden bg-slate-900 flex items-end">
                  <div id="desk-coffee-level" class="w-full bg-amber-800 transition-all duration-300" style="height: 100%;"></div>
                  <div class="absolute -top-1 left-1 text-slate-400 text-xs animate-bounce opacity-70">♨️</div>
                </div>
                <div class="text-[10px] text-slate-400 font-mono mt-1 group-hover:text-amber-400">Cà Phê [1]</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindDOMEvents();
    this.updateCoffeeVisual();
  }

  bindDOMEvents() {
    if (!this.container) return;

    // Zoom button
    const btnZoom = this.container.querySelector('#btn-zoom-toggle');
    btnZoom?.addEventListener('click', () => this.toggleZoom());

    // Stand up button
    const btnStandUp = this.container.querySelector('#btn-stand-up');
    btnStandUp?.addEventListener('click', () => {
      this.eventBus.emit('desk:stand-up');
    });

    // Coffee cup
    const coffeeEl = this.container.querySelector('#desk-coffee-cup');
    coffeeEl?.addEventListener('click', () => this.drinkCoffee());

    // Phone
    const phoneEl = this.container.querySelector('#desk-phone');
    phoneEl?.addEventListener('click', () => {
      if (this.isPhoneRinging) {
        this.answerPhone();
      } else {
        this.eventBus.emit('notification:show', {
          message: '☎️ Điện thoại im ắng. Khi có sự cố hoặc PM gọi gấp, chuông sẽ reo!',
          type: 'info'
        });
      }
    });

    // Duck
    const duckEl = this.container.querySelector('#desk-duck');
    duckEl?.addEventListener('click', () => {
      this.squeakDuck();
      this.eventBus.emit('notification:show', {
        message: '🦆 Quack! Bạn bóp vịt cao su và kể lể về bug. Tâm trạng nhẹ nhõm hơn (-2 Stress).',
        type: 'success'
      });
    });
  }
}

export const globalDeskView = new DeskView();
