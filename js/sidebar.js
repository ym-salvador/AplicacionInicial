/**
 * BARRA LATERAL (SIDEBAR) RESPONSIVA Y SENSIBLE AL ROL
 * Cada perfil ve únicamente los módulos que le corresponden:
 *   🏛️ Directora: gestión completa, pedagogía, comprobación, perfil y configuración.
 *   👩‍🏫 Docente: su panel, sus aulas y estudiantes, planificación, evaluación y perfil.
 *   🎒 Estudiante: sus aventuras y su progreso.
 */

window.SidebarModule = {
  isCollapsed: false,
  isMobileOpen: false,
  activeView: 'dashboard',

  menus: {
    admin: [
      { section: 'Gestión Institucional' },
      { id: 'dashboard', icon: '🏛️', label: 'Panel Institucional' },
      { id: 'classrooms', icon: '🏫', label: 'Aulas y Año Lectivo' },
      { id: 'teachers', icon: '👩‍🏫', label: 'Docentes y Usuarios' },
      { id: 'students', icon: '🎒', label: 'Matrícula de Estudiantes' },
      { section: 'Pedagogía CNEB' },
      { id: 'curriculum', icon: '📚', label: 'Malla Curricular CNEB' },
      { id: 'capacities', icon: '🎯', label: 'Planificar Sesiones' },
      { id: 'evaluations', icon: '📊', label: 'Evaluación & SIAGIE' },
      { id: 'progress', icon: '📈', label: 'Progreso: Antes y Después' },
      { id: 'monitoring', icon: '📋', label: 'Monitoreo y Fichas' },
      { section: 'Aventuras' },
      { id: 'games', icon: '🎮', label: 'Mundos y Retos', tag: 'Comprobar' },
      { section: 'Mi Cuenta' },
      { id: 'profile', icon: '👤', label: 'Mi Perfil y PIN' },
      { id: 'settings', icon: '⚙️', label: 'Configuración del Colegio' }
    ],
    docente: [
      { section: 'Mi Aula' },
      { id: 'dashboard', icon: '🏠', label: 'Mi Panel Docente' },
      { id: 'students', icon: '🎒', label: 'Mis Estudiantes' },
      { id: 'classrooms', icon: '🏫', label: 'Mis Aulas' },
      { section: 'Pedagogía CNEB' },
      { id: 'curriculum', icon: '📚', label: 'Malla Curricular CNEB' },
      { id: 'capacities', icon: '🎯', label: 'Planificar Sesiones' },
      { id: 'evaluations', icon: '📊', label: 'Evaluación & SIAGIE' },
      { id: 'progress', icon: '📈', label: 'Progreso: Antes y Después' },
      { id: 'monitoring', icon: '📋', label: 'Monitoreo y Fichas' },
      { section: 'Aventuras' },
      { id: 'games', icon: '🎮', label: 'Mundos y Retos', tag: 'Comprobar' },
      { section: 'Mi Cuenta' },
      { id: 'profile', icon: '👤', label: 'Mi Perfil y PIN' }
    ],
    estudiante: [
      { section: 'Mis Aventuras' },
      { id: 'games', icon: '🎮', label: 'Jugar Mundos' },
      { id: 'progress', icon: '⭐', label: 'Mi Progreso y Diploma' }
    ]
  },

  init() {
    this.renderSidebar();
    this.attachEvents();
    window.addEventListener('cneb:session-changed', () => this.renderSidebar());
    window.addEventListener('cneb:year-changed', () => {
      this.renderSidebar();
      if (window.AdminViews) window.AdminViews.selectedClassroomId = null;
      if (window.AuthModule?.isStaff()) this.navigateTo(this.activeView);
    });
    window.addEventListener('cneb:structure-changed', () => this.renderSidebar());
    window.addEventListener('cneb:config-updated', () => this.renderSidebar());
  },

  renderSidebar() {
    const host = document.getElementById('sidebar-container');
    if (!host) return;

    const session = window.AuthModule ? window.AuthModule.currentSession : null;
    const role = session ? (session.role === 'familia' ? 'estudiante' : session.role) : null;
    const config = window.AppState ? window.AppState.getSchoolConfig() : {};
    const SM = window.SchoolManagement;
    const activeYear = SM ? SM.getActiveYear() : '2026';
    const years = SM ? SM.getYears() : ['2026'];

    let userName = 'Sin iniciar sesión', userAvatar = '👤', userSubtitle = 'Toca "Ingresar"', roleBadge = '';
    if (role === 'admin') {
      const admin = SM.getAdmin();
      userName = admin.name; userAvatar = admin.avatar || '🏛️'; userSubtitle = admin.title || 'Directora';
      roleBadge = '<span class="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">Directora</span>';
    } else if (role === 'docente') {
      const t = SM.getTeacher(session.teacherId);
      const aulas = SM.getClassroomsForTeacher(session.teacherId);
      userName = t ? t.name : session.teacherName; userAvatar = t?.avatar || '👩‍🏫';
      userSubtitle = aulas.length ? aulas.map(c => c.name).join(' • ') : 'Sin aula asignada';
      roleBadge = '<span class="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">Docente</span>';
    } else if (role === 'estudiante') {
      const st = window.AppState.getCurrentStudent();
      const aula = st ? SM.getClassroom(st.classroomId) : null;
      const th = SM.ageTheme(st?.age || 5);
      userName = st ? st.name : 'Estudiante'; userAvatar = st?.avatar || '🦙';
      userSubtitle = aula ? aula.name : `Aula ${th.label}`;
      roleBadge = `<span class="text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${th.badge}">${th.label}</span>`;
    }

    const items = role ? (this.menus[role] || []) : [];
    const navHtml = items.map(it => {
      if (it.section) return `<div class="sidebar-text px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-amber-800">${it.section}</div>`;
      return `
        <button class="sidebar-nav-btn ${this.activeView === it.id ? 'active' : ''}" data-view="${it.id}" title="${it.label}">
          <span class="text-xl">${it.icon}</span>
          <span class="sidebar-text">${it.label}</span>
          ${it.tag ? `<span class="sidebar-text text-[9px] bg-purple-200 text-purple-950 font-black px-1.5 py-0.5 rounded ml-auto">${it.tag}</span>` : ''}
        </button>`;
    }).join('');

    const yearBox = role === 'admin' ? `
      <div class="sidebar-year-box mt-2 flex items-center justify-between px-2 py-1 rounded-xl bg-amber-100/70 text-xs font-bold text-amber-950">
        <span class="text-[11px]">📅 Año Lectivo</span>
        <select id="select-sidebar-year" class="bg-white border border-amber-300 rounded-lg text-xs font-black px-2 py-0.5 text-amber-900 cursor-pointer shadow-sm outline-none">
          ${years.map(y => `<option value="${y}" ${String(y) === String(activeYear) ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>` : (role === 'docente' ? `
      <div class="sidebar-year-box mt-2 flex items-center justify-between px-2 py-1 rounded-xl bg-amber-100/70 text-xs font-bold text-amber-950">
        <span class="text-[11px]">📅 Año Lectivo</span><span class="font-black">${activeYear}</span>
      </div>` : '');

    host.innerHTML = `
      <aside id="app-sidebar" class="app-sidebar ${this.isCollapsed ? 'collapsed' : ''} sidebar-role-${role || 'none'}">
        <div class="p-4 border-b-2 border-amber-200 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 overflow-hidden cursor-pointer" id="sidebar-logo">
            <span class="text-3xl animate-bounce-soft shrink-0">${config.mascotIcon || '🦙'}</span>
            <div class="sidebar-header-details min-w-0">
              <h2 class="text-base font-black text-amber-950 font-fun truncate leading-tight">${config.appTitle || 'Matemática Kusi'}</h2>
              <p class="text-[10px] font-bold text-amber-700 truncate">${config.schoolName || ''}</p>
            </div>
          </div>
          <button id="btn-sidebar-toggle" class="p-1.5 rounded-xl hover:bg-amber-100 text-slate-600 transition-colors hidden lg:block" title="${this.isCollapsed ? 'Expandir' : 'Colapsar'} menú">
            <span class="text-lg">${this.isCollapsed ? '➡️' : '⬅️'}</span>
          </button>
        </div>

        <div class="p-3 border-b border-amber-100 bg-amber-50/50">
          <div class="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-amber-200 shadow-sm ${role ? 'cursor-pointer hover:border-amber-400' : ''}" id="sidebar-profile-card">
            <div class="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl shrink-0 shadow-inner">${userAvatar}</div>
            <div class="sidebar-text min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <span class="text-xs font-black text-slate-800 truncate">${userName}</span>${roleBadge}
              </div>
              <p class="text-[10px] text-slate-500 font-bold truncate mt-0.5">${userSubtitle}</p>
            </div>
          </div>
          ${yearBox}
        </div>

        <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          ${role ? navHtml : `
            <div class="p-4 text-center">
              <p class="text-xs text-slate-500 font-bold mb-3">Elige tu perfil para comenzar.</p>
              <button id="btn-sidebar-login" class="btn-chunky btn-yellow w-full text-sm py-2">🔑 Ingresar</button>
            </div>`}
        </nav>

        <div class="p-3 border-t-2 border-amber-200 bg-amber-50/60 flex items-center justify-between gap-2">
          <button id="btn-sidebar-sound" class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-amber-100 text-slate-700 shadow-sm" title="Alternar sonido">
            <span id="sidebar-sound-icon" class="text-lg">${window.SoundEngine?.isMuted ? '🔇' : '🔊'}</span>
          </button>
          ${role ? `
            ${window.AuthModule?.isImpersonating() ? `
              <button id="btn-sidebar-exit-imp" class="sidebar-text flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 font-fun font-bold text-xs hover:bg-purple-200 shadow-sm">
                <span>👑</span><span>Volver a mi panel</span>
              </button>` : `
              <button id="btn-sidebar-logout" class="sidebar-text flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-fun font-bold text-xs hover:bg-rose-200 shadow-sm">
                <span>🚪</span><span>Cerrar Sesión</span>
              </button>`}` : ''}
        </div>
      </aside>`;

    host.querySelectorAll('.sidebar-nav-btn').forEach(b => b.addEventListener('click', () => this.navigateTo(b.dataset.view)));
    host.querySelector('#sidebar-logo')?.addEventListener('click', () => { if (role) this.navigateTo(role === 'estudiante' ? 'games' : 'dashboard'); });
    host.querySelector('#sidebar-profile-card')?.addEventListener('click', () => { if (role === 'admin' || role === 'docente') this.navigateTo('profile'); else if (role === 'estudiante') this.navigateTo('progress'); });
    host.querySelector('#btn-sidebar-toggle')?.addEventListener('click', () => { window.SoundEngine?.playPop(); this.toggleCollapse(); });
    host.querySelector('#btn-sidebar-login')?.addEventListener('click', () => window.AuthModule.openRoleSelectorModal('admin'));
    host.querySelector('#btn-sidebar-logout')?.addEventListener('click', () => window.AuthModule.logout());
    host.querySelector('#btn-sidebar-exit-imp')?.addEventListener('click', () => window.AuthModule.exitImpersonation());
    host.querySelector('#select-sidebar-year')?.addEventListener('change', (e) => { window.SoundEngine?.playPop(); window.SchoolManagement.setActiveYear(e.target.value); });
    host.querySelector('#btn-sidebar-sound')?.addEventListener('click', () => {
      if (!window.SoundEngine) return;
      window.SoundEngine.isMuted = !window.SoundEngine.isMuted;
      const icon = document.getElementById('sidebar-sound-icon');
      if (icon) icon.textContent = window.SoundEngine.isMuted ? '🔇' : '🔊';
      if (!window.SoundEngine.isMuted) { window.SoundEngine.playPop(); window.Kusi?.say('¡Sonido activado!'); }
    });
  },

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    document.getElementById('app-sidebar')?.classList.toggle('collapsed', this.isCollapsed);
    const btn = document.getElementById('btn-sidebar-toggle');
    if (btn) btn.innerHTML = `<span class="text-lg">${this.isCollapsed ? '➡️' : '⬅️'}</span>`;
  },

  toggleMobile() {
    this.isMobileOpen = !this.isMobileOpen;
    document.getElementById('app-sidebar')?.classList.toggle('mobile-open', this.isMobileOpen);
    document.getElementById('sidebar-backdrop')?.classList.toggle('active', this.isMobileOpen);
  },

  closeMobile() {
    this.isMobileOpen = false;
    document.getElementById('app-sidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebar-backdrop')?.classList.remove('active');
  },

  // Vistas permitidas por rol (defensa adicional a la del menú)
  canAccess(viewName) {
    const role = window.AuthModule?.getRole();
    if (!role) return false;
    const r = role === 'familia' ? 'estudiante' : role;
    return (this.menus[r] || []).some(it => it.id === viewName);
  },

  navigateTo(viewName) {
    window.SoundEngine?.playPop();
    if (!window.AuthModule?.currentSession) { window.AuthModule?.openRoleSelectorModal('admin'); return; }
    if (!this.canAccess(viewName)) {
      viewName = window.AuthModule.isFamily() ? 'games' : 'dashboard';
    }
    this.closeMobile();

    // Vistas que abren un modal sin cambiar de pantalla
    if (viewName === 'progress' && window.AuthModule.isFamily()) { window.FamiliaModule?.openPortal(); return; }
    if (viewName === 'monitoring') { window.DocenteModule?.openDashboard('monitoring'); return; }

    this.activeView = viewName;
    this.renderSidebar();
    window.scrollTo({ top: 0 });
    if (viewName === 'games' && window.AuthModule.isFamily()) { window.App.showHome(); return; }
    window.AdminViews?.renderView(viewName);
  },

  attachEvents() {
    document.getElementById('sidebar-backdrop')?.addEventListener('click', () => this.closeMobile());
  }
};
