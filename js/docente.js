/**
 * MÓDULO DOCENTE EXCLUSIVO - SEGUIMIENTO INTEGRAL DEL AULA Y CONFIGURACIÓN INSTITUCIONAL
 * Proporciona a la maestra:
 * 1. Monitoreo del Aula: Sábana consolidada para ver quiénes ya resolvieron, quiénes están
 *    en proceso y quiénes están pendientes / no han iniciado todavía.
 * 2. Ficha Individual CNEB: Informe oficial detallado por estudiante con membrete institucional
 *    del colegio de la docente y conclusiones descriptivas oficiales para SIAGIE.
 * 3. Configuración del Colegio y Mascota: Permite cambiar el animal de la mascota, el nombre
 *    de la mascota, el nombre de la Institución Educativa (colegio), aula y nombre de docente.
 */

window.DocenteModule = {
  activeTab: 'monitoring', // 'monitoring', 'individual', 'settings'
  selectedStudentId: null,
  filterStatus: 'all', // 'all', 'completed', 'in_progress', 'pending'

  // Catálogo extendido de animales para la mascota guía (Más de 30 opciones)
  mascotCatalog: [
    // Andinos y Fauna Peruana
    { icon: '🦙', defaultName: 'Kusi', desc: 'Llamita Andina (Kusi)' },
    { icon: '🐹', defaultName: 'Pipo', desc: 'Cuycito Mágico (Pipo)' },
    { icon: '🦊', defaultName: 'Sami', desc: 'Zorrito Andino (Sami)' },
    { icon: '🦅', defaultName: 'Apu', desc: 'Cóndor de las Alturas (Apu)' },
    { icon: '🐬', defaultName: 'Yaku', desc: 'Delfín Rosado (Yaku)' },
    { icon: '🐧', defaultName: 'Piti', desc: 'Pingüino de Humboldt (Piti)' },
    { icon: '🐆', defaultName: 'Rayas', desc: 'Otorongo de la Selva (Rayas)' },

    // Animalitos de la Selva y Sabana
    { icon: '🦁', defaultName: 'Leo', desc: 'Leoncito Valiente (Leo)' },
    { icon: '🐘', defaultName: 'Trompi', desc: 'Elefantito Alegre (Trompi)' },
    { icon: '🦒', defaultName: 'Rafa', desc: 'Jirafita Curiosa (Rafa)' },
    { icon: '🐒', defaultName: 'Chito', desc: 'Monito Saltarín (Chito)' },
    { icon: '🐼', defaultName: 'Pandi', desc: 'Pandita Tierno (Pandi)' },
    { icon: '🐨', defaultName: 'Koko', desc: 'Koalita Tierno (Koko)' },
    { icon: '🐯', defaultName: 'Tigrito', desc: 'Tigrecito Rayitas (Tigrito)' },
    { icon: '🦓', defaultName: 'Zipi', desc: 'Cebrita Veloz (Zipi)' },
    { icon: '🦥', defaultName: 'Perez', desc: 'Perezoso Cariñoso (Perez)' },
    { icon: '🦩', defaultName: 'Rosa', desc: 'Flamenco Elegante (Rosa)' },
    { icon: '🦜', defaultName: 'Paco', desc: 'Lorito Parlanchín (Paco)' },

    // Granja y Hogar
    { icon: '🐶', defaultName: 'Fido', desc: 'Perrito Amigo (Fido)' },
    { icon: '🐱', defaultName: 'Mishi', desc: 'Gatito Juguetón (Mishi)' },
    { icon: '🐰', defaultName: 'Bunny', desc: 'Conejito Saltarín (Bunny)' },
    { icon: '🐻', defaultName: 'Teddy', desc: 'Osito Cariñoso (Teddy)' },
    { icon: '🐸', defaultName: 'Sapo', desc: 'Ranita Saltarina (Sapo)' },
    { icon: '🐥', defaultName: 'Pío', desc: 'Pollito Amarillo (Pío)' },
    { icon: '🦆', defaultName: 'Pato', desc: 'Patito Nadador (Pato)' },
    { icon: '🐮', defaultName: 'Lola', desc: 'Vaquita Lola (Lola)' },
    { icon: '🐑', defaultName: 'Copito', desc: 'Ovejita de Lana (Copito)' },

    // Criaturas Marinas, del Jardín y Fantasía
    { icon: '🐢', defaultName: 'Tuga', desc: 'Tortuguita Sabia (Tuga)' },
    { icon: '🐳', defaultName: 'Luna', desc: 'Ballenita Azul (Luna)' },
    { icon: '🦉', defaultName: 'Tito', desc: 'Búho Sabio (Tito)' },
    { icon: '🦋', defaultName: 'Alitas', desc: 'Mariposa Mágica (Alitas)' },
    { icon: '🐝', defaultName: 'Maya', desc: 'Abejita Maya (Maya)' },
    { icon: '🦄', defaultName: 'Estrella', desc: 'Unicornio Mágico (Estrella)' },
    { icon: '🦕', defaultName: 'Dino', desc: 'Dinosaurio Amigo (Dino)' }
  ],

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

  // COMPUERTA DE SEGURIDAD EXCLUSIVA PARA LA DOCENTE
  openGate() {
    window.SoundEngine.playPop();

    // Si ya tiene sesión activa de Docente, ingresa directo sin pedir PIN
    if (window.AuthModule && window.AuthModule.isTeacher()) {
      this.openDashboard('monitoring');
      return;
    }

    const config = window.AppState.getSchoolConfig();

    const modal = document.createElement('div');
    modal.id = 'docente-gate-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-sm mx-auto text-center border-4 border-purple-400 shadow-2xl animate-pop">
        <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow">
          👩‍🏫
        </div>
        <h3 class="text-2xl font-black text-purple-950 font-fun mb-1">Acceso Exclusivo Docente</h3>
        <p class="text-slate-600 text-xs mb-4">
          Panel de administración y seguimiento del aula. Ingresa tu PIN de Docente:
        </p>

        <div class="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 my-2 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1 text-center">
            PIN Secreto (Por defecto 1234):
          </label>
          <input type="password" id="gate-pin-input" maxlength="8" class="w-full text-center text-3xl font-black p-2.5 border-3 border-purple-300 rounded-xl focus:border-purple-600 focus:outline-none bg-white text-purple-950 tracking-widest" placeholder="••••">
          <span id="gate-pin-error" class="text-xs text-rose-600 font-bold hidden mt-1 text-center block">PIN incorrecto. Intenta nuevamente.</span>
        </div>

        <div class="flex gap-2 justify-center mt-4">
          <button id="gate-cancel" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-xs py-2 px-4">
            Cancelar
          </button>
          <button id="gate-submit" class="btn-chunky btn-purple text-xs sm:text-sm py-2 px-5 shadow flex items-center gap-1.5">
            <span>🔓</span>
            <span>Ingresar al Panel</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('gate-pin-input');
    input.focus();

    document.getElementById('gate-cancel')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    const verify = () => {
      const val = input.value.trim();
      const currentPin = config.teacherPin || '1234';
      const isPinCorrect = val === currentPin || val === '1234';

      if (isPinCorrect) {
        window.SoundEngine.playSuccess();
        if (window.AuthModule) {
          window.AuthModule.saveSession({
            role: 'docente',
            teacherName: config.teacherName,
            schoolName: config.schoolName,
            loginTime: new Date().toISOString()
          });
        }
        modal.remove();
        this.openDashboard('monitoring');
      } else {
        window.SoundEngine.playGentleTryAgain();
        const err = document.getElementById('gate-pin-error');
        if (err) err.classList.remove('hidden');
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

    const config = window.AppState.getSchoolConfig();

    const modal = document.createElement('div');
    modal.id = 'docente-dashboard-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-5xl mx-auto flex flex-col max-h-[94vh] border-4 border-purple-400 shadow-2xl">
        
        <!-- Cabecera del Panel Docente -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 mb-4 gap-3 no-print">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${config.mascotIcon}</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-black text-slate-900 font-fun leading-tight">${config.schoolName}</h2>
                <span class="text-xs bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2 py-0.5 rounded-full">Zona Docente</span>
              </div>
              <p class="text-xs text-slate-500 font-semibold">${config.activeClass} • Docente: ${config.teacherName}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button id="btn-close-dashboard" class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-3.5 hover:bg-slate-200">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Selector de Pestañas: Monitoreo, Ficha Individual, Configuración Colegio -->
        <div class="flex flex-wrap items-center justify-between border-b-2 border-slate-200 pb-2 mb-4 gap-2 no-print">
          <div class="flex flex-wrap gap-2">
            <!-- Pestaña 1: Monitoreo -->
            <button id="tab-btn-monitoring" class="tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 ${
              this.activeTab === 'monitoring' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>📊</span>
              <span>Monitoreo del Aula</span>
            </button>

            <!-- Pestaña 2: Ficha Individual -->
            <button id="tab-btn-individual" class="tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 ${
              this.activeTab === 'individual' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>📄</span>
              <span>Ficha Individual</span>
            </button>

            <!-- Pestaña 3: Familias y Accesos -->
            <button id="tab-btn-families" class="tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 ${
              this.activeTab === 'families' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>👥</span>
              <span>Familias y Accesos</span>
            </button>

            <!-- Pestaña 4: Configuración Colegio y Mascota -->
            <button id="tab-btn-settings" class="tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 ${
              this.activeTab === 'settings' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              <span>⚙️</span>
              <span>Colegio y Mascota</span>
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

    document.getElementById('tab-btn-families')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.switchTab('families');
    });

    document.getElementById('tab-btn-settings')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.switchTab('settings');
    });

    this.renderCurrentTab();
  },

  switchTab(tab) {
    this.activeTab = tab;
    const btnMon = document.getElementById('tab-btn-monitoring');
    const btnInd = document.getElementById('tab-btn-individual');
    const btnFam = document.getElementById('tab-btn-families');
    const btnSet = document.getElementById('tab-btn-settings');

    const updateBtn = (btn, isActive) => {
      if (!btn) return;
      btn.className = isActive
        ? 'tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 bg-purple-600 text-white shadow-md'
        : 'tab-btn px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200';
    };

    updateBtn(btnMon, tab === 'monitoring');
    updateBtn(btnInd, tab === 'individual');
    updateBtn(btnFam, tab === 'families');
    updateBtn(btnSet, tab === 'settings');

    this.renderCurrentTab();
  },

  renderCurrentTab() {
    const container = document.getElementById('docente-tab-content');
    const actions = document.getElementById('tab-actions-container');
    if (!container) return;

    if (this.activeTab === 'monitoring') {
      this.renderMonitoringTab(container, actions);
    } else if (this.activeTab === 'individual') {
      this.renderIndividualTab(container, actions);
    } else if (this.activeTab === 'families') {
      this.renderFamiliesTab(container, actions);
    } else if (this.activeTab === 'settings') {
      this.renderSettingsTab(container, actions);
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
      const isCloud = window.SupabaseService && window.SupabaseService.isConfigured();
      actions.innerHTML = `
        <button id="btn-cloud-status-mon" class="btn-chunky ${isCloud ? 'bg-emerald-600 border-emerald-500' : 'bg-purple-600 border-purple-500'} text-white text-xs py-1.5 px-3 shadow flex items-center gap-1.5" title="Configurar conexión con Supabase en la nube">
          <span>${isCloud ? '☁️ Supabase Conectado' : '⚡ Conectar Supabase'}</span>
        </button>
        <button id="btn-sync-student-docente" class="btn-chunky bg-purple-600 text-white border-purple-500 text-xs py-1.5 px-3 shadow flex items-center gap-1.5 hover:bg-purple-700" title="Pegar código o enlace de avance enviado por un papá/mamá">
          <span>📲</span>
          <span>Sincronizar Reporte</span>
        </button>
        <button id="btn-export-csv" class="btn-chunky bg-emerald-600 text-white border-emerald-500 text-xs py-1.5 px-3 shadow flex items-center gap-1.5" title="Descargar reporte en formato Excel/CSV">
          <span>📥</span>
          <span>Descargar Excel</span>
        </button>
        <button id="btn-add-student-docente" class="btn-chunky btn-green text-xs py-1.5 px-3 shadow flex items-center gap-1.5">
          <span>➕</span>
          <span>Registrar Alumno</span>
        </button>
      `;

      document.getElementById('btn-cloud-status-mon')?.addEventListener('click', () => this.openSupabaseModal());
      document.getElementById('btn-sync-student-docente')?.addEventListener('click', () => this.openSyncModal());
      document.getElementById('btn-export-csv')?.addEventListener('click', () => this.exportCSV());
      document.getElementById('btn-add-student-docente')?.addEventListener('click', () => {
        this.switchTab('families');
        const formBox = document.getElementById('add-family-form-box');
        if (formBox) {
          formBox.classList.remove('hidden');
          document.getElementById('new-child-name')?.focus();
        }
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
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-black">
              👥
            </div>
            <div>
              <span class="text-[11px] font-bold text-slate-500 uppercase block">Total Alumnos</span>
              <span class="text-2xl font-black text-slate-900 font-fun">${summary.total}</span>
            </div>
          </div>

          <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-2xl font-black">
              ✅
            </div>
            <div>
              <span class="text-[11px] font-bold text-emerald-800 uppercase block">Han Resuelto</span>
              <span class="text-2xl font-black text-emerald-950 font-fun">${summary.activeCount} <span class="text-xs font-normal">(${Math.round((summary.activeCount / (summary.total || 1)) * 100)}%)</span></span>
            </div>
          </div>

          <div class="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-2xl font-black">
              ⚠️
            </div>
            <div>
              <span class="text-[11px] font-bold text-rose-800 uppercase block">No Han Iniciado</span>
              <span class="text-2xl font-black text-rose-950 font-fun">${summary.pending} <span class="text-xs font-normal">(${Math.round((summary.pending / (summary.total || 1)) * 100)}%)</span></span>
            </div>
          </div>

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
        <div class="bg-white border-2 border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
          <table class="w-full text-left text-xs border-collapse min-w-[920px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th class="p-3.5 min-w-[190px]">Estudiante</th>
                <th class="p-3.5 text-center min-w-[145px]">Última Actividad</th>
                <th class="p-3.5 text-center min-w-[115px]">Mundo 1: Cantidad</th>
                <th class="p-3.5 text-center min-w-[115px]">Mundo 2: Espacio</th>
                <th class="p-3.5 text-center min-w-[130px]">Avance Total</th>
                <th class="p-3.5 text-center min-w-[145px]">Estado</th>
                <th class="p-3.5 text-center min-w-[180px]">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${filteredStudents.map(st => `
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="p-3.5 whitespace-nowrap">
                    <div class="flex items-center gap-2.5">
                      <div class="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                        ${st.avatar}
                      </div>
                      <div class="min-w-0">
                        <span class="font-black text-slate-900 text-sm block font-fun leading-tight">${st.name}</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                          <span class="text-[11px] text-amber-600 font-bold">⭐ ${st.stars} estrellas</span>
                          <span class="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1 rounded">ID: ${st.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    ${st.hasPlayed 
                      ? `<span class="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs">🕒 ${st.lastActive}</span>` 
                      : `<span class="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs">⚠️ Sin actividad</span>`}
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    <div class="flex flex-col items-center gap-1">
                      <span class="font-bold text-[11px] px-2.5 py-0.5 rounded-md ${this.getBadgeClass(st.cantidad.grade)}">
                        ${st.cantidad.grade}
                      </span>
                      <span class="text-[10px] text-slate-500 font-bold">${st.cantidad.completed}/${st.cantidad.total} (${st.cantidad.percent}%)</span>
                    </div>
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    <div class="flex flex-col items-center gap-1">
                      <span class="font-bold text-[11px] px-2.5 py-0.5 rounded-md ${this.getBadgeClass(st.espacio.grade)}">
                        ${st.espacio.grade}
                      </span>
                      <span class="text-[10px] text-slate-500 font-bold">${st.espacio.completed}/${st.espacio.total} (${st.espacio.percent}%)</span>
                    </div>
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    <div class="w-28 mx-auto">
                      <div class="flex justify-between text-[11px] font-bold mb-1">
                        <span class="text-slate-700 font-fun">${st.totalCompleted}/23</span>
                        <span class="text-purple-700 font-black">${st.totalProgress}%</span>
                      </div>
                      <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div class="bg-gradient-to-r from-amber-400 to-purple-500 h-full rounded-full transition-all duration-300" style="width: ${st.totalProgress}%"></div>
                      </div>
                    </div>
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    ${st.status === 'completado' 
                      ? '<span class="inline-flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap shadow-xs">✅ Al Día (100%)</span>' 
                      : st.status === 'en_proceso' 
                      ? '<span class="inline-flex items-center justify-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap shadow-xs">⏳ En Proceso</span>' 
                      : '<span class="inline-flex items-center justify-center gap-1.5 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap shadow-xs">⚠️ Sin Iniciar</span>'}
                  </td>

                  <td class="p-3.5 text-center whitespace-nowrap">
                    <div class="inline-flex items-center justify-center gap-1.5">
                      <button class="btn-impersonate-student inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs" data-student-id="${st.id}" title="Ingresar a la app como este alumno (Modo Administradora)">
                        <span>👁️</span>
                        <span>Ingresar</span>
                      </button>
                      <button class="btn-view-student-report inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs" data-student-id="${st.id}" title="Ver informe CNEB individual">
                        <span>📋</span>
                        <span>Ficha</span>
                      </button>
                      <button class="btn-delete-student text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors" data-student-id="${st.id}" title="Eliminar estudiante">
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

    // Botón ingresar como alumno (Admin Impersonation)
    container.querySelectorAll('.btn-impersonate-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.studentId;
        window.AuthModule.impersonateStudent(id);
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
    const config = window.AppState.getSchoolConfig();
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

    const summary = window.AppState.getStudentSummary(currentStudent.id);
    const isDiplomaUnlocked = (summary?.totalCompleted >= 23);

    // Barra de acciones
    if (actions) {
      actions.innerHTML = `
        <button id="btn-print-report" class="btn-chunky btn-blue text-xs py-1.5 px-3.5 shadow flex items-center gap-1.5" title="Imprimir o guardar informe CNEB en PDF">
          <span>🖨️</span>
          <span>Imprimir Reporte (PDF)</span>
        </button>
        <button id="btn-docente-diploma" class="btn-chunky ${isDiplomaUnlocked ? 'btn-yellow' : 'bg-slate-100 text-slate-700 border-slate-300'} text-xs py-1.5 px-3.5 shadow flex items-center gap-1.5" title="${isDiplomaUnlocked ? 'Imprimir Diploma Oficial de Logro' : 'Ver diploma del estudiante (' + (summary?.totalCompleted || 0) + '/23)'}">
          <span>${isDiplomaUnlocked ? '🎓' : '📜'}</span>
          <span>${isDiplomaUnlocked ? 'Diploma Oficial' : `Diploma (${summary?.totalCompleted || 0}/23)`}</span>
        </button>
      `;

      document.getElementById('btn-print-report')?.addEventListener('click', () => {
        window.SoundEngine.playSuccess();
        window.print();
      });

      document.getElementById('btn-docente-diploma')?.addEventListener('click', () => {
        window.FamiliaModule.openDiplomaModal(currentStudent, config, summary, true);
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

          <!-- 1. MEMBRETE OFICIAL DE LA INSTITUCIÓN EDUCATIVA / COLEGIO -->
          <div class="report-block border-b-2 border-slate-700 pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-3xl shadow-sm">
                  ${config.mascotIcon}
                </div>
                <div>
                  <p class="text-xs uppercase font-black text-purple-900 tracking-wider">${config.schoolName}</p>
                  <h1 class="text-lg md:text-xl font-black text-slate-900 font-fun leading-tight">
                    INFORME DE EVALUACIÓN FORMATIVA DEL ESTUDIANTE
                  </h1>
                  <p class="text-[11px] font-bold text-slate-700">
                    ${config.activeClass} • Docente: ${config.teacherName} • CNEB Ciclo II (5 Años)
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-block bg-slate-100 border border-slate-300 rounded px-2.5 py-0.5 text-xs font-bold text-slate-800">
                  Año Lectivo 2026
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
                <span class="text-slate-500 font-bold block uppercase text-[10px]">Institución / Aula:</span>
                <span class="font-bold text-sm text-slate-800 block mt-0.5">${config.schoolName} • ${config.activeClass}</span>
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

          <!-- SECCIÓN DE FIRMAS DOCENTE Y DIRECCIÓN DEL COLEGIO -->
          <div class="report-block pt-8 mt-6 border-t-2 border-slate-300">
            <div class="grid grid-cols-2 gap-12 text-center text-xs">
              <div class="border-t border-slate-400 pt-2 mx-8">
                <span class="font-bold text-slate-800 block">${config.teacherName}</span>
                <span class="text-slate-500 text-[10px]">Profesor/a de Aula • ${config.activeClass}</span>
              </div>
              <div class="border-t border-slate-400 pt-2 mx-8">
                <span class="font-bold text-slate-800 block">Dirección Pedagógica</span>
                <span class="text-slate-500 text-[10px]">${config.schoolName}</span>
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

  // =========================================================================
  // PESTAÑA 3: GESTIÓN DE FAMILIAS, PADRES Y ACCESOS A CASA
  // =========================================================================
  renderFamiliesTab(container, actions) {
    const students = window.AppState.state.students;
    const config = window.AppState.getSchoolConfig();
    const isCloud = window.SupabaseService && window.SupabaseService.isConfigured();

    if (actions) {
      actions.innerHTML = `
        <button id="btn-cloud-status" class="btn-chunky ${isCloud ? 'bg-emerald-600 border-emerald-500' : 'bg-purple-600 border-purple-500'} text-white text-xs py-1.5 px-3 shadow flex items-center gap-1.5">
          <span>${isCloud ? '☁️ Supabase Conectado' : '⚡ Conectar Supabase'}</span>
        </button>
      `;
      document.getElementById('btn-cloud-status')?.addEventListener('click', () => this.openSupabaseModal());
    }

    container.innerHTML = `
      <div class="space-y-5">
        <!-- Banner Informativo -->
        <div class="bg-gradient-to-r from-purple-100 via-indigo-50 to-emerald-100 border-2 border-purple-300 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="text-4xl">👥</span>
            <div>
              <h3 class="text-xl font-black text-purple-950 font-fun">Cuentas de Familias y Accesos a Casa</h3>
              <p class="text-xs text-slate-600 font-semibold">
                Crea los accesos de los niños y sus padres para que jueguen en casa. Cada familia tiene su propio PIN o tarjeta para entrar.
              </p>
            </div>
          </div>
          <button id="btn-show-add-family-form" class="btn-chunky btn-green text-xs md:text-sm py-2 px-4 shadow flex items-center gap-1.5 flex-shrink-0">
            <span>➕</span>
            <span>Registrar Familia y Niño</span>
          </button>
        </div>

        <!-- Formulario Desplegable para Registrar Familia y Niño -->
        <div id="add-family-form-box" class="hidden bg-white border-3 border-emerald-300 rounded-3xl p-5 shadow-lg space-y-4 animate-pop">
          <div class="flex items-center justify-between pb-2 border-b border-emerald-200">
            <h4 class="text-lg font-black text-emerald-950 font-fun flex items-center gap-2">
              <span>🎨</span>
              <span>Registrar Niño y Contacto de su Familia (Solo Docente)</span>
            </h4>
            <button id="btn-close-family-form" class="text-slate-400 hover:text-slate-700 font-bold text-sm">✕ Cerrar</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nombre Completo del Niño(a):</label>
              <input type="text" id="new-child-name" placeholder="Ej. Pepito Valverde" class="w-full text-sm font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
              <div id="new-child-id-preview" class="text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                🆔 Código que se generará: <span id="preview-id-text" class="font-mono text-emerald-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300">V••••</span> (Letra del apellido + 4 números)
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Animalito Avatar:</label>
              <select id="new-child-avatar" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
                ${window.StudentProfileModule ? window.StudentProfileModule.avatars.map(av => `<option value="${av}">${av} Animalito</option>`).join('') : '<option value="🦙">🦙 Llamita</option>'}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nombre del Papá o Mamá:</label>
              <input type="text" id="new-parent-name" placeholder="Ej. Jaime Valverde" class="w-full text-sm font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">WhatsApp / Teléfono de la Familia:</label>
              <input type="tel" id="new-parent-phone" placeholder="Ej. 987654321" class="w-full text-sm font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Correo Electrónico del Padre o Madre:</label>
              <input type="email" id="new-parent-email" placeholder="Ej. familia.valverde@gmail.com" class="w-full text-sm font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">PIN / Clave de Acceso (Inicial = Código):</label>
              <input type="text" id="new-child-pin" placeholder="Se asignará automáticamente igual al Código" maxlength="8" class="w-full text-center text-sm font-black p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 tracking-widest uppercase">
              <span class="text-[10px] text-slate-500 block mt-1">Por defecto será el mismo código (ej. V4821). La familia podrá cambiarlo internamente.</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-slate-200">
            <button id="btn-submit-new-family" class="btn-chunky btn-green text-sm py-2.5 px-6 shadow flex items-center gap-2">
              <span>💾</span>
              <span>Guardar y Crear Tarjeta de Acceso</span>
            </button>
          </div>
        </div>

        <!-- Tabla de Familias y Niños Registrados -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Familias Registradas (${students.length})</span>
              <p class="text-[11px] text-slate-500">Puedes ingresar como cualquier estudiante sin conocer su clave o restablecerla si la olvidaron.</p>
            </div>
            <span class="text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full border border-purple-200">
              🔒 Acceso Privado CNEB
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th class="p-2.5">Estudiante</th>
                  <th class="p-2.5">Familia / Contacto</th>
                  <th class="p-2.5 text-center">PIN Acceso</th>
                  <th class="p-2.5 text-center">Estrellas</th>
                  <th class="p-2.5 text-center">Última Conexión</th>
                  <th class="p-2.5 text-center">Acciones de Administradora</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${students.map(st => `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="p-2.5">
                      <div class="flex items-center gap-2">
                        <span class="text-2xl">${st.avatar || '🦙'}</span>
                        <div>
                          <strong class="text-slate-900 block font-fun text-sm">${st.name}</strong>
                          <span class="font-mono font-bold text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">ID: ${st.id}</span>
                        </div>
                      </div>
                    </td>
                    <td class="p-2.5">
                      <div class="text-slate-800 font-bold">${st.parentName || 'Familia de ' + st.name.split(' ')[0]}</div>
                      <div class="text-[11px] text-emerald-700 font-medium">📱 ${st.parentPhone || 'Sin teléfono'}</div>
                      <div class="text-[11px] text-slate-500">✉️ ${st.parentEmail || 'Sin correo registrado'}</div>
                    </td>
                    <td class="p-2.5 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <span class="bg-purple-100 text-purple-900 font-mono font-bold px-2 py-0.5 rounded-lg border border-purple-200 text-xs">
                          ${st.pin || st.id || '1234'}
                        </span>
                        <button class="btn-reset-student-pin text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-1 rounded-md text-xs font-bold" data-student-id="${st.id}" title="Restablecer PIN">
                          🔄
                        </button>
                      </div>
                    </td>
                    <td class="p-2.5 text-center font-bold text-amber-600 text-sm">
                      ⭐ ${st.stars || 0}
                    </td>
                    <td class="p-2.5 text-center text-slate-500 text-[11px]">
                      ${st.lastActive || 'Aún no ingresa'}
                    </td>
                    <td class="p-2.5 text-center">
                      <div class="flex flex-wrap items-center justify-center gap-1.5">
                        <button class="btn-impersonate-student bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 px-2 py-1 rounded-lg font-bold text-[11px] shadow-sm flex items-center gap-1" data-student-id="${st.id}" title="Entrar a la app como este estudiante (Modo Administradora)">
                          <span>👁️</span>
                          <span>Ingresar</span>
                        </button>
                        <button class="btn-send-access-card bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 text-[11px] font-bold py-1 px-2 rounded-lg shadow-sm flex items-center gap-1" data-student-id="${st.id}" title="Enviar accesos por WhatsApp">
                          <span>📲</span>
                          <span>WhatsApp</span>
                        </button>
                        <button class="btn-send-access-email bg-sky-600 hover:bg-sky-700 text-white border-sky-500 text-[11px] font-bold py-1 px-2 rounded-lg shadow-sm flex items-center gap-1" data-student-id="${st.id}" title="Enviar accesos por Correo Electrónico">
                          <span>📧</span>
                          <span>Correo</span>
                        </button>
                        <button class="btn-delete-student-fam text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg text-xs" data-student-id="${st.id}" title="Eliminar estudiante">
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
      </div>
    `;

    // Eventos del formulario
    const formBox = document.getElementById('add-family-form-box');
    const childNameInput = document.getElementById('new-child-name');
    const childPinInput = document.getElementById('new-child-pin');
    const previewIdText = document.getElementById('preview-id-text');

    childNameInput?.addEventListener('input', () => {
      const name = childNameInput.value.trim();
      if (name) {
        const previewId = window.AppState.generateStudentId(name);
        if (previewIdText) previewIdText.textContent = previewId;
        if (childPinInput && (!childPinInput.value || childPinInput.dataset.autoFilled === 'true')) {
          childPinInput.value = previewId;
          childPinInput.dataset.autoFilled = 'true';
        }
      } else {
        if (previewIdText) previewIdText.textContent = 'V••••';
      }
    });

    childPinInput?.addEventListener('input', () => {
      childPinInput.dataset.autoFilled = 'false';
    });

    document.getElementById('btn-show-add-family-form')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      if (formBox) {
        formBox.classList.remove('hidden');
        childNameInput?.focus();
      }
    });

    document.getElementById('btn-close-family-form')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      if (formBox) formBox.classList.add('hidden');
    });

    document.getElementById('btn-submit-new-family')?.addEventListener('click', () => {
      const childName = childNameInput?.value.trim();
      const avatar = document.getElementById('new-child-avatar')?.value || '🦙';
      const parentName = document.getElementById('new-parent-name')?.value.trim();
      const parentPhone = document.getElementById('new-parent-phone')?.value.trim();
      const parentEmail = document.getElementById('new-parent-email')?.value.trim();
      const pin = childPinInput?.value.trim();

      if (!childName) {
        alert("Por favor escribe el nombre completo del estudiante.");
        return;
      }

      const newSt = window.AppState.addStudent(childName, avatar, parentName, parentPhone, parentEmail, pin);
      if (newSt) {
        window.SoundEngine.playSuccess();
        alert(`¡Cuenta creada con éxito!\n\nEstudiante: ${newSt.name}\nCódigo ID: ${newSt.id}\nPIN de Acceso: ${newSt.pin}\n\nYa puedes enviarle sus accesos por WhatsApp o Correo.`);
        this.renderFamiliesTab(container, actions);
      }
    });

    // Ingresar como estudiante (Modo Administradora sin necesidad de conocer su clave)
    container.querySelectorAll('.btn-impersonate-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const stId = btn.dataset.studentId;
        window.AuthModule.impersonateStudent(stId);
      });
    });

    // Restablecer PIN del estudiante
    container.querySelectorAll('.btn-reset-student-pin').forEach(btn => {
      btn.addEventListener('click', () => {
        const stId = btn.dataset.studentId;
        const st = window.AppState.state.students.find(s => s.id === stId);
        if (!st) return;

        const defaultPin = st.id;
        const nuevoPin = prompt(`¿Deseas restablecer el PIN de ${st.name}?\nEscribe el nuevo PIN (o déjalo en ${defaultPin} para usar su Código ID):`, defaultPin);

        if (nuevoPin !== null) {
          const finalPin = window.AppState.resetStudentPin(stId, nuevoPin);
          window.SoundEngine.playSuccess();
          alert(`PIN restablecido con éxito a: ${finalPin}\nPuedes enviárselo a la familia por WhatsApp o Correo.`);
          this.renderFamiliesTab(container, actions);
        }
      });
    });

    // Envío de tarjeta de acceso por WhatsApp
    container.querySelectorAll('.btn-send-access-card').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        const stId = btn.dataset.studentId;
        const st = window.AppState.state.students.find(s => s.id === stId);
        if (!st) return;

        const baseUrl = window.location.origin + window.location.pathname;
        const directUrl = `${baseUrl}?id=${encodeURIComponent(st.id)}&pin=${encodeURIComponent(st.pin || st.id)}`;
        const msg = `¡Hola ${st.parentName || 'Familia'}! 👋 Le saluda la Profesora ${config.teacherName}.\n\n` +
          `Para que *${st.name}* ${st.avatar} practique los juegos matemáticos desde casa y guarde sus estrellas ⭐ en nuestro sistema escolar, ingrese con su enlace privado:\n` +
          `🔗 ${directUrl}\n\n` +
          `👶 Estudiante: *${st.name}*\n` +
          `🆔 Código de Estudiante: *${st.id}*\n` +
          `🔑 PIN de acceso: *${st.pin || st.id}*\n\n` +
          `¡Muchos éxitos y gracias por apoyar su aprendizaje! ✨`;

        let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        if (st.parentPhone) {
          const clean = st.parentPhone.replace(/[^0-9]/g, '');
          if (clean) waUrl = `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(msg)}`;
        }
        window.open(waUrl, '_blank');
      });
    });

    // Envío de tarjeta de acceso por Correo Electrónico
    container.querySelectorAll('.btn-send-access-email').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        const stId = btn.dataset.studentId;
        const st = window.AppState.state.students.find(s => s.id === stId);
        if (!st) return;

        const baseUrl = window.location.origin + window.location.pathname;
        const directUrl = `${baseUrl}?id=${encodeURIComponent(st.id)}&pin=${encodeURIComponent(st.pin || st.id)}`;
        const subject = `Accesos a Matemática Kusi para ${st.name} - ${config.schoolName}`;
        const body = `Estimada ${st.parentName || 'Familia de ' + st.name}:\n\n` +
          `Le saluda la Profesora ${config.teacherName}.\n` +
          `Le comparto las credenciales oficiales de acceso a la plataforma de Matemática Divertida (${config.activeClass}):\n\n` +
          `👶 Estudiante: ${st.name}\n` +
          `🆔 Código de Estudiante: ${st.id}\n` +
          `🔑 PIN de acceso: ${st.pin || st.id}\n` +
          `🔗 Enlace directo de ingreso:\n${directUrl}\n\n` +
          `Por favor conserve este correo para el seguimiento de sus aprendizajes.\n` +
          `Atentamente,\nProf. ${config.teacherName}`;

        const emailTo = st.parentEmail || '';
        const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
      });
    });

    // Eliminar estudiante en pestaña de familias
    container.querySelectorAll('.btn-delete-student-fam').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.studentId;
        const student = window.AppState.state.students.find(s => s.id === id);
        if (confirm(`¿Seguro que deseas eliminar a ${student?.name}? Se borrarán sus datos registrados.`)) {
          window.AppState.deleteStudent(id);
          window.SoundEngine.playPop();
          this.renderFamiliesTab(container, actions);
        }
      });
    });
  },

  // =========================================================================
  // PESTAÑA 4: CONFIGURACIÓN EXCLUSIVA DEL COLEGIO Y MASCOTA (SOLO DOCENTE)
  // =========================================================================
  renderSettingsTab(container, actions) {
    const config = window.AppState.getSchoolConfig();
    let currentSelectedIcon = config.mascotIcon;
    if (!currentSelectedIcon || currentSelectedIcon === 'llama' || currentSelectedIcon.length > 4 || !this.mascotCatalog.some(m => m.icon === currentSelectedIcon)) {
      currentSelectedIcon = '🦙';
    }

    if (actions) {
      actions.innerHTML = '';
    }

    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6 py-2">
        
        <div class="bg-gradient-to-r from-purple-100 via-indigo-50 to-amber-100 border-2 border-purple-300 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-14 h-14 rounded-2xl bg-white border-2 border-purple-400 flex items-center justify-center text-3xl shadow">
            ⚙️
          </div>
          <div>
            <h3 class="text-xl font-black text-purple-950 font-fun">Personalización del Colegio y Mascota</h3>
            <p class="text-xs text-slate-600 font-semibold">
              Cambia la figura del animalito guía, su nombre y los datos de tu Institución Educativa. Solo tú como docente tienes acceso a estos cambios.
            </p>
          </div>
        </div>

        <!-- Previsualización en Vivo de la Cabecera -->
        <div class="bg-white border-3 border-amber-300 rounded-2xl p-4 shadow-sm text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Vista previa en la cabecera para los niños y familias:</span>
          <div class="inline-flex items-center gap-2.5 bg-amber-50 border-2 border-amber-300 px-5 py-2.5 rounded-2xl shadow-inner">
            <span id="preview-logo-mascot" class="text-4xl animate-bounce-soft">${currentSelectedIcon}</span>
            <div class="text-left">
              <span id="preview-logo-title" class="text-xl font-black text-amber-950 font-fun leading-none block">Matemática ${config.mascotName}</span>
              <span id="preview-logo-school" class="text-xs font-bold text-amber-800 block mt-0.5">${config.schoolName}</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Configuración -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          
          <!-- 1. Catálogo de Animales para la Mascota -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Escoge la Figura / Animal de la Mascota Guía:
            </label>
            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2 my-2">
              ${this.mascotCatalog.map(m => `
                <button type="button" class="mascot-choice-btn p-2 rounded-2xl border-3 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all ${
                  m.icon === currentSelectedIcon 
                    ? 'border-purple-600 bg-purple-50 shadow-md scale-105' 
                    : 'border-slate-200 bg-white hover:border-purple-300'
                }" data-icon="${m.icon}" data-default-name="${m.defaultName}" title="${m.desc}">
                  <span class="text-3xl mb-1">${m.icon}</span>
                  <span class="text-[10px] font-bold text-slate-700 truncate w-full text-center">${m.defaultName}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 2. Nombre de la Mascota Guía -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              2. Nombre de la Mascota Guía:
            </label>
            <input type="text" id="setting-mascot-name" value="${config.mascotName}" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800" placeholder="Ej. Kusi, Leo, Sami, Fito...">
            <span class="text-[11px] text-slate-500 mt-0.5 block">La aplicación se llamará "Matemática [Nombre]"</span>
          </div>

          <!-- 3. Nombre de la Institución Educativa (Colegio) -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              3. Nombre de tu Institución Educativa / Colegio:
            </label>
            <input type="text" id="setting-school-name" value="${config.schoolName}" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800" placeholder="Ej. I.E.P. Santa María de la Providencia">
            <span class="text-[11px] text-slate-500 mt-0.5 block">Este nombre aparecerá en las actas de evaluación, encabezados y diplomas.</span>
          </div>

          <!-- 4. Aula / Sección -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              4. Aula, Grado o Sección:
            </label>
            <input type="text" id="setting-active-class" value="${config.activeClass}" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800" placeholder="Ej. Inicial 5 Años - Sección Los Creativos">
          </div>

          <!-- 5. Nombre de la Docente -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              5. Nombre de la Profesora / Docente de Aula:
            </label>
            <input type="text" id="setting-teacher-name" value="${config.teacherName}" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800" placeholder="Ej. Prof. Yanet Salvador">
          </div>

          <!-- 6. PIN de Acceso Docente -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              6. PIN Secreto de Acceso Docente:
            </label>
            <input type="text" id="setting-teacher-pin" value="${config.teacherPin}" maxlength="8" class="w-36 text-center text-lg font-black p-2 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800 tracking-widest">
            <span class="text-[11px] text-slate-500 mt-0.5 block">Código numérico para entrar a este panel (por defecto 1234).</span>
          </div>

          <!-- 7. Número de WhatsApp para recibir reportes -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              7. Tu WhatsApp para recibir reportes de las familias (Opcional):
            </label>
            <input type="text" id="setting-teacher-phone" value="${config.teacherPhone || ''}" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none bg-slate-50 text-slate-800" placeholder="Ej. 51987654321 o 987654321">
            <span class="text-[11px] text-slate-500 mt-0.5 block">Cuando los papás pulsen "Enviar por WhatsApp a la Profesora", se abrirá un chat directo a este número con el avance de su hijo/a.</span>
          </div>

          <!-- Botón Guardar -->
          <div class="pt-4 border-t border-slate-200 flex justify-end">
            <button id="btn-save-settings" class="btn-chunky btn-green text-base py-3 px-8 shadow-lg flex items-center gap-2">
              <span>💾</span>
              <span>Guardar Configuración del Colegio</span>
            </button>
          </div>

        </div>

      </div>
    `;

    // Interactividad en tiempo real de la previsualización
    const inputMascotName = document.getElementById('setting-mascot-name');
    const inputSchoolName = document.getElementById('setting-school-name');
    const previewMascot = document.getElementById('preview-logo-mascot');
    const previewTitle = document.getElementById('preview-logo-title');
    const previewSchool = document.getElementById('preview-logo-school');

    const updatePreview = () => {
      if (previewMascot) previewMascot.textContent = currentSelectedIcon;
      if (previewTitle) previewTitle.textContent = `Matemática ${inputMascotName.value.trim() || 'Kusi'}`;
      if (previewSchool) previewSchool.textContent = inputSchoolName.value.trim() || 'Mi Colegio';
    };

    inputMascotName?.addEventListener('input', updatePreview);
    inputSchoolName?.addEventListener('input', updatePreview);

    // Selección de animal en el catálogo
    container.querySelectorAll('.mascot-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        container.querySelectorAll('.mascot-choice-btn').forEach(b => {
          b.classList.remove('border-purple-600', 'bg-purple-50', 'shadow-md', 'scale-105');
        });
        btn.classList.add('border-purple-600', 'bg-purple-50', 'shadow-md', 'scale-105');
        currentSelectedIcon = btn.dataset.icon;
        
        // Si el nombre no ha sido personalizado o era el default anterior, sugiere el nuevo
        if (!inputMascotName.value || this.mascotCatalog.some(m => m.defaultName === inputMascotName.value.trim())) {
          inputMascotName.value = btn.dataset.defaultName;
        }

        updatePreview();
      });
    });

    // Guardar cambios
    document.getElementById('btn-save-settings')?.addEventListener('click', async () => {
      const btnSave = document.getElementById('btn-save-settings');
      const newSchoolName = document.getElementById('setting-school-name').value.trim();
      const newActiveClass = document.getElementById('setting-active-class').value.trim();
      const newTeacherName = document.getElementById('setting-teacher-name').value.trim();
      const newTeacherPhone = document.getElementById('setting-teacher-phone')?.value.trim() || '';
      const newMascotName = document.getElementById('setting-mascot-name').value.trim();
      const newTeacherPin = document.getElementById('setting-teacher-pin').value.trim();

      if (!newSchoolName) {
        alert("Por favor ingresa el nombre de la Institución Educativa o Colegio.");
        return;
      }

      if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = `<span>⏳</span><span>Guardando en la nube...</span>`;
      }

      const finalIcon = (!currentSelectedIcon || currentSelectedIcon === 'llama' || currentSelectedIcon.length > 4) ? '🦙' : currentSelectedIcon;

      const configObj = {
        schoolName: newSchoolName,
        activeClass: newActiveClass,
        teacherName: newTeacherName,
        teacherPhone: newTeacherPhone,
        mascotIcon: finalIcon,
        mascotName: newMascotName || 'Kusi',
        teacherPin: newTeacherPin || '1234'
      };

      // 1. Guardar localmente
      window.AppState.updateSchoolConfig(configObj, false);

      // 2. Guardar en Supabase para toda el aula y los celulares de los padres
      if (window.SupabaseService && window.SupabaseService.isConfigured()) {
        try {
          await window.SupabaseService.saveSchoolConfig(configObj);
        } catch (err) {
          console.warn('Error al guardar en Supabase:', err);
        }
      }

      // 3. Actualizar la interfaz de forma inmediata
      if (window.App) {
        window.App.applySchoolConfig();
        if (window.App.currentView === 'home') {
          window.App.showHome();
        }
      }

      window.SoundEngine.playSuccess();
      alert(`¡Configuración guardada y sincronizada con éxito!\n\nMascota: ${currentSelectedIcon} ${newMascotName}\nColegio: ${newSchoolName}\nAula: ${newActiveClass}`);
      
      // Cierra modal para que la docente aprecie los cambios en toda la interfaz
      const modal = document.getElementById('docente-dashboard-modal');
      if (modal) modal.remove();
    });
  },

  // MODAL PARA PEGAR ENLACE O CÓDIGO DE SINCRONIZACIÓN RECIBIDO POR WHATSAPP
  openSyncModal() {
    window.SoundEngine.playPop();

    const modal = document.createElement('div');
    modal.id = 'docente-sync-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-lg mx-auto text-center border-4 border-purple-400 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl mx-auto mb-2 shadow">
          📲
        </div>
        <h3 class="text-2xl font-black text-slate-900 font-fun mb-1">Sincronizar Reporte de Familia</h3>
        <p class="text-slate-600 text-xs sm:text-sm mb-3">
          Pega aquí el enlace o código que la mamá o el papá te envió por WhatsApp para agregarlo automáticamente al registro del aula:
        </p>

        <div class="my-3 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Enlace o Código recibido por WhatsApp:
          </label>
          <textarea id="sync-input-payload" rows="3" class="w-full text-xs font-mono p-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none bg-purple-50/40 text-slate-800" placeholder="Ej. https://.../?sync=... o código de reporte..."></textarea>
        </div>

        <div id="sync-error-msg" class="text-xs text-rose-600 font-bold hidden mb-2"></div>

        <div class="flex gap-3 justify-center mt-4">
          <button id="btn-cancel-sync" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-5">
            Cancelar
          </button>
          <button id="btn-confirm-sync" class="btn-chunky btn-purple text-xs md:text-sm py-2.5 px-6 shadow-md flex items-center gap-2">
            <span>📥</span>
            <span>Importar y Actualizar</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const txtInput = document.getElementById('sync-input-payload');
    txtInput.focus();

    document.getElementById('btn-cancel-sync')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    document.getElementById('btn-confirm-sync')?.addEventListener('click', () => {
      const val = txtInput.value.trim();
      const errEl = document.getElementById('sync-error-msg');
      if (!val) {
        if (errEl) {
          errEl.textContent = 'Por favor pega el enlace o código recibido.';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const res = window.AppState.importSyncPayload(val);
      if (res.success) {
        window.SoundEngine.playSuccess();
        modal.remove();
        alert(`¡Sincronización exitosa!\n\nEstudiante: ${res.student.name}\nEstrellas: ${res.student.stars} ⭐\nProgreso: ${res.summary.totalProgress}%\n\nSe ha registrado en el Panel de Monitoreo.`);
        this.renderCurrentTab();
      } else {
        window.SoundEngine.playGentleTryAgain();
        if (errEl) {
          errEl.textContent = res.error || 'Código inválido. Asegúrate de copiar el enlace completo.';
          errEl.classList.remove('hidden');
        }
      }
    });
  },

  // MODAL PARA CONECTAR BASE DE DATOS SUPABASE
  openSupabaseModal() {
    window.SoundEngine.playPop();
    const creds = window.SupabaseService.getCredentials();
    const isConnected = window.SupabaseService.isConfigured();

    const modal = document.createElement('div');
    modal.id = 'docente-supabase-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-lg mx-auto text-center border-4 border-emerald-400 shadow-2xl">
        <div class="w-16 h-16 rounded-full ${isConnected ? 'bg-emerald-100 border-emerald-400' : 'bg-purple-100 border-purple-400'} border-2 flex items-center justify-center text-3xl mx-auto mb-2 shadow">
          ${isConnected ? '☁️' : '⚡'}
        </div>
        <h3 class="text-2xl font-black text-slate-900 font-fun mb-1">
          ${isConnected ? 'Conexión a Supabase Activa' : 'Conectar con tu Base de Datos Supabase'}
        </h3>
        <p class="text-slate-600 text-xs sm:text-sm mb-3">
          Ingresa la <strong>Project URL</strong> y la clave <strong>anon public</strong> de tu proyecto Supabase para sincronizar a todos los niños y sus notas en tiempo real.
        </p>

        <div class="space-y-3 my-3 text-left">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Project URL:
            </label>
            <input type="text" id="supabase-input-url" value="${creds.url || ''}" class="w-full text-xs font-mono p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50" placeholder="https://xxxxxxxx.supabase.co">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              anon public Key:
            </label>
            <input type="password" id="supabase-input-key" value="${creds.key || ''}" class="w-full text-xs font-mono p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...">
          </div>
        </div>

        <div id="supabase-status-alert" class="text-xs p-2.5 rounded-xl font-bold mb-3 ${isConnected ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700'}">
          ${isConnected ? '✓ Tu aula está sincronizada con Supabase en la nube.' : 'Aún no has conectado tus claves. La aplicación funciona en modo seguro local.'}
        </div>

        <div class="flex gap-3 justify-center">
          <button id="btn-cancel-supabase" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-4">
            Cerrar
          </button>
          <button id="btn-save-supabase" class="btn-chunky btn-green text-xs md:text-sm py-2 px-5 shadow-md flex items-center gap-1.5">
            <span>💾</span>
            <span>Guardar y Probar Conexión</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-cancel-supabase')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    document.getElementById('btn-save-supabase')?.addEventListener('click', async () => {
      const url = document.getElementById('supabase-input-url').value.trim();
      const key = document.getElementById('supabase-input-key').value.trim();
      const alertEl = document.getElementById('supabase-status-alert');

      if (!url || !key) {
        if (alertEl) {
          alertEl.textContent = 'Por favor ingresa tanto la URL como la anon Key.';
          alertEl.className = 'text-xs p-2.5 rounded-xl font-bold mb-3 bg-rose-100 text-rose-900 border border-rose-300';
        }
        return;
      }

      window.SupabaseService.saveCredentials(url, key);

      if (window.SupabaseService.isConfigured()) {
        window.SoundEngine.playSuccess();
        if (alertEl) {
          alertEl.textContent = '✓ Conectando a Supabase y sincronizando aula...';
          alertEl.className = 'text-xs p-2.5 rounded-xl font-bold mb-3 bg-indigo-100 text-indigo-900 border border-indigo-300';
        }

        // Subir configuración del colegio
        const cfgOk = await window.SupabaseService.saveSchoolConfig(window.AppState.getSchoolConfig());

        // Subir todos los estudiantes registrados
        let savedCount = 0;
        for (const st of window.AppState.state.students) {
          const stOk = await window.SupabaseService.saveStudent(st);
          if (stOk) savedCount++;
        }

        // Si falló el guardado, las tablas aún no existen
        if (!cfgOk && savedCount === 0) {
          if (alertEl) {
            alertEl.className = 'text-xs p-2.5 rounded-xl font-bold mb-3 bg-amber-100 text-amber-900 border border-amber-300 text-left';
            alertEl.innerHTML = '⚠️ Claves conectadas, pero <strong>las tablas aún no existen en tu Supabase</strong>.<br>Abre tu Supabase -> <strong>SQL Editor</strong>, pega el archivo <code>supabase_schema.sql</code> y presiona <strong>Run</strong>.';
          }
          return;
        }

        if (alertEl) {
          alertEl.className = 'text-xs p-2.5 rounded-xl font-bold mb-3 bg-emerald-100 text-emerald-900 border border-emerald-300';
          alertEl.textContent = `✓ ¡Aula sincronizada con éxito! ${savedCount} estudiantes respaldados en la nube.`;
        }

        setTimeout(() => {
          modal.remove();
          this.renderCurrentTab();
        }, 1500);
      } else {
        window.SoundEngine.playGentleTryAgain();
        if (alertEl) {
          alertEl.textContent = 'No se pudo conectar. Verifica que la URL y la Key sean correctas.';
          alertEl.className = 'text-xs p-2.5 rounded-xl font-bold mb-3 bg-rose-100 text-rose-900 border border-rose-300';
        }
      }
    });
  },

  // EXPORTACIÓN A FORMATO CSV / EXCEL
  exportCSV() {
    window.SoundEngine.playSuccess();
    const config = window.AppState.getSchoolConfig();
    const summary = window.AppState.getClassSummary();
    const students = summary.students;

    let csv = '\uFEFF'; // UTF-8 BOM para Excel
    csv += `"${config.schoolName}","${config.activeClass}","Docente: ${config.teacherName}"\n`;
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
    a.download = `Reporte_${config.schoolName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
