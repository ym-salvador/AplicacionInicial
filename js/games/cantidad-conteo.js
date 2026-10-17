/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGO 3.1: Conteo hasta el 10
 * Desempeño: Utiliza el conteo hasta 10 en situaciones cotidianas
 * asociando material concreto con la palabra-número en voz alta y Marco de Diez.
 */

window.GameConteo = {
  desempenoId: 'j3_1_conteo10',
  count: 0,
  targetCount: 10,
  numberWords: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],

  init(container) {
    this.container = container;
    this.count = 0;
    this.render();
  },

  render() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <!-- Encabezado con contador numérico gigante -->
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-orange-300 flex items-center gap-2">
            <span class="text-2xl">🍊</span>
            <span class="font-bold text-orange-950 text-base font-fun">Juego 3.1: Guardemos 10 Naranjas</span>
          </div>
          <!-- Contador Visual -->
          <div class="flex items-center gap-2 bg-amber-400 border-3 border-white px-4 py-1.5 rounded-2xl shadow">
            <span class="text-white text-sm font-bold">Llevas:</span>
            <span id="counter-display" class="font-fun text-3xl text-amber-950 font-black">0</span>
            <span class="text-amber-900 font-bold text-lg">/ 10</span>
          </div>
        </div>

        <!-- Canasta interactiva en el centro -->
        <div class="relative w-full max-w-md my-2 flex flex-col items-center">
          <div id="basket-zone" class="w-full min-h-[160px] bg-amber-100/90 border-4 border-amber-500 rounded-3xl p-3 shadow-xl flex flex-wrap items-center justify-center gap-2 relative overflow-hidden transition-all">
            <div class="absolute top-2 left-4 bg-amber-600 text-white font-fun px-3 py-0.5 rounded-full text-xs font-bold shadow">
              Canasta de Don Lucho
            </div>
            <div id="basket-fruits" class="flex flex-wrap gap-2 items-center justify-center pt-5"></div>
          </div>
        </div>

        <!-- Marco de Diez -->
        <div class="w-full max-w-lg bg-white/85 border-2 border-orange-200 rounded-2xl p-2 my-1 shadow-sm">
          <p class="text-xs text-center text-slate-600 font-bold mb-1">Tu progreso (Marco de Diez):</p>
          <div id="ten-frame" class="grid grid-cols-10 gap-1.5 justify-items-center">
            ${Array.from({ length: 10 }).map((_, i) => `
              <div id="slot-ten-${i + 1}" class="w-7 h-7 rounded-lg border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                ${i + 1}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mesa con 10 naranjas -->
        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-orange-300 mt-2">
          <p class="text-center font-bold text-orange-950 mb-2 text-sm font-fun">
            Toca una naranja para meterla a la canasta:
          </p>
          <div id="fruits-deck" class="flex flex-wrap justify-center gap-2.5">
            ${Array.from({ length: 10 }).map((_, idx) => `
              <button class="concrete-item orange-btn hover:scale-110 active:scale-90 transition-all cursor-pointer" data-index="${idx + 1}" style="width: 62px; height: 62px; background: #FFEDD5; border-color: #FB923C;">
                <span class="text-3xl">🍊</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Vamos al mercado! Toca cada naranja una por una para guardarla en la canasta hasta llegar a diez.");

    const orangeBtns = this.container.querySelectorAll('.orange-btn');
    orangeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleOrangeClick(btn));
    });
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

    const numberWord = this.numberWords[this.count - 1];
    window.Kusi.say(`¡${this.count}! ${numberWord}`);

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
      slot.className = 'w-7 h-7 rounded-lg border-2 border-orange-500 bg-orange-400 text-white flex items-center justify-center text-xs font-black animate-pop';
      slot.textContent = '🍊';
    }

    if (this.count >= this.targetCount) {
      setTimeout(() => {
        window.SoundEngine.playVictory();
        window.AppState.recordResult(this.desempenoId, true, 0);
        window.Kusi.celebrate("¡Maravilloso! ¡Contaste las 10 naranjas completas en la canasta!");
        setTimeout(() => window.App.showGameSuccess(this.desempenoId), 2500);
      }, 800);
    }
  }
};
