import { globalEventBus } from './eventBus.js';

export class ViewManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.officeEl = options.officeEl;
    this.workstationEl = options.workstationEl;
    this.currentView = 'office';
  }

  init(officeEl, workstationEl) {
    this.officeEl = officeEl;
    this.workstationEl = workstationEl;
    this.applyView();
  }

  switch(view) {
    if (view !== 'office' && view !== 'workstation') return;
    this.currentView = view;
    this.applyView();
    this.eventBus.emit('view:changed', view);
  }

  applyView() {
    if (!this.officeEl || !this.workstationEl) return;
    if (this.currentView === 'office') {
      this.officeEl.classList.remove('hidden');
      this.workstationEl.classList.add('hidden');
    } else {
      this.officeEl.classList.add('hidden');
      this.workstationEl.classList.remove('hidden');
    }
  }
}

export const globalViewManager = new ViewManager();
