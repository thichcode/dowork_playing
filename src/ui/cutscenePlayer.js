export class CutscenePlayer {
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('modal-container') : null);
    this.isPlaying = false;
  }

  play(scenes = []) {
    return new Promise((resolve) => {
      if (!this.container || scenes.length === 0) {
        resolve();
        return;
      }

      this.isPlaying = true;
      this.container.classList.remove('hidden');

      let currentIdx = 0;

      const renderScene = () => {
        if (currentIdx >= scenes.length) {
          this.container.classList.add('hidden');
          this.container.innerHTML = '';
          this.isPlaying = false;
          resolve();
          return;
        }

        const scene = scenes[currentIdx];
        this.container.innerHTML = `
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-center flex flex-col items-center">
            <div class="text-5xl mb-4 animate-bounce">${scene.icon || '🎬'}</div>
            <h3 class="text-base font-bold text-indigo-400 mb-2">${scene.title || 'Diễn biến cốt truyện'}</h3>
            <p class="text-xs text-slate-300 leading-relaxed font-sans mb-6 text-left whitespace-pre-wrap">${scene.text}</p>
            <button id="btn-next-scene" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition">
              ${currentIdx === scenes.length - 1 ? 'Bắt đầu ngay ▶' : 'Tiếp tục ➔'}
            </button>
          </div>
        `;

        this.container.querySelector('#btn-next-scene')?.addEventListener('click', () => {
          currentIdx += 1;
          renderScene();
        });
      };

      renderScene();
    });
  }
}

export const globalCutscenePlayer = new CutscenePlayer();
