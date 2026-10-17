/**
 * MÓDULO FAMILIAR - PORTAL DE AVANCES PARA PADRES Y FAMILIAS
 * Vista exclusiva y privada para que cada familia consulte el progreso de su propio hijo/a,
 * con medallero, aprendizajes clave en lenguaje cercano, pautas para el hogar y diploma imprimible.
 */

window.FamiliaModule = {
  openPortal() {
    window.SoundEngine.playPop();
    const student = window.AppState.getCurrentStudent();
    if (!student) return;

    const summary = window.AppState.getStudentSummary(student.id);
    const todayDate = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

    const modal = document.createElement('div');
    modal.id = 'familia-portal-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-3xl mx-auto flex flex-col max-h-[92vh] border-4 border-emerald-400 shadow-2xl">
        
        <!-- Cabecera del Portal Familiar (No Imprimible) -->
        <div class="flex items-center justify-between pb-3 border-b-2 border-emerald-200 mb-4 no-print">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-sm">
              👨‍👩‍👧
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 font-fun leading-tight">Portal para Familias: Mi Progreso</h2>
              <p class="text-xs text-emerald-800 font-bold">Acompañando el aprendizaje matemático en Educación Inicial (5 Años)</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-print-diploma" class="btn-chunky btn-yellow text-xs md:text-sm py-2 px-4 shadow flex items-center gap-1.5" title="Imprimir diploma de reconocimiento">
              <span>📜</span>
              <span>Imprimir Diploma</span>
            </button>
            <button id="btn-close-familia" class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-3.5 hover:bg-slate-200">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Contenido Desplazable del Portal -->
        <div id="familia-content-scroll" class="overflow-y-auto pr-1 flex-1 space-y-5">
          
          <!-- Tarjeta de Bienvenida Personalizada del Niño -->
          <div class="bg-gradient-to-r from-amber-100 via-emerald-100 to-sky-100 border-3 border-emerald-300 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-4 text-center sm:text-left">
              <div class="w-16 h-16 rounded-2xl bg-white border-3 border-emerald-400 flex items-center justify-center text-4xl shadow-md">
                ${student.avatar || '🦙'}
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 block">Estudiante del Ciclo II:</span>
                <h3 class="text-2xl font-black text-slate-900 font-fun">${student.name}</h3>
                <p class="text-xs text-slate-600 font-semibold">5 Años • ${window.AppState.state.activeClass}</p>
              </div>
            </div>

            <!-- Métricas Clave de Logros -->
            <div class="flex items-center gap-3">
              <div class="bg-white/90 border-2 border-amber-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">⭐</span>
                <span class="font-black text-amber-950 font-fun text-xl block leading-tight">${student.stars}</span>
                <span class="text-[10px] text-slate-500 font-bold">Estrellitas</span>
              </div>
              <div class="bg-white/90 border-2 border-emerald-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">🎯</span>
                <span class="font-black text-emerald-950 font-fun text-xl block leading-tight">${summary.totalCompleted}/23</span>
                <span class="text-[10px] text-slate-500 font-bold">Misiones</span>
              </div>
              <div class="bg-white/90 border-2 border-sky-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">📈</span>
                <span class="font-black text-sky-950 font-fun text-xl block leading-tight">${summary.totalProgress}%</span>
                <span class="text-[10px] text-slate-500 font-bold">Avance</span>
              </div>
            </div>
          </div>

          <!-- Medallero Infantil de Aventuras -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
            <h4 class="text-base font-black text-slate-900 font-fun mb-3 flex items-center gap-2">
              <span class="text-2xl">🏅</span>
              <span>Medallero de Aventuras Matemáticas</span>
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <!-- Medalla 1 -->
              <div class="p-3 rounded-2xl border-2 ${summary.cantidad.completed >= 4 ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🧺</span>
                <span class="font-bold text-xs text-slate-800 block">Clasificador Estrella</span>
                <span class="text-[10px] font-bold ${summary.cantidad.completed >= 4 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.cantidad.completed >= 4 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>

              <!-- Medalla 2 -->
              <div class="p-3 rounded-2xl border-2 ${summary.cantidad.completed >= 8 ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🌿</span>
                <span class="font-bold text-xs text-slate-800 block">Tesoros del Huerto</span>
                <span class="text-[10px] font-bold ${summary.cantidad.completed >= 8 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.cantidad.completed >= 8 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>

              <!-- Medalla 3 -->
              <div class="p-3 rounded-2xl border-2 ${summary.cantidad.completed >= 13 ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🍊</span>
                <span class="font-bold text-xs text-slate-800 block">Gran Contador al 10</span>
                <span class="text-[10px] font-bold ${summary.cantidad.completed >= 13 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.cantidad.completed >= 13 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>

              <!-- Medalla 4 -->
              <div class="p-3 rounded-2xl border-2 ${summary.espacio.completed >= 3 ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🟡</span>
                <span class="font-bold text-xs text-slate-800 block">Maestro de Formas</span>
                <span class="text-[10px] font-bold ${summary.espacio.completed >= 3 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.espacio.completed >= 3 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>

              <!-- Medalla 5 -->
              <div class="p-3 rounded-2xl border-2 ${summary.espacio.completed >= 6 ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🌳</span>
                <span class="font-bold text-xs text-slate-800 block">Explorador del Parque</span>
                <span class="text-[10px] font-bold ${summary.espacio.completed >= 6 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.espacio.completed >= 6 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>

              <!-- Medalla 6 -->
              <div class="p-3 rounded-2xl border-2 ${summary.espacio.completed >= 10 ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50 opacity-60'}">
                <span class="text-3xl block mb-1">🧭</span>
                <span class="font-bold text-xs text-slate-800 block">Guía de Caminos</span>
                <span class="text-[10px] font-bold ${summary.espacio.completed >= 10 ? 'text-emerald-700' : 'text-slate-500'}">
                  ${summary.espacio.completed >= 10 ? '¡Logrado! ⭐' : 'Por completar'}
                </span>
              </div>
            </div>
          </div>

          <!-- ¿Qué Habilidades ha Demostrado? (Lenguaje Formativo Claro) -->
          <div class="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm">
            <h4 class="text-base font-black text-slate-900 font-fun mb-2 flex items-center gap-2">
              <span class="text-xl">🌱</span>
              <span>¿Qué está aprendiendo en esta etapa (5 Años)?</span>
            </h4>
            <ul class="space-y-2 text-xs text-slate-700 font-medium">
              <li class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✔</span>
                <span><strong>Agrupación y Comparación:</strong> Clasifica objetos de su entorno por color y tamaño (grande y pequeño), y utiliza cuantificadores cotidianos ("muchos", "pocos", "ninguno").</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✔</span>
                <span><strong>Orden y Seriación:</strong> Ordena de forma creciente colecciones de hasta 5 elementos e identifica el 1.°, 2.° y 3.° lugar.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✔</span>
                <span><strong>Conteo y Resolución de Problemas:</strong> Cuenta hasta 10 elementos diciendo la secuencia en orden y resuelve situaciones sencillas de agregar y quitar hasta 5 con material concreto.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✔</span>
                <span><strong>Formas y Orientación Espacial:</strong> Reconoce figuras geométricas y cuerpos que ruedan, ubicando objetos "cerca de", "lejos de" y "al lado de".</span>
              </li>
            </ul>
          </div>

          <!-- Consejos Prácticos para Jugar Matemática en Familia -->
          <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm">
            <h4 class="text-base font-black text-amber-950 font-fun mb-2 flex items-center gap-2">
              <span class="text-xl">💡</span>
              <span>Ideas de 5 minutos para jugar matemática en casa:</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900">
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🍳 Al poner la mesa:</strong>
                "¿Cuántas cucharas necesitamos para todos?", "¿Hay muchas o pocas servilletas?"
              </div>
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🧺 Al ordenar la ropa:</strong>
                Emparejar medias por color o guardar los zapatos ordenándolos del más pequeño al más grande.
              </div>
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🌳 Camino al parque:</strong>
                "Demos 5 pasos gigantes", "¿Qué está más cerca: el arbolito o la tienda?"
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             PLANTILLA DEL DIPLOMA INFANTIL IMPRIMIBLE
             =================================================================== -->
        <div id="diploma-printable" class="print-only">
          <div class="p-8 border-8 border-double border-amber-500 rounded-3xl bg-amber-50 text-center max-w-2xl mx-auto my-4 relative">
            <div class="text-5xl mb-2">⭐ 🦙 ⭐</div>
            <p class="text-xs uppercase font-bold text-amber-800 tracking-widest">MINISTERIO DE EDUCACIÓN DEL PERÚ • EDUCACIÓN INICIAL</p>
            <h1 class="text-3xl font-black text-amber-950 font-fun mt-2 mb-1">DIPLOMA DE LOGRO MATEMÁTICO</h1>
            <p class="text-sm font-bold text-slate-600">Se otorga con mucho cariño y alegría a:</p>
            
            <div class="my-4 py-2 border-b-4 border-dashed border-amber-400">
              <span class="text-3xl font-black text-amber-900 font-fun">${student.name}</span>
            </div>

            <p class="text-sm text-slate-700 max-w-lg mx-auto font-medium">
              Por su curiosidad, esfuerzo y entusiasmo al resolver los desafíos matemáticos de <strong>Cantidad, Formas y Espacio (Ciclo II - 5 Años)</strong> junto a su amiga Kusi.
            </p>

            <div class="flex items-center justify-around mt-8 pt-4 border-t-2 border-amber-300 text-xs">
              <div>
                <span class="font-black text-slate-800 block text-sm">⭐ ${student.stars} Estrellas</span>
                <span class="text-slate-500">Logros acumulados</span>
              </div>
              <div>
                <span class="font-bold text-slate-800 block text-sm">${todayDate}</span>
                <span class="text-slate-500">Fecha de entrega</span>
              </div>
              <div>
                <span class="font-fun font-bold text-amber-900 text-base block">Kusi la Alpaca 🦙</span>
                <span class="text-slate-500">Mascota Guía</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-familia')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    document.getElementById('btn-print-diploma')?.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      window.print();
    });
  }
};
