/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 1: "Formas 2D y Cuerpos 3D en el Entorno"
 * Nivel por edad (js/niveles.js):
 *   3 años: círculo y cuadrado, 2 opciones.  4 años: + triángulo, cuerpos esfera/cubo.
 *   5 años: + rectángulo, cilindro y la pregunta "¿cuál NO rueda?".
 */

window.SesionEsp1Games = {
  formas: {
    circulo: { label: 'CÍRCULO', art: '<div class="w-20 h-20 rounded-full bg-amber-400 border-4 border-white shadow"></div>', obj: '🪙', objN: 'Moneda de sol', desc: 'redondo y sin esquinas', como: 'una moneda o una rueda' },
    cuadrado: { label: 'CUADRADO', art: '<div class="w-20 h-20 bg-sky-400 border-4 border-white shadow"></div>', obj: '🎁', objN: 'Caja de regalo', desc: 'con cuatro lados iguales', como: 'una caja o una ventana' },
    triangulo: { label: 'TRIÁNGULO', art: '<div style="width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-bottom:72px solid #F43F5E;" class="drop-shadow"></div>', obj: '🍕', objN: 'Porción de pizza', desc: 'con tres puntas', como: 'una porción de pizza o un techo' },
    rectangulo: { label: 'RECTÁNGULO', art: '<div class="w-28 h-16 bg-emerald-500 border-4 border-white shadow"></div>', obj: '🚪', objN: 'Puerta', desc: 'alargado, con cuatro lados', como: 'una puerta o un libro' }
  },
  cuerpos: {
    esfera: { label: 'ESFERA', hint: '🔵', obj: '⚽', objN: 'Pelota', desc: 'redondo como una bolita, rueda por todos lados' },
    cubo: { label: 'CUBO', hint: '🧊', obj: '🎲', objN: 'Dado', desc: 'con caras cuadradas, no rueda' },
    cilindro: { label: 'CILINDRO', hint: '🛢️', obj: '🥫', objN: 'Lata de leche', desc: 'con bases redondas, como un tubo' }
  },
  ruedan: [{ e: '⚽', n: 'Pelota' }, { e: '🍊', n: 'Naranja' }, { e: '🥫', n: 'Lata' }],
  noRuedan: [{ e: '📦', n: 'Caja de cartón' }, { e: '🎲', n: 'Dado' }, { e: '📕', n: 'Libro' }],

  header(icon, title, borderClass) {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span><span class="font-bold text-slate-900 text-base font-fun">${title}</span>${window.CNEB_NIVELES.badge()}
        </div>
      </div>`;
  },

  // Motor común: elegir el objeto cuya forma coincide con la forma guía
  pickObjectGame(container, o) {
    let hints = 0;
    const N = window.CNEB_NIVELES;
    const options = N.shuffle(o.options);
    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header(o.icono, o.titulo, 'border-indigo-300')}
        <div class="bg-white/90 border-4 border-indigo-400 rounded-3xl p-3 shadow-xl flex flex-col items-center max-w-md w-full my-2">
          <span class="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">${o.guiaTexto}</span>
          <div class="flex items-center gap-3 animate-bounce-soft">${o.guiaArt}<span class="text-lg font-black text-indigo-950 font-fun">${o.label}</span></div>
        </div>
        <div class="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-indigo-950 font-bold">${o.pregunta}</p>
        </div>
        <div class="grid gap-4 w-full my-3" style="grid-template-columns: repeat(${options.length}, minmax(0, 1fr));">
          ${options.map(op => `
            <button class="opt-shape concrete-item flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all w-full h-[130px]" data-correct="${op.correct}">
              <span class="text-5xl mb-1 ${op.correct ? 'animate-wiggle' : ''}">${op.e}</span>
              <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">${op.n}</span>
            </button>`).join('')}
        </div>
      </div>`;

    window.Kusi.say(o.voz);
    container.querySelectorAll('.opt-shape').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.correct === 'true') {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult(o.gameId, true, hints);
          window.Kusi.celebrate(o.celebrate);
          setTimeout(() => window.App.showGameSuccess(o.gameId), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(o.hint);
          container.querySelector('.opt-shape[data-correct="true"]')?.classList.add('pulse-target');
        }
      });
    });
  },

  // 1. FORMAS 2D
  playFormas2D(container) {
    const N = window.CNEB_NIVELES;
    const allowed = N.get('esp_j1_formas2d').formas || ['circulo', 'cuadrado', 'triangulo', 'rectangulo'];
    const targetKey = N.pick(allowed);
    const t = this.formas[targetKey];
    this.pickObjectGame(container, {
      gameId: 'esp_j1_formas2d', icono: '🟡', titulo: 'Juego 1.1: El Museo de las Formas 2D',
      guiaTexto: 'Buscamos un objeto con forma de:', guiaArt: t.art, label: t.label,
      pregunta: `¿Cuál objeto tiene forma de <span class="text-amber-600 underline">${t.label}</span>?`,
      options: allowed.map(k => ({ e: this.formas[k].obj, n: this.formas[k].objN, correct: k === targetKey })),
      voz: `¡Estamos en el Museo de las Formas! Buscamos un objeto ${t.desc}, como el ${t.label.toLowerCase()}. ¡Tócalo!`,
      celebrate: `¡Excelente! ${t.objN} tiene forma de ${t.label.toLowerCase()}.`,
      hint: `¡Buen intento! El ${t.label.toLowerCase()} es ${t.desc}, igual que ${t.como}.`
    });
  },

  // 2. CUERPOS 3D EN LA VIDA REAL
  playCuerpos3D(container) {
    const N = window.CNEB_NIVELES;
    const allowed = N.get('esp_j1_cuerpos3d').cuerpos || ['esfera', 'cubo', 'cilindro'];
    const targetKey = N.pick(allowed);
    const t = this.cuerpos[targetKey];
    this.pickObjectGame(container, {
      gameId: 'esp_j1_cuerpos3d', icono: '🥫', titulo: 'Juego 1.2: Cuerpos 3D en la Vida Real',
      guiaTexto: 'Buscamos un cuerpo con forma de:', guiaArt: `<span class="text-4xl">${t.hint}</span>`, label: t.label,
      pregunta: `¿Cuál objeto cotidiano tiene forma de <span class="text-indigo-700 underline">${t.label}</span>?`,
      options: allowed.map(k => ({ e: this.cuerpos[k].obj, n: `${this.cuerpos[k].objN} (${this.cuerpos[k].label.charAt(0) + this.cuerpos[k].label.slice(1).toLowerCase()})`, correct: k === targetKey })),
      voz: `¡Ahora con cuerpos de tres dimensiones! Buscamos un objeto con forma de ${t.label.toLowerCase()}, ${t.desc}. ¿Cuál es? ¡Tócalo!`,
      celebrate: `¡Maravilloso! ${t.objN} tiene forma de ${t.label.toLowerCase()}.`,
      hint: `¡Buen intento! El ${t.label.toLowerCase()} es ${t.desc}.`
    });
  },

  // 3. ¿RUEDA O NO RUEDA?
  playClasificacion(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('esp_j1_clasificacion');
    const n = lvl.opciones || 2;
    const pregunta = N.pick(lvl.preguntas || ['rueda']);
    const askRoll = pregunta === 'rueda';
    const correct = N.pick(askRoll ? this.ruedan : this.noRuedan);
    const others = N.shuffle(askRoll ? this.noRuedan : this.ruedan).slice(0, n - 1);
    const options = N.shuffle([{ ...correct, ok: true }, ...others.map(x => ({ ...x, ok: false }))]);
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('⚽', 'Juego 1.3: ¿Rueda o No Rueda?', 'border-sky-300')}
        <div class="bg-sky-100 border-2 border-sky-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-sky-950 font-bold">Toca el objeto que <span class="text-sky-700 underline">${askRoll ? 'PUEDE RODAR' : 'NO PUEDE RODAR'}</span> por la resbaladilla 🛝</p>
        </div>
        <div class="grid gap-5 w-full my-4" style="grid-template-columns: repeat(${Math.min(options.length, 4)}, minmax(0, 1fr));">
          ${options.map(o => `
            <button class="opt-roll drop-zone border-4 border-slate-300 bg-white hover:border-sky-500 p-4 rounded-3xl flex flex-col items-center cursor-pointer shadow-lg hover:scale-105 transition-all" data-ok="${o.ok}">
              <span class="text-6xl mb-2 ${o.ok ? 'animate-bounce-soft' : ''}">${o.e}</span>
              <span class="font-fun font-bold text-slate-800 text-base text-center">${o.n}</span>
            </button>`).join('')}
        </div>
      </div>`;

    window.Kusi.say(askRoll
      ? '¡Mira estos objetos! ¿Cuál puede rodar por la colina como una pelota redondita? ¡Tócalo!'
      : '¡Mira estos objetos! Casi todos ruedan... ¿Cuál NO puede rodar porque tiene caras planas? ¡Tócalo!');

    container.querySelectorAll('.opt-roll').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.ok === 'true') {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult('esp_j1_clasificacion', true, hints);
          window.Kusi.celebrate(askRoll ? `¡Excelente! ${correct.n} es redondo y puede rodar.` : `¡Excelente! ${correct.n} tiene caras planas y no rueda.`);
          setTimeout(() => window.App.showGameSuccess('esp_j1_clasificacion'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(askRoll
            ? '¡Buen intento! Ese objeto tiene caras planas y no rueda. Busquemos el redondo que sí rueda.'
            : '¡Buen intento! Ese objeto es redondo y sí rueda. Busquemos el que tiene caras planas.');
          container.querySelector('.opt-roll[data-ok="true"]')?.classList.add('pulse-target');
        }
      });
    });
  }
};
