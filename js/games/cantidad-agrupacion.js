/**
 * SESIÓN 1 (MUNDO 1: CANTIDAD): "Agrupamos y Comparamos en la Bodeguita de Don Lucho"
 * Con soporte de Arrastre y Soltado Real (Touch y Mouse Drag & Drop).
 * Cada reto adapta su dificultad a la edad (ver js/niveles.js):
 *   3 años: 1 criterio, pocas frutas, 2 colores.  4 años: 3 colores.  5 años: más frutas y comparaciones.
 */

window.Sesion1Games = {
  fruitsByColor: {
    red: [{ e: '🍎', n: 'Manzana roja' }, { e: '🍓', n: 'Fresa roja' }, { e: '🍒', n: 'Cerezas rojas' }],
    yellow: [{ e: '🍌', n: 'Plátano amarillo' }, { e: '🍋', n: 'Limón amarillo' }, { e: '🍍', n: 'Piña amarilla' }],
    green: [{ e: '🥑', n: 'Palta verde' }, { e: '🍏', n: 'Manzana verde' }, { e: '🥒', n: 'Pepino verde' }]
  },
  colorMeta: {
    red: { nombre: 'roja', border: 'border-red-400', bg: 'bg-red-50/90', dot: 'bg-red-500', text: 'text-red-800', item: '#FFE4E6', itemBorder: '#FDA4AF' },
    yellow: { nombre: 'amarilla', border: 'border-amber-400', bg: 'bg-amber-50/90', dot: 'bg-amber-400', text: 'text-amber-800', item: '#FEF9C3', itemBorder: '#FDE047' },
    green: { nombre: 'verde', border: 'border-emerald-400', bg: 'bg-emerald-50/90', dot: 'bg-emerald-500', text: 'text-emerald-800', item: '#DCFCE7', itemBorder: '#86EFAC' }
  },

  header(icon, title, counterId, total, borderClass = 'border-amber-300', bgClass = 'bg-amber-100 text-amber-900') {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span>
          <span class="font-bold text-slate-900 text-base font-fun">${title}</span>
          ${window.CNEB_NIVELES.badge()}
        </div>
        ${counterId ? `<div class="text-sm font-bold ${bgClass} px-3 py-1 rounded-full">Colocadas: <span id="${counterId}">0</span> / ${total}</div>` : ''}
      </div>`;
  },

  // 1.1 AGRUPAR POR COLOR (ARRASTRE REAL A LA CANASTA DE SU COLOR)
  playColor(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j1_1_color');
    const colors = lvl.colores || ['red', 'yellow', 'green'];
    const per = lvl.porColor || 2;
    const items = N.shuffle(colors.flatMap(c => this.fruitsByColor[c].slice(0, per).map(f => ({ ...f, color: c }))));
    const total = items.length;
    let placed = 0;
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('🎨', 'Juego 1.1: Agrupa por Color', 'placed-counter', total)}

        <div class="grid gap-4 w-full my-3" style="grid-template-columns: repeat(${colors.length}, minmax(0, 1fr));">
          ${colors.map(c => { const m = this.colorMeta[c]; return `
            <div id="basket-${c}" class="drop-zone border-4 ${m.border} ${m.bg} flex flex-col items-center justify-start p-3 rounded-2xl min-h-[160px] transition-all" data-target-color="${c}">
              <div class="flex items-center gap-1.5 mb-2">
                <span class="w-5 h-5 rounded-full ${m.dot} border border-white"></span>
                <span class="font-bold ${m.text} text-sm font-fun">Canasta ${m.nombre.charAt(0).toUpperCase() + m.nombre.slice(1)}</span>
              </div>
              <div id="items-${c}" class="flex flex-wrap gap-2 justify-center w-full min-h-[80px]"></div>
            </div>`; }).join('')}
        </div>

        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-amber-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2"><span>👆</span><span>Arrastra con tu dedito cada fruta hacia su canasta:</span></p>
          <div id="fruits-drag-shelf" class="flex flex-wrap justify-center gap-3">
            ${items.map(f => { const m = this.colorMeta[f.color]; return `<button class="concrete-item fruit-drag-item" data-color="${f.color}" data-name="${f.n}" style="width: 72px; height: 72px; background: ${m.item}; border-color: ${m.itemBorder};"><span class="text-4xl">${f.e}</span></button>`; }).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(lvl.voz || '¡Arrastra cada fruta a la canasta de su color!');

    container.querySelectorAll('.fruit-drag-item').forEach(fruitEl => {
      window.ChildDragDrop.makeDraggable(fruitEl, {
        targetSelector: '.drop-zone',
        onClickNoDrag: () => window.Kusi.say('¡Arrastra la fruta con tu dedito y suéltala dentro de su canasta!'),
        onDrop: (el, targetZone) => {
          const itemColor = el.dataset.color;
          if (itemColor === targetZone.dataset.targetColor) {
            window.SoundEngine.playPop();
            window.SoundEngine.playDrop();
            const clone = document.createElement('span');
            clone.className = 'text-3xl animate-pop';
            clone.textContent = el.querySelector('span').textContent;
            targetZone.querySelector('[id^="items-"]').appendChild(clone);
            placed++;
            document.getElementById('placed-counter').textContent = placed;
            if (placed >= total) {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j1_1_color', true, hints);
              window.Kusi.celebrate('¡Excelente! Has llevado todas las frutas a sus canastas correctas.');
              setTimeout(() => window.App.showGameSuccess('j1_1_color'), 2200);
            }
            return true;
          }
          hints++;
          const correctZone = document.getElementById(`basket-${itemColor}`);
          correctZone?.classList.add('pulse-target');
          setTimeout(() => correctZone?.classList.remove('pulse-target'), 1500);
          const nombre = this.colorMeta[itemColor].nombre;
          window.Kusi.giveHint(`¡Buen intento! Esa fruta es de color ${nombre}, llévala a la canasta ${nombre}.`);
          return false;
        },
        onMissDrop: () => window.Kusi.say('¡Casi! Suelta la fruta dentro de una de las canastas.')
      });
    });
  },

  // 1.2 AGRUPAR POR TAMAÑO (CAJA GRANDE O CAJA PEQUEÑA)
  playTamano(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j1_2_tamano');
    const pares = lvl.pares || 2;
    const bigs = [{ e: '🍉', n: 'Sandía grande' }, { e: '🎃', n: 'Zapallo grande' }, { e: '🍍', n: 'Piña grande' }, { e: '🥥', n: 'Coco grande' }];
    const smalls = [{ e: '🍓', n: 'Fresa pequeña' }, { e: '🍇', n: 'Uva pequeña' }, { e: '🫐', n: 'Arándano pequeño' }, { e: '🍒', n: 'Cereza pequeña' }];
    const items = N.shuffle([...bigs.slice(0, pares).map(x => ({ ...x, size: 'big' })), ...smalls.slice(0, pares).map(x => ({ ...x, size: 'small' }))]);
    const total = items.length;
    let placed = 0;
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('📏', 'Juego 1.2: Agrupa por Tamaño', 'size-counter', total, 'border-emerald-300', 'bg-emerald-100 text-emerald-900')}

        <div class="grid grid-cols-2 gap-6 w-full my-3">
          <div id="box-big" class="drop-zone border-4 border-emerald-400 bg-emerald-50/90 flex flex-col items-center justify-start p-4 rounded-3xl min-h-[170px] transition-all" data-target-size="big">
            <span class="font-bold text-emerald-900 text-lg font-fun mb-2 bg-emerald-200 px-4 py-1 rounded-full">Caja GRANDE 📦</span>
            <div id="items-big" class="flex flex-wrap gap-3 justify-center w-full min-h-[80px]"></div>
          </div>
          <div id="box-small" class="drop-zone border-4 border-amber-400 bg-amber-50/90 flex flex-col items-center justify-start p-4 rounded-3xl min-h-[170px] transition-all" data-target-size="small">
            <span class="font-bold text-amber-900 text-lg font-fun mb-2 bg-amber-200 px-4 py-1 rounded-full">Caja PEQUEÑITA 📦</span>
            <div id="items-small" class="flex flex-wrap gap-3 justify-center w-full min-h-[80px]"></div>
          </div>
        </div>

        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-emerald-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2"><span>👆</span><span>Arrastra los objetos grandes a la caja grande y los pequeñitos a la caja pequeña:</span></p>
          <div id="size-drag-shelf" class="flex flex-wrap justify-center items-end gap-4">
            ${items.map(it => it.size === 'big'
              ? `<button class="concrete-item size-drag-item" data-size="big" data-name="${it.n}" style="width: 88px; height: 88px;"><span class="text-6xl">${it.e}</span></button>`
              : `<button class="concrete-item size-drag-item" data-size="small" data-name="${it.n}" style="width: 64px; height: 64px;"><span class="text-3xl">${it.e}</span></button>`).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(lvl.voz || '¡Arrastra lo grande a la caja grande y lo pequeño a la caja pequeña!');

    container.querySelectorAll('.size-drag-item').forEach(itemEl => {
      window.ChildDragDrop.makeDraggable(itemEl, {
        targetSelector: '.drop-zone',
        onClickNoDrag: () => window.Kusi.say('¡Arrastra el objeto con tu dedito hacia la caja que le corresponde!'),
        onDrop: (el, targetZone) => {
          const itemSize = el.dataset.size;
          if (itemSize === targetZone.dataset.targetSize) {
            window.SoundEngine.playPop();
            window.SoundEngine.playDrop();
            const clone = document.createElement('span');
            clone.className = (itemSize === 'big' ? 'text-5xl' : 'text-3xl') + ' animate-pop';
            clone.textContent = el.querySelector('span').textContent;
            document.getElementById(itemSize === 'big' ? 'items-big' : 'items-small').appendChild(clone);
            placed++;
            document.getElementById('size-counter').textContent = placed;
            if (placed >= total) {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult('j1_2_tamano', true, hints);
              window.Kusi.celebrate('¡Bravo! Lo grande a la caja grande y lo pequeño a la caja pequeña.');
              setTimeout(() => window.App.showGameSuccess('j1_2_tamano'), 2200);
            }
            return true;
          }
          hints++;
          const correctBox = document.getElementById(itemSize === 'big' ? 'box-big' : 'box-small');
          correctBox?.classList.add('pulse-target');
          setTimeout(() => correctBox?.classList.remove('pulse-target'), 1500);
          const sizeLabel = itemSize === 'big' ? 'grande' : 'pequeñita';
          window.Kusi.giveHint(`¡Buen intento! Ese objeto es ${sizeLabel}, arrástralo a la caja ${sizeLabel}.`);
          return false;
        },
        onMissDrop: () => window.Kusi.say('¡Suelta el objeto dentro de una de las dos cajas!')
      });
    });
  },

  // 1.3 CUANTIFICADORES: MUCHOS, POCOS Y NINGUNO
  playCuantificadores(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j1_3_cuantificadores');
    const opciones = N.shuffle(lvl.opciones || ['muchas', 'pocas', 'ninguna']);
    const target = N.pick(lvl.preguntas || ['ninguna']);
    const counts = { muchas: lvl.muchas || 6, pocas: lvl.pocas || 1, ninguna: 0 };
    const labels = { muchas: 'MUCHAS', pocas: 'POCAS', ninguna: 'NINGUNA' };
    const letters = ['A', 'B', 'C'];
    let hints = 0;

    const basket = (key, i) => `
      <button class="opt-cuant drop-zone border-4 border-slate-300 bg-white hover:border-indigo-400 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all" data-key="${key}">
        <span class="font-bold text-slate-700 font-fun mb-2">Canasta ${letters[i]}</span>
        <div class="flex flex-wrap justify-center gap-1 text-3xl mb-2 min-h-[60px] items-center ${counts[key] === 0 ? 'text-slate-300' : ''}">
          ${counts[key] === 0 ? '<span>🧺</span>' : Array.from({ length: counts[key] }).map(() => '<span>🍎</span>').join('')}
        </div>
        <span class="text-xs bg-slate-100 px-3 py-0.5 rounded-full font-bold">${key === 'ninguna' ? '¡Vacía!' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
      </button>`;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('🧺', 'Juego 1.3: Cuantificadores', null, 0, 'border-indigo-300')}
        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">¿En cuál canasta hay <span class="text-indigo-700 underline">${labels[target]}</span> frutas?</p>
        </div>
        <div class="grid gap-5 w-full my-4" style="grid-template-columns: repeat(${opciones.length}, minmax(0, 1fr));">${opciones.map(basket).join('')}</div>
        <div class="text-center text-slate-600 font-fun text-sm">Observa las canastas y toca la que tiene ${target === 'ninguna' ? 'ninguna fruta, la vacía' : target + ' frutas'}.</div>
      </div>`;

    const vozPregunta = { muchas: '¿En cuál canasta hay muchas frutas? ¡Tócala!', pocas: '¿En cuál canasta hay pocas frutas? ¡Tócala!', ninguna: '¿En cuál canasta no hay ninguna fruta? ¡Tócala!' };
    window.Kusi.say(`¡Mira las canastas de frutas! ${vozPregunta[target]}`);

    container.querySelectorAll('.opt-cuant').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.key === target) {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('j1_3_cuantificadores', true, hints);
          window.Kusi.celebrate(target === 'ninguna' ? '¡Muy bien! En esa canasta no hay ninguna fruta, está vacía.' : `¡Muy bien! En esa canasta hay ${target} frutas.`);
          setTimeout(() => window.App.showGameSuccess('j1_3_cuantificadores'), 2200);
        } else {
          hints++;
          const pista = { muchas: 'Busquemos la canasta más llena, la que tiene muchas frutas.', pocas: 'Esa no es. Busquemos la canasta que tiene solo unas pocas frutas.', ninguna: 'En esa canasta sí hay frutas. Busquemos la canasta vacía, con ninguna fruta.' };
          window.Kusi.giveHint(`¡Buen intento! ${pista[target]}`);
          container.querySelector(`.opt-cuant[data-key="${target}"]`)?.classList.add('pulse-target');
        }
      });
    });
  },

  // 1.4 COMPARACIÓN DE COLECCIONES: MÁS QUE / MENOS QUE
  playMasMenos(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j1_4_mas_menos');
    const pregunta = N.pick(lvl.preguntas || ['mas']);
    const plates = N.shuffle([
      { name: 'Plato de Camila', count: lvl.mas || 5, key: 'mas' },
      { name: 'Plato de Mateo', count: lvl.menos || 2, key: 'menos' }
    ]);
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('⚖️', 'Juego 1.4: Comparar Colecciones', null, 0, 'border-rose-300')}
        <div class="bg-rose-100 border-2 border-rose-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-rose-950 font-bold">Toca el plato donde hay <span class="text-red-700 underline">${pregunta === 'mas' ? 'MÁS' : 'MENOS'} FRESAS QUE</span> en el otro 🍓</p>
        </div>
        <div class="grid grid-cols-2 gap-8 w-full max-w-xl my-4">
          ${plates.map(p => `
            <button class="opt-plate drop-zone border-4 border-slate-300 bg-white hover:border-rose-400 p-5 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all" data-key="${p.key}">
              <span class="font-bold text-slate-700 font-fun mb-2">${p.name}</span>
              <div class="flex flex-wrap justify-center gap-2 text-4xl mb-3 min-h-[75px] items-center max-w-[180px]">${Array.from({ length: p.count }).map(() => '<span>🍓</span>').join('')}</div>
              <span class="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">Toca aquí</span>
            </button>`).join('')}
        </div>
      </div>`;

    window.Kusi.say(`¡Mira los ricos platos de fresas! ¿En cuál plato hay ${pregunta === 'mas' ? 'más' : 'menos'} fresas que en el otro? ¡Tócalo!`);

    container.querySelectorAll('.opt-plate').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.key === pregunta) {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('j1_4_mas_menos', true, hints);
          window.Kusi.celebrate(`¡Maravilloso! En ese plato hay ${pregunta === 'mas' ? 'más' : 'menos'} fresas que en el otro.`);
          setTimeout(() => window.App.showGameSuccess('j1_4_mas_menos'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(pregunta === 'mas'
            ? '¡Buen intento! En ese plato hay menos fresas. Cuenta y busca el plato que tiene más.'
            : '¡Buen intento! En ese plato hay más fresas. Busca el plato que tiene menos.');
          container.querySelector(`.opt-plate[data-key="${pregunta}"]`)?.classList.add('pulse-target');
        }
      });
    });
  }
};
