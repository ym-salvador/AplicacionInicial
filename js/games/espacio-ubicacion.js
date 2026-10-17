/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 2: "Ubicación Espacial en el Parque"
 * Juegos con Arrastre y Soltado Real (Touch y Mouse Drag & Drop):
 * 1. esp_j2_cerca_lejos: Cerca y Lejos del Árbol (Arrastrar pelota ⚽ a zona cerca del árbol)
 * 2. esp_j2_al_lado: Al Lado del Tobogán (Arrastrar osito 🧸 a zona al lado del tobogán)
 * 3. esp_j2_posiciones: La Laguna de los Barquitos (Arrastrar barquito ⛵ a orilla del agua)
 */

window.SesionEsp2Games = {
  // 2.1 CERCA Y LEJOS DEL ÁRBOL (ARRASTRE REAL DE LA PELOTA)
  playCercaLejos(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-emerald-300 flex items-center gap-2">
            <span class="text-2xl">🌳</span>
            <span class="font-bold text-emerald-950 text-base font-fun">Juego 2.1: Cerca y Lejos del Árbol</span>
          </div>
        </div>

        <div class="bg-emerald-100 border-2 border-emerald-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-emerald-950 font-bold">
            Arrastra la pelota hasta el lugar que está <span class="text-emerald-700 underline">CERCA DEL ÁRBOL</span> ⚽
          </p>
        </div>

        <!-- Escenario del Parque con Zonas de Soltado (Drop Zones) -->
        <div class="relative w-full max-w-2xl h-[240px] bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 border-4 border-emerald-400 rounded-3xl shadow-xl overflow-hidden my-2 flex items-center justify-between px-8">
          <!-- Árbol grande a la izquierda -->
          <div class="flex flex-col items-center z-10 pointer-events-none">
            <span class="text-7xl drop-shadow-lg">🌳</span>
            <span class="text-xs font-bold bg-white/90 px-3 py-0.5 rounded-full text-emerald-900 shadow">Árbol frondoso</span>
          </div>

          <!-- Zona 1: CERCA DEL ÁRBOL (CORRECTA) -->
          <div id="zone-near" class="drop-zone border-4 border-dashed border-emerald-500 bg-emerald-50/80 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] z-20 shadow-md transition-all" data-target-zone="near">
            <span class="text-xs font-bold text-emerald-800 bg-emerald-200 px-3 py-0.5 rounded-full mb-1">Cerca del árbol</span>
            <span class="text-3xl text-emerald-600">📍</span>
          </div>

          <!-- Zona 2: LEJOS DEL ÁRBOL (DISTRACTOR) -->
          <div id="zone-far" class="drop-zone border-4 border-dashed border-slate-400 bg-white/60 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] z-20 shadow-md transition-all" data-target-zone="far">
            <span class="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-0.5 rounded-full mb-1">Lejos del árbol</span>
            <span class="text-3xl text-slate-400">📍</span>
          </div>

          <!-- Casita lejana -->
          <div class="flex flex-col items-center opacity-80 pointer-events-none">
            <span class="text-6xl">🏡</span>
            <span class="text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full text-slate-700">Casita</span>
          </div>
        </div>

        <!-- Pelota en la base para arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-emerald-200 flex flex-col items-center">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra la pelota con tu dedito hacia el lugar cerquita del árbol:</span>
          </p>
          <div id="ball-source" class="flex justify-center items-center py-1">
            <button id="drag-ball" class="concrete-item cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex items-center justify-center shadow-lg" style="width: 78px; height: 78px; background: #DCFCE7; border-color: #34D399; touch-action: none;">
              <span class="text-5xl">⚽</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Estamos en el parque! Arrastra la pelota con tu dedito hasta el lugar que está cerquita del gran árbol.");

    const ballEl = document.getElementById('drag-ball');
    const zoneNear = document.getElementById('zone-near');
    const zoneFar = document.getElementById('zone-far');

    window.ChildDragDrop.makeDraggable(ballEl, {
      targetSelector: '.drop-zone',

      onClickNoDrag: () => {
        window.Kusi.say("¡Arrastra la pelota con tu dedito hasta el lugar cerquita del gran árbol!");
      },

      onDrop: (el, targetZone) => {
        const isNear = targetZone.id === 'zone-near' || targetZone.dataset.targetZone === 'near';

        if (isNear) {
          window.SoundEngine.playSuccess();
          window.SoundEngine.playDrop();

          zoneNear.innerHTML = '<span class="text-5xl animate-pop">⚽</span>';
          zoneNear.classList.add('bg-green-100', 'border-green-500');

          window.AppState.recordResult('esp_j2_cerca_lejos', true, hints);
          window.Kusi.celebrate("¡Muy bien! Arrastraste la pelota cerquita del gran árbol.");
          setTimeout(() => window.App.showGameSuccess('esp_j2_cerca_lejos'), 2200);
          return true;
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! Esa zona está lejos del árbol, cerquita de la casita. Arrastra la pelota bien cerquita del árbol.");
          zoneNear.classList.add('pulse-target');
          setTimeout(() => zoneNear.classList.remove('pulse-target'), 1500);
          return false;
        }
      },

      onMissDrop: () => {
        window.Kusi.say("¡Casi! Arrastra la pelota y colócala en el círculo cerquita del árbol.");
      }
    });
  },

  // 2.2 AL LADO DEL TOBOGÁN (ARRASTRE REAL DEL OSITO)
  playAlLado(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-sky-300 flex items-center gap-2">
            <span class="text-2xl">🛝</span>
            <span class="font-bold text-sky-950 text-base font-fun">Juego 2.2: Al Lado del Tobogán</span>
          </div>
        </div>

        <div class="bg-sky-100 border-2 border-sky-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-sky-950 font-bold">
            Arrastra al osito hasta el lugar que está <span class="text-sky-700 underline">AL LADO DEL TOBOGÁN</span> 🧸
          </p>
        </div>

        <div class="relative w-full max-w-2xl h-[240px] bg-gradient-to-b from-amber-100 via-sky-100 to-emerald-200 border-4 border-sky-400 rounded-3xl shadow-xl overflow-hidden my-2 flex items-center justify-center gap-8 px-6">
          <!-- Zona Correcta: Al lado izquierdo del tobogán -->
          <div id="zone-beside" class="drop-zone border-4 border-dashed border-sky-500 bg-sky-50/80 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] shadow-md transition-all" data-target-zone="beside">
            <span class="text-xs font-bold text-sky-800 bg-sky-200 px-3 py-0.5 rounded-full mb-1">Al ladito</span>
            <span class="text-3xl text-sky-600">📍</span>
          </div>

          <!-- Tobogán Central -->
          <div class="flex flex-col items-center z-10 pointer-events-none">
            <span class="text-7xl drop-shadow-lg">🛝</span>
            <span class="text-xs font-bold bg-white/90 px-3 py-0.5 rounded-full text-slate-800 shadow">El Tobogán</span>
          </div>

          <!-- Zona Distractora: Muy arriba en el cielo -->
          <div id="zone-sky" class="drop-zone border-4 border-dashed border-slate-300 bg-white/40 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] shadow-md opacity-60 transition-all" data-target-zone="sky">
            <span class="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-0.5 rounded-full mb-1">En el cielo ☁️</span>
            <span class="text-3xl text-slate-400">📍</span>
          </div>
        </div>

        <!-- Osito en la base para arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-sky-200 flex flex-col items-center">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra al osito con tu dedito para sentarlo al lado del tobogán:</span>
          </p>
          <div id="bear-source" class="flex justify-center items-center py-1">
            <button id="drag-bear" class="concrete-item cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex items-center justify-center shadow-lg" style="width: 78px; height: 78px; background: #E0F2FE; border-color: #38BDF8; touch-action: none;">
              <span class="text-5xl">🧸</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira el tobogán! Arrastra al osito con tu dedito hasta el lugar que está al ladito del tobogán para que espere su turno.");

    const bearEl = document.getElementById('drag-bear');
    const zoneBeside = document.getElementById('zone-beside');
    const zoneSky = document.getElementById('zone-sky');

    window.ChildDragDrop.makeDraggable(bearEl, {
      targetSelector: '.drop-zone',

      onClickNoDrag: () => {
        window.Kusi.say("¡Arrastra al osito con tu dedito hasta el lugar que está al ladito del tobogán!");
      },

      onDrop: (el, targetZone) => {
        const isBeside = targetZone.id === 'zone-beside' || targetZone.dataset.targetZone === 'beside';

        if (isBeside) {
          window.SoundEngine.playSuccess();
          window.SoundEngine.playDrop();

          zoneBeside.innerHTML = '<span class="text-5xl animate-pop">🧸</span>';
          zoneBeside.classList.add('bg-green-100', 'border-green-500');

          window.AppState.recordResult('esp_j2_al_lado', true, hints);
          window.Kusi.celebrate("¡Bravo! Sentaste al osito al lado del tobogán.");
          setTimeout(() => window.App.showGameSuccess('esp_j2_al_lado'), 2200);
          return true;
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! En el cielo vuelan los pajaritos, pero el osito debe estar en el suelo, al ladito del tobogán.");
          zoneBeside.classList.add('pulse-target');
          setTimeout(() => zoneBeside.classList.remove('pulse-target'), 1500);
          return false;
        }
      },

      onMissDrop: () => {
        window.Kusi.say("¡Casi! Arrastra al osito y colócalo al ladito del tobogán.");
      }
    });
  },

  // 2.3 LA LAGUNA DE LOS BARQUITOS (ARRASTRE REAL DEL BARQUITO)
  playPosiciones(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-purple-300 flex items-center gap-2">
            <span class="text-2xl">🎪</span>
            <span class="font-bold text-purple-950 text-base font-fun">Juego 2.3: La Laguna de los Barquitos</span>
          </div>
        </div>

        <div class="bg-purple-100 border-2 border-purple-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-purple-950 font-bold">
            Arrastra el barquito hasta el lugar que está <span class="text-purple-700 underline">CERCA DEL AGUA</span> ⛵
          </p>
        </div>

        <!-- Escenario Laguna del Parque -->
        <div class="relative w-full max-w-2xl h-[240px] bg-gradient-to-b from-sky-200 via-emerald-100 to-cyan-300 border-4 border-purple-400 rounded-3xl shadow-xl overflow-hidden my-2 flex items-center justify-around px-6">
          <!-- Montaña lejana -->
          <div class="flex flex-col items-center opacity-70 pointer-events-none">
            <span class="text-6xl">🏔️</span>
            <span class="text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full">Montaña lejos</span>
          </div>

          <!-- Zona Lejana de la montaña -->
          <div id="zone-mountain" class="drop-zone border-4 border-dashed border-slate-400 bg-white/60 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] shadow transition-all" data-target-zone="mountain">
            <span class="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full mb-1">En la montaña</span>
            <span class="text-2xl text-slate-400">📍</span>
          </div>

          <!-- Zona Correcta: En la orilla del agua -->
          <div id="zone-water" class="drop-zone border-4 border-dashed border-cyan-500 bg-cyan-100/90 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] h-[100px] shadow-lg transition-all" data-target-zone="water">
            <span class="text-[11px] font-bold text-cyan-900 bg-cyan-300 px-3 py-0.5 rounded-full mb-1">Cerca del agua</span>
            <span class="text-3xl text-cyan-700">📍</span>
          </div>

          <!-- Laguna -->
          <div class="flex flex-col items-center z-10 pointer-events-none">
            <span class="text-6xl animate-bounce-soft">🌊</span>
            <span class="text-xs font-bold bg-white/90 px-3 py-0.5 rounded-full text-cyan-900 shadow">La Laguna</span>
          </div>
        </div>

        <!-- Barquito en la base para arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-purple-200 flex flex-col items-center">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra el barquito de papel con tu dedito cerca del agua:</span>
          </p>
          <div id="boat-source" class="flex justify-center items-center py-1">
            <button id="drag-boat" class="concrete-item cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex items-center justify-center shadow-lg" style="width: 78px; height: 78px; background: #F3E8FF; border-color: #C084FC; touch-action: none;">
              <span class="text-5xl">⛵</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira la laguna azul! Arrastra el barquito de papel con tu dedito hasta el lugar que está cerquita del agua para que pueda navegar.");

    const boatEl = document.getElementById('drag-boat');
    const zoneWater = document.getElementById('zone-water');
    const zoneMountain = document.getElementById('zone-mountain');

    window.ChildDragDrop.makeDraggable(boatEl, {
      targetSelector: '.drop-zone',

      onClickNoDrag: () => {
        window.Kusi.say("¡Arrastra el barquito con tu dedito hasta la orillita del agua!");
      },

      onDrop: (el, targetZone) => {
        const isWater = targetZone.id === 'zone-water' || targetZone.dataset.targetZone === 'water';

        if (isWater) {
          window.SoundEngine.playSuccess();
          window.SoundEngine.playDrop();

          zoneWater.innerHTML = '<span class="text-5xl animate-pop">⛵</span>';
          zoneWater.classList.add('bg-green-100', 'border-green-500');

          window.AppState.recordResult('esp_j2_posiciones', true, hints);
          window.Kusi.celebrate("¡Excelente! Arrastraste el barquito cerquita del agua para navegar.");
          setTimeout(() => window.App.showGameSuccess('esp_j2_posiciones'), 2200);
          return true;
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! En la montaña no hay agua para navegar. Arrastra el barquito cerquita de la laguna.");
          zoneWater.classList.add('pulse-target');
          setTimeout(() => zoneWater.classList.remove('pulse-target'), 1500);
          return false;
        }
      },

      onMissDrop: () => {
        window.Kusi.say("¡Casi! Arrastra el barquito hasta el lugar cerquita del agua.");
      }
    });
  }
};
