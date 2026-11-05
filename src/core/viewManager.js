import { globalEventBus } from './eventBus.js';

export class ViewManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.officeEl = options.officeEl;
    this.workstationEl = options.workstationEl;
    this.office3dEl = options.office3dEl;
    this.currentView = 'office';

    this.eventBus.on('view:dimension-changed', () => this.applyView());
  }

  init(officeEl, workstationEl, office3dEl = null) {
    this.officeEl = officeEl;
    this.workstationEl = workstationEl;
    this.office3dEl = office3dEl;
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
      const is3D = typeof document !== 'undefined' && document.getElementById('dimension-label')?.textContent?.includes('3D');
      if (this.office3dEl) {
        if (is3D !== false) {
          this.office3dEl.classList.remove('hidden');
          this.officeEl.classList.add('hidden');
        } else {
          this.office3dEl.classList.add('hidden');
          this.officeEl.classList.remove('hidden');
        }
      } else {
        this.officeEl.classList.remove('hidden');
      }
      this.workstationEl.classList.add('hidden');
    } else {
      if (this.office3dEl) this.office3dEl.classList.add('hidden');
      this.officeEl.classList.add('hidden');
      this.workstationEl.classList.remove('hidden');
    }
  }
}

export const globalViewManager = new ViewManager();
