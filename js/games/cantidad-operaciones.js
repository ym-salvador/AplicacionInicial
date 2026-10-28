/**
 * SESIÓN 3 (MUNDO 1: CANTIDAD) - JUEGOS 3.2 Y 3.3: Agregar y Quitar
 * Desempeño: resuelve situaciones sencillas de agregar y quitar con material concreto virtual.
 * Nivel por edad (js/niveles.js): 4 años hasta 3 elementos, 5 años hasta 5. Las cantidades se sortean.
 */

window.GameOperaciones = {
  words: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete'],

  // Tres opciones numéricas únicas que incluyen la respuesta correcta
  makeOptions(correct, max) {
    const set = new Set([correct]);
    const candidates = [correct + 1, correct - 1, correct + 2, correct - 2].filter(v => v >= 0 && v <= max + 2);
    for (const v of candidates) { if (set.size < 3) set.add(v); }
    return window.CNEB_NIVELES.shuffle([...set]);
  },

  header(icon, title, borderClass) {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span><span class="font-bold text-slate-900 text-base font-fun">${title}</span>${window.CNEB_NIVELES.badge()}
        </div>
      </div>`;
  },

  // 3.2 AGREGAR CON ANIMALITOS
  playAgregar(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j3_2_agregar');
    const max = lvl.max || 5;
    const a = N.randInt(1, max - 1);
    const b = N.randInt(1, max - a);
    const total = a + b;
    const theme = N.pick([
      { name: 'patitos', icon: '🦆', habitat: 'en la laguna' },
      { name: 'ranitas', icon: '🐸', habitat: 'en el charquito' },
      { name: 'conejitos', icon: '🐰', habitat: 'en el jardín' },
      { name: 'gatitos', icon: '🐱', habitat: 'en el parque' }
    ]);
    const options = this.makeOptions(total, max);
    const colors = ['btn-yellow', 'btn-green', 'btn-purple'];
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header(theme.icon, 'Juego 3.2: ¡Vamos a Agregar!', 'border-sky-300')}
        <div class="w-full bg-gradient-to-b from-sky-200 to-cyan-300 border-4 border-sky-400 rounded-3xl p-5 shadow-xl relative min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div class="text-center font-fun text-lg text-sky-900 font-bold bg-white/80 py-1 px-4 rounded-full self-center shadow">Había ${a} ${theme.name} ${theme.habitat} y ${b === 1 ? 'llega 1 amigo más' : `llegan ${b} amigos más`}...</div>
          <div class="flex items-center justify-center gap-5 my-3 flex-wrap">
            <div class="flex gap-2 bg-white/40 p-2.5 rounded-2xl border-2 border-sky-200">${Array.from({ length: a }).map((_, i) => `<span class="text-5xl animate-bounce-soft" style="animation-delay:${i * 0.15}s">${theme.icon}</span>`).join('')}</div>
            <div class="text-3xl font-black text-sky-700 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center shadow">+</div>
            <div class="flex gap-2 bg-emerald-100/70 p-2.5 rounded-2xl border-2 border-emerald-300 animate-pop">${Array.from({ length: b }).map((_, i) => `<span class="text-5xl animate-bounce-soft" style="animation-delay:${0.4 + i * 0.15}s">${theme.icon}</span>`).join('')}</div>
          </div>
          <div class="text-center text-xs font-bold text-sky-900">¿Cuántos ${theme.name} hay en total ahora?</div>
        </div>
        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-sky-200 my-2">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun">Toca el número de ${theme.name} que hay ahora:</p>
          <div class="flex justify-center gap-5">
            ${options.map((v, i) => `<button class="btn-chunky ${colors[i]} flex-1 max-w-[110px] opt-btn-add" data-value="${v}"><span class="text-3xl">${v}</span></button>`).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(`Estaban jugando ${a} ${theme.name}. De pronto ${b === 1 ? 'llega 1 amigo más' : `llegan ${b} amigos más`}. ¿Cuántos son en total?`);

    container.querySelectorAll('.opt-btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        if (parseInt(btn.dataset.value, 10) === total) {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j3_2_agregar', true, hints);
          window.Kusi.celebrate(`¡Excelente! Había ${a} y con ${b} más, ¡ahora son ${total} ${theme.name}!`);
          setTimeout(() => window.App.showGameSuccess('j3_2_agregar'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(`¡Buen intento! Contemos todos los animalitos juntos: ${this.words.slice(1, total + 1).join(', ')}. Busca el número ${total}.`);
        }
      });
    });
  },

  // 3.3 QUITAR EN EL PÍCNIC CON EL MONITO
  playQuitar(container) {
    const N = window.CNEB_NIVELES;
    const lvl = N.get('j3_3_quitar');
    const max = lvl.max || 5;
    const total = N.randInt(2, max);
    const take = N.randInt(1, Math.min(2, total - 1));
    const result = total - take;
    const options = this.makeOptions(result, max);
    const colors = ['btn-coral', 'btn-green', 'btn-yellow'];
    let hints = 0;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header('🍪', 'Juego 3.3: ¡Vamos a Quitar!', 'border-amber-300')}
        <div class="w-full bg-gradient-to-b from-amber-100 to-orange-200 border-4 border-amber-400 rounded-3xl p-5 shadow-xl relative min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div class="text-center font-fun text-lg text-amber-950 font-bold bg-white/80 py-1 px-4 rounded-full self-center shadow flex items-center justify-center gap-2">
            <span>Había ${total} galletitas y el monito travieso comió ${take}...</span><span class="text-3xl animate-bounce-soft">🐒</span>
          </div>
          <div class="flex items-center justify-center gap-4 my-3">
            <div class="flex gap-2.5 bg-white/60 p-3 rounded-3xl border-2 border-amber-300 flex-wrap justify-center">
              ${Array.from({ length: result }).map(() => '<span class="text-5xl">🍪</span>').join('')}
              ${Array.from({ length: take }).map(() => '<span class="text-5xl opacity-40 grayscale" title="Comida">🍪</span>').join('')}
            </div>
          </div>
          <div class="text-center text-xs font-bold text-amber-900">¿Cuántas galletitas quedan en el plato?</div>
        </div>
        <div class="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-amber-200 my-2">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun">Toca cuántas galletas quedan:</p>
          <div class="flex justify-center gap-5">
            ${options.map((v, i) => `<button class="btn-chunky ${colors[i]} flex-1 max-w-[110px] opt-btn-sub" data-value="${v}"><span class="text-3xl">${v}</span></button>`).join('')}
          </div>
        </div>
      </div>`;

    window.Kusi.say(`Había ${total} galletitas y el monito comió ${take}. ¿Cuántas galletas quedan ahora en el plato? ¡Toca el número!`);

    container.querySelectorAll('.opt-btn-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        if (parseInt(btn.dataset.value, 10) === result) {
          window.SoundEngine.playSuccess();
          window.AppState.recordResult('j3_3_quitar', true, hints);
          window.Kusi.celebrate(`¡Muy bien! Quedan ${result} galleta${result === 1 ? '' : 's'} en el plato.`);
          setTimeout(() => window.App.showGameSuccess('j3_3_quitar'), 2200);
        } else {
          hints++;
          window.Kusi.giveHint(`¡Buen intento! Cuenta solo las galletitas que aún no se han comido: ${this.words.slice(1, result + 1).join(', ')}.`);
        }
      });
    });
  }
};
