/**
 * MÓDULO DE AUTENTICACIÓN Y CONTROL DE ACCESO INSTITUCIONAL (CNEB INICIAL)
 *
 * 3 perfiles independientes, cada uno con su propio usuario:
 *   🏛️ Administrador / Directora → usuario + PIN del perfil de administración (adminProfile).
 *   👩‍🏫 Docente de aula          → cada docente tiene su usuario y PIN (teachers[]).
 *   🎒 Estudiante / Familia      → usuario (apellido.inicial) + PIN entregados por la docente.
 *
 * Todos los usuarios tienen el formato apellido.inicial (ej. gomez.v) y nadie ingresa sin usuario + PIN.
 * Nunca se crea una sesión automática: al abrir la app sin sesión se muestra el selector de perfil.
 * El personal puede "entrar como" un estudiante (modo supervisión) y volver a su propio panel.
 */

window.AuthModule = {
  storageKey: 'cneb_active_session_v3',
  currentSession: null,

  cleanString(str) {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  },

  init() {
    this.loadSession();
    this.validateSession();
    this.updateHeaderAuthUI();
  },

  loadSession() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.currentSession = saved ? JSON.parse(saved) : null;
    } catch (e) {
      this.currentSession = null;
    }
  },

  // Si el usuario de la sesión ya no existe (docente eliminado, alumno retirado) se cierra la sesión
  validateSession() {
    const s = this.currentSession;
    if (!s) return;
    let valid = true;
    if (s.role === 'docente' && !window.SchoolManagement?.getTeacher(s.teacherId)) valid = false;
    if (s.role === 'estudiante' || s.role === 'familia') {
      const st = window.AppState?.state?.students?.find(x => x.id === s.studentId || (x.legacyId && x.legacyId === s.studentId));
      if (!st) valid = false;
      else { s.studentId = st.id; window.AppState.switchStudent(st.id); }
    }
    if (!valid) {
      this.currentSession = null;
      localStorage.removeItem(this.storageKey);
    }
  },

  saveSession(session) {
    this.currentSession = session;
    if (session) localStorage.setItem(this.storageKey, JSON.stringify(session));
    else localStorage.removeItem(this.storageKey);
    this.updateHeaderAuthUI();
    window.dispatchEvent(new CustomEvent('cneb:session-changed', { detail: session }));
  },

  logout(openSelector = true) {
    window.SoundEngine?.playPop();
    this.saveSession(null);
    const main = document.getElementById('app-main-content');
    if (main) main.innerHTML = '';
    if (openSelector) this.openRoleSelectorModal('admin');
  },

  // === CONSULTAS DE ROL ===
  isAdmin() { return !!this.currentSession && this.currentSession.role === 'admin'; },
  isPureTeacher() { return !!this.currentSession && this.currentSession.role === 'docente'; },
  isTeacher() { return this.isAdmin() || this.isPureTeacher(); },
  isStaff() { return this.isTeacher(); },
  isFamily() { return !!this.currentSession && (this.currentSession.role === 'estudiante' || this.currentSession.role === 'familia'); },
  isImpersonating() { return !!this.currentSession && !!this.currentSession.impersonatedBy; },

  getRole() { return this.currentSession ? this.currentSession.role : null; },

  getCurrentStudentId() {
    return this.currentSession && this.currentSession.studentId ? this.currentSession.studentId : null;
  },

  getDisplayName() {
    const s = this.currentSession;
    if (!s) return 'Sin sesión';
    if (s.role === 'admin') return window.SchoolManagement?.getAdmin()?.name || s.name || 'Administración';
    if (s.role === 'docente') return window.SchoolManagement?.getTeacher(s.teacherId)?.name || s.teacherName || 'Docente';
    const st = window.AppState?.getCurrentStudent();
    return st ? st.name : (s.studentName || 'Estudiante');
  },

  // === MODO SUPERVISIÓN (ENTRAR COMO ESTUDIANTE / DOCENTE) ===
  impersonateStudent(studentId) {
    if (!this.isStaff()) return;
    const student = window.AppState.state.students.find(s => s.id === studentId);
    if (!student) return;
    const origin = this.currentSession.impersonatedBy || this.currentSession;

    window.AppState.switchStudent(student.id);
    this.saveSession({
      role: 'estudiante',
      studentId: student.id,
      studentName: student.name,
      avatar: student.avatar,
      loginTime: new Date().toISOString(),
      impersonatedBy: origin
    });

    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    window.SoundEngine?.playSuccess();
    window.Kusi?.say(`👑 Modo Supervisión: viendo la app como ${student.name.split(' ')[0]}.`);
    window.SidebarModule?.navigateTo('games');
  },

  impersonateTeacher(teacherId) {
    if (!this.isAdmin()) return;
    const teacher = window.SchoolManagement.getTeacher(teacherId);
    if (!teacher) return;
    const origin = this.currentSession.impersonatedBy || this.currentSession;
    this.saveSession({
      role: 'docente',
      teacherId: teacher.id,
      teacherName: teacher.name,
      loginTime: new Date().toISOString(),
      impersonatedBy: origin
    });
    window.SoundEngine?.playSuccess();
    window.Kusi?.say(`Viendo la plataforma como ${teacher.name}.`);
    window.SidebarModule?.navigateTo('dashboard');
  },

  exitImpersonation() {
    window.SoundEngine?.playPop();
    const origin = this.currentSession?.impersonatedBy;
    if (!origin) { this.logout(); return; }
    this.saveSession({ ...origin, loginTime: new Date().toISOString() });
    this.routeAfterLogin();
  },

  routeAfterLogin() {
    if (!window.SidebarModule) return;
    if (this.isAdmin() || this.isPureTeacher()) window.SidebarModule.navigateTo('dashboard');
    else if (this.isFamily()) window.SidebarModule.navigateTo('games');
  },

  // =========================================================================
  // BARRA SUPERIOR: INSIGNIA DEL PERFIL ACTIVO
  // =========================================================================
  updateHeaderAuthUI() {
    const badge = document.getElementById('header-auth-badge');
    const starCount = document.getElementById('star-count');
    if (!badge) return;

    const bindLogout = () => {
      document.getElementById('btn-auth-logout')?.addEventListener('click', (e) => { e.stopPropagation(); this.logout(); });
      document.getElementById('btn-exit-impersonate')?.addEventListener('click', (e) => { e.stopPropagation(); this.exitImpersonation(); });
    };

    if (!this.currentSession) {
      badge.innerHTML = `
        <button id="btn-open-login" class="btn-chunky bg-amber-400 text-amber-950 border-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow">
          <span>🔑</span><span>Ingresar</span>
        </button>`;
      document.getElementById('btn-open-login')?.addEventListener('click', () => this.openRoleSelectorModal('admin'));
      if (starCount) starCount.textContent = '★';
      return;
    }

    if (this.isImpersonating()) {
      const origin = this.currentSession.impersonatedBy;
      const label = this.isFamily() ? `Alumno: ${this.getDisplayName().split(' ')[0]}` : `Docente: ${this.getDisplayName().split(' ').slice(0, 2).join(' ')}`;
      badge.innerHTML = `
        <div class="flex items-center gap-2 bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border-2 border-yellow-400">
          <span>👑 ${label}</span>
          <button id="btn-exit-impersonate" class="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow">
            Volver a mi panel (${origin.role === 'admin' ? 'Directora' : 'Docente'})
          </button>
        </div>`;
      bindLogout();
      const st = window.AppState.getCurrentStudent();
      if (starCount) starCount.textContent = this.isFamily() && st ? (st.stars || 0) : '★';
      return;
    }

    if (this.isAdmin()) {
      badge.innerHTML = `
        <div class="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-800 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-purple-300">
          <span>🏛️</span><span class="hidden sm:inline max-w-[160px] truncate">${this.getDisplayName()}</span>
          <button id="btn-auth-logout" class="ml-1 bg-purple-950 hover:bg-black px-2 py-0.5 rounded-full text-[10px]" title="Cerrar sesión">Salir 🚪</button>
        </div>`;
      bindLogout();
      if (starCount) starCount.textContent = '★';
      return;
    }

    if (this.isPureTeacher()) {
      badge.innerHTML = `
        <div class="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-amber-300">
          <span>👩‍🏫</span><span class="hidden sm:inline max-w-[160px] truncate">${this.getDisplayName()}</span>
          <button id="btn-auth-logout" class="ml-1 bg-amber-950 hover:bg-black px-2 py-0.5 rounded-full text-[10px]" title="Cerrar sesión">Salir 🚪</button>
        </div>`;
      bindLogout();
      if (starCount) starCount.textContent = '★';
      return;
    }

    const student = window.AppState.getCurrentStudent();
    badge.innerHTML = `
      <div class="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-emerald-300">
        <span class="text-lg">${student ? student.avatar : '👧'}</span>
        <span class="max-w-[130px] truncate font-fun text-sm">${student ? student.name.split(' ')[0] : 'Estudiante'}</span>
        <button id="btn-auth-logout" class="ml-1.5 bg-emerald-800 hover:bg-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-bold" title="Cerrar sesión">Salir 🚪</button>
      </div>`;
    bindLogout();
    if (starCount) starCount.textContent = student ? (student.stars || 0) : 0;
  },

  // =========================================================================
  // SELECTOR DE PERFIL (ADMIN / DOCENTE / ESTUDIANTE)
  // =========================================================================
  openRoleSelectorModal(defaultTab = 'admin') {
    window.SoundEngine?.playPop();
    const config = window.AppState ? window.AppState.getSchoolConfig() : {};
    const activeYear = window.SchoolManagement ? window.SchoolManagement.getActiveYear() : '2026';

    document.getElementById('auth-role-modal')?.remove();
    const canClose = !!this.currentSession;

    const modal = document.createElement('div');
    modal.id = 'auth-role-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-2xl mx-auto flex flex-col text-center border-4 border-amber-400 shadow-2xl animate-pop max-h-[92vh] relative">
        ${canClose ? `<button id="btn-close-auth-x" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg shadow-sm" title="Cerrar">✕</button>` : ''}

        <div class="flex items-center justify-center gap-3 mb-3">
          <span class="text-5xl animate-bounce-soft">${config.mascotIcon || '🦙'}</span>
          <div class="text-left">
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 font-fun leading-tight">${config.appTitle || 'Matemática Kusi'}</h2>
            <p class="text-xs text-amber-800 font-bold">${config.schoolName || ''} • Año ${activeYear}</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 mb-4 font-semibold">¿Quién va a ingresar hoy?</p>

        <div class="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
          <button data-tab="admin" class="auth-tab py-2.5 px-2 rounded-xl font-black font-fun text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-700 hover:bg-white"><span class="text-lg">🏛️</span><span>Directora</span></button>
          <button data-tab="docente" class="auth-tab py-2.5 px-2 rounded-xl font-black font-fun text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-700 hover:bg-white"><span class="text-lg">👩‍🏫</span><span>Docentes</span></button>
          <button data-tab="estudiante" class="auth-tab py-2.5 px-2 rounded-xl font-black font-fun text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-700 hover:bg-white"><span class="text-lg">🎒</span><span>Estudiantes</span></button>
        </div>

        <div id="role-tab-content" class="overflow-y-auto pr-1 flex-1"></div>

        <div class="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span><span>Plataforma CNEB Ciclo II (3, 4 y 5 Años)</span></div>
          <span class="text-[10px] text-slate-400">Educación Inicial Perú 🇵🇪</span>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const activeClasses = { admin: 'bg-purple-700 text-white shadow-md', docente: 'bg-amber-600 text-white shadow-md', estudiante: 'bg-emerald-600 text-white shadow-md' };
    const setTab = (tab) => {
      modal.querySelectorAll('.auth-tab').forEach(b => {
        const base = 'auth-tab py-2.5 px-2 rounded-xl font-black font-fun text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ';
        b.className = base + (b.dataset.tab === tab ? activeClasses[tab] : 'text-slate-700 hover:bg-white');
      });
      this.renderRoleTab(tab, modal);
    };

    modal.querySelectorAll('.auth-tab').forEach(b => b.addEventListener('click', () => { window.SoundEngine?.playPop(); setTab(b.dataset.tab); }));
    document.getElementById('btn-close-auth-x')?.addEventListener('click', () => { window.SoundEngine?.playPop(); modal.remove(); });
    setTab(defaultTab === 'familia' ? 'estudiante' : defaultTab);
  },

  renderRoleTab(tab, modal) {
    const content = modal.querySelector('#role-tab-content');
    if (!content) return;
    const SM = window.SchoolManagement;

    const shake = (input, errId) => {
      window.SoundEngine?.playGentleTryAgain();
      modal.querySelector(errId)?.classList.remove('hidden');
      input?.classList.add('border-red-500', 'animate-wiggle');
      setTimeout(() => input?.classList.remove('animate-wiggle'), 500);
    };

    if (tab === 'admin') {
      const admin = SM.getAdmin();
      content.innerHTML = `
        <div class="space-y-3 max-w-sm mx-auto py-2">
          <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl mx-auto shadow">${admin.avatar || '🏛️'}</div>
          <div>
            <h3 class="text-xl font-black text-purple-950 font-fun">Acceso de Dirección</h3>
            <p class="text-xs text-slate-600 font-semibold">Gestión de aulas, docentes, matrícula anual y configuración.</p>
          </div>
          <div class="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 text-left space-y-2">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1">Usuario</label>
              <input type="text" id="admin-user-input" autocomplete="username" autocapitalize="none" placeholder="apellido.inicial" class="w-full p-2 border-2 border-purple-300 rounded-xl font-mono font-bold text-sm bg-white text-slate-900 outline-none focus:border-purple-600 lowercase">
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1">PIN de Administración</label>
              <input type="password" id="admin-pin-input" maxlength="12" autocomplete="current-password" class="w-full text-center text-2xl font-black p-2 border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:outline-none bg-white text-purple-950 tracking-widest" placeholder="••••">
              <span id="admin-pin-error" class="text-xs text-rose-600 font-bold hidden mt-1 block text-center">Usuario o PIN incorrectos.</span>
            </div>
          </div>
          <button id="btn-submit-admin" class="btn-chunky bg-purple-700 text-white border-purple-400 hover:bg-purple-800 w-full text-base py-3 shadow-lg flex items-center justify-center gap-2"><span>🔓</span><span>Ingresar al Panel Directivo</span></button>
          <p class="text-[10px] text-slate-400">Cambia tu usuario y PIN desde "Mi Perfil" una vez dentro.</p>
        </div>`;
      const pinInput = content.querySelector('#admin-pin-input');
      const userInput = content.querySelector('#admin-user-input');
      userInput?.focus();
      userInput?.addEventListener('keydown', e => { if (e.key === 'Enter') pinInput?.focus(); });
      const submit = () => {
        if (userInput.value.trim() && SM.verifyAdmin(userInput.value, pinInput.value)) {
          window.SoundEngine?.playSuccess();
          this.saveSession({ role: 'admin', adminId: admin.id, name: admin.name, loginTime: new Date().toISOString() });
          modal.remove();
          this.routeAfterLogin();
          window.Kusi?.celebrate(`¡Bienvenida, ${admin.name}!`);
        } else shake(pinInput, '#admin-pin-error');
      };
      content.querySelector('#btn-submit-admin')?.addEventListener('click', submit);
      pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      return;
    }

    if (tab === 'docente') {
      const teachers = SM.getTeachers();
      content.innerHTML = `
        <div class="space-y-3 max-w-sm mx-auto py-2">
          <div class="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl mx-auto shadow">👩‍🏫</div>
          <div>
            <h3 class="text-xl font-black text-amber-950 font-fun">Acceso para Docentes</h3>
            <p class="text-xs text-slate-600 font-semibold">Escribe tu usuario (apellido.inicial) y el PIN que te entregó la Dirección.</p>
          </div>
          ${teachers.length === 0 ? `<div class="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-900 font-bold">Aún no hay docentes registrados. La Directora debe crearlos en "Docentes y Usuarios".</div>` : `
          <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-left space-y-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-1">Usuario</label>
              <input type="text" id="teacher-user-input" autocomplete="username" autocapitalize="none" placeholder="Ej. delgadillo.c" class="w-full p-2.5 border-2 border-amber-300 rounded-xl font-mono font-bold text-sm bg-white text-slate-900 outline-none focus:border-amber-600 lowercase">
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-1">PIN de Docente</label>
              <input type="password" id="teacher-pin-input" maxlength="12" autocomplete="current-password" placeholder="••••" class="w-full text-center text-2xl font-black p-2 border-2 border-amber-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white text-slate-900 tracking-widest">
              <span id="teacher-pin-error" class="text-xs text-rose-600 font-bold hidden mt-1 block text-center">Usuario o PIN incorrectos. Consulta con la Dirección.</span>
            </div>
            <button id="btn-submit-teacher" class="btn-chunky btn-yellow w-full text-base py-3 shadow-lg flex items-center justify-center gap-2"><span>🔓</span><span>Ingresar a mis Aulas</span></button>
          </div>`}
        </div>`;
      const userInput = content.querySelector('#teacher-user-input');
      const pinInput = content.querySelector('#teacher-pin-input');
      userInput?.focus();
      const submit = () => {
        const teacher = SM.getTeacherByUsername((userInput?.value || '').trim().toLowerCase());
        if (teacher && teacher.active !== false && SM.verifyTeacher(teacher.id, pinInput.value)) {
          window.SoundEngine?.playSuccess();
          this.saveSession({ role: 'docente', teacherId: teacher.id, teacherName: teacher.name, loginTime: new Date().toISOString() });
          modal.remove();
          this.routeAfterLogin();
          window.Kusi?.celebrate(`¡Hola ${teacher.name}!`);
        } else shake(pinInput, '#teacher-pin-error');
      };
      content.querySelector('#btn-submit-teacher')?.addEventListener('click', submit);
      userInput?.addEventListener('keydown', e => { if (e.key === 'Enter') pinInput?.focus(); });
      pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      return;
    }

    // === ESTUDIANTES Y FAMILIAS: usuario (apellido.inicial) + PIN entregados por la docente ===
    content.innerHTML = `
      <div class="space-y-3 max-w-sm mx-auto py-2">
        <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl mx-auto shadow">🎒</div>
        <div>
          <h3 class="text-xl font-black text-emerald-950 font-fun">Niñas, Niños y Familias</h3>
          <p class="text-xs text-slate-600 font-semibold">Escribe el usuario y el PIN que te entregó la profesora.</p>
        </div>
        <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-left space-y-3">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-emerald-950 mb-1">Usuario del estudiante</label>
            <input type="text" id="student-user-input" autocomplete="username" autocapitalize="none" placeholder="Ej. gomez.v" class="w-full p-2.5 border-2 border-emerald-300 rounded-xl font-mono font-bold text-sm bg-white text-slate-900 outline-none focus:border-emerald-600 lowercase">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-emerald-950 mb-1">PIN</label>
            <input type="password" id="student-pin-input" inputmode="numeric" maxlength="12" autocomplete="current-password" placeholder="••••" class="w-full text-center text-2xl font-black p-2 border-2 border-emerald-300 rounded-xl focus:border-emerald-600 focus:outline-none bg-white text-slate-900 tracking-widest">
            <span id="student-pin-error" class="text-xs text-rose-600 font-bold hidden mt-1 block text-center">Usuario o PIN incorrectos. Pídele a tu profesora tus accesos.</span>
          </div>
          <button id="btn-submit-student" class="btn-chunky btn-green w-full text-base py-3 shadow-lg flex items-center justify-center gap-2"><span>🚀</span><span>¡Entrar a jugar!</span></button>
        </div>
        <p class="text-[10px] text-slate-400">El usuario tiene la forma apellido.inicial (por ejemplo: flores.c) y el PIN son 4 números.</p>
      </div>`;
    const sUser = content.querySelector('#student-user-input');
    const sPin = content.querySelector('#student-pin-input');
    sUser?.focus();
    const submitStudent = () => {
      const user = (sUser?.value || '').trim().toLowerCase();
      const pin = (sPin?.value || '').trim();
      const student = this.verifyStudent(user, pin);
      if (student) this.loginAsStudent(student.id);
      else shake(sPin, '#student-pin-error');
    };
    content.querySelector('#btn-submit-student')?.addEventListener('click', submitStudent);
    sUser?.addEventListener('keydown', e => { if (e.key === 'Enter') sPin?.focus(); });
    sPin?.addEventListener('keydown', e => { if (e.key === 'Enter') submitStudent(); });
  },

  // Verifica usuario + PIN de un estudiante activo (acepta el usuario anterior mientras dure la transición)
  verifyStudent(username, pin) {
    if (!username || !pin) return null;
    const students = window.AppState?.state?.students || [];
    const student = students.find(s => String(s.id || '').toLowerCase() === username || (s.legacyId && String(s.legacyId).toLowerCase() === username));
    if (!student || student.status === 'retirado' || !student.pin) return null;
    return String(student.pin) === pin ? student : null;
  },

  loginAsStudent(studentId) {
    const student = window.AppState.state.students.find(s => s.id === studentId);
    if (!student) return;
    window.AppState.switchStudent(student.id);
    this.saveSession({ role: 'estudiante', studentId: student.id, studentName: student.name, avatar: student.avatar, loginTime: new Date().toISOString() });
    document.getElementById('auth-role-modal')?.remove();
    window.SoundEngine?.playSuccess();
    window.Kusi?.celebrate(`¡Hola ${student.name.split(' ')[0]}! ¡A divertirnos con Matemática!`);
    this.routeAfterLogin();
  },

  openLoginModal(defaultTab = 'admin') {
    this.openRoleSelectorModal(defaultTab);
  }
};
