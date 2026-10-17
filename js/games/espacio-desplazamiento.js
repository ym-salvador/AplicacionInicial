/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 3 - JUEGO 3.1: Desplazamientos en la Cuadrícula
 * Desempeño: Expresa y realiza desplazamientos para guiar a un personaje a una meta
 * usando flechas direccionales táctiles gigantes: hacia adelante, hacia atrás, a un lado, al otro.
 */

window.GameDesplazamiento = {
  desempenoId: 'esp_j3_desplazamiento',
  gridSize: 4,
  playerPos: { r: 3, c: 0 },
  goalPos: { r: 0, c: 3 },
  hintsCount: 0,
  stepsTaken: 0,

  init(container) {
    this.container = container;
    this.playerPos = { r: 3, c: 0 };
    this.hintsCount = 0;
    this.stepsTaken = 0;
    this.render();
  },

  render() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2">
            <span class="text-2xl">🧭</span>
            <span class="font-bold text-amber-950 text-base font-fun">Juego 3.1: Guía a Fido con las Flechas</span>
          </div>
          <div class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
            ¡Usa las flechas grandes!
          </div>
        </div>

        <!-- Cuadrícula 4x4 -->
        <div class="w-full max-w-xs aspect-square bg-amber-50 border-4 border-amber-400 rounded-3xl p-2.5 shadow-xl grid grid-cols-4 gap-2 my-2" id="nav-grid">
          <!-- Celdas dinámicas -->
        </div>

        <!-- Controles de Flechas Direccionales Gigantes (>70px) -->
        <div class="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-amber-300 flex flex-col items-center">
          <p class="text-center font-bold text-slate-700 mb-1 text-xs font-fun">Toca las flechas para caminar:</p>

          <!-- Flecha Adelante (Arriba) -->
          <div class="flex justify-center mb-1.5">
            <button id="btn-dir-up" class="btn-chunky btn-blue btn-circle" title="Hacia adelante" style="width: 72px; height: 72px; min-width: 72px; min-height: 72px;">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>

          <!-- Flechas Laterales y Atrás -->
          <div class="flex justify-center items-center gap-4">
            <!-- Hacia el otro lado (Izquierda) -->
            <button id="btn-dir-left" class="btn-chunky btn-yellow btn-circle" title="Hacia el otro lado" style="width: 72px; height: 72px; min-width: 72px; min-height: 72px;">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <!-- Hacia atrás (Abajo) -->
            <button id="btn-dir-down" class="btn-chunky btn-coral btn-circle" title="Hacia atrás" style="width: 72px; height: 72px; min-width: 72px; min-height: 72px;">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>

            <!-- Hacia un lado (Derecha) -->
            <button id="btn-dir-right" class="btn-chunky btn-green btn-circle" title="Hacia un lado" style="width: 72px; height: 72px; min-width: 72px; min-height: 72px;">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this.updateGrid();
    window.Kusi.say("¡El perrito Fido tiene hambre! Usa las flechas grandes de colores para guiarlo hacia su rico huesito. ¡Adelante y a los lados!");

    document.getElementById('btn-dir-up')?.addEventListener('click', () => this.move(-1, 0, '¡Hacia adelante!'));
    document.getElementById('btn-dir-down')?.addEventListener('click', () => this.move(1, 0, '¡Hacia atrás!'));
    document.getElementById('btn-dir-left')?.addEventListener('click', () => this.move(0, -1, '¡Hacia el otro lado!'));
    document.getElementById('btn-dir-right')?.addEventListener('click', () => this.move(0, 1, '¡Hacia un lado!'));
  },

  updateGrid() {
    const gridEl = document.getElementById('nav-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm border-2';

        if (r === this.playerPos.r && c === this.playerPos.c) {
          cell.className += ' bg-amber-200 border-amber-500 scale-105 shadow-md';
          cell.innerHTML = '<span class="animate-bounce-soft">🐶</span>';
        } else if (r === this.goalPos.r && c === this.goalPos.c) {
          cell.className += ' bg-emerald-100 border-emerald-500 animate-pulse';
          cell.innerHTML = '<span class="text-3xl">🦴</span>';
        } else {
          cell.className += ' bg-white border-slate-200';
          if (r === 3 && c === 0) cell.innerHTML = '<span class="text-xs opacity-20">🐾</span>';
        }

        gridEl.appendChild(cell);
      }
    }
  },

  move(dr, dc, directionVoice) {
    const newR = this.playerPos.r + dr;
    const newC = this.playerPos.c + dc;

    if (newR >= 0 && newR < this.gridSize && newC >= 0 && newC < this.gridSize) {
      this.playerPos.r = newR;
      this.playerPos.c = newC;
      this.stepsTaken++;

      window.SoundEngine.playPop();
      this.updateGrid();

      if (this.playerPos.r === this.goalPos.r && this.playerPos.c === this.goalPos.c) {
        window.SoundEngine.playVictory();
        window.AppState.recordResult(this.desempenoId, true, this.hintsCount);
        window.Kusi.celebrate("¡Yupi! ¡Fido llegó a su rico huesito gracias a tus indicaciones!");
        setTimeout(() => window.App.showGameSuccess(this.desempenoId), 2500);
      } else {
        window.Kusi.say(directionVoice);
      }
    } else {
      this.hintsCount++;
      window.Kusi.giveHint("¡Ouch! El caminito termina ahí. Prueba con otra flecha para seguir avanzando.");
    }
  }
};
