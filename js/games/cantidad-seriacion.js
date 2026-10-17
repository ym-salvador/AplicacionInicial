/**
 * SESIÓN 2 (MUNDO 1: CANTIDAD): "El Huerto de Seriación y el Trencito de los Ordinales"
 * Con soporte de Arrastre y Soltado Real (Touch y Mouse Drag & Drop).
 * Exige arrastrar cada planta o zanahoria a su ranura; NO se coloca solo con un clic.
 */

window.Sesion2Games = {
  // 2.1 SERIACIÓN DE 5 PLANTAS POR TAMAÑO (ARRASTRE REAL AL HUERTO)
  playPlantas(container) {
    let nextExpected = 1;
    let hints = 0;
    const plantSizes = [
      { id: 3, scale: 0.8, emoji: '🪴' },
      { id: 1, scale: 0.5, emoji: '🌱' },
      { id: 5, scale: 1.25, emoji: '🌳' },
      { id: 2, scale: 0.65, emoji: '🌿' },
      { id: 4, scale: 1.0, emoji: '🌲' }
    ];

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-emerald-300 flex items-center gap-2">
            <span class="text-2xl">🌱</span>
            <span class="font-bold text-emerald-950 text-base font-fun">Juego 2.1: Seriar 5 Plantitas</span>
          </div>
          <div class="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
            Del más pequeño al más grande (1.° al 5.°)
          </div>
        </div>

        <!-- 5 Espacios de Destino (Drop Zones) -->
        <div class="grid grid-cols-5 gap-2 w-full my-3">
          ${[1, 2, 3, 4, 5].map(i => `
            <div id="slot-plant-${i}" class="drop-zone border-3 border-emerald-300 bg-emerald-50/70 flex flex-col items-center justify-center p-2 rounded-2xl min-h-[135px] transition-all" data-slot-id="${i}">
              <span class="text-[11px] font-black text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-full mb-1">${i}.° Puesto</span>
              <div class="slot-content w-full flex items-center justify-center min-h-[70px]"></div>
            </div>
          `).join('')}
        </div>

        <!-- Plantitas desordenadas en la mesa para Arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-emerald-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra la plantita que corresponde al puesto que sigue:</span>
          </p>
          <div id="plants-drag-shelf" class="flex justify-center items-end gap-3.5 min-h-[95px]">
            ${plantSizes.map(p => `
              <button class="concrete-item plant-drag-item flex items-center justify-center cursor-grab" data-id="${p.id}" style="width: 68px; height: 88px;">
                <span style="font-size: ${p.scale * 3}rem;">${p.emoji}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Vamos a sembrar en el huerto! Arrastra con tu dedito la plantita más pequeñita al primer puesto, luego la que sigue en tamaño hasta llegar al gran árbol.");

    const plantBtns = container.querySelectorAll('.plant-drag-item');
    plantBtns.forEach(btn => {
      window.ChildDragDrop.makeDraggable(btn, {
        targetSelector: '.drop-zone',

        onClickNoDrag: () => {
          window.Kusi.say("¡Arrastra la plantita con tu dedito hasta su puesto en el huerto!");
        },

        onDrop: (el, targetZone) => {
          const plantId = parseInt(el.dataset.id);
          const slotId = parseInt(targetZone.dataset.slotId);

          if (slotId === nextExpected && plantId === nextExpected) {
            // Acierto: colocado en el orden correcto
            window.SoundEngine.playPop();
            window.SoundEngine.playCount(nextExpected);

            const slotContent = targetZone.querySelector('.slot-content');
            slotContent.innerHTML = el.innerHTML;
            slotContent.classList.add('animate-pop');

            nextExpected++;

            if (nextExpected <= 5) {
              window.Kusi.say(`¡Muy bien! Ahora arrastra la plantita que sigue en tamaño al puesto ${nextExpected}.`);
            } else {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j2_1_plantas', true, hints);
              window.Kusi.celebrate("¡Excelente! Has ordenado todas las plantitas por tamaño arrastrándolas a su lugar.");
              setTimeout(() => window.App.showGameSuccess('j2_1_plantas'), 2200);
            }
            return true;
          } else {
            hints++;
            const correctSlot = document.getElementById(`slot-plant-${nextExpected}`);
            if (correctSlot) {
              correctSlot.classList.add('pulse-target');
              setTimeout(() => correctSlot.classList.remove('pulse-target'), 1500);
            }

            if (slotId !== nextExpected) {
              window.Kusi.giveHint(`¡Buen intento! Ahora corresponde llenar el puesto número ${nextExpected}.`);
            } else {
              window.Kusi.giveHint("¡Buen intento! Mira bien el tamaño de las plantitas. Busca la que sigue en orden.");
            }
            return false;
          }
        },

        onMissDrop: () => {
          window.Kusi.say("¡Suelta la plantita dentro de su puesto en el huerto!");
        }
      });
    });
  },

  // 2.2 SERIACIÓN DE 5 ZANAHORIAS POR LONGITUD (ARRASTRE REAL)
  playZanahorias(container) {
    let nextExpected = 1;
    let hints = 0;
    const carrots = [
      { id: 4, width: 90, emoji: '🥕' },
      { id: 2, width: 55, emoji: '🥕' },
      { id: 5, width: 115, emoji: '🥕' },
      { id: 1, width: 35, emoji: '🥕' },
      { id: 3, width: 75, emoji: '🥕' }
    ];

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-orange-300 flex items-center gap-2">
            <span class="text-2xl">🥕</span>
            <span class="font-bold text-orange-950 text-base font-fun">Juego 2.2: Zanahorias para el Conejo</span>
          </div>
          <div class="text-xs font-bold bg-orange-100 text-orange-900 px-3 py-1 rounded-full">
            De la más corta a la más larga
          </div>
        </div>

        <!-- 5 Espacios de Destino (Drop Zones) -->
        <div class="grid grid-cols-5 gap-2 w-full my-3">
          ${[1, 2, 3, 4, 5].map(i => `
            <div id="slot-carrot-${i}" class="drop-zone border-3 border-orange-300 bg-orange-50/70 flex flex-col items-center justify-center p-2 rounded-2xl min-h-[120px] transition-all" data-slot-id="${i}">
              <span class="text-[11px] font-black text-orange-900 bg-orange-200 px-2 py-0.5 rounded-full mb-1">${i}.°</span>
              <div class="slot-content flex items-center justify-center w-full min-h-[60px]"></div>
            </div>
          `).join('')}
        </div>

        <!-- Zanahorias para Arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-orange-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra cada zanahoria desde la más cortita hasta la más larga:</span>
          </p>
          <div id="carrots-drag-shelf" class="flex justify-center items-center gap-3 min-h-[80px]">
            ${carrots.map(c => `
              <button class="concrete-item carrot-drag-item flex items-center justify-center p-2 cursor-grab" data-id="${c.id}" style="width: ${c.width + 20}px; height: 60px;">
                <span class="text-3xl">🥕</span>
                <span class="h-3 bg-orange-400 rounded-full inline-block ml-1" style="width: ${c.width * 0.45}px;"></span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡El conejito quiere sus zanahorias! Arrastra con tu dedito desde la zanahoria más cortita hasta la más larga.");

    const carrotBtns = container.querySelectorAll('.carrot-drag-item');
    carrotBtns.forEach(btn => {
      window.ChildDragDrop.makeDraggable(btn, {
        targetSelector: '.drop-zone',

        onClickNoDrag: () => {
          window.Kusi.say("¡Arrastra la zanahoria con tu dedito hacia su puesto!");
        },

        onDrop: (el, targetZone) => {
          const carrotId = parseInt(el.dataset.id);
          const slotId = parseInt(targetZone.dataset.slotId);

          if (slotId === nextExpected && carrotId === nextExpected) {
            window.SoundEngine.playPop();
            window.SoundEngine.playCount(nextExpected);

            const slotContent = targetZone.querySelector('.slot-content');
            slotContent.innerHTML = el.innerHTML;
            slotContent.classList.add('animate-pop');

            nextExpected++;

            if (nextExpected > 5) {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j2_2_zanahorias', true, hints);
              window.Kusi.celebrate("¡Yupi! Has arrastrado todas las zanahorias en orden de longitud.");
              setTimeout(() => window.App.showGameSuccess('j2_2_zanahorias'), 2200);
            }
            return true;
          } else {
            hints++;
            const correctSlot = document.getElementById(`slot-carrot-${nextExpected}`);
            if (correctSlot) {
              correctSlot.classList.add('pulse-target');
              setTimeout(() => correctSlot.classList.remove('pulse-target'), 1500);
            }
            window.Kusi.giveHint(`¡Buen intento! Observa bien el largo. Arrastra la que sigue al puesto ${nextExpected}.`);
            return false;
          }
        },

        onMissDrop: () => {
          window.Kusi.say("¡Suelta la zanahoria dentro de una de las casillas!");
        }
      });
    });
  },

  // 2.3 ORDINALES DEL 1.° AL 5.° EN EL TRENCITO
  playTrencito(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-sky-300 flex items-center gap-2">
            <span class="text-2xl">🚆</span>
            <span class="font-bold text-sky-950 text-base font-fun">Juego 2.3: Ordinales en el Trencito</span>
          </div>
        </div>

        <div class="w-full bg-sky-50 border-3 border-sky-300 rounded-3xl p-3 my-2 shadow overflow-x-auto">
          <div class="flex items-center justify-center gap-2 min-w-[560px]">
            <div class="flex flex-col items-center bg-red-500 text-white p-2.5 rounded-2xl shadow border-2 border-white">
              <span class="text-3xl">🚂</span>
              <span class="text-[10px] font-bold">Locomotora</span>
            </div>
            <div class="flex flex-col items-center bg-amber-300 p-2 rounded-2xl shadow border-2 border-white min-w-[80px]">
              <span class="text-3xl">🐶</span>
              <span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">1.° Lugar</span>
            </div>
            <div class="flex flex-col items-center bg-emerald-300 p-2 rounded-2xl shadow border-2 border-white min-w-[80px]">
              <span class="text-3xl">🐱</span>
              <span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">2.° Lugar</span>
            </div>
            <div class="flex flex-col items-center bg-purple-300 p-2 rounded-2xl shadow border-2 border-white min-w-[80px]">
              <span class="text-3xl">🐰</span>
              <span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">3.° Lugar</span>
            </div>
            <div id="target-wagon-4" class="flex flex-col items-center bg-blue-300 p-2 rounded-2xl shadow border-2 border-white min-w-[80px]">
              <span class="text-3xl">🐑</span>
              <span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">4.° Lugar</span>
            </div>
            <div class="flex flex-col items-center bg-pink-300 p-2 rounded-2xl shadow border-2 border-white min-w-[80px]">
              <span class="text-3xl">🐥</span>
              <span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">5.° Lugar</span>
            </div>
          </div>
        </div>

        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-center my-2 shadow">
          <p class="font-fun text-2xl text-amber-950 font-bold">
            ¿Qué animalito viaja en el <span class="text-blue-700 underline">CUARTO LUGAR (4.°)</span>?
          </p>
        </div>

        <div class="flex justify-center gap-5 my-2">
          <button class="btn-chunky btn-yellow flex items-center gap-2 p-3 opt-train" data-correct="false">
            <span class="text-4xl">🐱</span>
            <span class="text-sm">Gatito</span>
          </button>
          <button class="btn-chunky btn-blue flex items-center gap-2 p-3 opt-train" data-correct="true">
            <span class="text-4xl">🐑</span>
            <span class="text-sm">Ovejita</span>
          </button>
          <button class="btn-chunky btn-coral flex items-center gap-2 p-3 opt-train" data-correct="false">
            <span class="text-4xl">🐥</span>
            <span class="text-sm">Patito</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira el trencito de los animalitos! Cuenta desde la locomotora: primero, segundo, tercero, cuarto... ¿Quién viaja en el cuarto lugar? ¡Tócalo!");

    const opts = container.querySelectorAll('.opt-train');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        const isCorrect = opt.dataset.correct === 'true';
        if (isCorrect) {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j2_3_trencito', true, hints);
          window.Kusi.celebrate("¡Muy bien! La ovejita viaja en el cuarto lugar del trencito.");
          setTimeout(() => window.App.showGameSuccess('j2_3_trencito'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint("¡Buen intento! Contemos los vagones: 1.° el perrito, 2.° el gatito, 3.° el conejito... ¿Quién sigue en el 4.° lugar?");
          document.getElementById('target-wagon-4')?.classList.add('pulse-target');
        }
      });
    });
  },

  // 2.4 PRIMERO Y ÚLTIMO DE LA FILA
  playPrimeroUltimo(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-purple-300 flex items-center gap-2">
            <span class="text-2xl">🚩</span>
            <span class="font-bold text-purple-950 text-base font-fun">Juego 2.4: Primero y Último</span>
          </div>
        </div>

        <div class="bg-purple-100 border-2 border-purple-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-purple-950 font-bold">
            Toca al amigo que está en el <span class="text-purple-700 underline">PRIMER LUGAR</span> de la fila 🚩
          </p>
        </div>

        <div class="flex items-center justify-center gap-4 w-full bg-white/80 p-4 rounded-3xl border-3 border-purple-200 my-4 shadow">
          <div class="flex flex-col items-center bg-amber-400 text-white p-2 rounded-2xl shadow">
            <span class="text-4xl">🚪</span>
            <span class="text-[10px] font-bold">Puerta</span>
          </div>

          <button id="btn-primero" class="concrete-item flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all p-2 border-4 border-purple-400" style="width: 85px; height: 95px;">
            <span class="text-4xl animate-bounce-soft">🦙</span>
            <span class="text-[10px] font-black text-purple-900 bg-purple-200 px-2 py-0.5 rounded-full mt-1">Kusi</span>
          </button>

          <div class="concrete-item flex flex-col items-center justify-center p-2 opacity-80" style="width: 75px; height: 85px;">
            <span class="text-3xl">🧸</span>
            <span class="text-[10px] font-bold text-slate-600">Osito</span>
          </div>

          <div class="concrete-item flex flex-col items-center justify-center p-2 opacity-80" style="width: 75px; height: 85px;">
            <span class="text-3xl">🐶</span>
            <span class="text-[10px] font-bold text-slate-600">Fido</span>
          </div>

          <button id="btn-ultimo" class="concrete-item flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all p-2" style="width: 75px; height: 85px;">
            <span class="text-3xl">🐧</span>
            <span class="text-[10px] font-bold text-slate-600">Pingüi</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Los amiguitos hacen una fila para entrar al aula! ¿Quién está en el primer lugar cerquita de la puerta? ¡Tócalo!");

    const btnPrimero = document.getElementById('btn-primero');
    const btnUltimo = document.getElementById('btn-ultimo');

    btnPrimero.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      btnPrimero.classList.add('bg-green-100', 'border-green-500');
      window.AppState.recordResult('j2_4_primero_ultimo', true, hints);
      window.Kusi.celebrate("¡Bravo! Kusi está en el primer lugar de la fila.");
      setTimeout(() => window.App.showGameSuccess('j2_4_primero_ultimo'), 2200);
    });

    btnUltimo.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! Pingüi está al final de la fila, en el último lugar. Busquemos quién está primero junto a la puerta.");
      btnPrimero.classList.add('pulse-target');
    });
  }
};
