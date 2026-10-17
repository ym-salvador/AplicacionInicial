/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 3 - JUEGOS DE LONGITUD:
 * 1. esp_j3_mas_largo: El Camino Más Largo Que...
 * 2. esp_j3_mas_corto: Cintas de Fiesta Más Cortas
 * 3. esp_j3_puente: El Puente de Madera para Cruzar el Río
 */

window.GameLongitud = {
  // 3.2 EL CAMINO MÁS LARGO QUE...
  playMasLargo(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-emerald-300 flex items-center gap-2">
            <span class="text-2xl">📏</span>
            <span class="font-bold text-emerald-950 text-base font-fun">Juego 3.2: Más Largo Que...</span>
          </div>
        </div>

        <div class="bg-emerald-100 border-2 border-emerald-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-emerald-950 font-bold">
            Toca el camino que es <span class="text-emerald-700 underline">MÁS LARGO QUE</span> el otro 🌸
          </p>
        </div>

        <!-- Dos Caminos Comparativos -->
        <div class="flex flex-col gap-5 w-full max-w-2xl my-3">
          <!-- Camino A: MÁS LARGO (CORRECTO) -->
          <button id="path-long" class="drop-zone border-4 border-emerald-400 bg-white hover:border-emerald-600 hover:scale-[1.02] active:scale-95 transition-all p-3 rounded-3xl flex items-center justify-between cursor-pointer shadow-lg w-full">
            <span class="text-4xl">🐌</span>
            <div class="flex-1 mx-3 h-11 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-around px-2 overflow-hidden shadow-inner">
              <span>🌸</span><span>🌱</span><span>🌼</span><span>🌿</span><span>🌺</span><span>🌸</span><span>🌷</span>
            </div>
            <span class="text-4xl">🏁</span>
          </button>

          <!-- Camino B: MÁS CORTO -->
          <button id="path-short" class="drop-zone border-4 border-slate-300 bg-white hover:border-slate-500 hover:scale-[1.02] active:scale-95 transition-all p-3 rounded-3xl flex items-center justify-between cursor-pointer shadow-lg w-full">
            <span class="text-4xl">🐞</span>
            <div class="w-32 mx-3 h-11 bg-slate-100 border-2 border-slate-300 rounded-2xl flex items-center justify-around px-2 overflow-hidden shadow-inner">
              <span>🌸</span><span>🌼</span>
            </div>
            <span class="text-4xl">🏁</span>
          </button>
        </div>

        <div class="text-center text-slate-600 font-fun text-sm">
          El caracolito tiene que recorrer un camino muy largo con muchas flores... ¿Cuál es?
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira los dos caminos con flores del jardín! Toca el camino que es más largo que el otro.");

    const pathLong = document.getElementById('path-long');
    const pathShort = document.getElementById('path-short');

    pathLong.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      pathLong.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('esp_j3_mas_largo', true, hints);
      window.Kusi.celebrate("¡Excelente! Este camino tiene muchas flores y es más largo que el otro.");
      setTimeout(() => window.App.showGameSuccess('esp_j3_mas_largo'), 2200);
    });

    pathShort.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Ese camino es cortito, tiene pocas flores. Busquemos el camino que es más largo.");
      pathLong.classList.add('pulse-target');
    });
  },

  // 3.3 CINTAS DE FIESTA MÁS CORTAS
  playMasCorto(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-indigo-300 flex items-center gap-2">
            <span class="text-2xl">🎀</span>
            <span class="font-bold text-indigo-950 text-base font-fun">Juego 3.3: Más Corto Que...</span>
          </div>
        </div>

        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">
            Toca la cinta que es <span class="text-indigo-700 underline">MÁS CORTA QUE</span> la otra 🎀
          </p>
        </div>

        <div class="flex flex-col items-center gap-5 w-full max-w-xl my-4">
          <!-- Cinta Larga Morada -->
          <button id="ribbon-long" class="drop-zone border-4 border-purple-300 bg-white hover:border-purple-500 hover:scale-[1.02] active:scale-95 transition-all p-3.5 rounded-3xl flex items-center justify-start cursor-pointer shadow-lg w-full">
            <span class="text-3xl mr-3">🎀</span>
            <div class="flex-1 h-7 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full shadow-inner"></div>
            <span class="ml-3 text-xs font-bold text-slate-500">Cinta Morada</span>
          </button>

          <!-- Cinta Corta Amarilla (CORRECTA) -->
          <button id="ribbon-short" class="drop-zone border-4 border-amber-300 bg-white hover:border-amber-500 hover:scale-[1.02] active:scale-95 transition-all p-3.5 rounded-3xl flex items-center justify-start cursor-pointer shadow-lg w-full">
            <span class="text-3xl mr-3">🎀</span>
            <div class="w-36 h-7 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-inner"></div>
            <span class="ml-3 text-xs font-bold text-slate-500">Cinta Amarilla</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Ahora mira las cintas de fiesta! Toca la cinta que es más corta que la otra.");

    const ribbonLong = document.getElementById('ribbon-long');
    const ribbonShort = document.getElementById('ribbon-short');

    ribbonShort.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      ribbonShort.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('esp_j3_mas_corto', true, hints);
      window.Kusi.celebrate("¡Bravo! La cinta amarilla es más corta que la cinta morada.");
      setTimeout(() => window.App.showGameSuccess('esp_j3_mas_corto'), 2200);
    });

    ribbonLong.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Esa cinta morada es larga. Busquemos la cinta que es más corta.");
      ribbonShort.classList.add('pulse-target');
    });
  },

  // 3.4 EL PUENTE DE MADERA PARA CRUZAR EL RÍO
  playPuente(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2">
            <span class="text-2xl">🪵</span>
            <span class="font-bold text-amber-950 text-base font-fun">Juego 3.4: El Puente para Cruzar el Río</span>
          </div>
        </div>

        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-amber-950 font-bold">
            Toca la tabla <span class="text-amber-800 underline">MÁS LARGA</span> que alcance de orilla a orilla 🌊
          </p>
        </div>

        <!-- Escenario del Río -->
        <div class="relative w-full max-w-2xl h-[170px] bg-cyan-200 border-4 border-cyan-400 rounded-3xl shadow-lg flex items-center justify-between px-6 overflow-hidden my-3">
          <div class="w-16 h-full bg-emerald-300 border-r-4 border-emerald-500 flex items-center justify-center">
            <span class="text-3xl animate-bounce-soft">🦙</span>
          </div>

          <div class="flex-1 flex flex-col items-center justify-center">
            <span class="text-3xl text-cyan-700 animate-pulse">🌊 🌊 🌊</span>
            <span class="text-xs font-bold text-cyan-900 bg-white/70 px-2 py-0.5 rounded-full mt-1">El río ancho</span>
          </div>

          <div class="w-16 h-full bg-emerald-300 border-l-4 border-emerald-500 flex items-center justify-center">
            <span class="text-3xl">🏁</span>
          </div>
        </div>

        <!-- Dos Tablas para Elegir -->
        <div class="flex flex-col items-center gap-4 w-full max-w-lg my-2">
          <!-- Tabla Larga (CORRECTA) -->
          <button id="board-long" class="drop-zone border-4 border-amber-500 bg-amber-100 hover:bg-amber-200 hover:scale-[1.02] active:scale-95 transition-all p-3 rounded-2xl flex items-center justify-center cursor-pointer shadow-md w-full">
            <span class="text-2xl mr-2">🪵</span>
            <div class="w-64 h-6 bg-amber-700 rounded-lg shadow-inner"></div>
            <span class="ml-3 text-xs font-bold text-amber-950">Tabla Larga (Alcanza)</span>
          </button>

          <!-- Tabla Corta -->
          <button id="board-short" class="drop-zone border-4 border-slate-300 bg-white hover:bg-slate-100 hover:scale-[1.02] active:scale-95 transition-all p-3 rounded-2xl flex items-center justify-center cursor-pointer shadow-md w-full">
            <span class="text-2xl mr-2">🪵</span>
            <div class="w-24 h-6 bg-amber-600/70 rounded-lg shadow-inner"></div>
            <span class="ml-3 text-xs font-bold text-slate-600">Tabla Corta (No alcanza)</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Kusi necesita cruzar el río! Toca la tabla de madera que es más larga para que alcance de una orilla a la otra.");

    const boardLong = document.getElementById('board-long');
    const boardShort = document.getElementById('board-short');

    boardLong.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      boardLong.classList.add('border-green-500', 'bg-green-100');
      window.AppState.recordResult('esp_j3_puente', true, hints);
      window.Kusi.celebrate("¡Excelente! La tabla más larga permitió que Kusi cruce el río a salvo.");
      setTimeout(() => window.App.showGameSuccess('esp_j3_puente'), 2200);
    });

    boardShort.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Esa tabla es muy corta y caería al agua. Busquemos la tabla que es más larga.");
      boardLong.classList.add('pulse-target');
    });
  }
};
