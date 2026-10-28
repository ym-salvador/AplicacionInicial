/**
 * VISTAS DE ADMINISTRACIÓN Y DOCENCIA
 * Todas las pantallas del panel (Directora y Docentes) con un flujo claro:
 *   1. Aulas y Año Lectivo  → crear año, aulas por edad, promover estudiantes.
 *   2. Docentes y Usuarios   → crear usuarios docentes y asignarles aulas.
 *   3. Matrícula             → registrar, mover, retirar y editar estudiantes.
 *   4. Planificar Sesiones   → habilitar competencias, sesiones y capacidades por aula + asignación individual.
 *   5. Evaluación & SIAGIE   → ficha por estudiante con escala AD/A/B/C.
 *   6. Mundos y Retos        → modo comprobación para el personal.
 *   7. Mi Perfil / Configuración.
 *
 * Lo que ve cada docente está acotado a SUS aulas del año activo (ver SchoolManagement.getVisibleStudents).
 */

window.AdminViews = {
  selectedClassroomId: null,
  selectedStudentId: null,
  selectedCompetencyId: 'cantidad',
  studentStatusFilter: 'activo',

  // === CONTEXTO DEL PERFIL ACTIVO ===
  ctx() {
    const SM = window.SchoolManagement;
    const session = window.AuthModule ? window.AuthModule.currentSession : null;
    const role = session ? session.role : null;
    const isAdmin = role === 'admin';
    const isTeacher = role === 'docente';
    const year = SM.getActiveYear();
    const classrooms = isTeacher ? SM.getClassroomsForTeacher(session.teacherId, year) : SM.getClassrooms(year);
    const students = SM.getVisibleStudents(session);
    return { session, role, isAdmin, isTeacher, teacherId: session?.teacherId, year, classrooms, students };
  },

  esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },

  renderView(viewName) {
    const container = document.getElementById('app-main-content');
    if (!container) return;
    if (!window.AuthModule?.currentSession) { window.AuthModule?.openRoleSelectorModal('admin'); return; }
    if (window.SidebarModule && !window.SidebarModule.canAccess(viewName)) viewName = window.AuthModule.isFamily() ? 'games' : 'dashboard';

    const map = {
      dashboard: this.renderDashboard, classrooms: this.renderClassrooms, teachers: this.renderTeachers,
      students: this.renderStudents, curriculum: this.renderCurriculum, capacities: this.renderCapacitiesPlanner,
      evaluations: this.renderEvaluations, progress: this.renderProgress, games: this.renderGames, settings: this.renderSettings, profile: this.renderProfile
    };
    (map[viewName] || this.renderDashboard).call(this, container);
  },

  // =========================================================================
  // UTILIDADES DE INTERFAZ
  // =========================================================================
  openModal(html, maxWidth = 'max-w-lg') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-content p-6 ${maxWidth} mx-auto text-left border-4 border-amber-400 shadow-2xl animate-pop max-h-[92vh] overflow-y-auto">${html}</div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => modal.remove()));
    return modal;
  },

  confirmDialog(title, message, onYes, danger = true) {
    const modal = this.openModal(`
      <h3 class="text-xl font-black ${danger ? 'text-rose-900' : 'text-amber-950'} font-fun mb-2">${title}</h3>
      <p class="text-sm text-slate-700 font-semibold mb-4">${message}</p>
      <div class="flex gap-2">
        <button class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
        <button id="confirm-yes" class="btn-chunky ${danger ? 'btn-coral' : 'btn-green'} text-xs py-2 px-4 flex-1">Sí, continuar</button>
      </div>`, 'max-w-md');
    modal.querySelector('#confirm-yes').addEventListener('click', () => { modal.remove(); onYes(); });
  },

  showToast(msg, type = 'ok') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-[60] text-white font-fun font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl border-2 animate-pop ${type === 'error' ? 'bg-rose-700 border-rose-300' : 'bg-slate-900 border-amber-400'}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  pageHeader(icon, title, subtitle, actionsHtml = '') {
    return `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-slate-800 font-fun flex items-center gap-2"><span>${icon}</span><span>${title}</span></h1>
          <p class="text-xs md:text-sm text-slate-600 font-bold mt-0.5">${subtitle}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">${actionsHtml}</div>
      </div>`;
  },

  emptyState(icon, title, text, actionHtml = '') {
    return `
      <div class="bg-white rounded-3xl border-3 border-dashed border-slate-300 p-10 text-center">
        <div class="text-5xl mb-2">${icon}</div>
        <h3 class="text-lg font-black text-slate-700 font-fun">${title}</h3>
        <p class="text-xs text-slate-500 font-bold mt-1 max-w-md mx-auto">${text}</p>
        ${actionHtml ? `<div class="mt-4">${actionHtml}</div>` : ''}
      </div>`;
  },

  input(id, label, value = '', opts = {}) {
    return `
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">${label}</label>
        <input type="${opts.type || 'text'}" id="${id}" value="${this.esc(value)}" placeholder="${this.esc(opts.placeholder || '')}" ${opts.required ? 'required' : ''} ${opts.readonly ? 'readonly' : ''} ${opts.maxlength ? `maxlength="${opts.maxlength}"` : ''}
          class="w-full px-3 py-2 border-2 ${opts.readonly ? 'bg-slate-100 border-slate-200 text-slate-600' : 'border-amber-200'} rounded-xl font-bold text-sm outline-none focus:border-amber-400 ${opts.mono ? 'font-mono' : ''}">
      </div>`;
  },

  avatarPicker(id, current, list) {
    return `
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Avatar</label>
        <div id="${id}" class="flex flex-wrap gap-1.5">
          ${list.map(a => `<button type="button" data-avatar="${a}" class="avatar-opt w-10 h-10 rounded-xl border-2 text-xl flex items-center justify-center ${a === current ? 'border-amber-500 bg-amber-100' : 'border-slate-200 bg-white hover:border-amber-300'}">${a}</button>`).join('')}
        </div>
        <input type="hidden" id="${id}-value" value="${current}">
      </div>`;
  },

  bindAvatarPicker(root, id) {
    root.querySelectorAll(`#${id} .avatar-opt`).forEach(b => b.addEventListener('click', () => {
      root.querySelectorAll(`#${id} .avatar-opt`).forEach(x => x.className = x.className.replace('border-amber-500 bg-amber-100', 'border-slate-200 bg-white hover:border-amber-300'));
      b.className = b.className.replace('border-slate-200 bg-white hover:border-amber-300', 'border-amber-500 bg-amber-100');
      root.querySelector(`#${id}-value`).value = b.dataset.avatar;
    }));
  },

  studentAvatars: ['🦙', '🦁', '🐰', '🐻', '🦊', '🐼', '🐬', '🐶', '🐱', '🐸', '🐥', '🦋', '🐢', '🦄', '🐧', '🐨'],
  staffAvatars: ['🏛️', '👩‍🏫', '👨‍🏫', '👩‍💼', '👨‍💼', '🧑‍🏫', '👩‍🎓', '🌟', '🍎', '📚'],

  // =========================================================================
  // 1. PANEL PRINCIPAL (DIRECTORA Y DOCENTE)
  // =========================================================================
  renderDashboard(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const config = window.AppState.getSchoolConfig();

    if (c.isTeacher) return this.renderTeacherDashboard(container, c);

    const teachers = SM.getTeachers();
    const unassigned = c.classrooms.filter(x => !x.teacherId).length;
    const noClassroom = c.students.filter(s => !SM.getClassroom(s.classroomId)).length;
    const totalStars = c.students.reduce((a, s) => a + (s.stars || 0), 0);
    const avgProgress = c.students.length ? Math.round(c.students.reduce((a, s) => a + (window.AppState.getStudentSummary(s.id)?.totalProgress || 0), 0) / c.students.length) : 0;

    const steps = [
      { done: c.classrooms.length > 0, label: 'Crear las aulas del año (3, 4 y 5 años)', view: 'classrooms' },
      { done: teachers.length > 0 && unassigned === 0 && c.classrooms.length > 0, label: 'Registrar docentes y asignarles sus aulas', view: 'teachers' },
      { done: c.students.length > 0 && noClassroom === 0, label: 'Matricular a los estudiantes en su aula', view: 'students' },
      { done: c.students.length > 0, label: 'Planificar qué sesiones y capacidades están activas', view: 'capacities' },
      { done: c.students.some(s => (s.stars || 0) > 0), label: 'Entregar accesos (ID y PIN) y empezar a jugar', view: 'students' }
    ];

    const ageCards = [3, 4, 5].map(age => {
      const th = SM.ageTheme(age);
      const aulas = c.classrooms.filter(x => x.age === age);
      const kids = c.students.filter(s => parseInt(s.age, 10) === age);
      return `
        <div class="bg-gradient-to-br ${th.gradient} border-4 ${th.border} p-5 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl p-2 rounded-2xl bg-white shadow-sm border-2 ${th.border}">${th.icon}</span>
              <span class="text-xs font-black px-2.5 py-1 rounded-full ${th.solid} uppercase tracking-wider">${th.label} • ${th.cycle}</span>
            </div>
            <h3 class="text-xl font-black ${th.text} font-fun">${th.alias}</h3>
            <p class="text-[11px] ${th.text} mt-1 opacity-80">${window.CNEB_CURRICULUM.edades[String(age)]?.enfoque || ''}</p>
          </div>
          <div class="mt-4 pt-3 border-t ${th.border} border-opacity-40 flex items-center justify-between text-xs font-bold ${th.text}">
            <span>${aulas.length} aula(s) • <strong>${kids.length}</strong> estudiantes</span>
            <button class="${th.solid} px-3 py-1 rounded-full text-xs font-bold shadow" onclick="window.AdminViews.goToAge(${age})">Ver</button>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 p-6 rounded-3xl border-4 border-amber-300 shadow-lg">
          <div class="flex items-center gap-4">
            <span class="text-5xl animate-bounce-soft">${config.mascotIcon}</span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-purple-700 text-white shadow-sm">Panel de Dirección</span>
                <span class="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">Año Escolar ${c.year}</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-black text-amber-950 font-fun leading-tight mt-1">${this.esc(config.schoolName)}</h1>
              <p class="text-xs md:text-sm text-amber-900 font-bold mt-0.5">Hola, ${this.esc(SM.getAdmin().name)} • ${this.esc(SM.getAdmin().title || 'Directora')}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.SidebarModule.navigateTo('students')">➕ Matricular</button>
            <button class="btn-chunky bg-purple-600 text-white border-purple-400 hover:bg-purple-700 text-xs py-2 px-4 shadow" onclick="window.SidebarModule.navigateTo('capacities')">🎯 Planificar Sesiones</button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          ${[
            ['🏫', c.classrooms.length, 'Aulas', 'border-sky-300'],
            ['👩‍🏫', teachers.length, 'Docentes', 'border-amber-300'],
            ['🎒', c.students.length, 'Matriculados', 'border-emerald-300'],
            ['📈', avgProgress + '%', 'Avance promedio', 'border-indigo-300'],
            ['⭐', totalStars, 'Estrellas del año', 'border-purple-300']
          ].map(([i, v, l, b]) => `
            <div class="bg-white p-3 rounded-2xl border-3 ${b} shadow-md text-center">
              <span class="text-2xl block">${i}</span>
              <span class="text-2xl font-black text-slate-800 font-fun">${v}</span>
              <span class="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">${l}</span>
            </div>`).join('')}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-2">
            <h2 class="text-lg font-black text-slate-800 font-fun mb-3 flex items-center gap-2"><span>🎨</span>Aulas por edad (CNEB Ciclo II)</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${ageCards}</div>
          </div>
          <div>
            <h2 class="text-lg font-black text-slate-800 font-fun mb-3 flex items-center gap-2"><span>🧭</span>Ruta de configuración</h2>
            <div class="bg-white rounded-3xl border-3 border-slate-200 p-4 shadow space-y-2">
              ${steps.map((s, i) => `
                <button class="w-full text-left flex items-start gap-2 p-2 rounded-xl hover:bg-amber-50 transition-colors" onclick="window.SidebarModule.navigateTo('${s.view}')">
                  <span class="text-lg leading-none">${s.done ? '✅' : '⬜'}</span>
                  <span class="text-xs font-bold ${s.done ? 'text-slate-400 line-through' : 'text-slate-800'}">${i + 1}. ${s.label}</span>
                </button>`).join('')}
              ${unassigned > 0 ? `<div class="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-bold">⚠️ ${unassigned} aula(s) sin docente asignado.</div>` : ''}
              ${noClassroom > 0 ? `<div class="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-bold">⚠️ ${noClassroom} estudiante(s) sin aula. Asígnalos desde Matrícula.</div>` : ''}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${[
            ['📚', 'Malla Curricular', 'Áreas, competencias y capacidades CNEB', 'curriculum', 'hover:border-amber-400'],
            ['📋', 'Monitoreo y Fichas', 'Sábana del aula, ranking y fichas SIAGIE', 'monitoring', 'hover:border-emerald-400'],
            ['🎮', 'Modo Comprobación', 'Probar los retos sin alterar notas', 'games', 'hover:border-purple-400']
          ].map(([i, t, d, v, h]) => `
            <div class="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow ${h} transition-colors cursor-pointer flex items-center gap-4" onclick="window.SidebarModule.navigateTo('${v}')">
              <span class="text-4xl p-3 rounded-2xl bg-slate-50">${i}</span>
              <div><h4 class="font-black text-slate-800 font-fun text-base">${t}</h4><p class="text-xs text-slate-500 font-bold mt-0.5">${d}</p></div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  goToAge(age) {
    const c = this.ctx();
    const aula = c.classrooms.find(x => x.age === age);
    this.selectedClassroomId = aula ? aula.id : null;
    window.SidebarModule.navigateTo('students');
  },

  renderTeacherDashboard(container, c) {
    const SM = window.SchoolManagement;
    const teacher = SM.getTeacher(c.teacherId);
    const config = window.AppState.getSchoolConfig();

    const classCards = c.classrooms.map(cl => {
      const th = SM.ageTheme(cl.age);
      const kids = SM.getStudentsByClassroom(cl.id);
      const started = kids.filter(k => (k.stars || 0) > 0).length;
      const avg = kids.length ? Math.round(kids.reduce((a, k) => a + (window.AppState.getStudentSummary(k.id)?.totalProgress || 0), 0) / kids.length) : 0;
      const plan = SM.getClassroomPlan(cl.id);
      const planTxt = window.CNEB_DATA.getMundosList().map(m => {
        const on = m.sesiones.filter(s => plan[m.id]?.enabled && plan[m.id].sessions[s.id]).map(s => s.numero);
        return `${m.icono} ${on.length ? 'Sesiones ' + on.join(', ') : 'pausado'}`;
      }).join(' • ') + ` • 📚 ${SM.getActiveCompetencies(cl.id).filter(x => !SM.hasGames(x.id)).length} competencias de otras áreas activas`;
      return `
        <div class="bg-white rounded-3xl border-4 ${th.border} p-5 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">${cl.icon || th.icon}</span>
            <span class="text-xs font-black px-3 py-1 rounded-full ${th.badge}">${th.label} • Sección ${cl.section}</span>
          </div>
          <h3 class="text-xl font-black text-slate-800 font-fun">${this.esc(cl.name)}</h3>
          <div class="grid grid-cols-3 gap-2 mt-3 text-center">
            <div class="bg-slate-50 rounded-xl p-2"><span class="text-lg font-black text-slate-800 font-fun block">${kids.length}</span><span class="text-[10px] text-slate-500 font-bold">Alumnos</span></div>
            <div class="bg-slate-50 rounded-xl p-2"><span class="text-lg font-black text-slate-800 font-fun block">${started}</span><span class="text-[10px] text-slate-500 font-bold">Ya jugaron</span></div>
            <div class="bg-slate-50 rounded-xl p-2"><span class="text-lg font-black text-slate-800 font-fun block">${avg}%</span><span class="text-[10px] text-slate-500 font-bold">Avance</span></div>
          </div>
          <p class="text-[11px] text-slate-600 font-bold mt-3 bg-amber-50 border border-amber-200 rounded-xl p-2">Plan actual: ${planTxt}</p>
          <div class="mt-3 flex gap-2">
            <button class="btn-chunky bg-purple-600 text-white border-purple-400 text-xs py-1.5 px-3 flex-1" onclick="window.AdminViews.selectedClassroomId='${cl.id}'; window.SidebarModule.navigateTo('capacities')">🎯 Planificar</button>
            <button class="btn-chunky btn-yellow text-xs py-1.5 px-3 flex-1" onclick="window.AdminViews.selectedClassroomId='${cl.id}'; window.SidebarModule.navigateTo('students')">🎒 Alumnos</button>
            <button class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-xs py-1.5 px-3 flex-1" onclick="window.AdminViews.selectedClassroomId='${cl.id}'; window.SidebarModule.navigateTo('evaluations')">📊 Evaluar</button>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 p-6 rounded-3xl border-4 border-amber-300 shadow-lg">
          <div class="flex items-center gap-4">
            <span class="text-5xl">${teacher?.avatar || '👩‍🏫'}</span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-600 text-white shadow-sm">Panel Docente</span>
                <span class="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">Año ${c.year}</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-black text-amber-950 font-fun leading-tight mt-1">${this.esc(teacher?.name || '')}</h1>
              <p class="text-xs md:text-sm text-amber-900 font-bold mt-0.5">${this.esc(config.schoolName)} • ${this.esc(teacher?.title || 'Docente de Aula')}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.SidebarModule.navigateTo('students')">➕ Matricular</button>
            <button class="btn-chunky bg-purple-600 text-white border-purple-400 text-xs py-2 px-4 shadow" onclick="window.SidebarModule.navigateTo('monitoring')">📋 Monitoreo</button>
          </div>
        </div>
        ${c.classrooms.length === 0 ? this.emptyState('🏫', 'Aún no tienes un aula asignada', 'Pide a la Dirección que te asigne un aula en "Docentes y Usuarios". Mientras tanto puedes explorar la Malla Curricular y comprobar los retos.') : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${classCards}</div>`}
      </div>`;
  },

  // =========================================================================
  // 2. AULAS Y AÑO LECTIVO
  // =========================================================================
  renderClassrooms(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const years = SM.getYears();

    const cards = c.classrooms.map(cl => {
      const th = SM.ageTheme(cl.age);
      const count = SM.getStudentsByClassroom(cl.id).length;
      const teacher = SM.getTeacher(cl.teacherId);
      return `
        <div class="bg-white rounded-3xl border-4 ${th.border} p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">${cl.icon || th.icon}</span>
              <span class="text-xs font-black px-3 py-1 rounded-full ${th.badge}">${th.label} (${cl.cycle})</span>
            </div>
            <h3 class="text-xl font-black text-slate-800 font-fun leading-tight">${this.esc(cl.name)}</h3>
            <p class="text-xs text-slate-500 font-bold mt-1">Sección "${this.esc(cl.section)}" • Turno ${this.esc(cl.shift)}</p>
            <div class="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div class="flex items-center gap-2 text-slate-700 font-bold"><span>👩‍🏫</span><strong class="${teacher ? 'text-slate-900' : 'text-rose-700'}">${teacher ? this.esc(teacher.name) : 'Sin docente asignado'}</strong></div>
              <div class="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200">
                <span>Matriculados: <strong>${count} / ${cl.capacity}</strong></span>
                <span class="text-emerald-700 font-bold">${cl.capacity ? Math.round((count / cl.capacity) * 100) : 0}%</span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button class="btn-chunky btn-yellow text-xs py-1.5 px-2" onclick="window.AdminViews.selectedClassroomId='${cl.id}'; window.SidebarModule.navigateTo('students')">🎒 Alumnos</button>
            <button class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-1.5 px-2" onclick="window.AdminViews.selectedClassroomId='${cl.id}'; window.SidebarModule.navigateTo('capacities')">🎯 Plan</button>
            ${c.isAdmin ? `
              <button class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs py-1.5 px-2" onclick="window.AdminViews.editClassroomModal('${cl.id}')">✏️ Editar</button>
              <button class="btn-chunky bg-rose-50 text-rose-800 border-rose-200 text-xs py-1.5 px-2" onclick="window.AdminViews.deleteClassroom('${cl.id}')">🗑️ Eliminar</button>` : ''}
          </div>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('🏫', c.isAdmin ? 'Aulas y Año Lectivo' : 'Mis Aulas', `Aulas por edad (3, 4 y 5 años) • Año escolar <strong class="text-amber-700">${c.year}</strong>`,
          c.isAdmin ? `<button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.AdminViews.openClassroomModal()">➕ Crear Aula</button>` : '')}

        ${c.isAdmin ? `
          <div class="bg-white rounded-3xl border-3 border-indigo-200 p-5 shadow-sm mb-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-indigo-950 font-fun flex items-center gap-2"><span>📅</span>Gestión del Año Lectivo</h2>
                <p class="text-[11px] text-slate-600 font-bold">Años disponibles: ${years.map(y => `<span class="px-1.5 py-0.5 rounded ${y === c.year ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}">${y}</span>`).join(' ')}. Cambia el año activo desde el menú lateral.</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="btn-chunky bg-indigo-600 text-white border-indigo-400 text-xs py-2 px-4" onclick="window.AdminViews.openYearModal()">➕ Nuevo Año</button>
                <button class="btn-chunky bg-emerald-600 text-white border-emerald-400 text-xs py-2 px-4" onclick="window.AdminViews.openPromoteModal()">🎓 Promover Estudiantes</button>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 font-semibold">
              <div class="p-2 rounded-xl bg-indigo-50 border border-indigo-100">1️⃣ <strong>Nuevo Año:</strong> crea el siguiente año y, si quieres, copia la estructura de aulas actual.</div>
              <div class="p-2 rounded-xl bg-indigo-50 border border-indigo-100">2️⃣ <strong>Promover:</strong> los de 3 pasan a 4, los de 4 a 5 y los de 5 egresan. Su recorrido de retos empieza de nuevo.</div>
              <div class="p-2 rounded-xl bg-indigo-50 border border-indigo-100">3️⃣ <strong>Matricular:</strong> inscribe a los nuevos de 3 años en el aula que corresponda.</div>
            </div>
          </div>` : ''}

        ${c.classrooms.length === 0 ? this.emptyState('🏫', 'No hay aulas en ' + c.year, c.isAdmin ? 'Crea la primera aula o copia la estructura de otro año desde "Nuevo Año".' : 'La Dirección aún no te asignó un aula para este año.',
          c.isAdmin ? `<button class="btn-chunky btn-yellow text-xs py-2 px-4" onclick="window.AdminViews.openClassroomModal()">➕ Crear Aula</button>` : '') :
          `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>`}
      </div>`;
  },

  openClassroomModal(classroom = null) {
    const SM = window.SchoolManagement;
    const year = SM.getActiveYear();
    const teachers = SM.getTeachers();
    const modal = this.openModal(`
      <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
        <h3 class="text-xl font-black text-amber-950 font-fun">${classroom ? '✏️ Editar Aula' : '🏫 Crear Nueva Aula'}</h3>
        <button class="text-2xl text-slate-400 hover:text-slate-700 close-modal font-bold">&times;</button>
      </div>
      <form id="form-classroom" class="space-y-3">
        ${this.input('cr-name', 'Nombre del aula', classroom?.name || '', { placeholder: 'Ej. Aula Los Conejitos', required: true })}
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Edad de los niños</label>
            <select id="cr-age" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
              ${[3, 4, 5].map(a => { const th = SM.ageTheme(a); return `<option value="${a}" ${(classroom ? classroom.age === a : a === 5) ? 'selected' : ''}>${th.icon} ${th.label} • ${th.alias}</option>`; }).join('')}
            </select>
          </div>
          ${this.input('cr-section', 'Sección', classroom?.section || 'A', { placeholder: 'A, B, C…', maxlength: 3 })}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Docente tutor(a)</label>
            <select id="cr-teacher" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
              <option value="">-- Sin asignar --</option>
              ${teachers.map(t => `<option value="${t.id}" ${classroom?.teacherId === t.id ? 'selected' : ''}>${this.esc(t.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Turno</label>
            <select id="cr-shift" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
              ${['Mañana', 'Tarde'].map(s => `<option ${classroom?.shift === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${this.input('cr-capacity', 'Capacidad', classroom?.capacity || 25, { type: 'number' })}
          ${this.input('cr-icon', 'Ícono (emoji)', classroom?.icon || '', { placeholder: 'Auto' })}
          ${this.input('cr-year', 'Año lectivo', classroom?.year || year, { readonly: true })}
        </div>
        <div class="pt-3 flex gap-2">
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky btn-green text-xs py-2 px-4 flex-1">Guardar Aula</button>
        </div>
      </form>`);

    modal.querySelector('#form-classroom').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: modal.querySelector('#cr-name').value, age: modal.querySelector('#cr-age').value, section: modal.querySelector('#cr-section').value,
        teacherId: modal.querySelector('#cr-teacher').value, shift: modal.querySelector('#cr-shift').value,
        capacity: modal.querySelector('#cr-capacity').value, icon: modal.querySelector('#cr-icon').value.trim()
      };
      if (classroom) SM.updateClassroom(classroom.id, data); else SM.addClassroom(data);
      window.SoundEngine?.playSuccess();
      modal.remove();
      this.showToast(classroom ? 'Aula actualizada' : 'Aula creada');
      this.renderClassrooms(document.getElementById('app-main-content'));
    });
  },

  editClassroomModal(id) {
    const cl = window.SchoolManagement.getClassroom(id);
    if (cl) this.openClassroomModal(cl);
  },

  deleteClassroom(id) {
    const cl = window.SchoolManagement.getClassroom(id);
    if (!cl) return;
    this.confirmDialog('Eliminar aula', `¿Eliminar "${this.esc(cl.name)}"? Solo es posible si no tiene estudiantes.`, () => {
      const r = window.SchoolManagement.deleteClassroom(id);
      if (!r.success) { this.showToast(r.message, 'error'); return; }
      this.showToast('Aula eliminada');
      this.renderClassrooms(document.getElementById('app-main-content'));
    });
  },

  openYearModal() {
    const SM = window.SchoolManagement;
    const years = SM.getYears();
    const suggested = String(Math.max(...years.map(Number)) + 1);
    const modal = this.openModal(`
      <h3 class="text-xl font-black text-indigo-950 font-fun mb-1">📅 Abrir Nuevo Año Lectivo</h3>
      <p class="text-xs text-slate-600 font-semibold mb-4">Se creará el año y podrás copiar la estructura de aulas (sin estudiantes).</p>
      <form id="form-year" class="space-y-3">
        ${this.input('yr-value', 'Año', suggested, { placeholder: '2027', maxlength: 4, required: true })}
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Copiar aulas desde</label>
          <select id="yr-clone" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
            <option value="">No copiar (empezar vacío)</option>
            ${years.map(y => `<option value="${y}" ${y === SM.getActiveYear() ? 'selected' : ''}>${y} (${SM.getClassrooms(y).length} aulas)</option>`).join('')}
          </select>
        </div>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><input type="checkbox" id="yr-activate" checked> Activar este año al terminar</label>
        <div class="pt-2 flex gap-2">
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky bg-indigo-600 text-white border-indigo-400 text-xs py-2 px-4 flex-1">Crear Año</button>
        </div>
      </form>`);
    modal.querySelector('#form-year').addEventListener('submit', (e) => {
      e.preventDefault();
      const r = SM.addYear(modal.querySelector('#yr-value').value, { cloneFromYear: modal.querySelector('#yr-clone').value || null });
      if (!r.success) { this.showToast(r.message, 'error'); return; }
      modal.remove();
      window.SoundEngine?.playSuccess();
      this.showToast(`Año ${r.year} creado${r.cloned ? ` con ${r.cloned} aulas copiadas` : ''}`);
      if (modal.querySelector('#yr-activate').checked) SM.setActiveYear(r.year);
      else this.renderClassrooms(document.getElementById('app-main-content'));
    });
  },

  openPromoteModal() {
    const SM = window.SchoolManagement;
    const years = SM.getYears();
    const from = SM.getActiveYear();
    const next = years.find(y => Number(y) > Number(from)) || '';
    const activeKids = SM.getStudentsByYear(from).length;
    const modal = this.openModal(`
      <h3 class="text-xl font-black text-emerald-950 font-fun mb-1">🎓 Promover Estudiantes</h3>
      <p class="text-xs text-slate-600 font-semibold mb-3">Los <strong>${activeKids}</strong> estudiantes activos de <strong>${from}</strong> pasarán a la siguiente edad en el año destino: 3→4, 4→5 y los de 5 años egresan. Su historial se conserva y comienzan un nuevo recorrido de retos.</p>
      <form id="form-promote" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Año destino</label>
          <select id="pr-to" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
            ${years.filter(y => y !== from).map(y => `<option value="${y}" ${y === next ? 'selected' : ''}>${y} (${SM.getClassrooms(y).length} aulas)</option>`).join('')}
          </select>
          ${years.filter(y => y !== from).length === 0 ? '<p class="text-[11px] text-rose-700 font-bold mt-1">Primero crea un nuevo año.</p>' : ''}
        </div>
        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-bold">Si el año destino no tiene un aula para alguna edad, el estudiante quedará "sin aula" y podrás ubicarlo desde Matrícula.</div>
        <div class="pt-2 flex gap-2">
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky btn-green text-xs py-2 px-4 flex-1" ${years.filter(y => y !== from).length === 0 ? 'disabled' : ''}>Promover</button>
        </div>
      </form>`);
    modal.querySelector('#form-promote').addEventListener('submit', (e) => {
      e.preventDefault();
      const to = modal.querySelector('#pr-to').value;
      modal.remove();
      this.confirmDialog('Confirmar promoción', `Esta acción mueve a todos los estudiantes activos de ${from} al año ${to}. ¿Continuar?`, () => {
        const r = SM.promoteStudents(from, to);
        if (!r.success) { this.showToast(r.message, 'error'); return; }
        window.SoundEngine?.playSuccess();
        this.showToast(`Promovidos: ${r.promoted} • Egresados: ${r.graduated} • Sin aula: ${r.pendingClassroom}`);
      }, false);
    });
  },

  // =========================================================================
  // 3. DOCENTES Y USUARIOS (SOLO DIRECCIÓN)
  // =========================================================================
  renderTeachers(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const teachers = SM.getTeachers();

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('👩‍🏫', 'Docentes y Usuarios', 'Cada docente tiene su usuario y PIN. Asígnale sus aulas del año ' + c.year + '.',
          `<button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.AdminViews.openTeacherModal()">➕ Registrar Docente</button>`)}
        ${teachers.length === 0 ? this.emptyState('👩‍🏫', 'Aún no hay docentes', 'Registra a tus docentes para que puedan ingresar con su propio usuario y PIN.') : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${teachers.map(t => {
            const aulas = SM.getClassroomsForTeacher(t.id, c.year);
            return `
              <div class="bg-white rounded-3xl border-3 border-amber-300 p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner">${t.avatar || '👩‍🏫'}</div>
                    <div class="min-w-0"><h3 class="text-lg font-black text-slate-800 font-fun truncate">${this.esc(t.name)}</h3><p class="text-xs text-amber-800 font-bold">${this.esc(t.title || 'Docente de Aula')}</p></div>
                  </div>
                  <div class="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-1 mb-3">
                    <div>👤 Usuario: <strong class="font-mono text-slate-800">${this.esc(t.username)}</strong></div>
                    <div>🔑 PIN: <strong class="font-mono text-purple-900 bg-purple-100 px-1.5 rounded">${this.esc(t.pin)}</strong></div>
                    ${t.phone ? `<div>📱 ${this.esc(t.phone)}</div>` : ''}${t.email ? `<div>✉️ ${this.esc(t.email)}</div>` : ''}
                  </div>
                  <span class="font-bold text-slate-700 text-xs block mb-1">Aulas a cargo (${c.year}):</span>
                  <div class="flex flex-wrap gap-1">${aulas.length ? aulas.map(a => `<span class="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold ${SM.ageTheme(a.age).badge}">${this.esc(a.name)}</span>`).join('') : '<span class="text-xs text-rose-600 italic font-bold">Sin aula asignada</span>'}</div>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs py-1.5 px-2" onclick="window.AdminViews.editTeacherModal('${t.id}')">✏️ Editar</button>
                  <button class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-1.5 px-2" onclick="window.AuthModule.impersonateTeacher('${t.id}')">👁️ Ver como</button>
                  <button class="btn-chunky bg-rose-50 text-rose-800 border-rose-200 text-xs py-1.5 px-2" onclick="window.AdminViews.deleteTeacher('${t.id}')">🗑️</button>
                </div>
              </div>`;
          }).join('')}
        </div>`}
      </div>`;
  },

  openTeacherModal(teacher = null) {
    const SM = window.SchoolManagement;
    const year = SM.getActiveYear();
    const classrooms = SM.getClassrooms(year);
    const mine = teacher ? SM.getClassroomsForTeacher(teacher.id, year).map(x => x.id) : [];
    const modal = this.openModal(`
      <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
        <h3 class="text-xl font-black text-amber-950 font-fun">${teacher ? '✏️ Editar Docente' : '👩‍🏫 Registrar Docente'}</h3>
        <button class="text-2xl text-slate-400 hover:text-slate-700 close-modal font-bold">&times;</button>
      </div>
      <form id="form-teacher" class="space-y-3">
        ${this.input('tch-name', 'Nombre completo', teacher?.name || '', { placeholder: 'Prof. Carmen Delgadillo', required: true })}
        <div class="grid grid-cols-2 gap-3">
          ${this.input('tch-username', 'Usuario de ingreso (apellido.inicial)', teacher?.username || '', { placeholder: 'delgadillo.c', required: true, mono: true })}
          ${this.input('tch-pin', 'PIN de acceso', teacher?.pin || '1234', { placeholder: '4 a 8 dígitos', required: true, mono: true, maxlength: 12 })}
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${this.input('tch-title', 'Cargo', teacher?.title || 'Docente de Aula')}
          ${this.input('tch-phone', 'Celular WhatsApp', teacher?.phone || '', { type: 'tel', placeholder: '987654321' })}
        </div>
        ${this.input('tch-email', 'Correo', teacher?.email || '', { type: 'email', placeholder: 'docente@colegio.edu.pe' })}
        ${this.avatarPicker('tch-avatar', teacher?.avatar || '👩‍🏫', this.staffAvatars)}
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Aulas a cargo en ${year}</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            ${classrooms.length === 0 ? '<span class="text-xs text-slate-400 italic">No hay aulas en este año.</span>' : classrooms.map(cl => {
              const th = SM.ageTheme(cl.age);
              const other = cl.teacherId && cl.teacherId !== teacher?.id ? SM.getTeacher(cl.teacherId) : null;
              return `<label class="flex items-center gap-2 p-2 rounded-xl border-2 ${mine.includes(cl.id) ? 'border-amber-400 bg-amber-50' : 'border-slate-200'} text-xs font-bold cursor-pointer">
                <input type="checkbox" class="tch-class" value="${cl.id}" ${mine.includes(cl.id) ? 'checked' : ''}>
                <span>${cl.icon || th.icon} ${this.esc(cl.name)}</span>
                ${other ? `<span class="text-[9px] text-rose-700 ml-auto">(de ${this.esc(other.name.split(' ').slice(-1)[0])})</span>` : ''}
              </label>`;
            }).join('')}
          </div>
        </div>
        <div class="pt-3 flex gap-2">
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky btn-green text-xs py-2 px-4 flex-1">Guardar</button>
        </div>
      </form>`);
    this.bindAvatarPicker(modal, 'tch-avatar');
    // Sugerir usuario apellido.inicial mientras se escribe el nombre (si el usuario no se editó a mano)
    const userInput = modal.querySelector('#tch-username');
    let userTouched = !!teacher;
    userInput.addEventListener('input', () => { userTouched = true; });
    modal.querySelector('#tch-name').addEventListener('input', (e) => {
      if (userTouched) return;
      const sp = window.AppState.splitName(e.target.value);
      userInput.value = (sp.firstName && sp.lastName) ? window.AppState.buildUsername(sp.firstName, sp.lastName, teacher?.id || null) : '';
    });
    modal.querySelector('#form-teacher').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: modal.querySelector('#tch-name').value, username: modal.querySelector('#tch-username').value, pin: modal.querySelector('#tch-pin').value,
        title: modal.querySelector('#tch-title').value, phone: modal.querySelector('#tch-phone').value, email: modal.querySelector('#tch-email').value,
        avatar: modal.querySelector('#tch-avatar-value').value,
        assignedClassrooms: Array.from(modal.querySelectorAll('.tch-class:checked')).map(x => x.value)
      };
      const r = teacher ? SM.updateTeacher(teacher.id, data) : SM.addTeacher(data);
      if (r && r.error) { this.showToast(r.error, 'error'); return; }
      window.SoundEngine?.playSuccess();
      modal.remove();
      this.showToast(teacher ? 'Docente actualizado' : `Docente creado. Usuario: ${data.username} • PIN: ${data.pin}`);
      this.renderTeachers(document.getElementById('app-main-content'));
    });
  },

  editTeacherModal(id) {
    const t = window.SchoolManagement.getTeacher(id);
    if (t) this.openTeacherModal(t);
  },

  deleteTeacher(id) {
    const t = window.SchoolManagement.getTeacher(id);
    if (!t) return;
    this.confirmDialog('Eliminar docente', `¿Eliminar a ${this.esc(t.name)}? Sus aulas quedarán sin docente (los estudiantes no se borran).`, () => {
      window.SchoolManagement.deleteTeacher(id);
      this.showToast('Docente eliminado');
      this.renderTeachers(document.getElementById('app-main-content'));
    });
  },

  // =========================================================================
  // 4. MATRÍCULA Y ESTUDIANTES
  // =========================================================================
  renderStudents(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const all = (window.AppState.state.students || []);
    const scopedIds = new Set(c.classrooms.map(x => x.id));

    // Universo visible: admin = año activo (según estado), docente = sus aulas
    let universe;
    if (c.isAdmin) {
      universe = all.filter(s => this.studentStatusFilter === 'egresado' ? s.status === 'egresado' : (String(s.year) === c.year && (this.studentStatusFilter === 'retirado' ? s.status === 'retirado' : s.status === 'activo')));
    } else {
      universe = all.filter(s => scopedIds.has(s.classroomId) && s.status === 'activo');
    }
    if (this.selectedClassroomId && !c.classrooms.some(x => x.id === this.selectedClassroomId) && this.selectedClassroomId !== '__none__') this.selectedClassroomId = null;
    const noClassroomCount = universe.filter(s => !SM.getClassroom(s.classroomId)).length;

    const applyFilters = (q = '') => {
      let list = universe;
      if (this.selectedClassroomId === '__none__') list = list.filter(s => !SM.getClassroom(s.classroomId));
      else if (this.selectedClassroomId) list = list.filter(s => s.classroomId === this.selectedClassroomId);
      if (q) list = list.filter(s => s.name.toLowerCase().includes(q) || (s.id || '').toLowerCase().includes(q));
      return list;
    };

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('🎒', c.isAdmin ? `Matrícula de Estudiantes (${c.year})` : 'Mis Estudiantes', 'Registra, ubica en su aula y entrega accesos (usuario apellido.inicial y PIN) a cada estudiante.',
          `<button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.AdminViews.openEnrollModal()">➕ Matricular Estudiante</button>`)}

        <div class="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-sm mb-6 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-slate-600">Aula:</span>
            <button class="px-3 py-1 rounded-xl text-xs font-black ${!this.selectedClassroomId ? 'bg-amber-400 text-amber-950 shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="window.AdminViews.filterClassroom(null)">Todas (${universe.length})</button>
            ${c.classrooms.map(cl => {
              const th = SM.ageTheme(cl.age);
              const n = universe.filter(s => s.classroomId === cl.id).length;
              return `<button class="px-3 py-1 rounded-xl text-xs font-black transition-all ${this.selectedClassroomId === cl.id ? th.solid + ' shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="window.AdminViews.filterClassroom('${cl.id}')">${cl.icon || th.icon} ${this.esc(cl.name)} (${n})</button>`;
            }).join('')}
            ${noClassroomCount > 0 ? `<button class="px-3 py-1 rounded-xl text-xs font-black ${this.selectedClassroomId === '__none__' ? 'bg-rose-600 text-white shadow' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}" onclick="window.AdminViews.filterClassroom('__none__')">⚠️ Sin aula (${noClassroomCount})</button>` : ''}
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            ${c.isAdmin ? `
              <div class="flex items-center gap-1 text-xs">
                <span class="font-bold text-slate-600 mr-1">Estado:</span>
                ${[['activo', 'Activos'], ['retirado', 'Retirados'], ['egresado', 'Egresados']].map(([k, l]) => `<button class="px-2.5 py-1 rounded-lg font-bold ${this.studentStatusFilter === k ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}" onclick="window.AdminViews.studentStatusFilter='${k}'; window.AdminViews.selectedClassroomId=null; window.AdminViews.renderStudents(document.getElementById('app-main-content'))">${l}</button>`).join('')}
              </div>` : '<span></span>'}
            <input type="text" id="search-student-input" placeholder="🔍 Buscar por nombre o ID…" class="w-full sm:w-64 px-3 py-1.5 border-2 border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-amber-400">
          </div>
        </div>

        <div id="students-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${this.generateStudentCards(applyFilters(), c)}</div>
      </div>`;

    container.querySelector('#search-student-input')?.addEventListener('input', (e) => {
      container.querySelector('#students-grid').innerHTML = this.generateStudentCards(applyFilters(e.target.value.toLowerCase().trim()), c);
    });
  },

  filterClassroom(id) {
    this.selectedClassroomId = id;
    this.renderStudents(document.getElementById('app-main-content'));
  },

  generateStudentCards(students, c) {
    const SM = window.SchoolManagement;
    if (students.length === 0) return `<div class="col-span-full">${this.emptyState('🎒', 'No hay estudiantes aquí', 'Usa "Matricular Estudiante" para registrar al primero o cambia el filtro de aula.')}</div>`;

    return students.map(s => {
      const cl = SM.getClassroom(s.classroomId);
      const th = SM.ageTheme(s.age || 5);
      const summary = window.AppState.getStudentSummary(s.id);
      const inactive = s.status !== 'activo';
      const comps = ['cantidad', 'espacio'].map(w => {
        const m = window.CNEB_DATA.mundos[w];
        const on = (s.assignedCompetencies || []).includes(w);
        return `<button class="px-2 py-0.5 rounded-lg text-[10px] font-black border ${on ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200 line-through'}" title="${on ? 'Asignada: toca para pausar' : 'Pausada: toca para asignar'}" onclick="window.AdminViews.toggleStudentComp('${s.id}','${w}','students')">${m.icono} ${w === 'cantidad' ? 'Cantidad' : 'Espacio'}</button>`;
      }).join(' ');

      return `
        <div class="bg-white rounded-3xl border-3 ${inactive ? 'border-slate-200 opacity-75' : cl ? th.border : 'border-rose-300'} p-4 shadow flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">${s.avatar || '🦙'}</span>
              <div class="flex items-center gap-1">
                ${inactive ? `<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">${s.status}</span>` : ''}
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${th.badge}">${th.label}</span>
              </div>
            </div>
            <h4 class="font-black text-slate-800 font-fun text-base leading-tight">${this.esc(s.name)}</h4>
            <div class="flex items-center gap-1.5 mt-1 flex-wrap">
              <span class="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 rounded border border-amber-300">👤 ${s.id}</span>
              <span class="text-[11px] font-mono text-purple-900 bg-purple-100 px-1.5 rounded">🔑 ${this.esc(s.pin || '—')}</span>
            </div>
            <div class="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div>🏫 <strong class="${cl ? 'text-slate-800' : 'text-rose-700'}">${cl ? this.esc(cl.name) : 'Sin aula asignada'}</strong></div>
              <div class="flex items-center justify-between"><span>⭐ ${s.stars || 0} estrellas</span><span>📈 ${summary?.totalProgress || 0}% (${summary?.totalCompleted || 0}/${summary?.totalGames || 0})</span></div>
              ${s.parentName ? `<div>👨‍👩‍👧 ${this.esc(s.parentName)}${s.parentPhone ? ' • ' + this.esc(s.parentPhone) : ''}</div>` : ''}
              <div class="flex items-center gap-1 pt-1 border-t border-slate-200"><span class="text-slate-500">Mundos:</span>${comps}</div>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-100 grid grid-cols-4 gap-1">
            <button class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-[11px] py-1 px-1" title="Evaluar" onclick="window.AdminViews.evaluateStudentDirectly('${s.id}')">📝</button>
            <button class="btn-chunky bg-sky-100 text-sky-900 border-sky-300 text-[11px] py-1 px-1" title="Entrar como alumno" onclick="window.AuthModule.impersonateStudent('${s.id}')">🎮</button>
            <button class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-[11px] py-1 px-1" title="Editar datos y PIN" onclick="window.AdminViews.openEditStudentModal('${s.id}')">✏️</button>
            <button class="btn-chunky bg-amber-100 text-amber-900 border-amber-300 text-[11px] py-1 px-1" title="Cambiar de aula" onclick="window.AdminViews.openTransferModal('${s.id}')">🔁</button>
          </div>
        </div>`;
    }).join('');
  },

  openEnrollModal() {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    if (c.classrooms.length === 0) { this.showToast('Primero crea un aula para este año.', 'error'); return; }
    const preselected = c.classrooms.some(x => x.id === this.selectedClassroomId) ? this.selectedClassroomId : c.classrooms[0].id;

    const modal = this.openModal(`
      <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
        <h3 class="text-xl font-black text-amber-950 font-fun">🎒 Matrícula ${c.year}</h3>
        <button class="text-2xl text-slate-400 hover:text-slate-700 close-modal font-bold">&times;</button>
      </div>
      <form id="form-enroll" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          ${this.input('st-first', 'Nombres', '', { placeholder: 'Ej. Valentina', required: true })}
          ${this.input('st-last', 'Apellidos (paterno y materno)', '', { placeholder: 'Ej. Gómez Ruiz', required: true })}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Aula (define la edad)</label>
            <select id="st-classroom" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
              ${c.classrooms.map(cl => `<option value="${cl.id}" ${preselected === cl.id ? 'selected' : ''}>${cl.icon || ''} ${this.esc(cl.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Usuario (apellido.inicial) y PIN</label>
            <div class="px-3 py-2 bg-slate-100 border-2 border-slate-200 rounded-xl font-mono font-black text-sm text-slate-700 flex items-center justify-between gap-2"><span id="st-id-preview">—</span><span id="st-pin-preview" class="text-purple-900 bg-purple-100 px-1.5 rounded">PIN —</span></div>
          </div>
        </div>
        ${this.avatarPicker('st-avatar', '🦙', this.studentAvatars)}
        <div class="grid grid-cols-2 gap-3">
          ${this.input('st-parent', 'Apoderado(a)', '', { placeholder: 'Ej. Elena Gómez' })}
          ${this.input('st-phone', 'Celular WhatsApp', '', { type: 'tel', placeholder: '987654321' })}
        </div>
        ${this.input('st-email', 'Correo de la familia (opcional)', '', { type: 'email' })}
        <div class="pt-3 flex gap-2">
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky btn-green text-xs py-2 px-4 flex-1">Completar Matrícula</button>
        </div>
      </form>`);
    this.bindAvatarPicker(modal, 'st-avatar');
    let previewId = '';
    const previewPin = window.AppState.generatePin();
    modal.querySelector('#st-pin-preview').textContent = `PIN ${previewPin}`;
    const updatePreview = () => {
      const fn = modal.querySelector('#st-first').value.trim();
      const ln = modal.querySelector('#st-last').value.trim();
      previewId = (fn && ln) ? window.AppState.buildUsername(fn, ln) : '';
      modal.querySelector('#st-id-preview').textContent = previewId || '—';
    };
    modal.querySelector('#st-first').addEventListener('input', updatePreview);
    modal.querySelector('#st-last').addEventListener('input', updatePreview);
    modal.querySelector('#form-enroll').addEventListener('submit', (e) => {
      e.preventDefault();
      const classroomId = modal.querySelector('#st-classroom').value;
      const firstName = modal.querySelector('#st-first').value.trim();
      const lastName = modal.querySelector('#st-last').value.trim();
      if (!firstName || !lastName) { this.showToast('Escribe los nombres y los apellidos del estudiante.', 'error'); return; }
      const st = window.AppState.addStudent(
        `${firstName} ${lastName}`, modal.querySelector('#st-avatar-value').value,
        modal.querySelector('#st-parent').value, modal.querySelector('#st-phone').value, modal.querySelector('#st-email').value,
        previewPin, previewId || null, { classroomId, firstName, lastName }
      );
      if (!st) { this.showToast('No se pudo registrar al estudiante.', 'error'); return; }
      window.SoundEngine?.playSuccess();
      modal.remove();
      this.selectedClassroomId = classroomId;
      this.showToast(`${st.name} matriculado(a). Usuario: ${st.id} • PIN: ${st.pin}`);
      this.renderStudents(document.getElementById('app-main-content'));
    });
  },

  openEditStudentModal(studentId) {
    const s = window.AppState.state.students.find(x => x.id === studentId);
    if (!s) return;
    const c = this.ctx();
    const modal = this.openModal(`
      <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
        <h3 class="text-xl font-black text-amber-950 font-fun">✏️ ${this.esc(s.name)} <span class="text-xs font-mono bg-amber-100 px-2 py-0.5 rounded">${s.id}</span></h3>
        <button class="text-2xl text-slate-400 hover:text-slate-700 close-modal font-bold">&times;</button>
      </div>
      <form id="form-edit-student" class="space-y-3">
        ${this.input('es-name', 'Nombre completo', s.name, { required: true })}
        ${this.avatarPicker('es-avatar', s.avatar || '🦙', this.studentAvatars)}
        <div class="grid grid-cols-2 gap-3">
          ${this.input('es-parent', 'Apoderado(a)', s.parentName || '')}
          ${this.input('es-phone', 'Celular WhatsApp', s.parentPhone || '', { type: 'tel' })}
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${this.input('es-email', 'Correo familia', s.parentEmail || '', { type: 'email' })}
          ${this.input('es-username', 'Usuario de ingreso', s.id, { mono: true, readonly: true })}
        </div>
        <div class="flex items-end gap-2">
          <div class="flex-1">${this.input('es-pin', 'PIN de acceso (la familia lo escribe al ingresar)', s.pin || '', { mono: true, maxlength: 12, required: true })}</div>
          <button type="button" id="es-newpin" class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-2 px-3 mb-0.5" title="Generar un PIN nuevo de 4 dígitos">🎲 Nuevo PIN</button>
        </div>
        ${c.isAdmin ? `
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Estado de matrícula</label>
            <select id="es-status" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs">
              ${[['activo', '✅ Activo'], ['retirado', '⏸️ Retirado (no puede ingresar)'], ['egresado', '🎓 Egresado']].map(([k, l]) => `<option value="${k}" ${s.status === k ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>` : ''}
        <div class="pt-3 flex flex-wrap gap-2">
          <button type="button" class="btn-chunky bg-rose-50 text-rose-800 border-rose-200 text-xs py-2 px-3" id="es-reset">🔄 Reiniciar progreso</button>
          ${c.isAdmin ? `<button type="button" class="btn-chunky bg-rose-600 text-white border-rose-400 text-xs py-2 px-3" id="es-delete">🗑️ Eliminar</button>` : ''}
          <span class="flex-1"></span>
          <button type="button" class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 close-modal">Cancelar</button>
          <button type="submit" class="btn-chunky btn-green text-xs py-2 px-4">Guardar</button>
        </div>
      </form>`);
    this.bindAvatarPicker(modal, 'es-avatar');
    modal.querySelector('#es-newpin').addEventListener('click', () => { modal.querySelector('#es-pin').value = window.AppState.generatePin(); window.SoundEngine?.playPop(); });
    modal.querySelector('#form-edit-student').addEventListener('submit', (e) => {
      e.preventDefault();
      const pinVal = modal.querySelector('#es-pin').value.trim();
      if (pinVal.length < 4 || pinVal.toLowerCase() === s.id.toLowerCase()) { this.showToast('El PIN debe tener al menos 4 caracteres y ser distinto del usuario.', 'error'); return; }
      window.AppState.updateStudent(s.id, {
        name: modal.querySelector('#es-name').value, avatar: modal.querySelector('#es-avatar-value').value,
        parentName: modal.querySelector('#es-parent').value, parentPhone: modal.querySelector('#es-phone').value,
        parentEmail: modal.querySelector('#es-email').value, pin: pinVal
      });
      const st = modal.querySelector('#es-status');
      if (st) window.SchoolManagement.setStudentStatus(s.id, st.value);
      window.SoundEngine?.playSuccess();
      modal.remove();
      this.showToast('Datos guardados');
      this.renderStudents(document.getElementById('app-main-content'));
    });
    modal.querySelector('#es-reset')?.addEventListener('click', () => {
      modal.remove();
      this.confirmDialog('Reiniciar progreso', `Se borrarán las estrellas y calificaciones de ${this.esc(s.name)}. ¿Continuar?`, () => {
        window.AppState.resetStudentProgress(s.id);
        this.showToast('Progreso reiniciado');
        this.renderStudents(document.getElementById('app-main-content'));
      });
    });
    modal.querySelector('#es-delete')?.addEventListener('click', () => {
      modal.remove();
      this.confirmDialog('Eliminar estudiante', `¿Eliminar definitivamente a ${this.esc(s.name)}? Si solo dejó el colegio, mejor márcalo como "Retirado".`, () => {
        if (window.AppState.deleteStudent(s.id)) this.showToast('Estudiante eliminado');
        this.renderStudents(document.getElementById('app-main-content'));
      });
    });
  },

  openTransferModal(studentId) {
    const s = window.AppState.state.students.find(x => x.id === studentId);
    if (!s) return;
    const SM = window.SchoolManagement;
    const c = this.ctx();
    const options = c.isAdmin ? SM.getClassrooms() : c.classrooms;
    const modal = this.openModal(`
      <h3 class="text-xl font-black text-amber-950 font-fun mb-1">🔁 Cambiar de aula</h3>
      <p class="text-xs text-slate-600 font-semibold mb-3">${this.esc(s.name)} está en <strong>${this.esc(SM.getClassroom(s.classroomId)?.name || 'sin aula')}</strong>. El estudiante toma la edad y el año del aula destino.</p>
      <select id="tr-classroom" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl font-bold text-xs mb-3">
        ${options.map(cl => `<option value="${cl.id}" ${cl.id === s.classroomId ? 'selected' : ''}>${cl.year} • ${cl.icon || ''} ${this.esc(cl.name)}</option>`).join('')}
      </select>
      <div class="flex gap-2">
        <button class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
        <button id="tr-save" class="btn-chunky btn-green text-xs py-2 px-4 flex-1">Mover</button>
      </div>`, 'max-w-md');
    modal.querySelector('#tr-save').addEventListener('click', () => {
      SM.transferStudent(s.id, modal.querySelector('#tr-classroom').value);
      modal.remove();
      window.SoundEngine?.playSuccess();
      this.showToast('Estudiante reubicado');
      this.renderStudents(document.getElementById('app-main-content'));
    });
  },

  evaluateStudentDirectly(studentId) {
    this.selectedStudentId = studentId;
    window.SidebarModule.navigateTo('evaluations');
  },

  toggleStudentComp(studentId, worldId, rerender = 'capacities') {
    window.AppState.toggleStudentCompetency(studentId, worldId);
    window.SoundEngine?.playPop();
    const container = document.getElementById('app-main-content');
    if (rerender === 'students') this.renderStudents(container); else this.renderCapacitiesPlanner(container);
  },

  // =========================================================================
  // 5. MALLA CURRICULAR CNEB (TODAS LAS ÁREAS, FILTRO POR ÁREA Y POR CICLO / EDAD)
  // =========================================================================
  curriculumAreaFilter: null,
  curriculumAgeFilter: null,

  renderCurriculum(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const CU = window.CNEB_CURRICULUM;
    const areas = CU.getAreasList();
    const ageF = this.curriculumAgeFilter; // null | 2 | 3 | 4 | 5
    const cycleF = ageF ? SM.cycleForAge(ageF) : null;
    const visibleAreas = areas.filter(a => !this.curriculumAreaFilter || a.id === this.curriculumAreaFilter);
    const totalComps = CU.getAllCompetencias().length;
    const reload = "window.AdminViews.renderCurriculum(document.getElementById('app-main-content'))";

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('📚', 'Malla Curricular del CNEB (Educación Inicial)', `${totalComps} competencias oficiales en ${areas.length} áreas. Matemática tiene retos interactivos; las demás áreas se planifican por aula y se evalúan de forma directa (AD/A/B/C).`,
          `<button class="btn-chunky bg-indigo-600 text-white border-indigo-400 text-xs py-2 px-4 shadow" onclick="window.AdminViews.applyCurriculumAll()">📐 Aplicar malla CNEB a ${c.isAdmin ? 'todas las aulas' : 'mis aulas'} (${c.classrooms.length})</button>`)}

        <div class="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-sm mb-5 space-y-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-slate-600 mr-1">Área:</span>
            <button class="px-3 py-1 rounded-xl text-xs font-black ${!this.curriculumAreaFilter ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="window.AdminViews.curriculumAreaFilter=null; ${reload}">Todas las áreas</button>
            ${areas.map(a => `<button class="px-3 py-1 rounded-xl text-xs font-black border ${this.curriculumAreaFilter === a.id ? a.badge + ' ring-2 ring-offset-1 ring-slate-400' : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'}" onclick="window.AdminViews.curriculumAreaFilter='${a.id}'; ${reload}">${a.icon} ${a.nombre}</button>`).join('')}
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-slate-600 mr-1">Ciclo / edad:</span>
            <button class="px-3 py-1 rounded-xl text-xs font-black ${!ageF ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="window.AdminViews.curriculumAgeFilter=null; ${reload}">Todos</button>
            ${[2, 3, 4, 5].map(a => { const th = SM.ageTheme(a); return `<button class="px-3 py-1 rounded-xl text-xs font-black ${ageF === a ? th.solid + ' shadow' : th.badge}" onclick="window.AdminViews.curriculumAgeFilter=${a}; ${reload}">${th.icon} ${a === 2 ? 'Ciclo I (0 a 2 años)' : th.label + ' • ' + th.cycle}</button>`; }).join('')}
          </div>
          <p class="text-[11px] text-slate-500 font-semibold">Según el CNEB, 0 a 2 años es Ciclo I (7 competencias) y 3, 4 y 5 años es Ciclo II (todas las competencias). La competencia es la misma en 3, 4 y 5 años: lo que cambia es el <strong>desempeño esperado</strong> y, en Matemática, los retos que se habilitan por edad.</p>
        </div>

        <div class="space-y-6">
          ${visibleAreas.map(a => {
            let comps = CU.getCompetenciasByArea(a.id);
            if (cycleF) comps = comps.filter(cp => CU.appliesToCycle(cp, cycleF));
            if (comps.length === 0) return '';
            return `
              <div class="bg-white rounded-3xl border-4 ${a.border} p-6 shadow-md">
                <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl p-2 rounded-2xl ${a.bgLight} border ${a.border}">${a.icon}</span>
                    <div><h2 class="text-xl font-black text-slate-800 font-fun">${a.nombre}</h2><p class="text-xs text-slate-500 font-bold">${a.descripcion}</p></div>
                  </div>
                  <span class="text-xs font-black px-3 py-1 rounded-full ${a.badge}">${comps.length} ${comps.length === 1 ? 'competencia' : 'competencias'}${a.id === 'matematica' ? ' • con retos interactivos' : ''}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${comps.map(cp => this.competencyCard(cp, a, c, ageF)).join('')}</div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  },

  competencyCard(cp, area, c, ageF) {
    const SM = window.SchoolManagement;
    const CU = window.CNEB_CURRICULUM;
    const activeIn = c.classrooms.filter(cl => SM.getClassroomPlan(cl.id)[cp.id]?.enabled);
    const hasGames = SM.hasGames(cp.id);
    const ages = ageF ? [ageF] : [3, 4, 5];
    return `
      <div class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex items-center gap-2"><span class="text-xl">${cp.icono}</span><h3 class="text-sm font-black text-slate-800 font-fun">Comp. ${cp.numeroCneb}: ${cp.nombre}</h3></div>
          ${hasGames ? '<span class="text-[9px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">🎮 Retos</span>' : ''}
        </div>
        <p class="text-[11px] text-slate-600 font-medium mb-2">${cp.descripcion}</p>
        ${cp.opcional ? `<p class="text-[10px] text-rose-700 font-bold mb-2">ℹ️ ${cp.opcional}</p>` : ''}
        <div class="flex flex-wrap gap-1 mb-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200">${(cp.ciclos || ['Ciclo II']).join(' y ')}</span>
          ${cp.nombreCicloI ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800">En Ciclo I: "${cp.nombreCicloI}"</span>` : ''}
        </div>
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Capacidades:</span>
        <div class="space-y-1">${cp.capacidades.map(cap => `<div class="flex items-start gap-1.5 text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200"><span class="text-amber-600 text-[11px]">🔹</span><div><strong class="font-bold text-slate-900">${cap.nombre}:</strong> <span class="text-[11px] text-slate-600">${cap.descripcion}</span></div></div>`).join('')}</div>
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mt-3 mb-1">Desempeño esperado por edad (la exigencia aumenta con la edad):</span>
        <div class="grid grid-cols-1 ${ages.length > 1 ? 'sm:grid-cols-3' : ''} gap-1.5 text-[10px]">
          ${ages.map(e => { const th = SM.ageTheme(e); const txt = CU.getDesempeno(cp.id, e); return `<div class="p-2 rounded-xl ${th.bg} border ${th.border}"><strong class="${th.text} block font-fun">${th.icon} ${e === 2 ? 'Ciclo I (0 a 2)' : th.label}:</strong><span class="${th.text}">${txt || 'No corresponde a este ciclo.'}</span></div>`; }).join('')}
        </div>
        <div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-[11px] font-bold">
          <span class="${activeIn.length ? 'text-emerald-700' : 'text-slate-400'}" title="${activeIn.map(x => x.name).join(', ')}">Activa en ${activeIn.length}/${c.classrooms.length} aula(s) ${activeIn.map(x => x.icon || '🏫').join(' ')}</span>
          <button class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-[11px] py-1 px-2" onclick="window.AdminViews.selectedAreaId='${area.id}'; window.AdminViews.selectedCompetencyId='${cp.id}'; window.SidebarModule.navigateTo('capacities')">🎯 Planificar</button>
        </div>
      </div>`;
  },

  applyCurriculumAll() {
    const c = this.ctx();
    this.confirmDialog('Aplicar malla CNEB', `Se activarán en ${c.classrooms.length} aula(s) de ${c.year} todas las competencias que el CNEB indica para su ciclo (Educación Religiosa queda para activarla manualmente) y se abrirán todas las sesiones de Matemática. Los ajustes manuales previos del plan se reemplazan. ¿Continuar?`, () => {
      const n = window.SchoolManagement.applyCurriculumToClassrooms(c.isAdmin ? null : c.classrooms.map(x => x.id));
      window.SoundEngine?.playSuccess();
      this.showToast(`Malla CNEB aplicada a ${n} aula(s)`);
      this.renderView(window.SidebarModule.activeView);
    }, false);
  },

  // =========================================================================
  // 6. PLANIFICAR SESIONES (PLAN DEL AULA POR ÁREA + ASIGNACIÓN / EVALUACIÓN INDIVIDUAL)
  // =========================================================================
  selectedAreaId: 'matematica',

  renderCapacitiesPlanner(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const CU = window.CNEB_CURRICULUM;
    if (c.classrooms.length === 0) {
      container.innerHTML = `<div class="max-w-6xl mx-auto px-4 py-6">${this.pageHeader('🎯', 'Planificar Sesiones', '')}${this.emptyState('🏫', 'No hay aulas para planificar', c.isAdmin ? 'Crea un aula primero.' : 'La Dirección debe asignarte un aula.')}</div>`;
      return;
    }
    const selected = c.classrooms.find(x => x.id === this.selectedClassroomId) || c.classrooms[0];
    this.selectedClassroomId = selected.id;
    const cycle = selected.cycle || SM.cycleForAge(selected.age);
    const th = SM.ageTheme(selected.age);
    const areas = CU.getAreasList();

    // Área y competencia seleccionadas (coherentes entre sí)
    let comp = CU.getCompetencia(this.selectedCompetencyId);
    if (comp && comp.areaId !== this.selectedAreaId) this.selectedAreaId = comp.areaId;
    if (!CU.areas[this.selectedAreaId]) this.selectedAreaId = 'matematica';
    const areaComps = CU.getCompetenciasByArea(this.selectedAreaId);
    if (!comp || comp.areaId !== this.selectedAreaId) comp = areaComps[0];
    this.selectedCompetencyId = comp.id;
    const area = CU.areas[this.selectedAreaId];

    const plan = SM.getClassroomPlan(selected.id);
    const cplan = plan[comp.id];
    const hasGames = SM.hasGames(comp.id);
    const applies = CU.appliesToCycle(comp, cycle);
    const students = SM.getStudentsByClassroom(selected.id);
    const activeTotal = SM.getActiveCompetencies(selected.id).length;
    const compName = CU.getNombre(comp.id, cycle);

    // --- Bloque específico de Matemática: sesiones de clase con retos ---
    let sessionsHtml = '';
    if (hasGames) {
      const mundo = window.CNEB_DATA.mundos[comp.id];
      sessionsHtml = mundo.sesiones.map((ses, idx) => {
        const enabled = !!cplan.sessions[ses.id];
        const caps = comp.capacidades.filter(cp => (ses.capacidades || []).includes(cp.id));
        const focus = cplan.focus[ses.id] || [];
        const juegos = window.CNEB_DATA.getJuegos(comp.id, ses.id, selected.age);
        const inStage = students.filter(s => SM.getStudentStage(s.id, comp.id)?.session?.id === ses.id).length;
        const approved = students.filter(s => window.AppState.isSessionApproved(comp.id, ses.id, s.id)).length;
        return `
          <div class="rounded-2xl border-2 ${enabled && cplan.enabled ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'} p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-start gap-3 min-w-0 flex-1">
                <span class="text-3xl">${ses.icono}</span>
                <div class="min-w-0">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Sesión ${ses.numero}${idx > 0 ? ' • requiere aprobar la sesión ' + idx : ' • siempre es la primera'}</span>
                  <h4 class="font-black text-slate-800 font-fun text-sm md:text-base leading-tight">${ses.titulo.split(':')[1] || ses.titulo}</h4>
                  <p class="text-[11px] text-slate-600 mt-1"><strong class="${th.text}">${th.icon} Desempeño ${th.label}:</strong> ${ses.desempenoPorEdad?.[String(selected.age)] || ses.desempenoCneb}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase ${enabled ? 'text-emerald-700' : 'text-slate-400'}">${enabled ? 'Abierta' : 'Pausada'}</span>
                <label class="switch-chunky"><input type="checkbox" class="ses-toggle" data-session="${ses.id}" ${enabled ? 'checked' : ''} ${!cplan.enabled ? 'disabled' : ''}><span class="slider-chunky"></span></label>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Capacidades priorizadas en esta sesión</span>
                <div class="space-y-1">
                  ${caps.map(cp => `
                    <label class="flex items-start gap-2 p-1.5 rounded-xl bg-white border ${focus.includes(cp.id) ? 'border-amber-300' : 'border-slate-200'} text-[11px] cursor-pointer">
                      <input type="checkbox" class="cap-toggle mt-0.5" data-session="${ses.id}" data-cap="${cp.id}" ${focus.includes(cp.id) ? 'checked' : ''}>
                      <span><strong class="text-slate-800">${cp.nombre}</strong><span class="text-slate-500"> — ${cp.descripcion}</span></span>
                    </label>`).join('')}
                </div>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Retos que verán los niños de ${th.label} (${juegos.length})</span>
                <div class="flex flex-wrap gap-1 mb-2">${juegos.map(j => `<span class="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-lg">${j.icono} ${j.titulo}</span>`).join('')}</div>
                <div class="text-[11px] text-slate-600 font-bold flex gap-3"><span>👦 En esta sesión: <strong>${inStage}</strong></span><span>✅ Aprobaron: <strong>${approved}</strong></span></div>
              </div>
            </div>
          </div>`;
      }).join('');
    }

    // --- Bloque genérico para las demás áreas: capacidades priorizadas + desempeño por edad ---
    const genericHtml = hasGames ? '' : `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="rounded-2xl border-2 ${th.border} ${th.bg} p-4">
          <span class="text-[10px] font-black uppercase tracking-wider ${th.text} block mb-1">${th.icon} Desempeño esperado para ${cycle === 'Ciclo I' ? 'Ciclo I (0 a 2 años)' : th.label}</span>
          <p class="text-xs ${th.text} font-semibold">${CU.getDesempeno(comp.id, selected.age) || 'Esta competencia no corresponde a este ciclo según el CNEB.'}</p>
          <div class="mt-3 pt-2 border-t ${th.border} text-[10px] text-slate-600 space-y-1">
            <span class="font-black uppercase tracking-wider text-slate-500 block">Progresión en el Ciclo II:</span>
            ${[3, 4, 5].map(e => `<div><strong>${SM.ageTheme(e).icon} ${e} años:</strong> ${CU.getDesempeno(comp.id, e)}</div>`).join('')}
          </div>
        </div>
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Capacidades priorizadas en el aula (marca las que trabajarás)</span>
          <div class="space-y-1">
            ${comp.capacidades.map(cp => { const on = (cplan.focus.general || []).includes(cp.id); return `
              <label class="flex items-start gap-2 p-2 rounded-xl bg-white border ${on ? 'border-amber-300' : 'border-slate-200'} text-[11px] cursor-pointer">
                <input type="checkbox" class="cap-toggle mt-0.5" data-session="general" data-cap="${cp.id}" ${on ? 'checked' : ''} ${!cplan.enabled ? 'disabled' : ''}>
                <span><strong class="text-slate-800">${cp.nombre}</strong><span class="text-slate-500"> — ${cp.descripcion}</span></span>
              </label>`; }).join('')}
          </div>
          <p class="text-[10px] text-slate-500 font-bold mt-2">Esta competencia no tiene retos interactivos: se trabaja en el aula y se califica de forma directa abajo o en "Evaluación".</p>
        </div>
      </div>`;

    // --- Estudiantes del aula ---
    let studentsHtml;
    if (students.length === 0) {
      studentsHtml = this.emptyState('🎒', 'Aula sin estudiantes', 'Matricula estudiantes en esta aula para asignarles la competencia.');
    } else if (hasGames) {
      studentsHtml = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${students.map(st => {
          const on = (st.assignedCompetencies || []).includes(comp.id);
          const stage = SM.getStudentStage(st.id, comp.id);
          const w = window.AppState.getWorldOverallAssessment(comp.id, st.id);
          let stageTxt;
          if (!on) stageTxt = '⏸️ Mundo pausado para este estudiante';
          else if (!stage || !stage.session) stageTxt = '🏆 Completó todas las sesiones';
          else if (stage.access.allowed) stageTxt = `▶️ Jugando Sesión ${stage.session.numero}`;
          else stageTxt = `🔒 Sesión ${stage.session.numero}: ${stage.access.code === 'session_off' ? 'pausada por el aula' : stage.access.code === 'plan_off' ? 'competencia pausada' : 'esperando aprobar la anterior'}`;
          return `
            <div class="p-3 rounded-2xl border-2 ${on ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0"><span class="text-2xl">${st.avatar || '🦙'}</span><div class="min-w-0"><h5 class="text-xs font-black text-slate-800 truncate">${this.esc(st.name)}</h5><span class="text-[10px] text-slate-500">${w?.totalCompleted || 0}/${w?.totalGames || 0} retos • ${w?.overall || 'Sin evaluar'}</span></div></div>
                <button class="px-2.5 py-1 rounded-xl text-xs font-bold ${on ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-600'}" onclick="window.AdminViews.toggleStudentComp('${st.id}','${comp.id}')">${on ? '✅ Activo' : '⚪ Pausado'}</button>
              </div>
              <p class="text-[10px] font-bold text-slate-600 mt-2">${stageTxt}</p>
            </div>`;
        }).join('')}
      </div>`;
    } else {
      studentsHtml = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${students.map(st => {
          const g = window.AppState.getAreaGrade(st.id, comp.id);
          return `
            <div class="p-3 rounded-2xl border-2 ${g ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0"><span class="text-2xl">${st.avatar || '🦙'}</span><div class="min-w-0"><h5 class="text-xs font-black text-slate-800 truncate">${this.esc(st.name)}</h5><span class="text-[10px] text-slate-500">${g ? 'Calificado ' + new Date(g.updatedAt).toLocaleDateString('es-PE') : 'Sin evaluar'}</span></div></div>
                <span class="text-sm font-black px-2.5 py-0.5 rounded-lg ${window.DocenteModule.getBadgeClass(g?.grade || 'Sin evaluar')}">${g?.grade || '—'}</span>
              </div>
              <div class="flex items-center gap-1 mt-2">
                ${['AD', 'A', 'B', 'C'].map(gr => `<button class="flex-1 py-1 rounded-lg font-black text-[11px] ${g?.grade === gr ? 'ring-2 ring-slate-700 ' : ''}${window.DocenteModule.getBadgeClass(gr)}" onclick="window.AdminViews.gradeArea('${st.id}','${comp.id}','${gr}','capacities')">${gr}</button>`).join('')}
                <button class="py-1 px-2 rounded-lg text-[11px] bg-white border border-slate-300" title="Anotación" onclick="window.AdminViews.openAreaNoteModal('${st.id}','${comp.id}','capacities')">📝</button>
              </div>
              ${g?.note ? `<p class="text-[10px] italic text-slate-600 mt-1">"${this.esc(g.note)}"</p>` : ''}
            </div>`;
        }).join('')}
      </div>`;
    }

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('🎯', 'Planificar Sesiones y Competencias', 'Elige el aula, el área y la competencia. Activa lo que trabajarás, prioriza capacidades y asigna o califica a cada estudiante.',
          `<button class="btn-chunky bg-indigo-100 text-indigo-900 border-indigo-300 text-xs py-2 px-3" id="btn-apply-cneb-class" title="Activa todas las competencias del ciclo del aula según el CNEB">📐 Aplicar malla CNEB a esta aula</button>
           ${c.classrooms.filter(x => x.id !== selected.id && x.age === selected.age).length ? `<button class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs py-2 px-3" id="btn-copy-plan">📋 Copiar plan a las otras aulas de ${th.label}</button>` : ''}`)}

        <div class="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-sm mb-5 space-y-3">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Aula</label>
              <select id="plan-class-select" class="px-3 py-2 border-2 border-amber-300 rounded-xl font-bold text-xs bg-amber-50 text-amber-950 outline-none">
                ${c.classrooms.map(cl => `<option value="${cl.id}" ${selected.id === cl.id ? 'selected' : ''}>${cl.icon || ''} ${this.esc(cl.name)} — ${cl.age} años</option>`).join('')}
              </select>
            </div>
            <span class="text-xs font-black px-3 py-1.5 rounded-full ${th.badge}">${th.icon} ${th.label} • ${cycle} • ${activeTotal} competencias activas</span>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Área curricular</label>
            <div class="flex flex-wrap gap-1.5">
              ${areas.map(a => { const n = SM.getActiveCompetencies(selected.id, a.id).length; const tot = CU.getCompetenciasByArea(a.id).length; return `<button class="area-chip px-3 py-1.5 rounded-xl text-xs font-black border ${this.selectedAreaId === a.id ? a.badge + ' ring-2 ring-offset-1 ring-slate-400' : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'}" data-area="${a.id}">${a.icon} ${a.nombre} <span class="opacity-70">${n}/${tot}</span></button>`; }).join('')}
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Competencia de ${area.nombre}</label>
            <div class="flex flex-wrap gap-1.5">
              ${areaComps.map(cp => { const on = plan[cp.id]?.enabled; return `<button class="comp-tab px-3 py-2 rounded-xl text-xs font-black border-2 text-left ${comp.id === cp.id ? 'bg-sky-600 text-white border-sky-400' : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'}" data-comp="${cp.id}" title="${this.esc(cp.nombre)}">${cp.icono} C.${cp.numeroCneb} ${CU.getNombre(cp.id, cycle).split(' ').slice(0, 4).join(' ')}${cp.nombre.split(' ').length > 4 ? '…' : ''} <span class="ml-1 ${comp.id === cp.id ? 'text-white/80' : (on ? 'text-emerald-600' : 'text-slate-400')}">${on ? '●' : '○'}</span></button>`; }).join('')}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl border-4 ${cplan.enabled ? area.border : 'border-slate-300'} p-5 shadow-xl mb-5">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-100 mb-4">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-4xl p-2 rounded-2xl ${area.bgLight} border-2 ${area.border}">${comp.icono}</span>
              <div class="min-w-0">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">${area.icon} ${area.nombre} • Competencia ${comp.numeroCneb}${hasGames ? ' • 🎮 con retos interactivos' : ''}</span>
                <h3 class="text-xl font-black text-slate-900 font-fun leading-tight">${compName}</h3>
                <p class="text-xs text-slate-600 font-bold">${applies ? SM.describePlan(selected.id, comp.id) : '⚠️ Según el CNEB esta competencia no corresponde al ' + cycle + '. Puedes activarla igual si tu programación lo requiere.'}</p>
                ${comp.opcional ? `<p class="text-[11px] text-rose-700 font-bold mt-1">ℹ️ ${comp.opcional}</p>` : ''}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase ${cplan.enabled ? 'text-emerald-700' : 'text-slate-500'}">${cplan.enabled ? 'Activa' : 'Pausada'} en el aula</span>
              <label class="switch-chunky"><input type="checkbox" id="comp-toggle" ${cplan.enabled ? 'checked' : ''}><span class="slider-chunky"></span></label>
            </div>
          </div>
          ${hasGames ? `<div class="space-y-3">${sessionsHtml}</div>` : genericHtml}
        </div>

        <div class="bg-white rounded-3xl border-3 border-slate-200 p-5 shadow-md">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 class="text-lg font-black text-slate-800 font-fun flex items-center gap-2"><span>📋</span>${hasGames ? `Asignación individual (${students.filter(s => (s.assignedCompetencies || []).includes(comp.id)).length}/${students.length} con ${comp.icono} activo)` : `Calificación directa por estudiante (${students.filter(s => window.AppState.getAreaGrade(s.id, comp.id)).length}/${students.length} evaluados)`}</h3>
              <p class="text-xs text-slate-500 font-bold">${hasGames ? 'Pausa o activa este mundo por estudiante según su ritmo. Verás en qué sesión está cada uno.' : 'Registra el nivel de logro observado en el aula (AD, A, B, C) y una anotación opcional para el informe SIAGIE.'}</p>
            </div>
            ${hasGames ? `<div class="flex gap-2"><button class="btn-chunky btn-green text-xs py-1.5 px-3" id="bulk-on">✅ Activar a todos</button><button class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-xs py-1.5 px-3" id="bulk-off">⏸️ Pausar a todos</button></div>` : ''}
          </div>
          ${studentsHtml}
        </div>
      </div>`;

    container.querySelector('#plan-class-select').addEventListener('change', (e) => { this.selectedClassroomId = e.target.value; this.renderCapacitiesPlanner(container); });
    container.querySelectorAll('.area-chip').forEach(b => b.addEventListener('click', () => { window.SoundEngine?.playPop(); this.selectedAreaId = b.dataset.area; this.selectedCompetencyId = null; this.renderCapacitiesPlanner(container); }));
    container.querySelectorAll('.comp-tab').forEach(b => b.addEventListener('click', () => { window.SoundEngine?.playPop(); this.selectedCompetencyId = b.dataset.comp; this.renderCapacitiesPlanner(container); }));
    container.querySelector('#comp-toggle').addEventListener('change', (e) => {
      SM.setCompetencyEnabled(selected.id, comp.id, e.target.checked);
      window.SoundEngine?.playPop();
      this.showToast(e.target.checked ? 'Competencia activada para el aula' : 'Competencia pausada para toda el aula');
      this.renderCapacitiesPlanner(container);
    });
    container.querySelectorAll('.ses-toggle').forEach(t => t.addEventListener('change', (e) => {
      SM.setSessionEnabled(selected.id, comp.id, t.dataset.session, e.target.checked);
      window.SoundEngine?.playPop();
      this.showToast(e.target.checked ? 'Sesión abierta para el aula' : 'Sesión pausada');
      this.renderCapacitiesPlanner(container);
    }));
    container.querySelectorAll('.cap-toggle').forEach(t => t.addEventListener('change', () => {
      SM.toggleFocusCapacity(selected.id, comp.id, t.dataset.session, t.dataset.cap);
      window.SoundEngine?.playPop();
    }));
    container.querySelector('#bulk-on')?.addEventListener('click', () => { students.forEach(s => { if (!(s.assignedCompetencies || []).includes(comp.id)) window.AppState.toggleStudentCompetency(s.id, comp.id); }); this.showToast('Mundo activado para todos'); this.renderCapacitiesPlanner(container); });
    container.querySelector('#bulk-off')?.addEventListener('click', () => { students.forEach(s => { if ((s.assignedCompetencies || []).includes(comp.id)) window.AppState.toggleStudentCompetency(s.id, comp.id); }); this.showToast('Mundo pausado para todos'); this.renderCapacitiesPlanner(container); });
    container.querySelector('#btn-apply-cneb-class')?.addEventListener('click', () => {
      this.confirmDialog('Aplicar malla CNEB al aula', `Se activarán todas las competencias del ${cycle} para "${this.esc(selected.name)}" y se abrirán todas las sesiones de Matemática. ¿Continuar?`, () => {
        SM.applyCurriculumToClassrooms([selected.id]);
        this.showToast('Malla CNEB aplicada al aula');
        this.renderCapacitiesPlanner(container);
      }, false);
    });
    container.querySelector('#btn-copy-plan')?.addEventListener('click', () => {
      this.confirmDialog('Copiar plan', `El plan completo de "${this.esc(selected.name)}" (todas las áreas) reemplazará el de las otras aulas de ${th.label} de ${selected.year}. ¿Continuar?`, () => {
        const n = SM.copyPlanToSameAge(selected.id);
        this.showToast(`Plan copiado a ${n} aula(s)`);
        this.renderCapacitiesPlanner(container);
      }, false);
    });
  },

  // Calificación directa de una competencia sin retos (áreas distintas a Matemática)
  gradeArea(studentId, compId, grade, rerender = 'evaluations') {
    const prev = window.AppState.getAreaGrade(studentId, compId);
    window.AppState.setAreaGrade(studentId, compId, grade, prev ? prev.note : '');
    window.SoundEngine?.playSuccess();
    const container = document.getElementById('app-main-content');
    if (rerender === 'capacities') this.renderCapacitiesPlanner(container); else this.renderEvaluations(container);
  },

  openAreaNoteModal(studentId, compId, rerender = 'evaluations') {
    const st = window.AppState.state.students.find(s => s.id === studentId);
    const comp = window.CNEB_CURRICULUM.getCompetencia(compId);
    if (!st || !comp) return;
    const prev = window.AppState.getAreaGrade(studentId, compId);
    const modal = this.openModal(`
      <h3 class="text-lg font-black text-amber-950 font-fun mb-1">📝 ${this.esc(st.name)}</h3>
      <p class="text-xs text-slate-600 font-bold mb-3">${comp.icono} ${comp.nombre}</p>
      <label class="block text-xs font-bold text-slate-700 mb-1">Nivel de logro</label>
      <div class="flex gap-1 mb-3">${['AD', 'A', 'B', 'C'].map(g => `<button type="button" class="note-grade flex-1 py-1.5 rounded-lg font-black text-xs ${(prev?.grade || 'A') === g ? 'ring-2 ring-slate-700 ' : ''}${window.DocenteModule.getBadgeClass(g)}" data-grade="${g}">${g}</button>`).join('')}</div>
      <label class="block text-xs font-bold text-slate-700 mb-1">Anotación (evidencia observada)</label>
      <textarea id="area-note" rows="3" class="w-full px-3 py-2 border-2 border-amber-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-400" placeholder="Ej. Comparte los materiales del sector sin que se le pida…">${this.esc(prev?.note || '')}</textarea>
      <div class="flex gap-2 mt-3">
        <button class="btn-chunky bg-slate-200 text-slate-700 text-xs py-2 px-4 flex-1 close-modal">Cancelar</button>
        <button id="area-note-save" class="btn-chunky btn-green text-xs py-2 px-4 flex-1">Guardar</button>
      </div>`, 'max-w-md');
    let grade = prev?.grade || 'A';
    modal.querySelectorAll('.note-grade').forEach(b => b.addEventListener('click', () => {
      grade = b.dataset.grade;
      modal.querySelectorAll('.note-grade').forEach(x => x.classList.remove('ring-2', 'ring-slate-700'));
      b.classList.add('ring-2', 'ring-slate-700');
    }));
    modal.querySelector('#area-note-save').addEventListener('click', () => {
      window.AppState.setAreaGrade(studentId, compId, grade, modal.querySelector('#area-note').value);
      modal.remove();
      window.SoundEngine?.playSuccess();
      this.showToast('Calificación y anotación guardadas');
      const container = document.getElementById('app-main-content');
      if (rerender === 'capacities') this.renderCapacitiesPlanner(container); else this.renderEvaluations(container);
    });
  },

  // =========================================================================
  // 7. EVALUACIÓN FORMATIVA Y SIAGIE
  // =========================================================================
  renderEvaluations(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const CU = window.CNEB_CURRICULUM;
    let students = c.students;
    if (this.selectedClassroomId && c.classrooms.some(x => x.id === this.selectedClassroomId)) students = students.filter(s => s.classroomId === this.selectedClassroomId);
    const student = students.find(s => s.id === this.selectedStudentId) || c.students.find(s => s.id === this.selectedStudentId) || students[0] || null;
    if (student && !students.includes(student)) { this.selectedClassroomId = null; students = c.students; }
    const summary = student ? window.AppState.getStudentSummary(student.id) : null;
    const cl = student ? SM.getClassroom(student.classroomId) : null;

    // Orden de áreas del informe de progreso de Educación Inicial
    const AREA_ORDER = ['personal_social', 'psicomotriz', 'comunicacion', 'matematica', 'ciencia_tecnologia', 'transversal'];
    const badge = (g) => window.DocenteModule.getBadgeClass(g);
    const gradeButtons = (cp) => `
      <div class="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
        <span class="text-[10px] font-black uppercase text-slate-500 mr-1">Calificar:</span>
        ${['AD', 'A', 'B', 'C'].map(gr => `<button class="px-2.5 py-0.5 rounded-lg font-black text-[11px] ${badge(gr)} hover:scale-105 transition-transform" onclick="window.AdminViews.${SM.hasGames(cp.id) ? `setWorldGrade('${student.id}','${cp.id}','${gr}')` : `gradeArea('${student.id}','${cp.id}','${gr}')`}">${gr}</button>`).join('')}
        ${SM.hasGames(cp.id) ? '' : `<button class="px-2 py-0.5 rounded-lg text-[11px] bg-white border border-slate-300" title="Anotación / evidencia" onclick="window.AdminViews.openAreaNoteModal('${student.id}','${cp.id}')">📝</button>`}
      </div>`;

    let report = '';
    if (student) {
      const cycle = cl ? cl.cycle : (parseInt(student.age, 10) <= 2 ? 'Ciclo I' : 'Ciclo II');
      const plan = cl ? SM.getClassroomPlan(cl.id) : null;
      const isEnabled = cp => plan ? !!plan[cp.id]?.enabled : true;
      const allComps = AREA_ORDER.flatMap(areaId => CU.getCompetenciasByArea(areaId).filter(cp => CU.appliesToCycle(cp, cycle) || isEnabled(cp)));
      const gradeOf = cp => SM.hasGames(cp.id)
        ? window.AppState.getWorldOverallAssessment(cp.id, student.id).overall
        : (window.AppState.getAreaGrade(student.id, cp.id)?.grade || 'Sin evaluar');
      const isGraded = cp => gradeOf(cp) !== 'Sin evaluar';
      const active = allComps.filter(isEnabled);
      const gradedCount = allComps.filter(isGraded).length;

      // Tarjeta de una competencia de Matemática: evidencia de las sesiones con retos
      const mathCard = (cp, a) => {
        const w = window.AppState.getWorldOverallAssessment(cp.id, student.id);
        const enabled = isEnabled(cp);
        const assigned = (student.assignedCompetencies || []).includes(cp.id);
        const conclusion = window.DocenteModule.formatMarkdown(window.AppState.generateConclusion(cp.id, student.id));
        return `
          <div class="rounded-xl border p-3 ${enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'}">
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-black ${enabled ? 'text-slate-800' : 'text-slate-500'}">${cp.icono} Comp. ${cp.numeroCneb}: ${CU.getNombre(cp.id, cycle)}</span>
              <span class="text-xs font-black px-2 py-0.5 rounded shrink-0 ${badge(w.overall)}">${w.overall}</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">🎮 Evidencia de retos: ${w.totalCompleted}/${w.totalGames}</span>
              ${(() => { const r = window.AppState.getProgressReport(student.id); const gs = r ? r.games.filter(g => g.worldId === cp.id) : []; if (!gs.length) return ''; const imp = gs.filter(g => g.trend === 'mejora').length; const ad = gs.filter(g => g.first === 'AD').length; return `<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 cursor-pointer hover:bg-teal-200" title="Ver antes y después" onclick="window.AdminViews.openProgressModal('${student.id}')">📈 Antes y después: ${imp} mejoraron • ${ad} AD a la primera</span>`; })()}
              ${enabled ? '' : '<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">⏸️ Pausada en el plan del aula</span>'}
              ${enabled && !assigned ? '<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">⏸️ Pausada para este estudiante</span>' : ''}
            </div>
            <div class="grid grid-cols-3 gap-1.5 mt-2">
              ${w.sesiones.map(sa => `<div class="bg-slate-50 rounded-lg border border-slate-200 p-1.5 text-center"><span class="text-[9px] font-bold text-slate-500 block">Sesión ${sa.session.numero}</span><span class="text-[11px] font-black px-1.5 py-0.5 rounded ${badge(sa.grade)}">${sa.grade}</span><span class="text-[9px] text-slate-500 block mt-0.5">${sa.completedCount}/${sa.totalCount} ${sa.isApproved ? '✅' : ''}</span></div>`).join('')}
            </div>
            <div class="text-[10px] text-slate-700 leading-relaxed mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">${conclusion}</div>
            ${gradeButtons(cp)}
          </div>`;
      };

      // Tarjeta de una competencia sin retos: calificación directa de aula
      const genericCard = (cp) => {
        const g = window.AppState.getAreaGrade(student.id, cp.id);
        const enabled = isEnabled(cp);
        const conclusion = g ? window.DocenteModule.formatMarkdown(window.AppState.generateAreaConclusion(student.id, cp.id)) : '';
        return `
          <div class="rounded-xl border p-3 ${enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'}">
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-black ${enabled ? 'text-slate-800' : 'text-slate-500'}">${cp.icono} Comp. ${cp.numeroCneb}: ${CU.getNombre(cp.id, cycle)}</span>
              <div class="flex items-center gap-1 shrink-0">
                <span class="text-xs font-black px-2 py-0.5 rounded ${badge(g?.grade || 'Sin evaluar')}">${g?.grade || 'Sin calificar'}</span>
                ${g ? `<button class="text-[10px] text-slate-400 hover:text-rose-600" title="Quitar calificación" onclick="window.AdminViews.gradeArea('${student.id}','${cp.id}','')">✖</button>` : ''}
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">📝 Calificación directa de aula</span>
              ${enabled ? '' : '<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">⏸️ Pausada en el plan del aula</span>'}
              ${cp.opcional ? '<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Exonerable</span>' : ''}
            </div>
            <p class="text-[10px] text-slate-600 mt-1.5"><strong>Desempeño esperado (${student.age} años):</strong> ${CU.getDesempeno(cp.id, student.age)}</p>
            ${g ? `<div class="text-[10px] text-slate-700 leading-relaxed mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">${conclusion}</div>` : ''}
            ${gradeButtons(cp)}
          </div>`;
      };

      const areaCard = (areaId) => {
        const a = CU.areas[areaId];
        const comps = allComps.filter(cp => cp.areaId === areaId);
        if (comps.length === 0) return '';
        const g = comps.filter(isGraded).length;
        return `
          <div class="rounded-2xl border-2 ${a.border} ${a.bgLight} p-4">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2"><span class="text-2xl">${a.icon}</span><div><h4 class="text-base font-black text-slate-800 font-fun leading-tight">${a.nombre}</h4><p class="text-[10px] text-slate-500 font-bold">${a.descripcion}</p></div></div>
              <span class="text-xs font-black px-3 py-1 rounded-full border ${g === comps.length ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : a.badge}">${g}/${comps.length} calificadas</span>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">${comps.map(cp => SM.hasGames(cp.id) ? mathCard(cp, a) : genericCard(cp)).join('')}</div>
          </div>`;
      };

      report = `
        <!-- RESUMEN DEL INFORME -->
        <div class="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 mb-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-black text-amber-950 font-fun">📋 Resumen del informe (${cycle} • ${student.age} años)</h3>
            <span class="text-xs font-black px-3 py-1 rounded-full ${gradedCount === allComps.length ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-white text-slate-700 border border-slate-300'}">${gradedCount}/${allComps.length} competencias calificadas</span>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${AREA_ORDER.map(areaId => { const a = CU.areas[areaId]; const comps = allComps.filter(cp => cp.areaId === areaId); if (!comps.length) return ''; const g = comps.filter(isGraded).length; return `<a href="#area-${areaId}" class="text-[10px] font-black px-2 py-0.5 rounded-full border ${a.badge}">${a.icon} ${a.nombre}: ${g}/${comps.length}</a>`; }).join('')}
          </div>
          <div class="mt-3 pt-2 border-t border-amber-200">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Activas en el plan del aula (${active.length}/${allComps.length}):</span>
            <div class="flex flex-wrap gap-1 mt-1">
              ${allComps.map(cp => { const on = isEnabled(cp); const g = gradeOf(cp); return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${on ? 'bg-white border-emerald-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400 line-through'}" title="${this.esc(cp.nombre)}">${cp.icono} C.${cp.numeroCneb} <span class="font-black ${g === 'Sin evaluar' ? 'text-slate-400' : 'text-emerald-700'}">${g === 'Sin evaluar' ? '—' : g}</span></span>`; }).join('')}
            </div>
            <p class="text-[10px] text-slate-500 font-bold mt-1.5">Las competencias pausadas aparecen tachadas y en gris más abajo; igual puedes calificarlas si las trabajaste. Cambia el plan en "Planificar Sesiones".</p>
          </div>
        </div>

        <!-- INFORME POR ÁREAS (ORDEN DEL CNEB) -->
        <div class="space-y-4">
          ${AREA_ORDER.map(areaId => `<div id="area-${areaId}">${areaCard(areaId)}</div>`).join('')}
        </div>`;
    }

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('📊', `Evaluación Formativa & SIAGIE (${c.year})`, 'Informe por áreas: competencia → nivel de logro (AD, A, B, C) → conclusión descriptiva. Matemática toma la evidencia de los retos; las demás áreas se califican de forma directa.',
          `<button class="btn-chunky btn-yellow text-xs py-2 px-4 shadow" onclick="window.DocenteModule.exportCSV()">📥 Exportar CSV</button>
           <button class="btn-chunky bg-emerald-600 text-white border-emerald-400 text-xs py-2 px-4 shadow" onclick="window.DocenteModule.openDashboard('monitoring')">📋 Sábana del aula</button>`)}

        <div class="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-sm mb-6 flex flex-wrap items-center gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Aula</label>
            <select id="eval-class-select" class="px-3 py-1.5 border-2 border-amber-300 rounded-xl font-bold text-xs bg-amber-50 outline-none">
              <option value="">Todas mis aulas</option>
              ${c.classrooms.map(x => `<option value="${x.id}" ${this.selectedClassroomId === x.id ? 'selected' : ''}>${this.esc(x.name)}</option>`).join('')}
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-bold text-slate-700 mb-1">Estudiante</label>
            <select id="eval-student-select" class="w-full px-3 py-1.5 border-2 border-amber-300 rounded-xl font-bold text-xs bg-amber-50 outline-none">
              ${students.map(s => `<option value="${s.id}" ${student?.id === s.id ? 'selected' : ''}>${s.avatar || '🦙'} ${this.esc(s.name)} (${s.id}) • ${s.age} años</option>`).join('')}
            </select>
          </div>
        </div>

        ${!student ? this.emptyState('📊', 'No hay estudiantes para evaluar', 'Matricula estudiantes o cambia el filtro de aula.') : `
          <div class="bg-white rounded-3xl border-4 border-amber-400 p-6 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-amber-200 mb-4">
              <div class="flex items-center gap-3">
                <span class="text-5xl p-2 rounded-2xl bg-amber-100 border-2 border-amber-300">${student.avatar || '🦙'}</span>
                <div>
                  <h2 class="text-2xl font-black text-slate-900 font-fun">${this.esc(student.name)}</h2>
                  <p class="text-xs text-slate-600 font-bold">Usuario <strong>${student.id}</strong> • ${cl ? this.esc(cl.name) : 'Sin aula'} • ${student.age} años • ⭐ ${student.stars || 0} • Retos ${summary.totalCompleted}/${summary.totalGames} (${summary.totalProgress}%) • Último acceso: ${this.esc(summary.lastActive)}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-2 px-3" onclick="window.DocenteModule.openDashboard('individual','${student.id}')">📄 Ficha oficial</button>
                <button class="btn-chunky bg-sky-100 text-sky-900 border-sky-300 text-xs py-2 px-3" onclick="window.AuthModule.impersonateStudent('${student.id}')">🎮 Ver como alumno</button>
              </div>
            </div>
            ${report}
          </div>`}
      </div>`;

    container.querySelector('#eval-class-select')?.addEventListener('change', (e) => { this.selectedClassroomId = e.target.value || null; this.selectedStudentId = null; this.renderEvaluations(container); });
    container.querySelector('#eval-student-select')?.addEventListener('change', (e) => { this.selectedStudentId = e.target.value; this.renderEvaluations(container); });
  },

  // Calificación manual: aplica la nota a todos los retos del mundo que corresponden a la edad del estudiante
  setWorldGrade(studentId, worldId, grade) {
    const student = window.AppState.state.students.find(s => s.id === studentId);
    if (!student) return;
    const mundo = window.CNEB_DATA.mundos[worldId];
    mundo.sesiones.forEach(ses => {
      window.AppState.getJuegosForStudent(worldId, ses.id, student).forEach(j => {
        if (!student.evaluaciones[j.id]) student.evaluaciones[j.id] = { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null };
        const ev = student.evaluaciones[j.id];
        ev.lastGrade = grade;
        ev.completed = true;
        ev.attempts = Math.max(ev.attempts || 0, 1);
        ev.manual = true;
        if (window.SupabaseService?.isConfigured()) window.SupabaseService.saveEvaluation(student.id, j.id, ev, student.stars || 0);
      });
    });
    window.AppState.saveState();
    window.SoundEngine?.playSuccess();
    this.showToast(`Calificación ${grade} registrada en ${mundo.nombre}`);
    this.renderEvaluations(document.getElementById('app-main-content'));
  },

  // =========================================================================
  // 8. MUNDOS Y RETOS (MODO COMPROBACIÓN PARA EL PERSONAL)
  // =========================================================================
  // =========================================================================
  // 8. PROGRESO: ANTES Y DESPUÉS (evaluación de proceso por intentos)
  // =========================================================================
  gradeBadge(grade) { return window.DocenteModule.getBadgeClass(grade); },

  trendChip(p) {
    if (!p) return '';
    if (p.trend === 'mejora') return `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">▲ Mejoró</span>`;
    if (p.trend === 'baja') return `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">▼ Bajó</span>`;
    if (p.trend === 'estable') return `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300">= Igual</span>`;
    return `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300">1 intento</span>`;
  },

  renderProgress(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const classrooms = c.classrooms;
    if (this.progressClassroomId && !classrooms.some(x => x.id === this.progressClassroomId)) this.progressClassroomId = null;
    const students = c.students.filter(s => s.status !== 'retirado' && (!this.progressClassroomId || s.classroomId === this.progressClassroomId));
    const ranking = window.AppState.getClassProgressRanking(students);
    const withData = ranking.filter(r => r.played > 0);
    const count = key => ranking.filter(r => r.profile === key).length;
    const avgDelta = withData.length ? (withData.reduce((a, r) => a + r.delta, 0) / withData.length) : 0;
    const totalRounds = ranking.reduce((a, r) => a + r.totalRounds, 0);

    const stat = (icon, label, value, cls) => `
      <div class="rounded-2xl border-2 ${cls} p-3 text-center shadow-sm">
        <div class="text-2xl">${icon}</div>
        <div class="text-2xl font-black font-fun leading-tight">${value}</div>
        <div class="text-[10px] font-bold uppercase tracking-wide opacity-80">${label}</div>
      </div>`;

    const row = (r, i) => {
      const cl = SM.getClassroom(r.student.classroomId);
      const sign = r.delta > 0 ? '+' : '';
      const deltaCls = r.delta > 0 ? 'text-emerald-700' : r.delta < 0 ? 'text-rose-700' : 'text-slate-500';
      return `
        <tr class="border-b border-slate-100 hover:bg-amber-50/60 ${r.played === 0 ? 'opacity-60' : ''}">
          <td class="px-2 py-2 text-center font-black text-slate-500 text-xs">${r.played ? i + 1 : '—'}</td>
          <td class="px-2 py-2">
            <div class="flex items-center gap-2 min-w-[150px]">
              <span class="text-2xl">${r.student.avatar || '🦙'}</span>
              <div class="min-w-0"><span class="font-black text-slate-900 text-xs block truncate">${this.esc(r.student.name)}</span><span class="text-[10px] text-slate-500 font-bold">${cl ? this.esc(cl.name) : 'Sin aula'} • ${r.student.age} años</span></div>
            </div>
          </td>
          <td class="px-2 py-2 text-center text-xs font-bold text-slate-700">${r.played}<span class="text-[10px] text-slate-400 font-medium block">${r.totalRounds} intentos</span></td>
          <td class="px-2 py-2 text-center text-xs font-bold text-slate-700">${r.replayed}</td>
          <td class="px-2 py-2 text-center"><span class="text-[11px] font-black px-2 py-0.5 rounded ${this.gradeBadge(r.initialGrade)}">${r.initialGrade}</span></td>
          <td class="px-2 py-2 text-center text-slate-400 font-black">➜</td>
          <td class="px-2 py-2 text-center"><span class="text-[11px] font-black px-2 py-0.5 rounded ${this.gradeBadge(r.currentGrade)}">${r.currentGrade}</span></td>
          <td class="px-2 py-2 text-center font-black text-sm ${deltaCls}">${r.played ? `${sign}${r.delta.toFixed(2)}` : '—'}<span class="text-[9px] text-slate-400 font-medium block">${r.improved}▲ ${r.declined}▼</span></td>
          <td class="px-2 py-2"><span class="text-[10px] font-black px-2 py-1 rounded-full border whitespace-nowrap ${r.color}">${r.icon} ${r.label}</span></td>
          <td class="px-2 py-2 text-right"><button class="btn-chunky bg-white text-purple-900 border-purple-300 text-[11px] py-1 px-2.5" onclick="window.AdminViews.openProgressModal('${r.student.id}')">🔍 Detalle</button></td>
        </tr>`;
    };

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-4 space-y-5">
        ${this.pageHeader('📈', 'Progreso: Antes y Después', 'Evaluación de proceso: compara la primera vez que cada estudiante resolvió un reto con su último intento, para ver quién mejora con el programa y quién destaca desde el inicio.')}

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-slate-600">Aula:</span>
          <button class="px-3 py-1 rounded-full text-xs font-black border-2 ${!this.progressClassroomId ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-slate-700 border-slate-200'}" onclick="window.AdminViews.progressClassroomId=null; window.AdminViews.renderProgress(document.getElementById('app-main-content'))">Todas</button>
          ${classrooms.map(cl => `<button class="px-3 py-1 rounded-full text-xs font-black border-2 ${this.progressClassroomId === cl.id ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-slate-700 border-slate-200'}" onclick="window.AdminViews.progressClassroomId='${cl.id}'; window.AdminViews.renderProgress(document.getElementById('app-main-content'))">${cl.icon || ''} ${this.esc(cl.name)}</button>`).join('')}
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          ${stat('🚀', 'Mejora notable', count('mejora_notable'), 'bg-emerald-50 border-emerald-300 text-emerald-900')}
          ${stat('📈', 'En mejora', count('mejora'), 'bg-teal-50 border-teal-300 text-teal-900')}
          ${stat('🌟', 'Destacados desde el inicio', count('destacado_inicio'), 'bg-amber-50 border-amber-300 text-amber-900')}
          ${stat('🤝', 'Requieren acompañamiento', count('retroceso') + count('estable'), 'bg-rose-50 border-rose-300 text-rose-900')}
          ${stat('🔁', 'Intentos registrados', totalRounds, 'bg-sky-50 border-sky-300 text-sky-900')}
        </div>

        <div class="bg-white border-2 border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-black text-slate-900 font-fun">🏅 Ranking de mejora del aula</h3>
            <span class="text-[11px] text-slate-600 font-bold">Cambio promedio del grupo: <strong class="${avgDelta > 0 ? 'text-emerald-700' : avgDelta < 0 ? 'text-rose-700' : 'text-slate-700'}">${avgDelta > 0 ? '+' : ''}${avgDelta.toFixed(2)}</strong> (escala C=1, B=2, A=3, AD=4)</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-600">
                <tr><th class="px-2 py-2 text-center">#</th><th class="px-2 py-2">Estudiante</th><th class="px-2 py-2 text-center">Retos</th><th class="px-2 py-2 text-center">Repetidos</th><th class="px-2 py-2 text-center">Antes</th><th></th><th class="px-2 py-2 text-center">Después</th><th class="px-2 py-2 text-center">Cambio</th><th class="px-2 py-2">Perfil</th><th></th></tr>
              </thead>
              <tbody>${ranking.length ? ranking.map(row).join('') : '<tr><td colspan="10" class="p-6 text-center text-xs text-slate-400 italic">No hay estudiantes en esta selección.</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
          <p class="font-black">¿Cómo se lee este informe?</p>
          <p><strong>Antes</strong> es el promedio de la primera nota de cada reto (línea de base). <strong>Después</strong> es el promedio de la última nota. El <strong>cambio</strong> es la diferencia: positivo = mejora con la práctica.</p>
          <p>Cada vez que un niño repite un reto se guarda un nuevo intento con su nota; la nota anterior no se borra. Con 0 apoyos la ronda es <strong>AD</strong>, con 1 apoyo <strong>A</strong>, con 2 o más <strong>B</strong>.</p>
          <p>🌟 <strong>Destacado desde el inicio</strong>: resolvió todo sin apoyo la primera vez. 🔁 <strong>Aún sin segundo intento</strong>: ya tiene línea de base, falta que repita para medir su mejora.</p>
        </div>
      </div>`;
  },

  openProgressModal(studentId) {
    const r = window.AppState.getProgressReport(studentId);
    if (!r) return;
    const s = r.student;
    const fmtDate = d => { try { return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }); } catch (e) { return ''; } };
    const gameRow = g => `
      <tr class="border-b border-slate-100">
        <td class="px-2 py-1.5"><span class="text-base">${g.juego.icono}</span> <span class="text-xs font-bold text-slate-800">${g.juego.titulo}</span><span class="text-[10px] text-slate-500 block">${g.mundo.nombre || g.mundo.titulo || g.mundo.id} • Sesión ${g.sesion.numero}</span></td>
        <td class="px-2 py-1.5 text-center text-xs font-bold text-slate-700">${g.rounds}</td>
        <td class="px-2 py-1.5 text-center"><span class="text-[11px] font-black px-1.5 py-0.5 rounded ${this.gradeBadge(g.first)}">${g.first}</span></td>
        <td class="px-2 py-1.5 text-center"><span class="text-[11px] font-black px-1.5 py-0.5 rounded ${this.gradeBadge(g.last)}">${g.last}</span></td>
        <td class="px-2 py-1.5 text-center"><span class="text-[11px] font-black px-1.5 py-0.5 rounded ${this.gradeBadge(g.best)}">${g.best}</span></td>
        <td class="px-2 py-1.5 text-center">${this.trendChip(g)}</td>
        <td class="px-2 py-1.5"><div class="flex flex-wrap gap-1">${g.history.map(h => `<span class="text-[10px] font-black px-1.5 py-0.5 rounded ${this.gradeBadge(h.grade)}" title="Intento ${h.n} • ${fmtDate(h.date)} • ${h.hints} apoyos${h.timeSec ? ' • ' + h.timeSec + 's' : ''}">${h.n}:${h.grade}</span>`).join('')}</div></td>
      </tr>`;
    const html = `
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <span class="text-4xl">${s.avatar || '🦙'}</span>
          <div>
            <h3 class="text-xl font-black text-slate-900 font-fun leading-tight">${this.esc(s.name)}</h3>
            <p class="text-[11px] text-slate-500 font-bold">Usuario ${s.id} • ${s.age} años</p>
          </div>
        </div>
        <button class="close-modal w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg">✕</button>
      </div>
      <div class="rounded-2xl border-2 p-3 mb-3 ${r.color}">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-sm font-black">${r.icon} ${r.label}</span>
          <span class="text-xs font-bold">Antes <span class="px-1.5 py-0.5 rounded ${this.gradeBadge(r.initialGrade)}">${r.initialGrade}</span> ➜ Después <span class="px-1.5 py-0.5 rounded ${this.gradeBadge(r.currentGrade)}">${r.currentGrade}</span> (${r.delta > 0 ? '+' : ''}${r.delta.toFixed(2)})</span>
        </div>
        <p class="text-xs mt-1.5 leading-relaxed">${r.text}</p>
      </div>
      <div class="grid grid-cols-4 gap-2 mb-3 text-center">
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-2"><div class="text-lg font-black text-slate-900">${r.played}</div><div class="text-[9px] font-bold text-slate-500 uppercase">Retos logrados</div></div>
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-2"><div class="text-lg font-black text-slate-900">${r.totalRounds}</div><div class="text-[9px] font-bold text-slate-500 uppercase">Intentos</div></div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-2"><div class="text-lg font-black text-emerald-800">${r.improved}</div><div class="text-[9px] font-bold text-emerald-700 uppercase">Mejoraron</div></div>
        <div class="rounded-xl bg-amber-50 border border-amber-200 p-2"><div class="text-lg font-black text-amber-800">${r.strongStart}</div><div class="text-[9px] font-bold text-amber-700 uppercase">AD a la primera</div></div>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-left">
          <thead class="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-600"><tr><th class="px-2 py-1.5">Reto</th><th class="px-2 py-1.5 text-center">Intentos</th><th class="px-2 py-1.5 text-center">Antes</th><th class="px-2 py-1.5 text-center">Después</th><th class="px-2 py-1.5 text-center">Mejor</th><th class="px-2 py-1.5 text-center">Tendencia</th><th class="px-2 py-1.5">Historial</th></tr></thead>
          <tbody>${r.games.length ? r.games.map(gameRow).join('') : '<tr><td colspan="7" class="p-4 text-center text-xs text-slate-400 italic">Todavía no completó ningún reto.</td></tr>'}</tbody>
        </table>
      </div>
      <div class="flex justify-end gap-2 mt-3">
        <button class="btn-chunky bg-white text-slate-700 border-slate-300 text-xs py-1.5 px-3" onclick="window.AdminViews.selectedStudentId='${s.id}'; document.querySelectorAll('.modal-overlay').forEach(m=>m.remove()); window.SidebarModule.navigateTo('evaluations')">📊 Ver ficha de evaluación</button>
        <button class="btn-chunky btn-green text-xs py-1.5 px-3" onclick="window.AuthModule.impersonateStudent('${s.id}')">👑 Jugar como ${this.esc(s.name.split(' ')[0])}</button>
      </div>`;
    this.openModal(html, 'max-w-3xl');
  },

  renderGames(container) {
    if (window.AuthModule.isFamily()) { window.App.showHome(); return; }
    const SM = window.SchoolManagement;
    const previewAge = window.App.previewAge || 5;
    const session = window.AuthModule.currentSession;
    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-6 animate-pop">
        <div class="mb-6 bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 text-white p-5 rounded-3xl shadow-xl border-3 border-yellow-400 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl animate-bounce-soft">👑</span>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-purple-950 px-2 py-0.5 rounded-full">Modo Comprobación</span>
              <h2 class="text-xl font-black font-fun leading-tight mt-0.5">Explora los retos como lo haría un niño</h2>
              <p class="text-xs text-purple-200 font-bold">${session.role === 'admin' ? 'Directora' : 'Docente'}: tus respuestas no alteran notas. Para ver el avance real de un alumno usa "Entrar como alumno".</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold">Ver retos de:</span>
            ${[3, 4, 5].map(a => `<button class="px-3 py-1.5 rounded-xl text-xs font-black ${previewAge === a ? 'bg-yellow-400 text-purple-950' : 'bg-white/10 text-white hover:bg-white/20'}" onclick="window.App.previewAge=${a}; window.AdminViews.renderGames(document.getElementById('app-main-content'))">${SM.ageTheme(a).icon} ${a} años</button>`).join('')}
          </div>
        </div>
        <div class="text-center mb-6">
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 font-fun">¡Aventuras Matemáticas con Kusi!</h1>
          <p class="text-sm text-slate-600 font-bold mt-1">Elige un mundo. Verás los ${window.CNEB_DATA.getTotalJuegosForAge(previewAge)} retos pertinentes para ${previewAge} años, cada uno con la dificultad de esa edad.</p>
          <div class="mt-3 inline-flex flex-wrap items-center justify-center gap-2 bg-white/90 border-2 border-slate-200 rounded-2xl px-4 py-2 text-[11px] text-slate-600 font-bold">
            <span>ℹ️ Los retos digitales cubren las 2 competencias de <strong>Matemática</strong>. Las otras ${window.CNEB_CURRICULUM.getAllCompetencias().length - 2} competencias del CNEB se trabajan en el aula y se califican en</span>
            <button class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300" onclick="window.SidebarModule.navigateTo('evaluations')">📊 Evaluación</button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${window.CNEB_DATA.getMundosList().map(m => {
            const isC = m.id === 'cantidad';
            const n = m.sesiones.reduce((a, s) => a + window.CNEB_DATA.getJuegos(m.id, s.id, previewAge).length, 0);
            return `
              <div class="world-card ${isC ? 'bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 border-amber-400' : 'bg-gradient-to-br from-sky-200 via-indigo-100 to-purple-200 border-sky-400'} group cursor-pointer" onclick="window.App.showWorld('${m.id}')">
                <div class="w-24 h-24 rounded-full ${isC ? 'bg-amber-400' : 'bg-sky-400'} border-4 border-white shadow-xl group-hover:scale-110 flex items-center justify-center text-5xl mb-3 transition-transform">${m.icono}</div>
                <span class="text-xs font-black uppercase tracking-wider ${isC ? 'bg-amber-600' : 'bg-sky-600'} text-white px-3 py-1 rounded-full mb-2">Competencia ${m.numeroCneb}</span>
                <h3 class="text-2xl font-black ${isC ? 'text-amber-950' : 'text-sky-950'} font-fun mb-2">${m.nombre}</h3>
                <p class="${isC ? 'text-amber-900' : 'text-sky-900'} text-xs font-bold mb-4">${m.sesiones.map(s => s.numero + '. ' + (s.titulo.split(':')[1] || '').trim()).join(' • ')}</p>
                <button class="btn-chunky ${isC ? 'btn-yellow' : 'btn-blue'} w-full text-sm py-2">Entrar (${n} retos) ➔</button>
              </div>`;
          }).join('')}
        </div>

        ${this.renderVivencialWorlds(previewAge)}
      </div>`;
  },

  // Mundos vivenciales: las competencias de las otras áreas, con sus 3 sesiones de aula sugeridas
  gamesAreaFilter: null,
  renderVivencialWorlds(previewAge) {
    const CU = window.CNEB_CURRICULUM;
    const SM = window.SchoolManagement;
    const c = this.ctx();
    const cycle = previewAge <= 2 ? 'Ciclo I' : 'Ciclo II';
    const ORDER = ['personal_social', 'psicomotriz', 'comunicacion', 'ciencia_tecnologia', 'transversal'];
    const areas = ORDER.map(id => CU.areas[id]).filter(Boolean);
    const visible = areas.filter(a => !this.gamesAreaFilter || a.id === this.gamesAreaFilter);
    const th = SM.ageTheme(previewAge);
    return `
      <div class="mt-10">
        <div class="text-center mb-4">
          <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-fun">🏫 Mundos Vivenciales (otras áreas del CNEB)</h2>
          <p class="text-sm text-slate-600 font-bold mt-1">Estas competencias se viven en el aula, no en la pantalla. Cada mundo trae 3 sesiones de aula sugeridas y el desempeño esperado para ${th.icon} ${th.label}. Se califican en Evaluación.</p>
        </div>
        <div class="flex flex-wrap justify-center gap-1.5 mb-5">
          <button class="px-3 py-1 rounded-xl text-xs font-black ${!this.gamesAreaFilter ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'}" onclick="window.AdminViews.gamesAreaFilter=null; window.AdminViews.renderGames(document.getElementById('app-main-content'))">Todas las áreas</button>
          ${areas.map(a => `<button class="px-3 py-1 rounded-xl text-xs font-black border ${this.gamesAreaFilter === a.id ? a.badge + ' ring-2 ring-offset-1 ring-slate-400' : 'bg-white text-slate-700 border-slate-200'}" onclick="window.AdminViews.gamesAreaFilter='${a.id}'; window.AdminViews.renderGames(document.getElementById('app-main-content'))">${a.icon} ${a.nombre}</button>`).join('')}
        </div>
        <div class="space-y-6">
          ${visible.map(a => {
            const comps = CU.getCompetenciasByArea(a.id).filter(cp => CU.appliesToCycle(cp, cycle));
            if (!comps.length) return '';
            return `
              <div>
                <h3 class="text-base font-black text-slate-700 font-fun mb-2 flex items-center gap-2"><span class="text-xl">${a.icon}</span>${a.nombre}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${comps.map(cp => {
                    const acts = CU.getActividades(cp.id);
                    const activeIn = c.classrooms.filter(cl => SM.getClassroomPlan(cl.id)[cp.id]?.enabled).length;
                    return `
                      <div class="world-card bg-gradient-to-br ${a.bgGradient.replace('from-', 'from-').replace(/\d00/g, '100')} ${a.border} cursor-pointer group" onclick="window.AdminViews.openActivitiesModal('${cp.id}')">
                        <div class="w-16 h-16 rounded-full bg-white border-4 ${a.border} shadow-lg group-hover:scale-110 flex items-center justify-center text-3xl mb-2 transition-transform">${cp.icono}</div>
                        <span class="text-[10px] font-black uppercase tracking-wider ${a.badge} px-2.5 py-0.5 rounded-full mb-1.5 border">Competencia ${cp.numeroCneb} • 🏫 Vivencial</span>
                        <h4 class="text-base font-black text-slate-900 font-fun leading-tight mb-1">${CU.getNombre(cp.id, cycle)}</h4>
                        <p class="text-[11px] text-slate-700 font-bold mb-2">${acts.map((x, i) => `${i + 1}. ${x.titulo}`).join(' • ')}</p>
                        <p class="text-[10px] text-slate-600 mb-3"><strong>${th.icon} ${th.label}:</strong> ${CU.getDesempeno(cp.id, previewAge)}</p>
                        <div class="flex items-center justify-between w-full gap-2">
                          <span class="text-[10px] font-bold ${activeIn ? 'text-emerald-700' : 'text-slate-400'}">Activa en ${activeIn}/${c.classrooms.length} aula(s)</span>
                          <button class="btn-chunky bg-white text-slate-800 border-slate-300 text-xs py-1.5 px-3">Ver sesiones ➔</button>
                        </div>
                      </div>`;
                  }).join('')}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  },

  openActivitiesModal(compId) {
    const CU = window.CNEB_CURRICULUM;
    const SM = window.SchoolManagement;
    const cp = CU.getCompetencia(compId);
    if (!cp) return;
    const a = CU.areas[cp.areaId];
    const age = window.App.previewAge || 5;
    const acts = CU.getActividades(compId);
    const modal = this.openModal(`
      <div class="flex items-start justify-between gap-3 pb-3 border-b-2 ${a.border} mb-3">
        <div class="flex items-center gap-3">
          <span class="text-4xl p-2 rounded-2xl ${a.bgLight} border-2 ${a.border}">${cp.icono}</span>
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">${a.icon} ${a.nombre} • Competencia ${cp.numeroCneb} • Mundo vivencial</span>
            <h3 class="text-lg font-black text-slate-900 font-fun leading-tight">${cp.nombre}</h3>
          </div>
        </div>
        <button class="text-2xl text-slate-400 hover:text-slate-700 close-modal font-bold">&times;</button>
      </div>
      <div class="flex flex-wrap items-center gap-1.5 mb-3">
        <span class="text-xs font-bold text-slate-600">Desempeño esperado para:</span>
        ${[3, 4, 5].map(e => { const t = SM.ageTheme(e); return `<button class="act-age px-2.5 py-1 rounded-lg text-xs font-black ${age === e ? t.solid : t.badge}" data-age="${e}">${t.icon} ${e} años</button>`; }).join('')}
      </div>
      <p id="act-desempeno" class="text-xs text-slate-700 font-semibold bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">${CU.getDesempeno(compId, age)}</p>
      <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">3 sesiones de aula sugeridas</span>
      <div class="space-y-2 mb-4">
        ${acts.map((x, i) => `
          <div class="p-3 rounded-2xl border-2 border-slate-200 bg-white">
            <div class="flex items-center gap-2 mb-1"><span class="text-2xl">${x.icono}</span><div><span class="text-[10px] font-black uppercase text-slate-500">Sesión ${i + 1}</span><h4 class="text-sm font-black text-slate-900 font-fun leading-tight">${x.titulo}</h4></div></div>
            <p class="text-[11px] text-slate-700"><strong>Materiales:</strong> ${x.material}</p>
            <p class="text-[11px] text-slate-700 mt-1"><strong>Desarrollo:</strong> ${x.pasos}</p>
          </div>`).join('')}
      </div>
      <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Capacidades que moviliza</span>
      <div class="flex flex-wrap gap-1 mb-4">${cp.capacidades.map(cap => `<span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">🔹 ${cap.nombre}</span>`).join('')}</div>
      <div class="flex flex-wrap gap-2 justify-end">
        <button class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-2 px-3" onclick="this.closest('.modal-overlay').remove(); window.AdminViews.selectedAreaId='${cp.areaId}'; window.AdminViews.selectedCompetencyId='${cp.id}'; window.SidebarModule.navigateTo('capacities')">🎯 Planificar en un aula</button>
        <button class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-xs py-2 px-3" onclick="this.closest('.modal-overlay').remove(); window.SidebarModule.navigateTo('evaluations')">📊 Calificar estudiantes</button>
      </div>`, 'max-w-2xl');
    modal.querySelectorAll('.act-age').forEach(b => b.addEventListener('click', () => {
      const e = parseInt(b.dataset.age, 10);
      modal.querySelectorAll('.act-age').forEach(x => { const t = SM.ageTheme(parseInt(x.dataset.age, 10)); x.className = `act-age px-2.5 py-1 rounded-lg text-xs font-black ${parseInt(x.dataset.age, 10) === e ? t.solid : t.badge}`; });
      modal.querySelector('#act-desempeno').textContent = CU.getDesempeno(compId, e);
    }));
  },

  // =========================================================================
  // 9. MI PERFIL (DIRECTORA O DOCENTE)
  // =========================================================================
  renderProfile(container) {
    const c = this.ctx();
    const SM = window.SchoolManagement;
    const me = c.isAdmin ? SM.getAdmin() : SM.getTeacher(c.teacherId);
    if (!me) { container.innerHTML = ''; return; }

    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('👤', 'Mi Perfil y PIN', c.isAdmin ? 'Tus datos de acceso como Directora / Administradora.' : 'Tus datos de acceso como docente. Tu usuario lo administra la Dirección.')}
        <form id="form-profile" class="bg-white rounded-3xl border-4 border-amber-400 p-6 shadow-xl space-y-4">
          <div class="flex items-center gap-4 pb-4 border-b-2 border-amber-100">
            <div class="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl">${me.avatar || (c.isAdmin ? '🏛️' : '👩‍🏫')}</div>
            <div><h3 class="text-xl font-black text-slate-900 font-fun">${this.esc(me.name)}</h3><p class="text-xs text-slate-600 font-bold">${this.esc(me.title || '')} • Usuario: <span class="font-mono">${this.esc(me.username)}</span></p></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${this.input('pf-name', 'Nombre completo', me.name, { required: true })}
            ${this.input('pf-title', 'Cargo / título', me.title || '')}
            ${this.input('pf-username', 'Usuario de ingreso', me.username || '', { mono: true, readonly: !c.isAdmin, required: c.isAdmin })}
            ${this.input('pf-phone', 'Celular', me.phone || '', { type: 'tel' })}
            ${this.input('pf-email', 'Correo', me.email || '', { type: 'email' })}
          </div>
          ${this.avatarPicker('pf-avatar', me.avatar || (c.isAdmin ? '🏛️' : '👩‍🏫'), this.staffAvatars)}
          <div class="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <h4 class="text-sm font-black text-purple-950 font-fun mb-2">🔑 Cambiar PIN de acceso</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              ${this.input('pf-pin-current', 'PIN actual', '', { type: 'password', mono: true, maxlength: 12 })}
              ${this.input('pf-pin-new', 'Nuevo PIN', '', { type: 'password', mono: true, maxlength: 12, placeholder: '4 a 8 dígitos' })}
              ${this.input('pf-pin-confirm', 'Confirmar nuevo PIN', '', { type: 'password', mono: true, maxlength: 12 })}
            </div>
            <p class="text-[11px] text-purple-800 font-bold mt-2">Deja los campos vacíos si no quieres cambiar tu PIN.</p>
          </div>
          <div class="pt-2 flex justify-end"><button type="submit" class="btn-chunky btn-green text-xs py-2 px-6 shadow">💾 Guardar mi perfil</button></div>
        </form>
      </div>`;

    this.bindAvatarPicker(container, 'pf-avatar');
    container.querySelector('#form-profile').addEventListener('submit', (e) => {
      e.preventDefault();
      const updates = {
        name: container.querySelector('#pf-name').value, title: container.querySelector('#pf-title').value,
        phone: container.querySelector('#pf-phone').value, email: container.querySelector('#pf-email').value,
        avatar: container.querySelector('#pf-avatar-value').value
      };
      if (c.isAdmin) updates.username = container.querySelector('#pf-username').value;
      const cur = container.querySelector('#pf-pin-current').value.trim();
      const nw = container.querySelector('#pf-pin-new').value.trim();
      const cf = container.querySelector('#pf-pin-confirm').value.trim();
      if (nw || cf || cur) {
        if (cur !== String(me.pin)) { this.showToast('El PIN actual no es correcto.', 'error'); return; }
        if (nw.length < 4) { this.showToast('El nuevo PIN debe tener al menos 4 caracteres.', 'error'); return; }
        if (nw !== cf) { this.showToast('El nuevo PIN y su confirmación no coinciden.', 'error'); return; }
        updates.pin = nw;
      }
      const r = c.isAdmin ? SM.updateAdmin(updates) : SM.updateTeacher(c.teacherId, updates);
      if (r && r.error) { this.showToast(r.error, 'error'); return; }
      window.SoundEngine?.playSuccess();
      this.showToast(updates.pin ? 'Perfil y PIN actualizados' : 'Perfil actualizado');
      window.AuthModule.updateHeaderAuthUI();
      window.SidebarModule.renderSidebar();
      this.renderProfile(container);
    });
  },

  // =========================================================================
  // 10. CONFIGURACIÓN DEL COLEGIO (SOLO DIRECCIÓN)
  // =========================================================================
  renderSettings(container) {
    const config = window.AppState.getSchoolConfig();
    const catalog = window.DocenteModule?.mascotCatalog || [{ icon: '🦙', defaultName: 'Kusi', desc: 'Llamita' }];
    const cloud = window.SupabaseService?.isConfigured();

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-6 animate-pop">
        ${this.pageHeader('⚙️', 'Configuración del Colegio', 'Identidad institucional, mascota guía y respaldo de datos. Tu PIN se cambia en "Mi Perfil".')}
        <form id="form-settings" class="bg-white rounded-3xl border-4 border-amber-400 p-6 shadow-xl space-y-4 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${this.input('cfg-school', 'Nombre de la Institución Educativa', config.schoolName)}
            ${this.input('cfg-city', 'Ciudad (para diplomas)', config.certificateCity)}
            ${this.input('cfg-director', 'Nombre de la Directora (firma diplomas)', config.directorName)}
            ${this.input('cfg-mascot-name', 'Nombre de la mascota guía', config.mascotName)}
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mascota guía</label>
            <div id="mascot-grid" class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
              ${catalog.map(m => `<button type="button" data-icon="${m.icon}" data-name="${m.defaultName}" title="${m.desc}" class="mascot-opt w-11 h-11 rounded-xl border-2 text-2xl flex items-center justify-center ${m.icon === config.mascotIcon ? 'border-amber-500 bg-amber-100' : 'border-slate-200 bg-white hover:border-amber-300'}">${m.icon}</button>`).join('')}
            </div>
            <input type="hidden" id="cfg-mascot-icon" value="${config.mascotIcon}">
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button type="button" class="btn-chunky bg-purple-100 text-purple-900 border-purple-300 text-xs py-2 px-4" onclick="window.DocenteModule.openDashboard('settings')">🎓 Diplomas, logo y firmas (avanzado)</button>
            <button type="submit" class="btn-chunky btn-green text-xs py-2 px-6 shadow">💾 Guardar configuración</button>
          </div>
        </form>

        <div class="bg-white rounded-3xl border-3 border-slate-200 p-6 shadow space-y-3">
          <h3 class="text-base font-black text-slate-800 font-fun">💾 Datos y respaldo</h3>
          <p class="text-xs text-slate-600 font-bold">Nube Supabase: ${cloud ? '<span class="text-emerald-700">✅ conectada</span> (estudiantes, notas y estructura se sincronizan)' : '<span class="text-rose-700">sin conexión</span> (solo este dispositivo)'}.</p>
          <div class="flex flex-wrap gap-2">
            <button class="btn-chunky bg-sky-100 text-sky-900 border-sky-300 text-xs py-2 px-4" id="btn-export-backup">📤 Exportar respaldo (JSON)</button>
            <label class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-xs py-2 px-4 cursor-pointer">📥 Importar respaldo<input type="file" id="file-import-backup" accept="application/json" class="hidden"></label>
            <button class="btn-chunky bg-rose-50 text-rose-800 border-rose-200 text-xs py-2 px-4" id="btn-reset-demo">🧹 Restablecer datos de demostración</button>
          </div>
        </div>
      </div>`;

    container.querySelectorAll('.mascot-opt').forEach(b => b.addEventListener('click', () => {
      container.querySelectorAll('.mascot-opt').forEach(x => x.className = x.className.replace('border-amber-500 bg-amber-100', 'border-slate-200 bg-white hover:border-amber-300'));
      b.className = b.className.replace('border-slate-200 bg-white hover:border-amber-300', 'border-amber-500 bg-amber-100');
      container.querySelector('#cfg-mascot-icon').value = b.dataset.icon;
      const nameInput = container.querySelector('#cfg-mascot-name');
      if (nameInput && (!nameInput.value || catalog.some(m => m.defaultName === nameInput.value))) nameInput.value = b.dataset.name;
    }));
    container.querySelector('#form-settings').addEventListener('submit', (e) => {
      e.preventDefault();
      window.AppState.updateSchoolConfig({
        schoolName: container.querySelector('#cfg-school').value, certificateCity: container.querySelector('#cfg-city').value,
        directorName: container.querySelector('#cfg-director').value, mascotName: container.querySelector('#cfg-mascot-name').value,
        mascotIcon: container.querySelector('#cfg-mascot-icon').value
      });
      window.SoundEngine?.playSuccess();
      this.showToast('Configuración guardada');
      window.App.applySchoolConfig();
      window.SidebarModule.renderSidebar();
      window.Kusi?.render('#mascot-host');
    });
    container.querySelector('#btn-export-backup').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(window.AppState.state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `respaldo_cneb_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      this.showToast('Respaldo descargado');
    });
    container.querySelector('#file-import-backup').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || !Array.isArray(data.students)) throw new Error('formato');
          this.confirmDialog('Importar respaldo', 'Se reemplazarán todos los datos de este dispositivo por los del archivo. ¿Continuar?', () => {
            window.AppState.state = { ...window.AppState.getDefaultState(), ...data };
            window.AppState.saveState();
            window.SchoolManagement.init();
            this.showToast('Respaldo importado');
            window.location.reload();
          });
        } catch (err) { this.showToast('El archivo no es un respaldo válido.', 'error'); }
      };
      reader.readAsText(file);
    });
    container.querySelector('#btn-reset-demo').addEventListener('click', () => {
      this.confirmDialog('Restablecer datos', 'Se borrarán aulas, docentes, estudiantes y notas de este dispositivo y volverán los datos de ejemplo. ¿Continuar?', () => {
        localStorage.removeItem(window.AppState.storageKey);
        localStorage.removeItem(window.AuthModule.storageKey);
        window.location.reload();
      });
    });
  }
};
