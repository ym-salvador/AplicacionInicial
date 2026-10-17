/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGOS 3.4 Y 3.5: Peso y Nociones de Tiempo
 * Desempeño: Compara pesos con balanza interactiva ("pesa más", "pesa menos") y
 * secuencias temporales cotidianas ("antes", "después").
 */

window.GamePesoTiempo = {
  // 3.4 BALANZA MÁGICA: PESA MÁS Y PESA MENOS
  playBalanza(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2">
            <span class="text-2xl">⚖️</span>
            <span class="font-bold text-amber-950 text-base font-fun">Juego 3.4: La Balanza Mágica</span>
          </div>
        </div>

        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-amber-950 font-bold">
            Toca el objeto que <span class="text-red-600 underline">PESA MÁS</span> y hace bajar la balanza
          </p>
        </div>

        <!-- Balanza Animada Basculante -->
        <div class="relative w-full max-w-md my-4 h-[220px] flex justify-center items-center">
          <div id="scale-beam" class="scale-beam" style="transform: rotate(-12deg);">
            <!-- Plato Izquierdo: Sandía (Pesa más - desciende) -->
            <button id="plate-left" class="scale-pan-left group cursor-pointer focus:outline-none" style="transform: rotate(12deg);" title="Sandía grande">
              <div class="scale-rope"></div>
              <div class="scale-plate group-hover:scale-110 group-hover:border-amber-500 transition-all bg-emerald-50">
                <span class="text-4xl animate-bounce-soft">🍉</span>
              </div>
              <span class="mt-2 text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full shadow">Sandía</span>
            </button>

            <!-- Plato Derecho: Fresa (Pesa menos - asciende) -->
            <button id="plate-right" class="scale-pan-right group cursor-pointer focus:outline-none" style="transform: rotate(12deg);" title="Fresa pequeña">
              <div class="scale-rope"></div>
              <div class="scale-plate group-hover:scale-110 group-hover:border-amber-500 transition-all bg-red-50">
                <span class="text-2xl">🍓</span>
              </div>
              <span class="mt-2 text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full shadow">Fresa</span>
            </button>
          </div>

          <div class="scale-base">
            <div class="scale-fulcrum"></div>
          </div>
        </div>

        <div class="text-center text-slate-600 font-fun text-sm">
          ¡Mira cómo la sandía pesada hace bajar su platillo hacia el suelo!
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira la balanza de Don Lucho! Pusimos una sandía y una fresita. ¿Cuál de los dos objetos pesa más? ¡Tócalo!");

    const plateLeft = document.getElementById('plate-left');
    const plateRight = document.getElementById('plate-right');

    plateLeft.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      plateLeft.querySelector('.scale-plate').classList.add('ring-4', 'ring-green-400');
      window.AppState.recordResult('j3_4_balanza', true, hints);
      window.Kusi.celebrate("¡Excelente! La sandía es pesada y hace bajar el platillo.");
      setTimeout(() => window.App.showGameSuccess('j3_4_balanza'), 2200);
    });

    plateRight.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Recuerda: el objeto que pesa más baja el platillo hacia el suelo. ¿Cuál está abajo?");
      plateLeft.classList.add('pulse-target');
    });
  },

  // 3.5 TIEMPO: ANTES Y DESPUÉS
  playTiempo(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-indigo-300 flex items-center gap-2">
            <span class="text-2xl">⏳</span>
            <span class="font-bold text-indigo-950 text-base font-fun">Juego 3.5: Antes y Después</span>
          </div>
        </div>

        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">
            ¿Qué hacemos en la mañana <span class="text-indigo-700 underline">DESPUÉS</span> de levantarnos?
          </p>
        </div>

        <div class="flex items-center gap-3 bg-white/90 border-2 border-slate-300 px-4 py-2 rounded-2xl shadow-sm my-2">
          <span class="text-3xl">🛏️</span>
          <div>
            <span class="text-[10px] font-bold text-slate-500 uppercase block">Antes</span>
            <span class="text-xs font-bold text-slate-800">Despertamos en la camita</span>
          </div>
          <span class="text-xl text-indigo-500 font-bold ml-2">➔ ¿Luego?</span>
        </div>

        <div class="grid grid-cols-2 gap-5 w-full max-w-lg my-3">
          <!-- Opción Correcta: Lavarse los dientes y tomar desayuno -->
          <button id="opt-morning-s" class="drop-zone border-4 border-indigo-300 bg-white hover:border-indigo-500 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="text-5xl mb-2">🪥</span>
            <span class="font-fun font-bold text-slate-800 text-base">Lavarnos los dientes y desayunar</span>
            <span class="mt-2 text-xs bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">Toca aquí</span>
          </button>

          <!-- Opción Distractora: Dormir de noche -->
          <button id="opt-night-s" class="drop-zone border-4 border-indigo-300 bg-white hover:border-indigo-500 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="text-5xl mb-2">🌙</span>
            <span class="font-fun font-bold text-slate-800 text-base">Dormir con pijamita de noche</span>
            <span class="mt-2 text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">Toca aquí</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("En la mañana, después de despertar en nuestra camita... ¿Qué hacemos después? ¿Asearnos y desayunar o volver a dormir con estrellas?");

    const optMorning = document.getElementById('opt-morning-s');
    const optNight = document.getElementById('opt-night-s');

    optMorning.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      optMorning.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('j3_5_tiempo', true, hints);
      window.Kusi.celebrate("¡Muy bien! Después de despertar nos cepillamos y tomamos desayuno.");
      setTimeout(() => window.App.showGameSuccess('j3_5_tiempo'), 2200);
    });

    optNight.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! En la noche dormimos con la luna, pero en el día después de levantarnos nos cepillamos y aseamos.");
      optMorning.classList.add('pulse-target');
    });
  }
};
