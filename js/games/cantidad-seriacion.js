/**
 * SESIÓN 2 (MUNDO 1: CANTIDAD): "El Huerto de Seriación y el Trencito de los Ordinales"
 * Con soporte de Arrastre y Soltado Real (Touch y Mouse Drag & Drop).
 * Dificultad por edad (js/niveles.js): 3 años seria 3 objetos, 4 años 4 y 5 años 5;
 * ordinales hasta el 3.° (4 años) o hasta el 5.° (5 años); fila de 3, 4 o 5 amigos.
 */

window.Sesion2Games = {
  ordinalWord: ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto'],

  header(icon, title, note, borderClass = 'border-emerald-300', noteClass = 'bg-emerald-100 text-emerald-900') {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span>
          <span class="font-bold text-slate-900 text-base font-fun">${title}</span>
          ${window.CNEB_NIVELES.badge()}
        </div>
        ${note ? `<div class="text-xs font-bold ${noteClass} px-3 py-1 rounded-full">${note}</div>` : ''}
      </div>`;
  },

  // Motor común de seriación: arrastrar n objetos en orden a sus puestos
  seriationGame(container, o) {
    const N = window.CNEB_NIVELES;
    let nextExpected = 1;
    let hints = 0;
    const shuffled = N.shuffle(o.items);

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header(o.icono, o.titulo, o.nota, `border-${o.color}-300`, `bg-${o.color}-100 text-${o.color}-900`)}
        <div class="grid gap-2 w-full my-3" style="grid-template-columns: repeat(${o.n}, minmax(0, 1fr));">
          ${Array.from({ length: o.n }).map((_, i) => `
            <div id="${o.slotPrefix}-${i + 1}" class="drop-zone border-3 border-${o.color}-300 bg-${o.color}-50/70 flex flex-col items-center justify-center p-2 rounded-2xl min-h-[130px] transition-all" data-slot-id="${i + 1}">
              <span class="text-[11px] font-black text-${o.color}-900 bg-${o.color}-200 px-2 py-0.5 rounded-full mb-1">${i + 1}.° Puesto</span>
              <div class="slot-content w-full flex items-center justify-center min-h-[70px]"></div>
            </div>`).join('')}
        </div>
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border-3 border-${o.color}-200">
          <p class="text-center text-slate-700 font-bold mb-2 text-sm font-fun flex items-center justify-center gap-2"><span>👆</span><span>${o.instruccion}</span></p>
          <div class="flex flex-wrap justify-center items-end gap-3.5 min-h-[95px]">
            ${shuffled.map(it => `<button class="concrete-item seria-drag-item flex items-center justify-center cursor-grab" data-id="${it.id}" style="${it.style}">${it.html}</button>`).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(o.voz);

    container.querySelectorAll('.seria-drag-item').forEach(btn => {
      window.ChildDragDrop.makeDraggable(btn, {
        targetSelector: '.drop-zone',
        onClickNoDrag: () => window.Kusi.say(o.clickMsg),
        onDrop: (el, targetZone) => {
          const itemId = parseInt(el.dataset.id, 10);
          const slotId = parseInt(targetZone.dataset.slotId, 10);
          if (slotId === nextExpected && itemId === nextExpected) {
            window.SoundEngine.playPop();
            window.SoundEngine.playCount(nextExpected);
            const slotContent = targetZone.querySelector('.slot-content');
            slotContent.innerHTML = el.innerHTML;
            slotContent.classList.add('animate-pop');
            nextExpected++;
            if (nextExpected <= o.n) {
              window.Kusi.say(`¡Muy bien! Ahora arrastra ${o.siguiente} al puesto ${nextExpected}.`);
            } else {
              window.SoundEngine.playSuccess();
              window.AppState.recordResult(o.gameId, true, hints);
              window.Kusi.celebrate(o.celebrate);
              setTimeout(() => window.App.showGameSuccess(o.gameId), 2200);
            }
            return true;
          }
          hints++;
          const correctSlot = document.getElementById(`${o.slotPrefix}-${nextExpected}`);
          correctSlot?.classList.add('pulse-target');
          setTimeout(() => correctSlot?.classList.remove('pulse-target'), 1500);
          window.Kusi.giveHint(slotId !== nextExpected
            ? `¡Buen intento! Ahora corresponde llenar el puesto número ${nextExpected}.`
            : `¡Buen intento! Mira bien ${o.criterio}. Busca ${o.siguiente}.`);
          return false;
        },
        onMissDrop: () => window.Kusi.say(o.missMsg)
      });
    });
  },

  // Elige n elementos de una escala de 5 manteniendo el contraste (3 → 1,3,5; 4 → 1,2,4,5)
  spread(all, n) {
    if (n >= 5) return all;
    if (n === 4) return [all[0], all[1], all[3], all[4]];
    if (n === 3) return [all[0], all[2], all[4]];
    return [all[0], all[4]];
  },

  // 2.1 SERIACIÓN DE PLANTAS POR TAMAÑO
  playPlantas(container) {
    const lvl = window.CNEB_NIVELES.get('j2_1_plantas');
    const n = lvl.cantidad || 5;
    const all = [{ scale: 0.5, emoji: '🌱' }, { scale: 0.65, emoji: '🌿' }, { scale: 0.8, emoji: '🪴' }, { scale: 1.0, emoji: '🌲' }, { scale: 1.25, emoji: '🌳' }];
    const items = this.spread(all, n).map((p, i) => ({ id: i + 1, html: `<span style="font-size: ${p.scale * 3}rem;">${p.emoji}</span>`, style: 'width: 68px; height: 88px;' }));
    this.seriationGame(container, {
      gameId: 'j2_1_plantas', n, items, slotPrefix: 'slot-plant', color: 'emerald', icono: '🌱',
      titulo: `Juego 2.1: Seriar ${n} Plantitas`, nota: `Del más pequeño al más grande (1.° al ${n}.°)`,
      instruccion: 'Arrastra la plantita que corresponde al puesto que sigue:',
      voz: n <= 3 ? 'Vamos a sembrar. Arrastra primero la plantita más pequeñita, después la mediana y al final la más grande.' : '¡Vamos a sembrar en el huerto! Arrastra la plantita más pequeñita al primer puesto, luego la que sigue en tamaño hasta llegar al gran árbol.',
      siguiente: 'la plantita que sigue en tamaño', criterio: 'el tamaño de las plantitas',
      clickMsg: '¡Arrastra la plantita con tu dedito hasta su puesto en el huerto!', missMsg: '¡Suelta la plantita dentro de su puesto en el huerto!',
      celebrate: '¡Excelente! Has ordenado todas las plantitas por tamaño.'
    });
  },

  // 2.2 SERIACIÓN DE ZANAHORIAS POR LONGITUD
  playZanahorias(container) {
    const lvl = window.CNEB_NIVELES.get('j2_2_zanahorias');
    const n = lvl.cantidad || 5;
    const all = [35, 55, 75, 95, 115];
    const items = this.spread(all, n).map((w, i) => ({ id: i + 1, html: `<span class="text-3xl">🥕</span><span class="h-3 bg-orange-400 rounded-full inline-block ml-1" style="width: ${Math.round(w * 0.45)}px;"></span>`, style: `width: ${w + 20}px; height: 60px; padding: 0 8px;` }));
    this.seriationGame(container, {
      gameId: 'j2_2_zanahorias', n, items, slotPrefix: 'slot-carrot', color: 'orange', icono: '🥕',
      titulo: 'Juego 2.2: Zanahorias para el Conejo', nota: 'De la más corta a la más larga',
      instruccion: 'Arrastra cada zanahoria desde la más cortita hasta la más larga:',
      voz: lvl.voz || '¡El conejito quiere sus zanahorias! Arrastra desde la más cortita hasta la más larga.',
      siguiente: 'la zanahoria que sigue en largo', criterio: 'el largo de las zanahorias',
      clickMsg: '¡Arrastra la zanahoria con tu dedito hacia su puesto!', missMsg: '¡Suelta la zanahoria dentro de una de las casillas!',
      celebrate: '¡Yupi! Has ordenado todas las zanahorias por su largo.'
    });
  },

  // 2.3 ORDINALES EN EL TRENCITO
  playTrencito(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j2_3_trencito');
    const animals = [{ e: '🐶', n: 'Perrito', bg: 'bg-amber-300' }, { e: '🐱', n: 'Gatito', bg: 'bg-emerald-300' }, { e: '🐰', n: 'Conejito', bg: 'bg-purple-300' }, { e: '🐑', n: 'Ovejita', bg: 'bg-blue-300' }, { e: '🐥', n: 'Patito', bg: 'bg-pink-300' }];
    const target = N.pick(lvl.ordinales || [4]);
    const correct = animals[target - 1];
    const distractors = N.shuffle(animals.filter((_, i) => i !== target - 1)).slice(0, 2);
    const options = N.shuffle([correct, ...distractors]);
    const word = this.ordinalWord[target];
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('🚆', 'Juego 2.3: Ordinales en el Trencito', null, 'border-sky-300')}
        <div class="w-full bg-sky-50 border-3 border-sky-300 rounded-3xl p-3 my-2 shadow overflow-x-auto">
          <div class="flex items-center justify-center gap-2 min-w-[560px]">
            <div class="flex flex-col items-center bg-red-500 text-white p-2.5 rounded-2xl shadow border-2 border-white"><span class="text-3xl">🚂</span><span class="text-[10px] font-bold">Locomotora</span></div>
            ${animals.map((a, i) => `<div id="wagon-${i + 1}" class="flex flex-col items-center ${a.bg} p-2 rounded-2xl shadow border-2 border-white min-w-[80px]"><span class="text-3xl">${a.e}</span><span class="text-[10px] font-black bg-white px-2 py-0.5 rounded-full mt-1">${i + 1}.° Lugar</span></div>`).join('')}
          </div>
        </div>
        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-center my-2 shadow">
          <p class="font-fun text-2xl text-amber-950 font-bold">¿Qué animalito viaja en el <span class="text-blue-700 underline">${word.toUpperCase()} LUGAR (${target}.°)</span>?</p>
        </div>
        <div class="flex justify-center gap-5 my-2">
          ${options.map(a => `<button class="btn-chunky ${a === correct ? 'btn-blue' : 'btn-yellow'} flex items-center gap-2 p-3 opt-train" data-correct="${a === correct}"><span class="text-4xl">${a.e}</span><span class="text-sm">${a.n}</span></button>`).join('')}
        </div>
      </div>`;

    const conteo = animals.slice(0, target).map((a, i) => `${this.ordinalWord[i + 1]}${i + 1 === 1 ? 'o' : ''} ${a.n.toLowerCase()}`).join(', ');
    window.Kusi.say(`¡Mira el trencito de los animalitos! Cuenta desde la locomotora: ${this.ordinalWord.slice(1, target + 1).map((w, i) => i === 0 ? 'primero' : (w === 'tercer' ? 'tercero' : w)).join(', ')}... ¿Quién viaja en el ${word} lugar? ¡Tócalo!`);

    container.querySelectorAll('.opt-train').forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.dataset.correct === 'true') {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j2_3_trencito', true, hints);
          window.Kusi.celebrate(`¡Muy bien! ${correct.n} viaja en el ${word} lugar del trencito.`);
          setTimeout(() => window.App.showGameSuccess('j2_3_trencito'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(`¡Buen intento! Contemos los vagones: ${conteo}. ¿Quién está en el ${word} lugar?`);
          document.getElementById(`wagon-${target}`)?.classList.add('pulse-target');
        }
      });
    });
  },

  // 2.4 PRIMERO Y ÚLTIMO DE LA FILA
  playPrimeroUltimo(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j2_4_primero_ultimo');
    const fila = lvl.fila || 4;
    const pregunta = N.pick(lvl.preguntas || ['primero']);
    const chars = [{ e: '🦙', n: 'Kusi' }, { e: '🧸', n: 'Osito' }, { e: '🐶', n: 'Fido' }, { e: '🐧', n: 'Pingüi' }, { e: '🐰', n: 'Bunny' }].slice(0, fila);
    const correctIdx = pregunta === 'primero' ? 0 : fila - 1;
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('🚩', 'Juego 2.4: Primero y Último', null, 'border-purple-300')}
        <div class="bg-purple-100 border-2 border-purple-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-purple-950 font-bold">Toca al amigo que está en el <span class="text-purple-700 underline">${pregunta === 'primero' ? 'PRIMER' : 'ÚLTIMO'} LUGAR</span> de la fila 🚩</p>
        </div>
        <div class="flex items-center justify-center gap-4 w-full bg-white/80 p-4 rounded-3xl border-3 border-purple-200 my-4 shadow flex-wrap">
          <div class="flex flex-col items-center bg-amber-400 text-white p-2 rounded-2xl shadow"><span class="text-4xl">🚪</span><span class="text-[10px] font-bold">Puerta</span></div>
          ${chars.map((c, i) => `
            <button class="concrete-item opt-fila flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all p-2" data-idx="${i}" style="width: 80px; height: 90px;">
              <span class="text-4xl ${i === correctIdx ? 'animate-bounce-soft' : ''}">${c.e}</span>
              <span class="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full mt-1">${c.n}</span>
            </button>`).join('')}
        </div>
      </div>`;

    window.Kusi.say(pregunta === 'primero'
      ? '¡Los amiguitos hacen una fila para entrar al aula! ¿Quién está en el primer lugar, cerquita de la puerta? ¡Tócalo!'
      : '¡Los amiguitos hacen una fila para entrar al aula! ¿Quién está en el último lugar, al final de la fila? ¡Tócalo!');

    container.querySelectorAll('.opt-fila').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx === correctIdx) {
          window.SoundEngine.playSuccess();
          btn.classList.add('bg-green-100', 'border-green-500');
          window.AppState.recordResult('j2_4_primero_ultimo', true, hints);
          window.Kusi.celebrate(`¡Bravo! ${chars[idx].n} está en el ${pregunta === 'primero' ? 'primer' : 'último'} lugar de la fila.`);
          setTimeout(() => window.App.showGameSuccess('j2_4_primero_ultimo'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(pregunta === 'primero'
            ? `¡Buen intento! ${chars[idx].n} no está primero. El primero es el que está junto a la puerta.`
            : `¡Buen intento! ${chars[idx].n} no está al final. El último es el que está más lejos de la puerta.`);
          container.querySelector(`.opt-fila[data-idx="${correctIdx}"]`)?.classList.add('pulse-target');
        }
      });
    });
  }
};
