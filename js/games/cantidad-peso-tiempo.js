/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGOS 3.4 Y 3.5: Peso y Nociones de Tiempo
 * Desempeño: compara pesos ("pesa más", "pesa menos") y secuencias temporales ("antes", "después").
 * Nivel por edad (js/niveles.js): 3 años solo "pesa más" y una secuencia; 5 años pares variados y "antes/después".
 */

window.GamePesoTiempo = {
  pares: [
    { heavy: { e: '🍉', n: 'Sandía' }, light: { e: '🍓', n: 'Fresa' } },
    { heavy: { e: '🐘', n: 'Elefante' }, light: { e: '🐭', n: 'Ratoncito' } },
    { heavy: { e: '🎒', n: 'Mochila llena' }, light: { e: '🪶', n: 'Plumita' } },
    { heavy: { e: '🪨', n: 'Piedra' }, light: { e: '🎈', n: 'Globo' } }
  ],
  escenarios: [
    { antes: { e: '🛏️', t: 'Despertamos en la camita' }, despues: { e: '🪥', t: 'Nos lavamos los dientes y desayunamos' }, distractor: { e: '🌙', t: 'Dormir con pijamita de noche' }, momento: 'en la mañana' },
    { antes: { e: '🧼', t: 'Nos lavamos las manos' }, despues: { e: '🍽️', t: 'Almorzamos en la mesa' }, distractor: { e: '🛁', t: 'Bañarnos antes de dormir' }, momento: 'al mediodía' },
    { antes: { e: '🍲', t: 'Cenamos en familia' }, despues: { e: '😴', t: 'Nos vamos a dormir' }, distractor: { e: '🎒', t: 'Ir al jardín con la mochila' }, momento: 'en la noche' }
  ],

  header(icon, title, borderClass) {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span><span class="font-bold text-slate-900 text-base font-fun">${title}</span>${window.CNEB_NIVELES.badge()}
        </div>
      </div>`;
  },

  // 3.4 BALANZA MÁGICA: PESA MÁS Y PESA MENOS
  playBalanza(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j3_4_balanza');
    const pair = this.pares[N.pick(lvl.pares || [0])] || this.pares[0];
    const pregunta = N.pick(lvl.preguntas || ['mas']);
    const heavyLeft = Math.random() < 0.5;
    const left = heavyLeft ? pair.heavy : pair.light;
    const right = heavyLeft ? pair.light : pair.heavy;
    const correctSide = (pregunta === 'mas') === heavyLeft ? 'left' : 'right';
    const tilt = heavyLeft ? -12 : 12;
    let hints = 0;

    const pan = (side, obj, isHeavy) => `
      <button id="plate-${side}" class="scale-pan-${side} group cursor-pointer focus:outline-none" style="transform: rotate(${-tilt}deg);" title="${obj.n}">
        <div class="scale-rope"></div>
        <div class="scale-plate group-hover:scale-110 group-hover:border-amber-500 transition-all ${isHeavy ? 'bg-emerald-50' : 'bg-red-50'}"><span class="${isHeavy ? 'text-4xl animate-bounce-soft' : 'text-2xl'}">${obj.e}</span></div>
        <span class="mt-2 text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full shadow">${obj.n}</span>
      </button>`;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('⚖️', 'Juego 3.4: La Balanza Mágica', 'border-amber-300')}
        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-amber-950 font-bold">Toca el objeto que <span class="text-red-600 underline">PESA ${pregunta === 'mas' ? 'MÁS' : 'MENOS'}</span></p>
        </div>
        <div class="relative w-full max-w-md my-4 h-[220px] flex justify-center items-center">
          <div id="scale-beam" class="scale-beam" style="transform: rotate(${tilt}deg);">
            ${pan('left', left, heavyLeft)}
            ${pan('right', right, !heavyLeft)}
          </div>
          <div class="scale-base"><div class="scale-fulcrum"></div></div>
        </div>
        <div class="text-center text-slate-600 font-fun text-sm">El objeto que pesa más hace bajar su platillo hacia el suelo; el que pesa menos sube.</div>
      </div>`;

    window.Kusi.say(`¡Mira la balanza de Don Lucho! Pusimos ${pair.heavy.n.toLowerCase()} y ${pair.light.n.toLowerCase()}. ¿Cuál de los dos pesa ${pregunta === 'mas' ? 'más' : 'menos'}? ¡Tócalo!`);

    ['left', 'right'].forEach(side => {
      document.getElementById(`plate-${side}`).addEventListener('click', () => {
        if (side === correctSide) {
          window.SoundEngine.playSuccess();
          document.getElementById(`plate-${side}`).querySelector('.scale-plate').classList.add('ring-4', 'ring-green-400');
          window.AppState.recordResult('j3_4_balanza', true, hints);
          const obj = pregunta === 'mas' ? pair.heavy : pair.light;
          window.Kusi.celebrate(pregunta === 'mas' ? `¡Excelente! ${obj.n} pesa más y hace bajar el platillo.` : `¡Excelente! ${obj.n} pesa menos y su platillo sube.`);
          setTimeout(() => window.App.showGameSuccess('j3_4_balanza'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(pregunta === 'mas'
            ? '¡Buen intento! El objeto que pesa más baja el platillo hacia el suelo. ¿Cuál está abajo?'
            : '¡Buen intento! El objeto que pesa menos hace subir su platillo. ¿Cuál está arriba?');
          document.getElementById(`plate-${correctSide}`).classList.add('pulse-target');
        }
      });
    });
  },

  // 3.5 TIEMPO: ANTES Y DESPUÉS
  playTiempo(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j3_5_tiempo');
    const esc = this.escenarios[N.pick(lvl.escenarios || [0])] || this.escenarios[0];
    const pregunta = N.pick(lvl.preguntas || ['despues']);
    const shown = pregunta === 'despues' ? esc.antes : esc.despues;
    const correct = pregunta === 'despues' ? esc.despues : esc.antes;
    const options = N.shuffle([{ ...correct, ok: true }, { ...esc.distractor, ok: false }]);
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('⏳', 'Juego 3.5: Antes y Después', 'border-indigo-300')}
        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">¿Qué hacemos ${esc.momento} <span class="text-indigo-700 underline">${pregunta === 'despues' ? 'DESPUÉS' : 'ANTES'}</span> de esto?</p>
        </div>
        <div class="flex items-center gap-3 bg-white/90 border-2 border-slate-300 px-4 py-2 rounded-2xl shadow-sm my-2">
          <span class="text-3xl">${shown.e}</span>
          <div><span class="text-[10px] font-bold text-slate-500 uppercase block">${pregunta === 'despues' ? 'Antes' : 'Después'}</span><span class="text-xs font-bold text-slate-800">${shown.t}</span></div>
          <span class="text-xl text-indigo-500 font-bold ml-2">${pregunta === 'despues' ? '➔ ¿Luego?' : '⬅ ¿Y antes?'}</span>
        </div>
        <div class="grid grid-cols-2 gap-5 w-full max-w-lg my-3">
          ${options.map((o, i) => `
            <button class="opt-tiempo drop-zone border-4 border-indigo-300 bg-white hover:border-indigo-500 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all" data-ok="${o.ok}">
              <span class="text-5xl mb-2">${o.e}</span>
              <span class="font-fun font-bold text-slate-800 text-base text-center">${o.t}</span>
              <span class="mt-2 text-xs bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">Toca aquí</span>
            </button>`).join('')}
        </div>
      </div>`;

    window.Kusi.say(pregunta === 'despues'
      ? `${esc.momento.charAt(0).toUpperCase() + esc.momento.slice(1)}, ${shown.t.toLowerCase()}. ¿Qué hacemos después? ¡Toca la imagen!`
      : `${esc.momento.charAt(0).toUpperCase() + esc.momento.slice(1)}, ${shown.t.toLowerCase()}. ¿Qué hicimos antes? ¡Toca la imagen!`);

    container.querySelectorAll('.opt-tiempo').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.ok === 'true') {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('j3_5_tiempo', true, hints);
          window.Kusi.celebrate(`¡Muy bien! ${pregunta === 'despues' ? 'Después' : 'Antes'} de eso, ${correct.t.toLowerCase()}.`);
          setTimeout(() => window.App.showGameSuccess('j3_5_tiempo'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(`¡Buen intento! Eso lo hacemos en otro momento del día. Piensa qué pasa ${pregunta === 'despues' ? 'justo después' : 'justo antes'}.`);
          container.querySelector('.opt-tiempo[data-ok="true"]')?.classList.add('pulse-target');
        }
      });
    });
  }
};
