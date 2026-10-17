/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 1: "Formas 2D y Cuerpos 3D en el Entorno"
 * Juegos:
 * 1. esp_j1_formas2d: El Museo de las Formas 2D (círculo, cuadrado, triángulo, rectángulo)
 * 2. esp_j1_cuerpos3d: Cuerpos 3D en la Vida Real (esfera, cubo, cilindro)
 * 3. esp_j1_clasificacion: ¿Rueda o No Rueda? (cuerpos redondos vs figuras planas)
 */

window.SesionEsp1Games = {
  // 1. FORMAS 2D (CÍRCULO, CUADRADO, TRIÁNGULO, RECTÁNGULO)
  playFormas2D(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-indigo-300 flex items-center gap-2">
            <span class="text-2xl">🟡</span>
            <span class="font-bold text-indigo-950 text-base font-fun">Juego 1.1: El Museo de las Formas 2D</span>
          </div>
        </div>

        <!-- Forma Guía a Encontrar -->
        <div class="bg-white/90 border-4 border-indigo-400 rounded-3xl p-3 shadow-xl flex flex-col items-center max-w-md w-full my-2">
          <span class="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Buscamos un objeto con forma de:</span>
          <div class="w-20 h-20 rounded-full bg-amber-400 border-4 border-white shadow flex items-center justify-center animate-bounce-soft">
            <span class="text-xs font-black text-amber-950 font-fun">CÍRCULO</span>
          </div>
        </div>

        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">
            ¿Cuál objeto es redondo como un <span class="text-amber-600 underline">CÍRCULO</span>?
          </p>
        </div>

        <!-- Opciones de Objetos Reales -->
        <div class="grid grid-cols-3 gap-4 w-full my-3">
          <!-- Caja (Cuadrado) -->
          <button class="btn-shape concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="false">
            <span class="text-5xl mb-1">🎁</span>
            <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Caja de regalo</span>
          </button>

          <!-- Moneda (Círculo - CORRECTO) -->
          <button id="target-shape-circle" class="btn-shape concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="true">
            <span class="text-5xl mb-1 animate-wiggle">🪙</span>
            <span class="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">Moneda de sol</span>
          </button>

          <!-- Tajada (Triángulo) -->
          <button class="btn-shape concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="false">
            <span class="text-5xl mb-1">🍉</span>
            <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Tajada triangular</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Estamos en el Museo de las Formas! Buscamos un objeto redondo como el círculo. ¿Es la caja, la moneda o la tajada? ¡Tócalo!");

    const btns = container.querySelectorAll('.btn-shape');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('esp_j1_formas2d', true, hints);
          window.Kusi.celebrate("¡Excelente! La moneda de sol es redonda como un círculo.");
          setTimeout(() => window.App.showGameSuccess('esp_j1_formas2d'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! El círculo es redondito y no tiene esquinas, igual que una moneda o una rueda.");
          document.getElementById('target-shape-circle')?.classList.add('pulse-target');
        }
      });
    });
  },

  // 2. CUERPOS 3D EN LA VIDA REAL (ESFERA, CUBO, CILINDRO)
  playCuerpos3D(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-indigo-300 flex items-center gap-2">
            <span class="text-2xl">🥫</span>
            <span class="font-bold text-indigo-950 text-base font-fun">Juego 1.2: Cuerpos 3D en la Vida Real</span>
          </div>
        </div>

        <!-- Forma 3D: CILINDRO -->
        <div class="bg-white/90 border-4 border-indigo-400 rounded-3xl p-3 shadow-xl flex flex-col items-center max-w-md w-full my-2">
          <span class="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Buscamos un cuerpo con forma de:</span>
          <div class="flex items-center gap-2">
            <span class="text-4xl">🛢️</span>
            <span class="text-lg font-black text-indigo-950 font-fun">CILINDRO</span>
          </div>
        </div>

        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">
            ¿Cuál objeto cotidiano tiene forma de <span class="text-indigo-700 underline">CILINDRO</span>?
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 w-full my-3">
          <!-- Pelota (Esfera) -->
          <button class="btn-3d concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="false">
            <span class="text-5xl mb-1">⚽</span>
            <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Pelota (Esfera)</span>
          </button>

          <!-- Lata (Cilindro - CORRECTO) -->
          <button id="target-shape-cylinder" class="btn-3d concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="true">
            <span class="text-5xl mb-1 animate-wiggle">🥫</span>
            <span class="text-[11px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full">Lata de leche</span>
          </button>

          <!-- Dado (Cubo) -->
          <button class="btn-3d concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="false">
            <span class="text-5xl mb-1">🎲</span>
            <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Dado (Cubo)</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Ahora con cuerpos de tres dimensiones! Buscamos un objeto con forma de cilindro, como una lata o un tambor. ¿Cuál es? ¡Tócalo!");

    const btns = container.querySelectorAll('.btn-3d');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('esp_j1_cuerpos3d', true, hints);
          window.Kusi.celebrate("¡Maravilloso! La lata de leche tiene forma de cilindro.");
          setTimeout(() => window.App.showGameSuccess('esp_j1_cuerpos3d'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! El cilindro tiene bases redondas y rueda como un tubito o una lata.");
          document.getElementById('target-shape-cylinder')?.classList.add('pulse-target');
        }
      });
    });
  },

  // 3. ¿RUEDA O NO RUEDA?
  playClasificacion(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-sky-300 flex items-center gap-2">
            <span class="text-2xl">⚽</span>
            <span class="font-bold text-sky-950 text-base font-fun">Juego 1.3: ¿Rueda o No Rueda?</span>
          </div>
        </div>

        <div class="bg-sky-100 border-2 border-sky-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-sky-950 font-bold">
            Toca el objeto que <span class="text-sky-700 underline">PUEDE RODAR</span> por la resbaladilla 🛝
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6 w-full max-w-lg my-4">
          <!-- Pelota de fútbol (Rueda - CORRECTO) -->
          <button id="opt-roll" class="drop-zone border-4 border-sky-300 bg-white hover:border-sky-500 p-5 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="text-6xl mb-2 animate-bounce-soft">⚽</span>
            <span class="font-fun font-bold text-slate-800 text-lg">Pelota redonda</span>
            <span class="mt-2 text-xs bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-full">¡Sí Rueda!</span>
          </button>

          <!-- Caja cuadrada (No rueda) -->
          <button id="opt-no-roll" class="drop-zone border-4 border-slate-300 bg-white hover:border-slate-400 p-5 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="text-6xl mb-2">📦</span>
            <span class="font-fun font-bold text-slate-800 text-lg">Caja de cartón</span>
            <span class="mt-2 text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">No rueda</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira estos objetos! ¿Cuál de los dos puede rodar por la colina como una esfera redondita? ¡Tócalo!");

    const optRoll = document.getElementById('opt-roll');
    const optNoRoll = document.getElementById('opt-no-roll');

    optRoll.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      optRoll.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('esp_j1_clasificacion', true, hints);
      window.Kusi.celebrate("¡Excelente! La pelota es una esfera redonda y puede rodar por todas partes.");
      setTimeout(() => window.App.showGameSuccess('esp_j1_clasificacion'), 2200);
    });

    optNoRoll.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Las cajas tienen caras planas y no ruedan. Busquemos el objeto redondo que sí rueda.");
      optRoll.classList.add('pulse-target');
    });
  }
};
