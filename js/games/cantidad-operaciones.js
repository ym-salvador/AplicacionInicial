/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGOS 3.2 Y 3.3: Agregar y Quitar hasta 5
 * Desempeño: Resuelve situaciones sencillas de agregar y quitar hasta 5
 * elementos observando la transformación en tiempo real con material concreto virtual.
 */

window.GameOperaciones = {
  // 3.2 AGREGAR EN LA LAGUNA (2 + 1 = 3)
  playAgregar(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-sky-300 flex items-center gap-2">
            <span class="text-2xl">🦆</span>
            <span class="font-bold text-sky-950 text-base font-fun">Juego 3.2: ¡Vamos a Agregar!</span>
          </div>
        </div>

        <!-- Escenario Laguna -->
        <div class="w-full bg-gradient-to-b from-sky-200 to-cyan-300 border-4 border-sky-400 rounded-3xl p-5 shadow-xl relative min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div class="text-center font-fun text-lg text-sky-900 font-bold bg-white/80 py-1 px-4 rounded-full self-center shadow">
            Habían 2 patitos y llega 1 amigo más...
          </div>

          <!-- Patitos -->
          <div class="flex items-center justify-center gap-5 my-3">
            <div class="flex gap-2 bg-white/40 p-2.5 rounded-2xl border-2 border-sky-200">
              <span class="text-5xl animate-bounce-soft">🦆</span>
              <span class="text-5xl animate-bounce-soft" style="animation-delay: 0.2s;">🦆</span>
            </div>

            <div class="text-3xl font-black text-sky-700 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center shadow">
              +
            </div>

            <div class="flex gap-2 bg-emerald-100/70 p-2.5 rounded-2xl border-2 border-emerald-300 animate-pop">
              <span class="text-5xl animate-bounce-soft" style="animation-delay: 0.4s;">🦆</span>
            </div>
          </div>

          <div class="text-center text-xs font-bold text-sky-900">
            ¿Cuántos patitos hay en total ahora en la laguna?
          </div>
        </div>

        <!-- Opciones Numéricas Grandes -->
        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-sky-200 my-2">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun">Toca el número de patitos que hay ahora:</p>
          <div class="flex justify-center gap-5">
            <button class="btn-chunky btn-yellow flex-1 max-w-[110px] opt-btn-add" data-value="2">
              <span class="text-3xl">2</span>
            </button>
            <button class="btn-chunky btn-green flex-1 max-w-[110px] opt-btn-add" data-value="3">
              <span class="text-3xl">3</span>
            </button>
            <button class="btn-chunky btn-purple flex-1 max-w-[110px] opt-btn-add" data-value="4">
              <span class="text-3xl">4</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("En la laguna estaban nadando 2 patitos. De pronto llega 1 patito amigo más. ¿Cuántos patitos hay ahora en total?");

    const btns = container.querySelectorAll('.opt-btn-add');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.value);
        if (val === 3) {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j3_2_agregar', true, hints);
          window.Kusi.celebrate("¡Excelente! Habían 2 patitos y con 1 más, ¡ahora son 3 patitos!");
          setTimeout(() => window.App.showGameSuccess('j3_2_agregar'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! Contemos los patitos juntos: uno, dos, ¡y tres! Busca el número tres.");
        }
      });
    });
  },

  // 3.3 QUITAR EN EL PÍCNIC (4 - 1 = 3)
  playQuitar(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2">
            <span class="text-2xl">🍪</span>
            <span class="font-bold text-amber-950 text-base font-fun">Juego 3.3: ¡Vamos a Quitar!</span>
          </div>
        </div>

        <!-- Plato de Galletas -->
        <div class="w-full bg-gradient-to-b from-amber-100 to-orange-200 border-4 border-amber-400 rounded-3xl p-5 shadow-xl relative min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div class="text-center font-fun text-lg text-amber-950 font-bold bg-white/80 py-1 px-4 rounded-full self-center shadow">
            Habían 4 galletitas y el monito comió 1...
          </div>

          <!-- Galletas -->
          <div class="flex items-center justify-center gap-4 my-3">
            <div class="flex gap-2.5 bg-white/60 p-3 rounded-3xl border-2 border-amber-300">
              <span class="text-5xl">🍪</span>
              <span class="text-5xl">🍪</span>
              <span class="text-5xl">🍪</span>
              <span class="text-5xl opacity-40 grayscale" title="Comida">🍪</span>
            </div>
          </div>

          <div class="text-center text-xs font-bold text-amber-900">
            ¿Cuántas galletitas quedan en el plato?
          </div>
        </div>

        <!-- Opciones -->
        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-amber-200 my-2">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun">Toca cuántas galletas quedan:</p>
          <div class="flex justify-center gap-5">
            <button class="btn-chunky btn-coral flex-1 max-w-[110px] opt-btn-sub" data-value="2">
              <span class="text-3xl">2</span>
            </button>
            <button class="btn-chunky btn-green flex-1 max-w-[110px] opt-btn-sub" data-value="3">
              <span class="text-3xl">3</span>
            </button>
            <button class="btn-chunky btn-yellow flex-1 max-w-[110px] opt-btn-sub" data-value="5">
              <span class="text-3xl">5</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("Habían 4 galletitas y el monito comió 1. ¿Cuántas galletas ricas quedan ahora en el plato? ¡Toca el número!");

    const btns = container.querySelectorAll('.opt-btn-sub');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.value);
        if (val === 3) {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j3_3_quitar', true, hints);
          window.Kusi.celebrate("¡Muy bien! Quedan 3 galletas en el plato.");
          setTimeout(() => window.App.showGameSuccess('j3_3_quitar'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! Cuenta las galletitas que aún no se han comido: una, dos y tres.");
        }
      });
    });
  }
};
