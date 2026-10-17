/**
 * MÓDULO DOCENTE EXCLUSIVO - SEGUIMIENTO INTEGRAL DEL AULA Y EVALUACIÓN CNEB
 * Proporciona a la maestra:
 * 1. Monitoreo del Aula: Sábana consolidada para ver quiénes ya resolvieron, quiénes están
 *    en proceso y quiénes están pendientes / no han iniciado todavía.
 * 2. Gestión de Estudiantes: Registrar alumnos, importar listas y exportar a Excel (CSV).
 * 3. Ficha Individual CNEB: Informe oficial detallado por estudiante con rúbrica oficial (AD, A, B, C)
 *    y conclusiones descriptivas para SIAGIE / MINEDU, listo para imprimir en PDF.
 */

window.DocenteModule = {
  activeTab: 'monitoring', // 'monitoring' o 'individual'
  selectedStudentId: null,
  filterStatus: 'all', // 'all', 'completed', 'in_progress', 'pending'

  getBadgeClass(grade) {
    switch (grade) {
      case 'AD': return 'badge-ad bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'A':  return 'badge-a bg-indigo-100 text-indigo-800 border border-indigo-300';
      case 'B':  return 'badge-b bg-amber-100 text-amber-800 border border-amber-300';
      case 'C':  return 'badge-c bg-rose-100 text-rose-800 border border-rose-300';
      default:   return 'bg-slate-100 text-slate-600 border border-slate-300';
    }
  },

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/\n\n/g, '<div class="my-2"></div>')
      .replace(/\n/g, '<br>');
  },

  // COMPUERTA DE SEGURIDAD EXCLUSIVA PARA EL DOCENTE
  openGate() {
    window.SoundEngine.playPop();
    const num1 = Math.floor(Math.random() * 6) + 4; // 4 a 9
    const num2 = Math.floor(Math.random() * 6) + 3; // 3 a 8
    const answer = num1 + num2;

    const modal = document.createElement('div');
    modal.id = 'docente-gate-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-purple-400 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow">
          🔒
        </div>
        <h3 class="text-2xl font-black text-slate-900 font-fun mb-2">Panel Docente Protegido</h3>
        <p class="text-slate-600 text-sm mb-4">
          Acceso exclusivo para la profesora. Para visualizar el seguimiento y calificaciones del aula, resuelve:
        </p>

        <div class="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 my-3">
          <span class="text-3xl font-black text-purple-950 font-fun">${num1} + ${num2} = ?</span>
        </div>

        <div class="flex gap-2 justify-center my-4">
          <input type="number" id="gate-input" class="w-32 text-center text-3xl font-black p-2 border-3 border-slate-300 rounded-2xl focus:border-purple-500 focus:outline-none" placeholder="¿?">
        </div>

        <div class="flex gap-3 justify-center mt-5">
          <button id="gate-cancel" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-sm py-2 px-5">
            Cancelar
          </button>
          <button id="gate-submit" class="btn-chunky btn-purple text-base py-2 px-6">
            Ingresar al Panel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('gate-input');
    input.focus();

    document.getElementById('gate-cancel')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    const verify = () => {
      const val = parseInt(input.value);
      if (val === answer || input.value === '1234') { // Código maestro o cálculo
        window.SoundEngine.playSuccess();
        modal.remove();
        this.openDashboard('monitoring');
      } else {
        window.SoundEngine.playGentleTryAgain();
        input.classList.add('border-red-500', 'animate-wiggle');
        setTimeout(() => input.classList.remove('animate-wiggle'), 500);
      }
    };

    document.getElementById('gate-submit')?.addEventListener('click', verify);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verify();
    });
  },

  // ABRE EL DASHBOARD DOCENTE
  openDashboard(tab = 'monitoring', targetStudentId = null) {
    this.activeTab = tab;
    if (targetStudentId) {
      this.selectedStudentId = targetStudentId;
    } else if (!this.selectedStudentId) {
      this.selectedStudentId = window.AppState.state.currentStudentId;
    }

    const modal = document.createElement('div');
    modal.id = 'docente-dashboard-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-5xl mx-auto flex flex-col max-h-[94vh] border-4 border-purple-400 shadow-2xl">
        
        <!-- Cabecera del Panel Docente -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 mb-4 gap-3 no-print">
          <div class="flex items-center gap-3">
            <span class="text-4xl">👩‍🏫</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-black text-slate-900 font-fun leading-tight">Panel de Gestión Docente</h2>
                <span class="text-xs bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2 py-0.5 rounded-full">Exclusivo Profesora</span>
              </div>
              <p class="text-xs text-slate-500 font-semibold">${window.AppState.state.activeClass} • CNEB Ciclo II (5 Años)</p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button id="btn-close-dashboard" class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-3.5 hover:bg-slate-200">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Selector de Pestañas: Monitoreo Grupal vs Ficha Individual -->
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-4 no-print">
          <div class="flex gap-2">
            <button id="tab-btn-monitoring" class="tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              this.activeTab === 'monitoring' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>📊</span>
              <span>Monitoreo del Aula (${window.AppState.state.students.length} Estudiantes)</span>
            </button>

            <button id="tab-btn-individual" class="tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              this.activeTab === 'individual' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>📄</span>
              <span>Ficha Individual CNEB</span>
            </button>
          </div>

          <!-- Acciones Rápidas -->
          <div id="tab-actions-container" class="flex items-center gap-2">
            <!-- Se inyecta según pestaña activa -->
          </div>
        </div>

        <!-- Contenedor Principal Dinámico -->
        <div id="docente-tab-content" class="overflow-y-auto pr-1 flex-1">
          <!-- Se inyecta según pestaña -->
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-dashboard')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    document.getElementById('tab-btn-monitoring')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.switchTab('monitoring');
    });

    document.getElementById('tab-btn-individual')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.switchTab('individual');
    });

    this.renderCurrentTab();
  },

  switchTab(tab) {
    this.activeTab = tab;
    const btnMon = document.getElementById('tab-btn-monitoring');
    const btnInd = document.getElementById('tab-btn-individual');

    if (btnMon && btnInd) {
      if (tab === 'monitoring') {
        btnMon.className = 'tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-purple-600 text-white shadow-md';
        btnInd.className = 'tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200';
      } else {
        btnMon.className = 'tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200';
        btnInd.className = 'tab-btn px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-purple-600 text-white shadow-md';
      }
    }

    this.renderCurrentTab();
  },

  renderCurrentTab() {
    const container = document.getElementById('docente-tab-content');
    const actions = document.getElementById('tab-actions-container');
    if (!container) return;

    if (this.activeTab === 'monitoring') {
      this.renderMonitoringTab(container, actions);
    } else {
      this.renderIndividualTab(container, actions);
    }
  },

  // =========================================================================
  // PESTAÑA 1: MONITOREO DEL AULA (SEGUIMIENTO GRUPAL DE TODOS LOS ALUMNOS)
  // =========================================================================
  renderMonitoringTab(container, actions) {
    const summary = window.AppState.getClassSummary();
    const students = summary.students;

    // Barra de acciones superiores
    if (actions) {
      actions.innerHTML = `
        <button id="btn-export-csv" class="btn-chunky bg-emerald-600 text-white border-emerald-500 text-xs py-1.5 px-3 shadow flex items-center gap-1.5" title="Descargar reporte en formato Excel/CSV">
          <span>📥</span>
          <span>Descargar Excel</span>
        </button>
        <button id="btn-add-student-docente" class="btn-chunky btn-green text-xs py-1.5 px-3 shadow flex items-center gap-1.5">
          <span>➕</span>
          <span>Registrar Alumno</span>
        </button>
      `;

      document.getElementById('btn-export-csv')?.addEventListener('click', () => this.exportCSV());
      document.getElementById('btn-add-student-docente')?.addEventListener('click', () => {
        window.StudentProfileModule.openRegisterModal();
        const modal = document.getElementById('docente-dashboard-modal');
        if (modal) modal.remove();
      });
    }

    // Filtrar según estado
    let filteredStudents = students;
    if (this.filterStatus === 'completed') {
      filteredStudents = students.filter(s => s.status === 'completado');
    } else if (this.filterStatus === 'in_progress') {
      filteredStudents = students.filter(s => s.status === 'en_proceso');
    } else if (this.filterStatus === 'pending') {
      filteredStudents = students.filter(s => s.status === 'pendiente');
    }

    container.innerHTML = `
      <div class="space-y-4">

        <!-- Tarjetas KPI del Aula -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- Total Estudiantes -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-black">
              👥
            </div>
            <div>
              <span class="text-[11px] font-bold text-slate-500 uppercase block">Total Alumnos</span>
              <span class="text-2xl font-black text-slate-900 font-fun">${summary.total}</span>
            </div>
          </div>

          <!-- Han Resuelto / Activos -->
          <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-2xl font-black">
              ✅
            </div>
            <div>
              <span class="text-[11px] font-bold text-emerald-800 uppercase block">Han Resuelto</span>
              <span class="text-2xl font-black text-emerald-950 font-fun">${summary.activeCount} <span class="text-xs font-normal">(${Math.round((summary.activeCount / (summary.total || 1)) * 100)}%)</span></span>
            </div>
          </div>

          <!-- Pendientes / Aún no inician -->
          <div class="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-2xl font-black">
              ⚠️
            </div>
            <div>
              <span class="text-[11px] font-bold text-rose-800 uppercase block">No Han Iniciado</span>
              <span class="text-2xl font-black text-rose-950 font-fun">${summary.pending} <span class="text-xs font-normal">(${Math.round((summary.pending / (summary.total || 1)) * 100)}%)</span></span>
            </div>
          </div>

          <!-- Promedio de Avance del Aula -->
          <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-2xl font-black">
              📈
            </div>
            <div>
              <span class="text-[11px] font-bold text-amber-800 uppercase block">Avance Promedio</span>
              <span class="text-2xl font-black text-amber-950 font-fun">${summary.avgProgress}%</span>
            </div>
          </div>
        </div>

        <!-- Filtros Rápidos de Seguimiento -->
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-600 uppercase ml-1">Filtrar:</span>
            <button class="filter-btn text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${this.filterStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-status="all">
              Todos (${summary.total})
            </button>
            <button class="filter-btn text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${this.filterStatus === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-status="completed">
              ✅ Completados (${summary.completed})
            </button>
            <button class="filter-btn text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${this.filterStatus === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-status="in_progress">
              ⏳ En Proceso (${summary.inProgress})
            </button>
            <button class="filter-btn text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${this.filterStatus === 'pending' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-status="pending">
              ⚠️ Pendientes (${summary.pending})
            </button>
          </div>

          <span class="text-xs text-slate-500 font-medium hidden sm:inline">Mostrando ${filteredStudents.length} de ${summary.total} alumnos</span>
        </div>

        <!-- Sábana / Tabla de Seguimiento del Salón -->
        <div class="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th class="p-3">Estudiante</th>
                <th class="p-3">Última Actividad</th>
                <th class="p-3 text-center">Mundo 1: Cantidad</th>
                <th class="p-3 text-center">Mundo 2: Espacio</th>
                <th class="p-3 text-center">Avance Total</th>
                <th class="p-3 text-center">Estado</th>
                <th class="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${filteredStudents.map(st => `
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <!-- Estudiante -->
                  <td class="p-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl flex-shrink-0">
                        ${st.avatar}
                      </div>
                      <div>
                        <span class="font-black text-slate-900 text-sm block font-fun">${st.name}</span>
                        <span class="text-[11px] text-amber-600 font-bold">⭐ ${st.stars} estrellas</span>
                      </div>
                    </div>
                  </td>

                  <!-- Última Actividad -->
                  <td class="p-3 font-semibold text-slate-600">
                    ${st.hasPlayed 
                      ? `<span class="text-emerald-700 font-bold">🕒 ${st.lastActive}</span>` 
                      : `<span class="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">⚠️ Sin actividad</span>`}
                  </td>

                  <!-- Mundo 1: Cantidad -->
                  <td class="p-3 text-center">
                    <div class="flex flex-col items-center gap-1">
                      <span class="font-bold text-[11px] px-2 py-0.5 rounded ${this.getBadgeClass(st.cantidad.grade)}">
                        ${st.cantidad.grade}
                      </span>
                      <span class="text-[10px] text-slate-500">${st.cantidad.completed}/${st.cantidad.total} (${st.cantidad.percent}%)</span>
                    </div>
                  </td>

                  <!-- Mundo 2: Espacio -->
                  <td class="p-3 text-center">
                    <div class="flex flex-col items-center gap-1">
                      <span class="font-bold text-[11px] px-2 py-0.5 rounded ${this.getBadgeClass(st.espacio.grade)}">
                        ${st.espacio.grade}
                      </span>
                      <span class="text-[10px] text-slate-500">${st.espacio.completed}/${st.espacio.total} (${st.espacio.percent}%)</span>
                    </div>
                  </td>

                  <!-- Avance Total -->
                  <td class="p-3 text-center">
                    <div class="w-28 mx-auto">
                      <div class="flex justify-between text-[11px] font-bold mb-1">
                        <span class="text-slate-700">${st.totalCompleted}/23</span>
                        <span class="text-purple-700">${st.totalProgress}%</span>
                      </div>
                      <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-amber-400 to-purple-500 h-full rounded-full transition-all" style="width: ${st.totalProgress}%"></div>
                      </div>
                    </div>
                  </td>

                  <!-- Estado Semáforo -->
                  <td class="p-3 text-center">
                    ${st.status === 'completado' 
                      ? '<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold text-[11px]">✅ Al Día (100%)</span>' 
                      : st.status === 'en_proceso' 
                      ? '<span class="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full font-bold text-[11px]">⏳ En Proceso</span>' 
                      : '<span class="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full font-bold text-[11px]">⚠️ No ha iniciado</span>'}
                  </td>

                  <!-- Acciones -->
                  <td class="p-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button class="btn-view-student-report bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1" data-student-id="${st.id}" title="Ver informe CNEB individual">
                        <span>🔍</span>
                        <span>Ficha CNEB</span>
                      </button>
                      <button class="btn-delete-student text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg" data-student-id="${st.id}" title="Eliminar estudiante">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;

    // Filtros
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        this.filterStatus = btn.dataset.status;
        this.renderMonitoringTab(container, actions);
      });
    });

    // Botón ver ficha individual
    container.querySelectorAll('.btn-view-student-report').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        this.selectedStudentId = btn.dataset.studentId;
        this.switchTab('individual');
      });
    });

    // Botón eliminar estudiante
    container.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.studentId;
        const student = window.AppState.state.students.find(s => s.id === id);
        if (confirm(`¿Seguro que deseas eliminar a ${student?.name}? Se borrarán sus datos registrados.`)) {
          window.AppState.deleteStudent(id);
          window.SoundEngine.playPop();
          this.renderMonitoringTab(container, actions);
        }
      });
    });
  },

  // =========================================================================
  // PESTAÑA 2: FICHA INDIVIDUAL CNEB (INFORME DETALLADO POR ESTUDIANTE)
  // =========================================================================
  renderIndividualTab(container, actions) {
    const students = window.AppState.state.students;
    const currentStudent = students.find(s => s.id === this.selectedStudentId) || students[0];
    this.selectedStudentId = currentStudent?.id;

    const assessmentCantidad = window.AppState.getWorldOverallAssessment('cantidad', currentStudent.id);
    const assessmentEspacio = window.AppState.getWorldOverallAssessment('espacio', currentStudent.id);

    const conclusionCantidad = window.AppState.generateConclusion('cantidad', currentStudent.id);
    const conclusionEspacio = window.AppState.generateConclusion('espacio', currentStudent.id);

    const formattedConclusionCantidad = this.formatMarkdown(conclusionCantidad);
    const formattedConclusionEspacio = this.formatMarkdown(conclusionEspacio);

    const todayDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Barra de acciones
    if (actions) {
      actions.innerHTML = `
        <button id="btn-print-report" class="btn-chunky btn-blue text-xs py-1.5 px-3.5 shadow flex items-center gap-1.5" title="Imprimir o guardar en PDF">
          <span>🖨️</span>
          <span>Imprimir Reporte (PDF)</span>
        </button>
      `;

      document.getElementById('btn-print-report')?.addEventListener('click', () => {
        window.SoundEngine.playSuccess();
        window.print();
      });
    }

    container.innerHTML = `
      <div class="space-y-4">
        
        <!-- Selector Rápido del Alumno a Evaluar -->
        <div class="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div class="flex items-center gap-2">
            <span class="text-xl">👤</span>
            <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">Ver Informe de:</span>
            <select id="select-individual-student" class="font-black text-sm text-slate-900 bg-white border-2 border-purple-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-600 shadow-sm cursor-pointer">
              ${students.map(s => `
                <option value="${s.id}" ${s.id === currentStudent.id ? 'selected' : ''}>
                  ${s.avatar} ${s.name} (${s.stars} ⭐)
                </option>
              `).join('')}
            </select>
          </div>

          <div class="text-xs text-slate-500 font-medium">
            Última actividad: <strong class="text-slate-800">${currentStudent.lastActive || 'Aún no ha jugado'}</strong>
          </div>
        </div>

        <!-- ===================================================================
             DOCUMENTO DE REPORTE OFICIAL (OPTIMIZADO PARA PANTALLA E IMPRESIÓN PDF)
             =================================================================== -->
        <div id="docente-report-printable" class="space-y-6">

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
                <span class="font-black text-base text-slate-900 block mt-0.5">${currentStudent.avatar} ${currentStudent.name}</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Nivel / Aula:</span>
                <span class="font-bold text-sm text-slate-800 block mt-0.5">${window.AppState.state.activeClass}</span>
              </div>
              <div class="sm:text-right">
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Logros Acumulados:</span>
                <span class="font-black text-sm text-amber-600 block mt-0.5">⭐ ${currentStudent.stars} Estrellas</span>
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

          <!-- COMPETENCIA 1: CANTIDAD -->
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
              <div class="text-slate-800 leading-relaxed">${formattedConclusionCantidad}</div>
            </div>
          </div>

          <div class="report-page-break"></div>

          <!-- COMPETENCIA 2: FORMA, MOVIMIENTO Y LOCALIZACIÓN -->
          <div class="report-block border border-sky-300 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-sky-200 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📐</span>
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
              <div class="text-slate-800 leading-relaxed">${formattedConclusionEspacio}</div>
            </div>
          </div>

          <!-- SECCIÓN DE FIRMAS DOCENTE Y DIRECCIÓN -->
          <div class="report-block pt-8 mt-6 border-t-2 border-slate-300">
            <div class="grid grid-cols-2 gap-12 text-center text-xs">
              <div class="border-t border-slate-400 pt-2 mx-8">
                <span class="font-bold text-slate-800 block">Profesor/a de Aula</span>
                <span class="text-slate-500 text-[10px]">Educación Inicial (5 Años)</span>
              </div>
              <div class="border-t border-slate-400 pt-2 mx-8">
                <span class="font-bold text-slate-800 block">Dirección / Coordinación Pedagógica</span>
                <span class="text-slate-500 text-[10px]">I.E. Inicial • Ciclo II</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    document.getElementById('select-individual-student')?.addEventListener('change', (e) => {
      this.selectedStudentId = e.target.value;
      this.renderCurrentTab();
    });
  },

  // EXPORTACIÓN A FORMATO CSV / EXCEL
  exportCSV() {
    window.SoundEngine.playSuccess();
    const summary = window.AppState.getClassSummary();
    const students = summary.students;

    let csv = '\uFEFF'; // UTF-8 BOM para Excel
    csv += 'ID,Nombre,Avatar,Edad,Ultima Actividad,Mundo 1 Cantidad (Nota),Cantidad Resueltos,Mundo 2 Espacio (Nota),Espacio Resueltos,Total Resueltos,Avance %,Estado,Estrellas\n';

    students.forEach(s => {
      const cleanName = `"${s.name.replace(/"/g, '""')}"`;
      const cleanDate = `"${s.lastActive}"`;
      csv += `${s.id},${cleanName},${s.avatar},${s.age},${cleanDate},${s.cantidad.grade},${s.cantidad.completed}/${s.cantidad.total},${s.espacio.grade},${s.espacio.completed}/${s.espacio.total},${s.totalCompleted}/23,${s.totalProgress}%,${s.status},${s.stars}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Aula_Matematica_5Anos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
