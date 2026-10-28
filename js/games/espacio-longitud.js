/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 3 - JUEGOS DE LONGITUD
 * Desempeño: establece relaciones de medida ("es más largo que", "es más corto que").
 * Nivel por edad (js/niveles.js): 3 años compara 2 objetos con gran contraste; 4 años 2 objetos;
 * 5 años elige entre 3 objetos con poco contraste.
 */

window.GameLongitud = {
  header(icon, title, borderClass) {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span><span class="font-bold text-slate-900 text-base font-fun">${title}</span>${window.CNEB_NIVELES.badge()}
        </div>
      </div>`;
  },

  // Motor común: elegir entre barras el elemento más largo o más corto
  compareGame(container, o) {
    let hints = 0;
    const N = window.CNEB_NIVELES;
    const items = N.shuffle(o.items);
    const correct = o.pickLongest ? items.reduce((a, b) => (b.len > a.len ? b : a)) : items.reduce((a, b) => (b.len < a.len ? b : a));

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header(o.icono, o.titulo, `border-${o.color}-300`)}
        <div class="bg-${o.color}-100 border-2 border-${o.color}-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-${o.color}-950 font-bold">${o.pregunta}</p>
        </div>
        ${o.scene || ''}
        <div class="flex flex-col gap-4 w-full max-w-2xl my-3">
          ${items.map((it, i) => `
            <button class="opt-len drop-zone border-4 border-slate-300 bg-white hover:border-${o.color}-500 hover:scale-[1.02] active:scale-95 transition-all p-3 rounded-3xl flex items-center cursor-pointer shadow-lg w-full" data-idx="${i}">
              <span class="text-3xl mr-3">${it.icon}</span>
              <div class="h-9 ${it.barClass} rounded-full shadow-inner flex items-center justify-around px-2 overflow-hidden" style="width: ${it.len}%;">${it.fill || ''}</div>
              ${o.endIcon ? `<span class="text-3xl ml-3">${o.endIcon}</span>` : ''}
              <span class="ml-auto text-xs font-bold text-slate-500 pl-2">${it.label}</span>
            </button>`).join('')}
        </div>
        ${o.footer ? `<div class="text-center text-slate-600 font-fun text-sm">${o.footer}</div>` : ''}
      </div>`;

    window.Kusi.say(o.voz);
    container.querySelectorAll('.opt-len').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = items[parseInt(btn.dataset.idx, 10)];
        if (it === correct) {
          window.SoundEngine.playSuccess();
          btn.classList.add('border-green-500', 'bg-green-50');
          window.AppState.recordResult(o.gameId, true, hints);
          window.Kusi.celebrate(o.celebrate(it));
          setTimeout(() => window.App.showGameSuccess(o.gameId), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(o.hint(it));
          const idx = items.indexOf(correct);
          container.querySelector(`.opt-len[data-idx="${idx}"]`)?.classList.add('pulse-target');
        }
      });
    });
  },

  // 3.2 EL CAMINO MÁS LARGO QUE...
  playMasLargo(container) {
    const n = window.CNEB_NIVELES.get('esp_j3_mas_largo').caminos || 2;
    const defs = [
      { icon: '🐌', label: 'Camino del caracol', len: 100, fill: '🌸🌱🌼🌿🌺🌸🌷' },
      { icon: '🐞', label: 'Camino de la mariquita', len: 45, fill: '🌸🌼' },
      { icon: '🐛', label: 'Camino del gusanito', len: 70, fill: '🌸🌼🌿🌺' }
    ].slice(0, n).map(d => ({ ...d, barClass: 'bg-emerald-100 border-2 border-emerald-300', fill: `<span class="text-sm tracking-widest">${d.fill}</span>` }));
    this.compareGame(container, {
      gameId: 'esp_j3_mas_largo', icono: '📏', titulo: 'Juego 3.2: Más Largo Que...', color: 'emerald', pickLongest: true, endIcon: '🏁',
      pregunta: `Toca el camino que es <span class="text-emerald-700 underline">MÁS LARGO QUE</span> ${n > 2 ? 'los otros' : 'el otro'} 🌸`,
      items: defs, footer: 'El caracolito tiene que recorrer un camino muy largo con muchas flores... ¿cuál es?',
      voz: `¡Mira los caminos con flores del jardín! Toca el camino que es más largo que ${n > 2 ? 'los demás' : 'el otro'}.`,
      celebrate: it => `¡Excelente! El ${it.label.toLowerCase()} tiene muchas flores y es el más largo.`,
      hint: it => `¡Buen intento! El ${it.label.toLowerCase()} es más corto, tiene menos flores. Busquemos el camino más largo.`
    });
  },

  // 3.3 CINTAS DE FIESTA MÁS CORTAS
  playMasCorto(container) {
    const lvl = window.CNEB_NIVELES.get('esp_j3_mas_corto');
    const n = lvl.cintas || 2;
    const lens = lvl.contraste === 'alto' ? [100, 25, 60] : lvl.contraste === 'medio' ? [100, 45, 70] : [100, 60, 80];
    const defs = [
      { icon: '🎀', label: 'Cinta morada', len: lens[0], barClass: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
      { icon: '🎀', label: 'Cinta amarilla', len: lens[1], barClass: 'bg-gradient-to-r from-yellow-400 to-amber-500' },
      { icon: '🎀', label: 'Cinta verde', len: lens[2], barClass: 'bg-gradient-to-r from-emerald-400 to-teal-500' }
    ].slice(0, n);
    this.compareGame(container, {
      gameId: 'esp_j3_mas_corto', icono: '🎀', titulo: 'Juego 3.3: Más Corto Que...', color: 'indigo', pickLongest: false,
      pregunta: `Toca la cinta que es <span class="text-indigo-700 underline">MÁS CORTA QUE</span> ${n > 2 ? 'las otras' : 'la otra'} 🎀`,
      items: defs,
      voz: `¡Mira las cintas de fiesta! Toca la cinta que es más corta que ${n > 2 ? 'las demás' : 'la otra'}.`,
      celebrate: it => `¡Bravo! La ${it.label.toLowerCase()} es la más corta.`,
      hint: it => `¡Buen intento! La ${it.label.toLowerCase()} es más larga. Busquemos la cinta más cortita.`
    });
  },

  // 3.4 EL PUENTE DE MADERA PARA CRUZAR EL RÍO
  playPuente(container) {
    const n = window.CNEB_NIVELES.get('esp_j3_puente').tablas || 2;
    const defs = [
      { icon: '🪵', label: 'Tabla larga', len: 100, barClass: 'bg-amber-700' },
      { icon: '🪵', label: 'Tabla corta', len: 35, barClass: 'bg-amber-600/70' },
      { icon: '🪵', label: 'Tabla mediana', len: 65, barClass: 'bg-amber-600/80' }
    ].slice(0, n);
    const scene = `
      <div class="relative w-full max-w-2xl h-[150px] bg-cyan-200 border-4 border-cyan-400 rounded-3xl shadow-lg flex items-center justify-between px-6 overflow-hidden my-2">
        <div class="w-16 h-full bg-emerald-300 border-r-4 border-emerald-500 flex items-center justify-center"><span class="text-3xl animate-bounce-soft">🦙</span></div>
        <div class="flex-1 flex flex-col items-center justify-center"><span class="text-3xl text-cyan-700 animate-pulse">🌊 🌊 🌊</span><span class="text-xs font-bold text-cyan-900 bg-white/70 px-2 py-0.5 rounded-full mt-1">El río ancho</span></div>
        <div class="w-16 h-full bg-emerald-300 border-l-4 border-emerald-500 flex items-center justify-center"><span class="text-3xl">🏁</span></div>
      </div>`;
    this.compareGame(container, {
      gameId: 'esp_j3_puente', icono: '🪵', titulo: 'Juego 3.4: El Puente para Cruzar el Río', color: 'amber', pickLongest: true, scene,
      pregunta: 'Toca la tabla <span class="text-amber-800 underline">MÁS LARGA</span> que alcance de orilla a orilla 🌊',
      items: defs,
      voz: '¡Kusi necesita cruzar el río! Toca la tabla de madera más larga para que alcance de una orilla a la otra.',
      celebrate: () => '¡Excelente! La tabla más larga permitió que Kusi cruce el río a salvo.',
      hint: it => `¡Buen intento! La ${it.label.toLowerCase()} no alcanza y caería al agua. Busquemos la tabla más larga.`
    });
  }
};
