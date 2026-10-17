/**
 * MÓDULO DOCENTE Y FAMILIA - EVALUACIÓN FORMATIVA CNEB INTEGRAL
 * Rúbrica oficial (AD, A, B, C) según RVM N° 094-2020-MINEDU,
 * detalle para las 6 sesiones pedagógicas (Mundo 1 y Mundo 2),
 * formateo profesional para impresión y exportación a PDF sin solapamientos.
 */

window.DocenteModule = {
  gateAnswer: 0,

  // Helper para convertir sintaxis Markdown simple a HTML semántico
  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/\n\n/g, '<div class="my-2"></div>')
      .replace(/\n/g, '<br>');
  },

  openGate() {
    window.SoundEngine.playPop();
    const num1 = Math.floor(Math.random() * 6) + 4; // 4 a 9
    const num2 = Math.floor(Math.random() * 6) + 3; // 3 a 8
    this.gateAnswer = num1 + num2;

    const modal = document.createElement('div');
    modal.id = 'docente-gate-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-amber-400 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl mx-auto mb-3">
          🔒
        </div>
        <h3 class="text-2xl font-black text-slate-800 font-fun mb-2">Zona Docente y Familias</h3>
        <p class="text-slate-600 text-sm mb-4">
          Control de seguridad para adultos. Para acceder al panel de evaluación formativa del CNEB, resuelve:
        </p>

        <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 my-3">
          <span class="text-3xl font-black text-amber-950 font-fun">${num1} + ${num2} = ?</span>
        </div>

        <div class="flex gap-2 justify-center my-4">
          <input type="number" id="gate-input" class="w-28 text-center text-3xl font-black p-2 border-3 border-slate-300 rounded-2xl focus:border-amber-500 focus:outline-none" placeholder="¿?">
        </div>

        <div class="flex gap-3 justify-center mt-5">
          <button id="gate-cancel" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-base py-2 px-5">
            Cancelar
          </button>
          <button id="gate-submit" class="btn-chunky btn-green text-base py-2 px-6">
            Ingresar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('gate-input');
    input.focus();

    document.getElementById('gate-cancel').addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    const verify = () => {
      const val = parseInt(input.value);
      if (val === this.gateAnswer) {
        window.SoundEngine.playSuccess();
        modal.remove();
        this.openDashboard();
      } else {
        window.SoundEngine.playGentleTryAgain();
        input.classList.add('border-red-500', 'animate-wiggle');
        setTimeout(() => input.classList.remove('animate-wiggle'), 500);
      }
    };

    document.getElementById('gate-submit').addEventListener('click', verify);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verify();
    });
  },

  openDashboard() {
    const assessmentCantidad = window.AppState.getWorldOverallAssessment('cantidad');
    const assessmentEspacio = window.AppState.getWorldOverallAssessment('espacio');

    const conclusionCantidad = window.AppState.generateConclusion('cantidad');
    const conclusionEspacio = window.AppState.generateConclusion('espacio');

    const formattedConclusionCantidad = this.formatMarkdown(conclusionCantidad);
    const formattedConclusionEspacio = this.formatMarkdown(conclusionEspacio);

    const todayDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const modal = document.createElement('div');
    modal.id = 'docente-dashboard-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-4xl mx-auto flex flex-col max-h-[92vh]">
        
        <!-- Cabecera en Pantalla (Acciones No Imprimibles) -->
        <div class="flex items-center justify-between border-b pb-4 mb-4 no-print">
          <div class="flex items-center gap-3">
            <span class="text-3xl">👩‍🏫</span>
            <div>
              <h2 class="text-2xl font-black text-slate-800 font-fun">Panel Docente: Evaluación Formativa CNEB</h2>
              <p class="text-xs text-slate-500 font-semibold">Educación Inicial - Ciclo II (5 Años) • Estándar Nivel 2 • RVM N° 094-2020-MINEDU</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-print-report" class="btn-chunky btn-blue text-sm py-2 px-5 shadow-lg flex items-center gap-2" title="Imprimir o guardar en PDF">
              <span>🖨️</span>
              <span>Imprimir Reporte (PDF)</span>
            </button>
            <button id="btn-close-dashboard" class="btn-chunky btn-coral text-sm py-2 px-4">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- ===================================================================
             DOCUMENTO DE REPORTE OFICIAL (OPTIMIZADO PARA PANTALLA E IMPRESIÓN PDF)
             =================================================================== -->
        <div id="docente-report-printable" class="overflow-y-auto pr-1 flex-1 space-y-6">

          <!-- 1. MEMBRETE OFICIAL INSTITUCIONAL (MINEDU) -->
          <div class="report-block border-b-2 border-slate-700 pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-amber-500 border border-amber-600 flex items-center justify-center text-2xl shadow-sm">
                  🇵🇪
                </div>
                <div>
                  <p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ministerio de Educación del Perú • Educación Inicial</p>
                  <h1 class="text-lg md:text-xl font-black text-slate-900 font-fun leading-tight">
                    INFORME DE EVALUACIÓN FORMATIVA DEL ESTUDIANTE
                  </h1>
                  <p class="text-[11px] font-bold text-slate-700">
                    Ciclo II (5 Años) • Estándar de Aprendizaje Nivel 2 • RVM N° 094-2020-MINEDU
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-block bg-slate-100 border border-slate-300 rounded px-2.5 py-0.5 text-xs font-bold text-slate-800">
                  Año 2026
                </span>
                <p class="text-[10px] text-slate-500 mt-1">Fecha: ${todayDate}</p>
              </div>
            </div>
          </div>

          <!-- 2. FICHA DE DATOS DEL ESTUDIANTE -->
          <div class="report-block border border-slate-300 bg-slate-50/80 rounded-xl p-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Estudiante (5 años):</span>
                <input type="text" id="student-name-input" class="screen-only font-black text-base text-slate-900 bg-white border border-amber-300 rounded-lg px-2.5 py-1 w-full mt-1 shadow-sm" value="${window.AppState.state.childName}">
                <span id="student-name-print" class="print-only font-black text-sm text-slate-900 mt-1">${window.AppState.state.childName}</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Nivel / Edad:</span>
                <span class="font-bold text-sm text-slate-800 block mt-1">Inicial 5 años • Ciclo II</span>
              </div>
              <div class="sm:text-right">
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Logros Acumulados:</span>
                <span class="font-black text-sm text-amber-600 block mt-1">⭐ ${window.AppState.state.stars} Estrellas</span>
              </div>
            </div>
          </div>

          <!-- 3. ESCALA OFICIAL CNEB (LEYENDA NORMATIVA) -->
          <div class="report-block border border-slate-200 bg-white rounded-lg p-2 text-xs flex flex-wrap items-center justify-between gap-2">
            <span class="font-bold text-slate-600 uppercase text-[10px]">Escala Oficial (RVM 094-2020):</span>
            <div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded font-black badge-ad">AD</span> <span class="text-[11px] font-medium text-slate-700">Logro Destacado</span></div>
            <div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded font-black badge-a">A</span> <span class="text-[11px] font-medium text-slate-700">Logro Esperado</span></div>
            <div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded font-black badge-b">B</span> <span class="text-[11px] font-medium text-slate-700">En Proceso</span></div>
            <div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded font-black badge-c">C</span> <span class="text-[11px] font-medium text-slate-700">En Inicio</span></div>
          </div>

          <!-- ================================================================
               COMPETENCIA 1: RESUELVE PROBLEMAS DE CANTIDAD
               ================================================================ -->
          <div class="report-block border border-amber-300 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-amber-200 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🧺</span>
                <div>
                  <h3 class="text-base font-black text-amber-950 font-fun">Competencia 1: Resuelve problemas de cantidad</h3>
                  <p class="text-[11px] text-slate-500">3 Sesiones de Aprendizaje • 13 Retos evaluados</p>
                </div>
              </div>
              <span class="text-sm font-black px-3 py-1 rounded-lg shadow-sm ${this.getBadgeClass(assessmentCantidad.overall)}">
                Nivel Global: ${assessmentCantidad.overall}
              </span>
            </div>

            <!-- Tablas de las 3 Sesiones de Cantidad -->
            <div class="space-y-3">
              ${assessmentCantidad.sesiones.map(ses => `
                <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-xs text-slate-800">${ses.session.icono} ${ses.session.titulo}</span>
                    <span class="font-black text-[11px] px-2 py-0.5 rounded ${this.getBadgeClass(ses.grade)}">
                      Sesión: ${ses.grade}
                    </span>
                  </div>

                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th class="p-1">Reto / Desempeño Lúdico</th>
                        <th class="p-1 text-center w-16">Intentos</th>
                        <th class="p-1 text-center w-16">Pistas</th>
                        <th class="p-1 text-center w-24">Calificación</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      ${ses.items.map(it => `
                        <tr>
                          <td class="p-1">
                            <span class="font-bold text-slate-800">${it.juego.titulo}</span>
                            <span class="text-[10px] text-slate-500 block">${it.juego.subtitulo}</span>
                          </td>
                          <td class="p-1 text-center font-bold text-slate-700">${it.attempts}</td>
                          <td class="p-1 text-center font-bold text-slate-700">${it.hints}</td>
                          <td class="p-1 text-center">
                            <span class="font-black px-2 py-0.5 rounded text-[10px] ${this.getBadgeClass(it.calificacion)}">
                              ${it.calificacion}
                            </span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `).join('')}
            </div>

            <!-- Conclusión Descriptiva Oficial Cantidad -->
            <div class="border-l-4 border-amber-500 bg-amber-50/70 p-3 rounded-r-lg text-xs space-y-1.5 mt-3">
              <p class="font-black text-amber-950 uppercase tracking-wider text-[11px]">Conclusión Descriptiva Oficial (SIAGIE / MINEDU):</p>
              <div class="text-slate-800 leading-relaxed text-[11px]">${formattedConclusionCantidad}</div>
            </div>
          </div>

          <!-- SALTO DE PÁGINA LIMPIO PARA LA SEGUNDA COMPETENCIA EN IMPRESIÓN -->
          <div class="report-page-break"></div>

          <!-- ================================================================
               COMPETENCIA 2: FORMA, MOVIMIENTO Y LOCALIZACIÓN
               ================================================================ -->
          <div class="report-block border border-sky-300 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-sky-200 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🚀</span>
                <div>
                  <h3 class="text-base font-black text-sky-950 font-fun">Competencia 2: Resuelve problemas de forma, movimiento y localización</h3>
                  <p class="text-[11px] text-slate-500">3 Sesiones de Aprendizaje • 10 Retos evaluados</p>
                </div>
              </div>
              <span class="text-sm font-black px-3 py-1 rounded-lg shadow-sm ${this.getBadgeClass(assessmentEspacio.overall)}">
                Nivel Global: ${assessmentEspacio.overall}
              </span>
            </div>

            <!-- Tablas de las 3 Sesiones de Espacio -->
            <div class="space-y-3">
              ${assessmentEspacio.sesiones.map(ses => `
                <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-xs text-slate-800">${ses.session.icono} ${ses.session.titulo}</span>
                    <span class="font-black text-[11px] px-2 py-0.5 rounded ${this.getBadgeClass(ses.grade)}">
                      Sesión: ${ses.grade}
                    </span>
                  </div>

                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th class="p-1">Reto / Desempeño Lúdico</th>
                        <th class="p-1 text-center w-16">Intentos</th>
                        <th class="p-1 text-center w-16">Pistas</th>
                        <th class="p-1 text-center w-24">Calificación</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      ${ses.items.map(it => `
                        <tr>
                          <td class="p-1">
                            <span class="font-bold text-slate-800">${it.juego.titulo}</span>
                            <span class="text-[10px] text-slate-500 block">${it.juego.subtitulo}</span>
                          </td>
                          <td class="p-1 text-center font-bold text-slate-700">${it.attempts}</td>
                          <td class="p-1 text-center font-bold text-slate-700">${it.hints}</td>
                          <td class="p-1 text-center">
                            <span class="font-black px-2 py-0.5 rounded text-[10px] ${this.getBadgeClass(it.calificacion)}">
                              ${it.calificacion}
                            </span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `).join('')}
            </div>

            <!-- Conclusión Descriptiva Oficial Espacio -->
            <div class="border-l-4 border-sky-500 bg-sky-50/70 p-3 rounded-r-lg text-xs space-y-1.5 mt-3">
              <p class="font-black text-sky-950 uppercase tracking-wider text-[11px]">Conclusión Descriptiva Oficial (SIAGIE / MINEDU):</p>
              <div class="text-slate-800 leading-relaxed text-[11px]">${formattedConclusionEspacio}</div>
            </div>
          </div>

          <!-- 4. FIRMAS OFICIALES DE RESPONSABILIDAD (OFICIAL MINEDU) -->
          <div class="report-block border-t-2 border-slate-300 pt-6 mt-6">
            <div class="grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div class="border-b border-slate-400 mb-2 h-10"></div>
                <p class="font-bold text-slate-800 text-[11px]">Docente de Aula</p>
                <p class="text-[10px] text-slate-500">Educación Inicial (5 Años)</p>
              </div>
              <div>
                <div class="border-b border-slate-400 mb-2 h-10"></div>
                <p class="font-bold text-slate-800 text-[11px]">Dirección de la I.E.</p>
                <p class="text-[10px] text-slate-500">Sello y Firma</p>
              </div>
              <div>
                <div class="border-b border-slate-400 mb-2 h-10"></div>
                <p class="font-bold text-slate-800 text-[11px]">Padre / Madre / Apoderado</p>
                <p class="text-[10px] text-slate-500">Conformidad de Entrega</p>
              </div>
            </div>
            <p class="text-[9px] text-center text-slate-400 mt-4">
              Documento pedagógico oficial expedido conforme a las disposiciones de la RVM N° 094-2020-MINEDU y el Currículo Nacional de la Educación Básica (CNEB).
            </p>
          </div>

          <!-- Opciones de reinicio para otro estudiante (Solo Pantalla) -->
          <div class="flex justify-between items-center pt-2 border-t no-print">
            <button id="btn-reset-data" class="text-xs text-red-600 hover:text-red-800 font-bold underline cursor-pointer">
              ⚠️ Reiniciar datos para evaluar a otro estudiante
            </button>
            <span class="text-[11px] text-slate-400">RVM N° 094-2020-MINEDU • Inicial Ciclo II</span>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos
    document.getElementById('btn-close-dashboard').addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    const studentInput = document.getElementById('student-name-input');
    const studentPrint = document.getElementById('student-name-print');

    studentInput.addEventListener('input', () => {
      const val = studentInput.value.trim() || 'Estudiante de 5 años';
      studentPrint.textContent = val;
      window.AppState.updateChildName(val);
    });

    document.getElementById('btn-print-report').addEventListener('click', () => {
      // Sincronizar nombre antes de imprimir
      studentPrint.textContent = studentInput.value.trim() || 'Estudiante de 5 años';
      window.print();
    });

    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas reiniciar los datos de evaluación para registrar a un nuevo estudiante?')) {
        window.AppState.resetProgress();
        modal.remove();
        this.openDashboard();
      }
    });
  },

  getBadgeClass(grade) {
    switch (grade) {
      case 'AD': return 'badge-ad';
      case 'A': return 'badge-a';
      case 'B': return 'badge-b';
      case 'C': return 'badge-c';
      default: return 'bg-slate-100 text-slate-600 border border-slate-300';
    }
  }
};
