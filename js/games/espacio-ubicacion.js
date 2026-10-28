/**
 * MUNDO 2 (ESPACIO, FORMA Y MOVIMIENTO) - SESIÓN 2: "Ubicación Espacial en el Parque"
 * Juegos con Arrastre y Soltado Real. Nivel por edad (js/niveles.js):
 *   3 años: solo "cerca".  4 años: "cerca"/"lejos" y "al lado" con 2 zonas.
 *   5 años: 3 zonas y preguntas combinadas ("lejos del agua, en la montaña").
 */

window.SesionEsp2Games = {
  header(icon, title, borderClass) {
    return `
      <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="bg-white/95 px-4 py-2 rounded-2xl shadow border-2 ${borderClass} flex items-center gap-2">
          <span class="text-2xl">${icon}</span><span class="font-bold text-slate-900 text-base font-fun">${title}</span>${window.CNEB_NIVELES.badge()}
        </div>
      </div>`;
  },

  // Motor común: arrastrar un objeto a la zona correcta dentro de un escenario
  dragSceneGame(container, o) {
    let hints = 0;
    container.innerHTML = `
      <div class="flex flex-col items-center justify-between h-full max-w-4xl mx-auto p-3">
        ${this.header(o.icono, o.titulo, `border-${o.color}-300`)}
        <div class="bg-${o.color}-100 border-2 border-${o.color}-300 rounded-2xl px-6 py-2 text-center my-2 shadow">
          <p class="font-fun text-2xl text-${o.color}-950 font-bold">${o.pregunta}</p>
        </div>
        <div class="relative w-full max-w-2xl min-h-[240px] ${o.sceneBg} border-4 border-${o.color}-400 rounded-3xl shadow-xl overflow-hidden my-2 flex items-center justify-around px-4 gap-2 flex-wrap py-3">
          ${o.scene}
        </div>
        <div class="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-lg border-3 border-${o.color}-200 flex flex-col items-center">
          <p class="text-center font-bold text-slate-700 mb-2 text-sm font-fun flex items-center justify-center gap-2"><span>👆</span><span>${o.instruccion}</span></p>
          <button id="drag-obj" class="concrete-item cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex items-center justify-center shadow-lg" style="width: 78px; height: 78px; background: ${o.objBg}; border-color: ${o.objBorder}; touch-action: none;"><span class="text-5xl">${o.obj}</span></button>
        </div>
      </div>`;

    window.Kusi.say(o.voz);
    const correctZone = document.getElementById(o.correctZoneId);

    window.ChildDragDrop.makeDraggable(document.getElementById('drag-obj'), {
      targetSelector: '.drop-zone',
      onClickNoDrag: () => window.Kusi.say(o.clickMsg),
      onDrop: (el, targetZone) => {
        if (targetZone.id === o.correctZoneId) {
          window.SoundEngine.playSuccess();
          window.SoundEngine.playDrop();
          correctZone.innerHTML = `<span class="text-5xl animate-pop">${o.obj}</span>`;
          correctZone.classList.add('bg-green-100', 'border-green-500');
          window.AppState.recordResult(o.gameId, true, hints);
          window.Kusi.celebrate(o.celebrate);
          setTimeout(() => window.App.showGameSuccess(o.gameId), 2200);
          return true;
        }
        hints++;
        window.Kusi.giveHint(o.hints[targetZone.id] || o.hintDefault);
        correctZone.classList.add('pulse-target');
        setTimeout(() => correctZone.classList.remove('pulse-target'), 1500);
        return false;
      },
      onMissDrop: () => window.Kusi.say(o.missMsg)
    });
  },

  zone(id, label, color, extra = '') {
    return `<div id="${id}" class="drop-zone border-4 border-dashed border-${color}-500 bg-${color}-50/80 p-3 rounded-2xl flex flex-col items-center justify-center min-w-[110px] h-[100px] shadow-md transition-all ${extra}">
      <span class="text-xs font-bold text-${color}-800 bg-${color}-200 px-3 py-0.5 rounded-full mb-1 text-center">${label}</span><span class="text-3xl text-${color}-600">📍</span></div>`;
  },

  landmark(emoji, label) {
    return `<div class="flex flex-col items-center z-10 pointer-events-none"><span class="text-7xl drop-shadow-lg">${emoji}</span><span class="text-xs font-bold bg-white/90 px-3 py-0.5 rounded-full text-slate-800 shadow">${label}</span></div>`;
  },

  // 2.1 CERCA Y LEJOS DEL ÁRBOL
  playCercaLejos(container) {
    const N = window.CNEB_NIVELES;
    const pregunta = N.pick(N.get('esp_j2_cerca_lejos').preguntas || ['cerca']);
    const correctZoneId = pregunta === 'cerca' ? 'zone-near' : 'zone-far';
    this.dragSceneGame(container, {
      gameId: 'esp_j2_cerca_lejos', icono: '🌳', titulo: 'Juego 2.1: Cerca y Lejos del Árbol', color: 'emerald',
      pregunta: `Arrastra la pelota hasta el lugar que está <span class="text-emerald-700 underline">${pregunta === 'cerca' ? 'CERCA' : 'LEJOS'} DEL ÁRBOL</span> ⚽`,
      sceneBg: 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200',
      scene: `${this.landmark('🌳', 'Árbol frondoso')}${this.zone('zone-near', 'Cerca del árbol', 'emerald')}${this.zone('zone-far', 'Lejos del árbol', 'slate')}${this.landmark('🏡', 'Casita')}`,
      instruccion: `Arrastra la pelota con tu dedito hacia el lugar ${pregunta === 'cerca' ? 'cerquita del' : 'lejos del'} árbol:`,
      obj: '⚽', objBg: '#DCFCE7', objBorder: '#34D399', correctZoneId,
      voz: pregunta === 'cerca' ? '¡Estamos en el parque! Arrastra la pelota hasta el lugar que está cerquita del gran árbol.' : '¡Estamos en el parque! Arrastra la pelota hasta el lugar que está lejos del árbol, cerca de la casita.',
      clickMsg: '¡Arrastra la pelota con tu dedito hasta el lugar indicado!',
      celebrate: pregunta === 'cerca' ? '¡Muy bien! Pusiste la pelota cerquita del gran árbol.' : '¡Muy bien! Pusiste la pelota lejos del árbol.',
      hints: { 'zone-far': '¡Buen intento! Esa zona está lejos del árbol, cerca de la casita. Busca el lugar cerquita del árbol.', 'zone-near': '¡Buen intento! Esa zona está cerquita del árbol. Busca el lugar que está lejos, junto a la casita.' },
      hintDefault: '¡Buen intento! Mira dónde está el árbol.', missMsg: '¡Casi! Suelta la pelota dentro de uno de los círculos.'
    });
  },

  // 2.2 AL LADO DEL TOBOGÁN
  playAlLado(container) {
    const zonas = window.CNEB_NIVELES.get('esp_j2_al_lado').zonas || 2;
    this.dragSceneGame(container, {
      gameId: 'esp_j2_al_lado', icono: '🛝', titulo: 'Juego 2.2: Al Lado del Tobogán', color: 'sky',
      pregunta: 'Arrastra al osito hasta el lugar que está <span class="text-sky-700 underline">AL LADO DEL TOBOGÁN</span> 🧸',
      sceneBg: 'bg-gradient-to-b from-amber-100 via-sky-100 to-emerald-200',
      scene: `${this.zone('zone-beside', 'Al ladito', 'sky')}${this.landmark('🛝', 'El Tobogán')}${this.zone('zone-sky', 'En el cielo ☁️', 'slate', 'opacity-70')}${zonas >= 3 ? this.zone('zone-farslide', 'Lejos, en la banca', 'slate', 'opacity-80') : ''}`,
      instruccion: 'Arrastra al osito con tu dedito para sentarlo al lado del tobogán:',
      obj: '🧸', objBg: '#E0F2FE', objBorder: '#38BDF8', correctZoneId: 'zone-beside',
      voz: '¡Mira el tobogán! Arrastra al osito hasta el lugar que está al ladito del tobogán para que espere su turno.',
      clickMsg: '¡Arrastra al osito con tu dedito hasta el lugar al ladito del tobogán!',
      celebrate: '¡Bravo! Sentaste al osito al lado del tobogán.',
      hints: { 'zone-sky': '¡Buen intento! En el cielo vuelan los pajaritos; el osito debe estar en el suelo, al ladito del tobogán.', 'zone-farslide': '¡Buen intento! Esa banca está lejos. Busca el lugar pegadito, al lado del tobogán.' },
      hintDefault: '¡Buen intento! Busca el lugar al ladito del tobogán.', missMsg: '¡Casi! Suelta al osito dentro de un círculo.'
    });
  },

  // 2.3 LA LAGUNA DE LOS BARQUITOS
  playPosiciones(container) {
    const N = window.CNEB_NIVELES;
    const pregunta = N.pick(N.get('esp_j2_posiciones').preguntas || ['agua']);
    const correctZoneId = pregunta === 'agua' ? 'zone-water' : 'zone-mountain';
    this.dragSceneGame(container, {
      gameId: 'esp_j2_posiciones', icono: '🎪', titulo: 'Juego 2.3: La Laguna de los Barquitos', color: 'purple',
      pregunta: pregunta === 'agua'
        ? 'Arrastra el barquito hasta el lugar que está <span class="text-purple-700 underline">CERCA DEL AGUA</span> ⛵'
        : 'Arrastra el barquito hasta el lugar que está <span class="text-purple-700 underline">LEJOS DEL AGUA, EN LA MONTAÑA</span> ⛵',
      sceneBg: 'bg-gradient-to-b from-sky-200 via-emerald-100 to-cyan-300',
      scene: `${this.landmark('🏔️', 'Montaña')}${this.zone('zone-mountain', 'En la montaña', 'slate')}${this.zone('zone-water', 'Cerca del agua', 'cyan')}${this.landmark('🌊', 'La Laguna')}`,
      instruccion: pregunta === 'agua' ? 'Arrastra el barquito de papel cerca del agua:' : 'Arrastra el barquito de papel lejos del agua, hasta la montaña:',
      obj: '⛵', objBg: '#F3E8FF', objBorder: '#C084FC', correctZoneId,
      voz: pregunta === 'agua'
        ? '¡Mira la laguna azul! Arrastra el barquito hasta el lugar cerquita del agua para que pueda navegar.'
        : '¡El barquito quiere descansar! Arrástralo hasta el lugar que está lejos del agua, allá en la montaña.',
      clickMsg: '¡Arrastra el barquito con tu dedito hasta el lugar indicado!',
      celebrate: pregunta === 'agua' ? '¡Excelente! Pusiste el barquito cerquita del agua.' : '¡Excelente! Pusiste el barquito lejos del agua, en la montaña.',
      hints: { 'zone-mountain': '¡Buen intento! La montaña está lejos del agua. Busca el lugar cerquita de la laguna.', 'zone-water': '¡Buen intento! Ahí está cerca del agua. Busca el lugar lejos, en la montaña.' },
      hintDefault: '¡Buen intento! Mira dónde está la laguna.', missMsg: '¡Casi! Suelta el barquito dentro de un círculo.'
    });
  }
};
