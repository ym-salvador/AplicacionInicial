/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGO 3.1: Conteo con material concreto
 * Desempeño: utiliza el conteo en situaciones cotidianas asociando objeto, palabra-número y marco.
 * Nivel por edad (js/niveles.js): 3 años cuenta hasta 3, 4 años hasta 5, 5 años hasta 10.
 */

window.GameConteo = {
  desempenoId: 'j3_1_conteo10',
  count: 0,
  targetCount: 10,
  numberWords: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],

  init(container) {
    this.container = container;
    this.count = 0;
    const lvl = window.CNEB_NIVELES.get(this.desempenoId);
    this.targetCount = lvl.hasta || 10;
    this.voz = lvl.voz;
    this.render();
  },

  render() {
    const n = this.targetCount;
    const slotSize = n <= 5 ? 'w-10 h-10 text-sm' : 'w-7 h-7 text-xs';
    this.container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-orange-300 flex items-center gap-2">
            <span class="text-2xl">🍊</span>
            <span class="font-bold text-orange-950 text-base font-fun">Juego 3.1: Guardemos ${n} Naranjas</span>
            ${window.CNEB_NIVELES.badge()}
          </div>
          <div class="flex items-center gap-2 bg-amber-400 border-3 border-white px-4 py-1.5 rounded-2xl shadow">
            <span class="text-white text-sm font-bold">Llevas:</span>
            <span id="counter-display" class="font-fun text-3xl text-amber-950 font-black">0</span>
            <span class="text-amber-900 font-bold text-lg">/ ${n}</span>
          </div>
        </div>

        <div class="relative w-full max-w-md my-2 flex flex-col items-center">
          <div id="basket-zone" class="w-full min-h-[160px] bg-amber-100/90 border-4 border-amber-500 rounded-3xl p-3 shadow-xl flex flex-wrap items-center justify-center gap-2 relative overflow-hidden transition-all">
            <div class="absolute top-2 left-4 bg-amber-600 text-white font-fun px-3 py-0.5 rounded-full text-xs font-bold shadow">Canasta de Don Lucho</div>
            <div id="basket-fruits" class="flex flex-wrap gap-2 items-center justify-center pt-5"></div>
          </div>
        </div>

        <div class="w-full max-w-lg bg-white/85 border-2 border-orange-200 rounded-2xl p-2 my-1 shadow-sm">
          <p class="text-xs text-center text-slate-600 font-bold mb-1">Tu progreso (Marco de ${n}):</p>
          <div id="ten-frame" class="grid gap-1.5 justify-items-center" style="grid-template-columns: repeat(${n}, minmax(0, 1fr));">
            ${Array.from({ length: n }).map((_, i) => `<div id="slot-ten-${i + 1}" class="${slotSize} rounded-lg border-2 border-slate-300 bg-slate-50 flex items-center justify-center font-bold text-slate-400">${i + 1}</div>`).join('')}
          </div>
        </div>

        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-orange-300 mt-2">
          <p class="text-center font-bold text-orange-950 mb-2 text-sm font-fun">Toca una naranja para meterla a la canasta:</p>
          <div id="fruits-deck" class="flex flex-wrap justify-center gap-2.5">
            ${Array.from({ length: n }).map((_, idx) => `<button class="concrete-item orange-btn hover:scale-110 active:scale-90 transition-all cursor-pointer" data-index="${idx + 1}" style="width: ${n <= 5 ? 76 : 62}px; height: ${n <= 5 ? 76 : 62}px; background: #FFEDD5; border-color: #FB923C;"><span class="${n <= 5 ? 'text-4xl' : 'text-3xl'}">🍊</span></button>`).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(this.voz || `¡Vamos al mercado! Toca cada naranja una por una para guardarla en la canasta hasta llegar a ${this.numberWords[n - 1]}.`);
    this.container.querySelectorAll('.orange-btn').forEach(btn => btn.addEventListener('click', () => this.handleOrangeClick(btn)));
  },

  handleOrangeClick(btn) {
    if (btn.classList.contains('placed') || this.count >= this.targetCount) return;
    btn.classList.add('placed');
    btn.style.opacity = '0.3';
    btn.style.transform = 'scale(0.8)';
    btn.disabled = true;
    this.count++;

    window.SoundEngine.playPop();
    window.SoundEngine.playCount(this.count);
    window.Kusi.say(`¡${this.count}! ${this.numberWords[this.count - 1]}`);

    const display = document.getElementById('counter-display');
    if (display) {
      display.textContent = this.count;
      display.classList.add('animate-wiggle');
      setTimeout(() => display.classList.remove('animate-wiggle'), 300);
    }
    const basketFruits = document.getElementById('basket-fruits');
    if (basketFruits) {
      const fruit = document.createElement('span');
      fruit.className = 'text-3xl animate-pop';
      fruit.textContent = '🍊';
      basketFruits.appendChild(fruit);
    }
    const slot = document.getElementById(`slot-ten-${this.count}`);
    if (slot) {
      slot.className = slot.className.replace('border-slate-300 bg-slate-50 text-slate-400', 'border-orange-500 bg-orange-400 text-white animate-pop');
      slot.textContent = '🍊';
    }

    if (this.count >= this.targetCount) {
      setTimeout(() => {
        window.SoundEngine.playVictory();
        window.AppState.recordResult(this.desempenoId, true, 0);
        window.Kusi.celebrate(`¡Maravilloso! ¡Contaste las ${this.targetCount} naranjas completas en la canasta!`);
        setTimeout(() => window.App.showGameSuccess(this.desempenoId), 2500);
      }, 800);
    }
  }
};
