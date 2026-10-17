/**
 * SESIÓN 1 (MUNDO 1: CANTIDAD): "Agrupamos y Comparamos en la Bodeguita de Don Lucho"
 * Con soporte de Arrastre y Soltado Real (Touch y Mouse Drag & Drop).
 * Exige arrastrar el objeto a su canasta/caja correspondiente; NO lo coloca con un simple clic.
 */

window.Sesion1Games = {
  // 1.1 AGRUPAR POR COLOR (ARRASTRE REAL A CANASTA ROJA, AMARILLA O VERDE)
  playColor(container) {
    let placed = 0;
    const total = 6;
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2">
            <span class="text-2xl">🎨</span>
            <span class="font-bold text-amber-950 text-base font-fun">Juego 1.1: Agrupa por Color</span>
          </div>
          <div class="text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            Colocadas: <span id="placed-counter">0</span> / 6
          </div>
        </div>

        <!-- 3 Canastas de Destino (Zonas de Soltado / Drop Zones) -->
        <div class="grid grid-cols-3 gap-4 w-full my-3">
          <!-- Canasta Roja -->
          <div id="basket-red" class="drop-zone border-4 border-red-400 bg-red-50/90 flex flex-col items-center justify-start p-3 rounded-2xl min-h-[160px] transition-all" data-target-color="red">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-5 h-5 rounded-full bg-red-500 border border-white"></span>
              <span class="font-bold text-red-800 text-sm font-fun">Canasta Roja</span>
            </div>
            <div id="items-red" class="flex flex-wrap gap-2 justify-center w-full min-h-[80px]"></div>
          </div>

          <!-- Canasta Amarilla -->
          <div id="basket-yellow" class="drop-zone border-4 border-amber-400 bg-amber-50/90 flex flex-col items-center justify-start p-3 rounded-2xl min-h-[160px] transition-all" data-target-color="yellow">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-5 h-5 rounded-full bg-amber-400 border border-white"></span>
              <span class="font-bold text-amber-800 text-sm font-fun">Canasta Amarilla</span>
            </div>
            <div id="items-yellow" class="flex flex-wrap gap-2 justify-center w-full min-h-[80px]"></div>
          </div>

          <!-- Canasta Verde -->
          <div id="basket-green" class="drop-zone border-4 border-emerald-400 bg-emerald-50/90 flex flex-col items-center justify-start p-3 rounded-2xl min-h-[160px] transition-all" data-target-color="green">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-5 h-5 rounded-full bg-emerald-500 border border-white"></span>
              <span class="font-bold text-emerald-800 text-sm font-fun">Canasta Verde</span>
            </div>
            <div id="items-green" class="flex flex-wrap gap-2 justify-center w-full min-h-[80px]"></div>
          </div>
        </div>

        <!-- Frutas en el Estante para Arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-amber-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra con tu dedito cada fruta hacia su canasta:</span>
          </p>
          <div id="fruits-drag-shelf" class="flex flex-wrap justify-center gap-3">
            <button class="concrete-item fruit-drag-item" data-color="red" data-name="Manzana roja" style="width: 72px; height: 72px; background: #FFE4E6; border-color: #FDA4AF;"><span class="text-4xl">🍎</span></button>
            <button class="concrete-item fruit-drag-item" data-color="yellow" data-name="Plátano amarillo" style="width: 72px; height: 72px; background: #FEF9C3; border-color: #FDE047;"><span class="text-4xl">🍌</span></button>
            <button class="concrete-item fruit-drag-item" data-color="green" data-name="Palta verde" style="width: 72px; height: 72px; background: #DCFCE7; border-color: #86EFAC;"><span class="text-4xl">🥑</span></button>
            <button class="concrete-item fruit-drag-item" data-color="red" data-name="Fresa roja" style="width: 72px; height: 72px; background: #FFE4E6; border-color: #FDA4AF;"><span class="text-4xl">🍓</span></button>
            <button class="concrete-item fruit-drag-item" data-color="yellow" data-name="Limón dulce" style="width: 72px; height: 72px; background: #FEF9C3; border-color: #FDE047;"><span class="text-4xl">🍋</span></button>
            <button class="concrete-item fruit-drag-item" data-color="green" data-name="Manzana verde" style="width: 72px; height: 72px; background: #DCFCE7; border-color: #86EFAC;"><span class="text-4xl">🍏</span></button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Bienvenido a la Bodeguita! Arrastra con tu dedito cada fruta hacia la canasta de su mismo color: roja, amarilla o verde.");

    const fruitItems = container.querySelectorAll('.fruit-drag-item');
    fruitItems.forEach(fruitEl => {
      window.ChildDragDrop.makeDraggable(fruitEl, {
        targetSelector: '.drop-zone',

        onClickNoDrag: () => {
          window.Kusi.say("¡Arrastra la fruta con tu dedito y suéltala dentro de su canasta!");
        },

        onDrop: (el, targetZone) => {
          const itemColor = el.dataset.color;
          const targetColor = targetZone.dataset.targetColor;

          if (itemColor === targetColor) {
            // Acierto: soltado en la canasta correcta
            window.SoundEngine.playPop();
            window.SoundEngine.playDrop();

            const targetItemsContainer = targetZone.querySelector('[id^="items-"]');
            const emoji = el.querySelector('span').textContent;

            const clone = document.createElement('span');
            clone.className = 'text-3xl animate-pop';
            clone.textContent = emoji;
            targetItemsContainer.appendChild(clone);

            placed++;
            document.getElementById('placed-counter').textContent = placed;

            if (placed >= total) {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j1_1_color', true, hints);
              window.Kusi.celebrate("¡Excelente! Has arrastrado todas las frutas a sus canastas correctas.");
              setTimeout(() => window.App.showGameSuccess('j1_1_color'), 2200);
            }
            return true;
          } else {
            // Error constructivo: soltado en canasta equivocada
            hints++;
            const correctZone = document.getElementById(`basket-${itemColor}`);
            if (correctZone) {
              correctZone.classList.add('pulse-target');
              setTimeout(() => correctZone.classList.remove('pulse-target'), 1500);
            }

            const colorNames = { red: 'roja', yellow: 'amarilla', green: 'verde' };
            window.Kusi.giveHint(`¡Buen intento! Esa fruta es de color ${colorNames[itemColor]}, llévala a la canasta ${colorNames[itemColor]}.`);
            return false;
          }
        },

        onMissDrop: () => {
          // Soltó fuera de cualquier canasta
          window.Kusi.say("¡Casi! Suelta la fruta dentro de una de las canastas.");
        }
      });
    });
  },

  // 1.2 AGRUPAR POR TAMAÑO (ARRASTRE REAL A CAJA GRANDE O CAJA PEQUEÑA)
  playTamano(container) {
    let placed = 0;
    const total = 4;
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-emerald-300 flex items-center gap-2">
            <span class="text-2xl">📏</span>
            <span class="font-bold text-emerald-950 text-base font-fun">Juego 1.2: Agrupa por Tamaño</span>
          </div>
          <div class="text-sm font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
            Colocados: <span id="size-counter">0</span> / 4
          </div>
        </div>

        <!-- Dos Cajas de Destino (Drop Zones) -->
        <div class="grid grid-cols-2 gap-6 w-full my-3">
          <!-- Caja Grande -->
          <div id="box-big" class="drop-zone border-4 border-emerald-400 bg-emerald-50/90 flex flex-col items-center justify-start p-4 rounded-3xl min-h-[170px] transition-all" data-target-size="big">
            <span class="font-bold text-emerald-900 text-lg font-fun mb-2 bg-emerald-200 px-4 py-1 rounded-full">Caja GRANDE 📦</span>
            <div id="items-big" class="flex flex-wrap gap-3 justify-center w-full min-h-[80px]"></div>
          </div>

          <!-- Caja Pequeña -->
          <div id="box-small" class="drop-zone border-4 border-amber-400 bg-amber-50/90 flex flex-col items-center justify-start p-4 rounded-3xl min-h-[170px] transition-all" data-target-size="small">
            <span class="font-bold text-amber-900 text-lg font-fun mb-2 bg-amber-200 px-4 py-1 rounded-full">Caja PEQUEÑITA 📦</span>
            <div id="items-small" class="flex flex-wrap gap-3 justify-center w-full min-h-[80px]"></div>
          </div>
        </div>

        <!-- Objetos en el estante para Arrastrar -->
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-emerald-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Arrastra los objetos grandes a la caja grande y los pequeñitos a la caja pequeña:</span>
          </p>
          <div id="size-drag-shelf" class="flex justify-center items-end gap-6">
            <!-- Sandía Grande -->
            <button class="concrete-item size-drag-item" data-size="big" data-name="Sandía grande" style="width: 88px; height: 88px;"><span class="text-6xl">🍉</span></button>
            <!-- Fresa Pequeña -->
            <button class="concrete-item size-drag-item" data-size="small" data-name="Fresa pequeña" style="width: 68px; height: 68px;"><span class="text-3xl">🍓</span></button>
            <!-- Zapallo Grande -->
            <button class="concrete-item size-drag-item" data-size="big" data-name="Zapallo grande" style="width: 88px; height: 88px;"><span class="text-6xl">🎃</span></button>
            <!-- Uva Pequeña -->
            <button class="concrete-item size-drag-item" data-size="small" data-name="Uva pequeña" style="width: 68px; height: 68px;"><span class="text-3xl">🍇</span></button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira los tamaños! Arrastra con tu dedito las frutas grandes a la caja grande, y las frutas pequeñitas a la caja pequeña.");

    const sizeItems = container.querySelectorAll('.size-drag-item');
    sizeItems.forEach(itemEl => {
      window.ChildDragDrop.makeDraggable(itemEl, {
        targetSelector: '.drop-zone',

        onClickNoDrag: () => {
          window.Kusi.say("¡Arrastra el objeto con tu dedito hacia la caja que le corresponde!");
        },

        onDrop: (el, targetZone) => {
          const itemSize = el.dataset.size;
          const targetSize = targetZone.dataset.targetSize;

          if (itemSize === targetSize) {
            window.SoundEngine.playPop();
            window.SoundEngine.playDrop();

            const targetContainer = document.getElementById(itemSize === 'big' ? 'items-big' : 'items-small');
            const emoji = el.querySelector('span').textContent;

            const clone = document.createElement('span');
            clone.className = (itemSize === 'big' ? 'text-5xl' : 'text-3xl') + ' animate-pop';
            clone.textContent = emoji;
            targetContainer.appendChild(clone);

            placed++;
            document.getElementById('size-counter').textContent = placed;

            if (placed >= total) {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j1_2_tamano', true, hints);
              window.Kusi.celebrate("¡Bravo! Arrastraste correctamente lo grande a la caja grande y lo pequeño a la caja pequeña.");
              setTimeout(() => window.App.showGameSuccess('j1_2_tamano'), 2200);
            }
            return true;
          } else {
            hints++;
            const correctBox = document.getElementById(itemSize === 'big' ? 'box-big' : 'box-small');
            if (correctBox) {
              correctBox.classList.add('pulse-target');
              setTimeout(() => correctBox.classList.remove('pulse-target'), 1500);
            }
            const sizeLabel = itemSize === 'big' ? 'grande' : 'pequeñita';
            window.Kusi.giveHint(`¡Buen intento! Ese objeto es ${sizeLabel}, arrástralo a la caja ${sizeLabel}.`);
            return false;
          }
        },

        onMissDrop: () => {
          window.Kusi.say("¡Suelta el objeto dentro de una de las dos cajas!");
        }
      });
    });
  },

  // 1.3 CUANTIFICADORES: MUCHOS, POCOS Y NINGUNO
  playCuantificadores(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-indigo-300 flex items-center gap-2">
            <span class="text-2xl">🧺</span>
            <span class="font-bold text-indigo-950 text-base font-fun">Juego 1.3: Cuantificadores</span>
          </div>
        </div>

        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">
            ¿En cuál canasta <span class="text-indigo-700 underline">NO HAY NINGUNA</span> fruta?
          </p>
        </div>

        <div class="grid grid-cols-3 gap-5 w-full my-4">
          <button id="opt-muchas-c" class="drop-zone border-4 border-slate-300 bg-white hover:border-indigo-400 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="font-bold text-slate-700 font-fun mb-2">Canasta A</span>
            <div class="grid grid-cols-3 gap-1 text-3xl mb-2">
              <span>🍎</span><span>🍎</span><span>🍎</span>
              <span>🍎</span><span>🍎</span><span>🍎</span>
            </div>
            <span class="text-xs bg-slate-100 px-3 py-0.5 rounded-full font-bold">Muchas</span>
          </button>

          <button id="opt-pocas-c" class="drop-zone border-4 border-slate-300 bg-white hover:border-indigo-400 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="font-bold text-slate-700 font-fun mb-2">Canasta B</span>
            <div class="flex items-center justify-center min-h-[60px] text-3xl mb-2">
              <span>🍎</span>
            </div>
            <span class="text-xs bg-slate-100 px-3 py-0.5 rounded-full font-bold">Pocas</span>
          </button>

          <button id="opt-ninguna-c" class="drop-zone border-4 border-slate-300 bg-white hover:border-indigo-400 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="font-bold text-slate-700 font-fun mb-2">Canasta C</span>
            <div class="flex items-center justify-center min-h-[60px] text-3xl mb-2 text-slate-300">
              <span>🧺</span>
            </div>
            <span class="text-xs bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full font-bold">¡Vacía!</span>
          </button>
        </div>

        <div class="text-center text-slate-600 font-fun text-sm">
          Observa las tres canastas y toca la que está completamente vacía, ¡ninguna fruta!
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira las tres canastas! Una tiene muchas frutas, otra tiene pocas... ¿En cuál canasta no hay ninguna fruta? ¡Tócala!");

    const optNinguna = document.getElementById('opt-ninguna-c');
    const optMuchas = document.getElementById('opt-muchas-c');
    const optPocas = document.getElementById('opt-pocas-c');

    optNinguna.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      optNinguna.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('j1_3_cuantificadores', true, hints);
      window.Kusi.celebrate("¡Muy bien! En esa canasta no hay ninguna fruta, está vacía.");
      setTimeout(() => window.App.showGameSuccess('j1_3_cuantificadores'), 2200);
    });

    [optMuchas, optPocas].forEach(el => {
      el.addEventListener('click', () => {
        hints++;
        window.Kusi.giveHint("¡Buen intento! En esa canasta sí hay frutas. Busquemos la canasta que está vacía, con ninguna fruta.");
        optNinguna.classList.add('pulse-target');
      });
    });
  },

  // 1.4 COMPARACIÓN DE COLECCIONES: MÁS QUE / MENOS QUE
  playMasMenos(container) {
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        <div class="w-full flex items-center justify-between mb-2">
          <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 border-coral-300 flex items-center gap-2">
            <span class="text-2xl">⚖️</span>
            <span class="font-bold text-coral-950 text-base font-fun">Juego 1.4: Comparar Colecciones</span>
          </div>
        </div>

        <div class="bg-coral-100 border-2 border-coral-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-coral-950 font-bold">
            Toca el plato donde hay <span class="text-red-700 underline">MÁS QUE</span> en el otro 🍓
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full max-w-xl my-4">
          <button id="plate-more" class="drop-zone border-4 border-coral-300 bg-white hover:border-coral-500 p-5 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="font-bold text-slate-700 font-fun mb-2">Plato de Camila</span>
            <div class="grid grid-cols-3 gap-2 text-4xl mb-3">
              <span>🍓</span><span>🍓</span><span>🍓</span>
              <span>🍓</span><span>🍓</span>
            </div>
            <span class="text-xs bg-coral-100 text-coral-800 px-3 py-1 rounded-full font-bold">Toca aquí</span>
          </button>

          <button id="plate-less" class="drop-zone border-4 border-slate-300 bg-white hover:border-slate-500 p-5 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all">
            <span class="font-bold text-slate-700 font-fun mb-2">Plato de Mateo</span>
            <div class="flex gap-2 text-4xl mb-3 min-h-[75px] items-center">
              <span>🍓</span><span>🍓</span>
            </div>
            <span class="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">Toca aquí</span>
          </button>
        </div>
      </div>
    `;

    window.Kusi.say("¡Mira los ricos platos de fresas! ¿En cuál plato hay más fresas que en el otro? ¡Tócalo!");

    const plateMore = document.getElementById('plate-more');
    const plateLess = document.getElementById('plate-less');

    plateMore.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      plateMore.classList.add('border-green-500', 'bg-green-50');
      window.AppState.recordResult('j1_4_mas_menos', true, hints);
      window.Kusi.celebrate("¡Maravilloso! En el plato de Camila hay más fresas que en el plato de Mateo.");
      setTimeout(() => window.App.showGameSuccess('j1_4_mas_menos'), 2200);
    });

    plateLess.addEventListener('click', () => {
      hints++;
      window.Kusi.giveHint("¡Buen intento! En ese plato hay solo dos fresitas, es decir, menos fresas. Busquemos el plato que tiene más.");
      plateMore.classList.add('pulse-target');
    });
  }
};
