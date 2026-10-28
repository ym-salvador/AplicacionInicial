/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN - CNEB INICIAL (3, 4 Y 5 AÑOS)
 * Orquesta los Dos Mundos (Cantidad y Espacio) con sus sesiones y minijuegos,
 * aplicando las reglas de acceso del aula (SchoolManagement) y la progresión secuencial.
 */

window.App = {
  currentView: 'home', // 'home', 'world', 'session', 'game'
  currentWorldId: null,
  currentSessionId: null,
  currentGameId: null,
  currentGameStartTime: null,
  previewAge: 5, // Edad con la que el personal comprueba los retos

  async init() {
    window.SchoolManagement?.init();
    this.applySchoolConfig();
    window.AuthModule?.init();
    window.SidebarModule?.init();

    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      this.syncFromCloud().then(() => this.renderTopNav()).catch(e => console.warn('Sync background error:', e));
    }

    document.getElementById('btn-toggle-sidebar-mobile')?.addEventListener('click', () => window.SidebarModule?.toggleMobile());

    // Enrutamiento inicial según el perfil activo (nunca se crea una sesión automática)
    if (window.AuthModule?.currentSession) {
      window.AuthModule.routeAfterLogin();
    } else {
      setTimeout(() => window.AuthModule?.openRoleSelectorModal('admin'), 300);
    }

    window.addEventListener('cneb:config-updated', () => this.applySchoolConfig());

    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      window.SoundEngine.isMuted = !window.SoundEngine.isMuted;
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = window.SoundEngine.isMuted ? '🔇' : '🔊';
      if (!window.SoundEngine.isMuted) { window.SoundEngine.playPop(); window.Kusi.say('¡Sonido activado!'); }
    });

    this.checkSyncUrl();
  },

  async syncFromCloud() {
    if (!window.SupabaseService || !window.SupabaseService.isConfigured()) return;
    try {
      const remoteConfig = await window.SupabaseService.fetchSchoolConfig();
      if (remoteConfig) {
        window.AppState.updateSchoolConfig(remoteConfig, false);
        this.applySchoolConfig();
      }

      // Estructura institucional (aulas, docentes, años, perfil admin)
      if (typeof window.SupabaseService.fetchSchoolStructure === 'function') {
        const structure = await window.SupabaseService.fetchSchoolStructure();
        if (structure) window.SchoolManagement.importStructure(structure);
        else window.SupabaseService.saveSchoolStructure(window.SchoolManagement.exportStructure()).catch(() => {});
      }

      const remoteStudents = await window.SupabaseService.fetchStudentsWithEvals();
      if (remoteStudents && Array.isArray(remoteStudents)) {
        if (remoteStudents.length > 0) {
          // Las filas de la nube pueden llegar todavía con el usuario antiguo (est_1, V4821):
          // se reconocen por el legacyId local y se adopta el usuario nuevo para no duplicar al estudiante.
          const localStudents = window.AppState.state.students;
          const byLegacy = new Map(localStudents.filter(s => s.legacyId).map(s => [s.legacyId, s]));
          const byId = new Map(localStudents.map(s => [s.id, s]));
          const map = new Map();
          remoteStudents.forEach(remote => {
            const local = byLegacy.get(remote.id) || byId.get(remote.id);
            let st = remote;
            if (local) {
              const pinIsOld = !remote.pin || String(remote.pin).toLowerCase() === String(remote.id).toLowerCase();
              st = { ...remote, id: local.id, legacyId: local.legacyId, firstName: local.firstName, lastName: local.lastName, pin: pinIsOld ? local.pin : remote.pin };
              if (remote.id !== local.id) window.SupabaseService.renameStudent(remote.id, st).catch(() => {});
            }
            if (!map.has(st.id)) map.set(st.id, st);
          });
          localStudents.forEach(st => { if (!map.has(st.id)) map.set(st.id, st); });
          window.AppState.state.students = Array.from(map.values());
          window.AppState.saveState();
        } else if (window.AppState.state.students.length > 0) {
          for (const st of window.AppState.state.students) await window.SupabaseService.saveStudent(st);
        }
      }
      // Re-aplica reglas y migración de usuarios (apellido.inicial) sobre lo que llegó de la nube
      window.SchoolManagement.init();
      window.SidebarModule?.renderSidebar();
      if (window.AuthModule?.isStaff() && window.SidebarModule) window.SidebarModule.navigateTo(window.SidebarModule.activeView);
    } catch (e) {
      console.warn('Advertencia al sincronizar con la nube:', e);
    }
  },

  checkSyncUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has('sync')) return;
      const res = window.AppState.importSyncPayload(urlParams.get('sync'));
      if (res.success) {
        window.SoundEngine.playSuccess();
        this.renderTopNav();
        const syncModal = document.createElement('div');
        syncModal.className = 'modal-overlay';
        syncModal.innerHTML = `
          <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-emerald-400 shadow-2xl animate-pop">
            <div class="w-20 h-20 rounded-full bg-emerald-100 border-3 border-emerald-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow">${res.student.avatar || '🎉'}</div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">¡Sincronización Exitosa!</span>
            <h3 class="text-2xl font-black text-slate-900 font-fun mt-2 mb-1">${res.isNew ? '¡Nuevo Alumno Registrado!' : '¡Avance Actualizado!'}</h3>
            <p class="text-sm text-slate-700 font-bold mb-3">Los datos de <span class="text-emerald-700">${res.student.name}</span> (${res.student.stars} ⭐) se han guardado.</p>
            <button id="btn-sync-modal-close" class="btn-chunky btn-green text-base py-2.5 px-6 shadow-md w-full">¡Entendido! 🚀</button>
          </div>`;
        document.body.appendChild(syncModal);
        document.getElementById('btn-sync-modal-close')?.addEventListener('click', () => { window.SoundEngine.playPop(); syncModal.remove(); });
        if (window.history?.replaceState) window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('Error checking sync param:', e);
    }
  },

  applySchoolConfig() {
    const config = window.AppState ? window.AppState.getSchoolConfig() : null;
    if (!config) return;
    const logoMascot = document.getElementById('app-logo-mascot');
    const logoTitle = document.getElementById('app-logo-title');
    const logoSchool = document.getElementById('app-logo-school');
    if (logoMascot) logoMascot.textContent = config.mascotIcon;
    if (logoTitle) logoTitle.textContent = config.appTitle || `Matemática ${config.mascotName || 'Kusi'}`;
    if (logoSchool) logoSchool.textContent = config.schoolName || 'CNEB Inicial';
  },

  renderTopNav() {
    this.applySchoolConfig();
    window.AuthModule?.updateHeaderAuthUI();
  },

  updateStars() {
    const starCount = document.getElementById('star-count');
    if (starCount) {
      starCount.textContent = window.AppState.stars;
      starCount.parentElement.classList.add('animate-wiggle');
      setTimeout(() => starCount.parentElement.classList.remove('animate-wiggle'), 600);
    }
  },

  // === AYUDANTES DE CONTEXTO DE JUEGO ===
  isStaffMode() {
    return !!window.AuthModule && window.AuthModule.isStaff() && !window.AuthModule.isImpersonating();
  },

  // Estudiante cuyo progreso se muestra (null en modo comprobación del personal)
  getPlayingStudent() {
    if (this.isStaffMode()) return null;
    return window.AppState.getCurrentStudent();
  },

  getPlayingAge() {
    const st = this.getPlayingStudent();
    return st ? window.SchoolManagement.getStudentAge(st.id) : this.previewAge;
  },

  // Acceso a un mundo según las reglas del aula. El personal siempre puede comprobar.
  getWorldAccess(worldId) {
    const st = this.getPlayingStudent();
    if (!st) return { allowed: true, code: 'staff', reason: '' };
    return window.SchoolManagement.getStudentAccess(st.id, worldId);
  },

  getSessionAccess(worldId, sessionId) {
    const st = this.getPlayingStudent();
    if (!st) return { allowed: true, code: 'staff', reason: '', planEnabled: true, isUnlocked: true };
    return window.SchoolManagement.getSessionAccess(st.id, worldId, sessionId);
  },

  requireSession() {
    if (!window.AuthModule || !window.AuthModule.currentSession) {
      window.SoundEngine.playGentleTryAgain();
      window.AuthModule.openRoleSelectorModal('estudiante');
      return false;
    }
    return true;
  },

  // 1. MENÚ PRINCIPAL DEL ESTUDIANTE: ELECCIÓN DE MUNDO
  showHome() {
    if (!this.requireSession()) return;
    if (this.isStaffMode()) { window.SidebarModule?.navigateTo('games'); return; }

    this.currentView = 'home';
    this.currentWorldId = null;
    this.currentSessionId = null;
    this.currentGameId = null;

    const mainContainer = document.getElementById('app-main-content');
    const config = window.AppState.getSchoolConfig();
    const student = this.getPlayingStudent();
    const classroom = student ? window.SchoolManagement.getClassroom(student.classroomId) : null;
    const theme = window.SchoolManagement.ageTheme(this.getPlayingAge());

    // Para el niño solo se muestran los mundos que puede jugar (los bloqueados no aparecen)
    const openWorlds = ['cantidad', 'espacio'].filter(w => this.getWorldAccess(w).allowed);

    const worldCard = (worldId) => {
      const mundo = window.CNEB_DATA.mundos[worldId];
      const access = this.getWorldAccess(worldId);
      const evalW = window.AppState.getWorldOverallAssessment(worldId, student?.id);
      const isC = worldId === 'cantidad';
      const stage = student ? window.SchoolManagement.getStudentStage(student.id, worldId) : null;
      return `
        <div id="card-world-${worldId}" class="world-card ${access.allowed ? (isC ? 'bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 border-amber-400' : 'bg-gradient-to-br from-sky-200 via-indigo-100 to-purple-200 border-sky-400') + ' group cursor-pointer' : 'bg-slate-100/90 border-slate-300 border-dashed opacity-80 cursor-pointer'}">
          <div class="w-24 h-24 rounded-full ${access.allowed ? (isC ? 'bg-amber-400' : 'bg-sky-400') + ' border-4 border-white shadow-xl group-hover:scale-110' : 'bg-slate-300 border-4 border-slate-200 shadow filter grayscale'} flex items-center justify-center text-5xl mb-3 transition-transform">${access.allowed ? mundo.icono : '🔒'}</div>
          <div class="flex items-center gap-2 mb-2 flex-wrap justify-center">
            <span class="text-xs font-black uppercase tracking-wider ${access.allowed ? (isC ? 'bg-amber-600' : 'bg-sky-600') : 'bg-slate-400'} text-white px-3 py-1 rounded-full">Competencia ${mundo.numeroCneb}</span>
            ${access.allowed
              ? `<span class="text-xs font-black px-2.5 py-1 rounded-full ${window.DocenteModule.getBadgeClass(evalW.overall)}">${evalW.overall === 'Sin evaluar' ? `${evalW.totalCompleted}/${evalW.totalGames} retos` : `Nivel: ${evalW.overall}`}</span>`
              : `<span class="text-xs font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300">🔒 Bloqueado</span>`}
          </div>
          <h2 class="text-3xl font-black ${access.allowed ? (isC ? 'text-amber-950' : 'text-sky-950') : 'text-slate-600'} font-fun mb-2">${mundo.nombre}</h2>
          <p class="${access.allowed ? (isC ? 'text-amber-900' : 'text-sky-900') + ' font-semibold' : 'text-slate-500 font-medium'} text-sm mb-5">
            ${access.allowed ? (stage?.session ? `Estás en la Sesión ${stage.session.numero}: ${(stage.session.titulo.split(':')[1] || '').trim()}` : '¡Completaste todas las sesiones! Puedes repasar.') : access.reason}
          </p>
          <button type="button" class="btn-chunky ${access.allowed ? (isC ? 'btn-yellow' : 'btn-blue') : 'bg-slate-200 text-slate-500 border-slate-300'} w-full text-lg py-3 world-enter-btn" data-world="${worldId}">
            <span>${access.allowed ? `Entrar a ${isC ? 'Cantidad' : 'Espacio'} ➔` : '🔒 Bloqueado'}</span>
          </button>
        </div>`;
    };

    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[75vh] px-4 py-6">
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2.5 bg-white/95 border-4 ${theme.border} px-6 py-2 rounded-full shadow-lg mb-3">
            <span class="text-2xl">${config.mascotIcon}</span>
            <span class="font-black text-amber-950 font-fun text-lg md:text-xl">${classroom ? classroom.name : `Aula ${theme.label}`}</span>
            <span class="text-xs font-black px-2 py-0.5 rounded-full ${theme.badge}">${theme.icon} ${theme.label}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 font-fun drop-shadow-md">¡Matemática Mágica con ${config.mascotName}!</h1>
          <p class="text-lg md:text-xl text-slate-700 font-bold mt-1 font-fun">Elige un mundo para explorar sus sesiones de aprendizaje:</p>
          ${student ? `
            <div class="flex flex-wrap items-center justify-center gap-2.5 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-amber-300 rounded-2xl px-4 py-2 mt-4 shadow-sm inline-flex">
              <span class="text-2xl">${student.avatar || '🦙'}</span>
              <span class="text-xs md:text-sm font-bold text-slate-800">Jugando como: <strong class="text-amber-950 font-black font-fun text-base">${student.name}</strong>
                <span class="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 ml-1">Usuario: ${student.id}</span></span>
              <button id="btn-quick-family-portal" class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-xs py-1 px-3 shadow-sm flex items-center gap-1 hover:bg-emerald-200"><span>👨‍👩‍👧</span><span>Mi Progreso</span></button>
            </div>` : ''}
        </div>
        ${openWorlds.length === 0 ? `
          <div class="w-full max-w-xl bg-white/90 border-4 border-dashed border-amber-300 rounded-3xl p-8 text-center shadow">
            <div class="text-6xl mb-2">🌈</div>
            <h2 class="text-2xl font-black text-amber-950 font-fun">¡Pronto habrá nuevas aventuras!</h2>
            <p class="text-sm text-slate-600 font-bold mt-1">Tu profesora abrirá tus mundos de Matemática en clase. Mientras tanto, mira tus aventuras del aula aquí abajo.</p>
          </div>` : `
          <div class="grid grid-cols-1 ${openWorlds.length > 1 ? 'md:grid-cols-2' : ''} gap-8 w-full ${openWorlds.length > 1 ? 'max-w-4xl' : 'max-w-md'}">${openWorlds.map(worldCard).join('')}</div>`}
        ${this.renderClassroomWorlds(student, classroom)}
      </div>`;

    window.Kusi.render('#mascot-host');
    const kusiMsg = openWorlds.length === 2
      ? '¡Hola amiguito! Toca la tarjeta amarilla para Aventuras de Cantidad o la tarjeta azul para Exploradores del Espacio.'
      : openWorlds.length === 1
        ? `¡Hola amiguito! Toca la tarjeta ${openWorlds[0] === 'cantidad' ? 'amarilla para Aventuras de Cantidad' : 'azul para Exploradores del Espacio'}.`
        : '¡Hola! Tu profesora abrirá tus mundos en clase. ¡Mira tus medallas del aula!';
    window.Kusi.say(kusiMsg);

    mainContainer.querySelectorAll('.world-enter-btn, .world-card').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const worldId = el.dataset.world || el.id.replace('card-world-', '');
        const access = this.getWorldAccess(worldId);
        window.SoundEngine.playPop();
        if (!access.allowed) {
          window.SoundEngine.playGentleTryAgain();
          const card = document.getElementById(`card-world-${worldId}`);
          card?.classList.add('animate-wiggle');
          setTimeout(() => card?.classList.remove('animate-wiggle'), 600);
          window.Kusi.say(access.reason);
          return;
        }
        this.showWorld(worldId);
      });
    });
    document.getElementById('btn-quick-family-portal')?.addEventListener('click', (e) => { e.stopPropagation(); window.FamiliaModule.openPortal(); });
  },

  // 1b. MUNDOS VIVENCIALES DEL ESTUDIANTE: lo que trabaja con su profesora en el aula (otras áreas)
  renderClassroomWorlds(student, classroom) {
    if (!student || !classroom || !window.CNEB_CURRICULUM) return '';
    const CU = window.CNEB_CURRICULUM;
    const SM = window.SchoolManagement;
    const comps = SM.getActiveCompetencies(classroom.id).filter(cp => !SM.hasGames(cp.id));
    if (comps.length === 0) return '';
    const medal = (g) => ({ AD: '🏆', A: '🥇', B: '🥈', C: '🥉' }[g] || '');
    return `
      <div class="w-full max-w-4xl mt-8">
        <div class="text-center mb-3">
          <h2 class="text-xl md:text-2xl font-black text-slate-800 font-fun">🏫 Mis aventuras en el aula con mi profesora</h2>
          <p class="text-xs text-slate-600 font-bold">Estas las vivimos juntos en clase. ¡Mira tus medallas!</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          ${comps.map(cp => {
            const a = CU.areas[cp.areaId];
            const g = window.AppState.getAreaGrade(student.id, cp.id);
            return `
              <div class="bg-white/90 rounded-2xl border-3 ${a.border} p-3 text-center shadow-sm">
                <span class="text-3xl block">${cp.icono}</span>
                <span class="text-[10px] font-black uppercase ${a.badge} px-2 py-0.5 rounded-full border inline-block mt-1">${a.nombre}</span>
                <p class="text-[11px] font-bold text-slate-700 mt-1 leading-tight">${CU.getNombre(cp.id, classroom.cycle)}</p>
                <span class="text-sm font-black mt-1 block">${g ? `${medal(g.grade)} ${g.grade}` : '⭐ En el aula'}</span>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  },

  // 2. VISTA DE LAS SESIONES DE UN MUNDO
  showWorld(worldId) {
    if (!this.requireSession()) return;
    const access = this.getWorldAccess(worldId);
    if (!access.allowed) {
      window.SoundEngine.playGentleTryAgain();
      window.Kusi.say(access.reason);
      this.showHome();
      return;
    }

    this.currentView = 'world';
    this.currentWorldId = worldId;
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return;

    const student = this.getPlayingStudent();
    const age = this.getPlayingAge();
    const theme = window.SchoolManagement.ageTheme(age);
    const isCantidad = worldId === 'cantidad';
    const themeBorder = isCantidad ? 'border-amber-300' : 'border-sky-300';
    const themeBtn = isCantidad ? 'btn-yellow' : 'btn-blue';
    const mainContainer = document.getElementById('app-main-content');

    // El niño solo ve las sesiones que puede jugar; el personal (comprobación) las ve todas
    const visibleSessions = student ? mundo.sesiones.filter(s => this.getSessionAccess(worldId, s.id).allowed) : mundo.sesiones;
    const hiddenByProgress = student ? mundo.sesiones.filter(s => { const a = this.getSessionAccess(worldId, s.id); return !a.allowed && a.code === 'locked'; }).length : 0;

    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-5 bg-white/90 backdrop-blur-md p-4 rounded-3xl border-3 ${themeBorder} shadow-md">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${mundo.icono}</span>
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-fun">${mundo.nombre}</h2>
              <p class="text-xs text-slate-600 font-bold">${mundo.sesiones.length} Sesiones • ${mundo.competencia} • <span class="px-1.5 py-0.5 rounded ${theme.badge}">${theme.icon} ${theme.label}</span>${!student ? ' • 👑 Modo comprobación' : ''}</p>
            </div>
          </div>
          <button id="btn-back-to-home" class="btn-chunky ${themeBtn} text-sm py-2 px-5">⬅ ${student ? 'Menú Principal' : 'Volver'}</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-${Math.max(1, Math.min(3, visibleSessions.length))} gap-6 ${visibleSessions.length < 3 ? 'max-w-3xl mx-auto' : ''}">
          ${visibleSessions.map(ses => {
            const juegos = window.CNEB_DATA.getJuegos(worldId, ses.id, age);
            const sAccess = this.getSessionAccess(worldId, ses.id);
            const assessment = student ? window.AppState.getSessionAssessment(worldId, ses.id, student.id) : null;
            const grade = assessment?.grade || 'Sin evaluar';
            const completed = assessment?.completedCount || 0;
            const isApproved = assessment?.isApproved || false;
            const title = ses.titulo.split(':')[1] || ses.titulo;

            if (!sAccess.allowed) {
              const pausedByTeacher = sAccess.code === 'session_off';
              return `
                <div class="world-card bg-slate-100/90 border-4 border-slate-300 border-dashed p-5 rounded-3xl shadow-sm flex flex-col justify-between text-left opacity-85 session-card-locked cursor-pointer" data-reason="${sAccess.reason.replace(/"/g, '&quot;')}">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2"><span class="text-3xl filter grayscale opacity-60">${ses.icono}</span><span class="text-2xl animate-bounce-soft">${pausedByTeacher ? '⏸️' : '🔒'}</span></div>
                      <span class="text-xs font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300">${pausedByTeacher ? '⏸️ Pausada' : '🔒 Bloqueada'}</span>
                    </div>
                    <span class="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Sesión ${ses.numero}</span>
                    <h3 class="text-xl font-black text-slate-600 font-fun mb-2 leading-snug">${title}</h3>
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 my-2 text-xs text-amber-950 font-bold flex items-center gap-2"><span class="text-lg">${pausedByTeacher ? '👩‍🏫' : '🔒'}</span><span>${sAccess.reason}</span></div>
                  </div>
                  <div class="space-y-1.5 my-3 bg-slate-200/50 p-3 rounded-2xl border border-slate-300 opacity-60">
                    <span class="text-[11px] font-bold text-slate-600 block mb-1">Retos de la sesión:</span>
                    ${juegos.map(j => `<div class="flex items-center justify-between text-xs text-slate-500"><span>🔒 ${j.titulo}</span></div>`).join('')}
                  </div>
                  <button class="btn-chunky bg-slate-200 text-slate-500 border-slate-300 w-full text-base py-2.5 mt-2 font-fun"><span>${pausedByTeacher ? '⏸️' : '🔒'} Sesión ${ses.numero}</span></button>
                </div>`;
            }

            return `
              <div class="world-card bg-white border-4 ${isApproved ? 'border-emerald-400 bg-emerald-50/20' : themeBorder} p-5 rounded-3xl shadow-lg flex flex-col justify-between text-left">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-4xl">${ses.icono}</span>
                    <div class="flex items-center gap-1.5">
                      ${isApproved ? '<span class="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">✅ Aprobada</span>' : ''}
                      <span class="text-xs font-black px-2.5 py-1 rounded-full ${window.DocenteModule.getBadgeClass(grade)}">${grade === 'Sin evaluar' ? `${completed}/${juegos.length} Retos` : `Logro: ${grade}`}</span>
                    </div>
                  </div>
                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Sesión ${ses.numero}</span>
                  <h3 class="text-xl font-black text-slate-900 font-fun mb-2 leading-snug">${title}</h3>
                  <p class="text-xs text-slate-600 font-medium mb-3">${ses.desempenoPorEdad?.[String(age)] || ses.proposito}</p>
                </div>
                <div class="space-y-1.5 my-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span class="text-[11px] font-bold text-slate-800 block mb-1">Retos de la sesión:</span>
                  ${juegos.map(j => `<div class="flex items-center justify-between text-xs text-slate-700"><span>${j.icono} ${j.titulo}</span><span>${student?.evaluaciones?.[j.id]?.completed ? '✅' : '⚪'}</span></div>`).join('')}
                </div>
                <button class="btn-chunky ${isApproved ? 'btn-green' : themeBtn} w-full text-base py-2.5 mt-2 font-fun session-enter-btn" data-session="${ses.id}">
                  <span>${isApproved ? `Repasar Sesión ${ses.numero}` : `Abrir Sesión ${ses.numero}`}</span><span>➔</span>
                </button>
              </div>`;
          }).join('')}
        </div>
        ${visibleSessions.length === 0 ? `
          <div class="max-w-xl mx-auto bg-white/90 border-4 border-dashed border-slate-300 rounded-3xl p-8 text-center shadow mt-2">
            <div class="text-5xl mb-2">👩‍🏫</div>
            <p class="text-sm text-slate-700 font-bold">Tu profesora abrirá las sesiones de este mundo en clase. ¡Vuelve pronto!</p>
          </div>` : (hiddenByProgress > 0 ? `
          <p class="text-center text-xs text-slate-500 font-bold mt-5">🔓 Cuando apruebes esta sesión se abrirá la siguiente aventura.</p>` : '')}
      </div>`;

    document.getElementById('btn-back-to-home')?.addEventListener('click', () => { window.SoundEngine.playPop(); this.showHome(); });
    mainContainer.querySelectorAll('.session-enter-btn').forEach(btn => btn.addEventListener('click', () => { window.SoundEngine.playPop(); this.showSessionGames(worldId, btn.dataset.session); }));
    mainContainer.querySelectorAll('.session-card-locked').forEach(card => card.addEventListener('click', () => {
      window.SoundEngine.playGentleTryAgain();
      card.classList.add('animate-wiggle');
      setTimeout(() => card.classList.remove('animate-wiggle'), 600);
      window.Kusi.say(card.dataset.reason || 'Esta sesión todavía no está disponible.');
    }));

    window.Kusi.say(isCantidad
      ? '¡Estás en Aventuras de Cantidad! Aprueba cada sesión para desbloquear la siguiente.'
      : '¡Bienvenido a Exploradores del Espacio! Aprueba cada sesión para desbloquear la siguiente.');
  },

  // 3. VISTA DE LOS JUEGOS DE UNA SESIÓN
  showSessionGames(worldId, sessionId) {
    if (!this.requireSession()) return;
    const sAccess = this.getSessionAccess(worldId, sessionId);
    if (!sAccess.allowed) {
      window.SoundEngine.playGentleTryAgain();
      window.Kusi.say(sAccess.reason);
      this.showWorld(worldId);
      return;
    }

    this.currentView = 'session';
    this.currentWorldId = worldId;
    this.currentSessionId = sessionId;

    const session = window.CNEB_DATA.getSesion(worldId, sessionId);
    if (!session) return;
    const student = this.getPlayingStudent();
    const age = this.getPlayingAge();
    const juegos = window.CNEB_DATA.getJuegos(worldId, sessionId, age);
    const isCantidad = worldId === 'cantidad';
    const themeBorder = isCantidad ? 'border-amber-300' : 'border-sky-300';
    const themeBtn = isCantidad ? 'btn-yellow' : 'btn-blue';

    const mainContainer = document.getElementById('app-main-content');
    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white/90 p-4 rounded-3xl border-3 ${themeBorder} shadow">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${session.icono}</span>
            <div><h2 class="text-2xl font-black text-slate-800 font-fun">${session.titulo}</h2><p class="text-xs text-slate-600 font-bold">${session.desempenoPorEdad?.[String(age)] || session.proposito}</p></div>
          </div>
          <button id="btn-back-to-sessions" class="btn-chunky ${themeBtn} text-sm py-2 px-4">⬅ Todas las Sesiones</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${juegos.length > 3 ? '4' : '3'} gap-5">
          ${juegos.map(j => {
            const ev = student?.evaluaciones?.[j.id];
            return `
              <div class="game-card group cursor-pointer" data-game="${j.id}">
                <div class="flex justify-between w-full items-start">
                  <span class="text-4xl group-hover:scale-110 transition-transform">${j.icono}</span>
                  ${ev?.completed ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-black ${window.DocenteModule.getBadgeClass(ev.lastGrade)}">✓ ${ev.lastGrade}</span>` : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">¡Jugar!</span>`}
                </div>
                <div class="my-3 text-center">
                  <h3 class="text-base font-black text-slate-800 font-fun group-hover:text-amber-600 transition-colors">${j.titulo}</h3>
                  <p class="text-[11px] text-slate-500 mt-1">${j.subtitulo}</p>
                </div>
                <button class="btn-chunky ${themeBtn} w-full text-xs py-2 font-fun">¡Empezar Reto! ➔</button>
              </div>`;
          }).join('')}
        </div>
      </div>`;

    document.getElementById('btn-back-to-sessions')?.addEventListener('click', () => { window.SoundEngine.playPop(); this.showWorld(worldId); });
    mainContainer.querySelectorAll('.game-card').forEach(card => card.addEventListener('click', () => { window.SoundEngine.playPop(); this.launchGame(card.dataset.game); }));
    window.Kusi.say(`¡Estás en la ${session.titulo.split(':')[0]}! Toca uno de los retos para comenzar.`);
  },

  // 4. LANZAMIENTO DE UN MINIJUEGO
  launchGame(gameId) {
    if (!this.requireSession()) return;
    this.currentView = 'game';
    this.currentGameId = gameId;
    this.currentGameStartTime = Date.now();

    const mainContainer = document.getElementById('app-main-content');
    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-2 py-2 flex flex-col min-h-[75vh]">
        <div class="flex items-center justify-between mb-2 px-2">
          <button id="btn-exit-game" class="btn-chunky btn-coral text-sm py-2 px-4 flex items-center gap-1.5"><span>⬅</span><span>Volver</span></button>
          <div class="text-slate-600 font-fun font-bold text-sm bg-white/80 px-4 py-1.5 rounded-full border shadow-sm">¡Tú puedes lograrlo!</div>
        </div>
        <div id="game-active-stage" class="flex-1 w-full bg-white/70 backdrop-blur-md rounded-3xl border-4 border-white shadow-xl p-3"></div>
      </div>`;

    document.getElementById('btn-exit-game')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      if (this.currentSessionId) this.showSessionGames(this.currentWorldId, this.currentSessionId);
      else this.showWorld(this.currentWorldId || 'cantidad');
    });

    const stage = document.getElementById('game-active-stage');
    switch (gameId) {
      case 'j1_1_color': window.Sesion1Games.playColor(stage); break;
      case 'j1_2_tamano': window.Sesion1Games.playTamano(stage); break;
      case 'j1_3_cuantificadores': window.Sesion1Games.playCuantificadores(stage); break;
      case 'j1_4_mas_menos': window.Sesion1Games.playMasMenos(stage); break;
      case 'j2_1_plantas': window.Sesion2Games.playPlantas(stage); break;
      case 'j2_2_zanahorias': window.Sesion2Games.playZanahorias(stage); break;
      case 'j2_3_trencito': window.Sesion2Games.playTrencito(stage); break;
      case 'j2_4_primero_ultimo': window.Sesion2Games.playPrimeroUltimo(stage); break;
      case 'j3_1_conteo10': window.GameConteo.init(stage); break;
      case 'j3_2_agregar': window.GameOperaciones.playAgregar(stage); break;
      case 'j3_3_quitar': window.GameOperaciones.playQuitar(stage); break;
      case 'j3_4_balanza': window.GamePesoTiempo.playBalanza(stage); break;
      case 'j3_5_tiempo': window.GamePesoTiempo.playTiempo(stage); break;
      case 'esp_j1_formas2d': window.SesionEsp1Games.playFormas2D(stage); break;
      case 'esp_j1_cuerpos3d': window.SesionEsp1Games.playCuerpos3D(stage); break;
      case 'esp_j1_clasificacion': window.SesionEsp1Games.playClasificacion(stage); break;
      case 'esp_j2_cerca_lejos': window.SesionEsp2Games.playCercaLejos(stage); break;
      case 'esp_j2_al_lado': window.SesionEsp2Games.playAlLado(stage); break;
      case 'esp_j2_posiciones': window.SesionEsp2Games.playPosiciones(stage); break;
      case 'esp_j3_desplazamiento': window.GameDesplazamiento.init(stage); break;
      case 'esp_j3_mas_largo': window.GameLongitud.playMasLargo(stage); break;
      case 'esp_j3_mas_corto': window.GameLongitud.playMasCorto(stage); break;
      case 'esp_j3_puente': window.GameLongitud.playPuente(stage); break;
      default: stage.innerHTML = '<p class="text-center font-bold">Cargando reto...</p>';
    }
  },

  // 5. PANTALLA DE CELEBRACIÓN
  showGameSuccess(gameId) {
    const mainContainer = document.getElementById('app-main-content');
    const goNext = () => {
      window.SoundEngine.playPop();
      if (this.currentSessionId) this.showSessionGames(this.currentWorldId, this.currentSessionId);
      else this.showWorld(this.currentWorldId || 'cantidad');
    };

    if (this.isStaffMode()) {
      window.ConfettiEngine.celebrate(3000);
      mainContainer.innerHTML = `
        <div class="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-pop">
          <div class="text-6xl mb-3">👑 ✨ 🎯</div>
          <div class="bg-white/95 border-4 border-purple-400 rounded-3xl p-6 shadow-2xl max-w-lg w-full mb-6">
            <span class="text-xs font-black uppercase tracking-wider bg-purple-700 text-white px-3 py-1 rounded-full mb-2 inline-block">Modo Comprobación</span>
            <h2 class="text-3xl font-black text-purple-950 font-fun mb-2">¡Reto Comprobado!</h2>
            <p class="text-sm text-slate-700 font-bold mb-3">Verificaste la interactividad y la lógica formativa de este reto.</p>
            <div class="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 font-bold">ℹ️ Tus respuestas en modo comprobación no alteran las calificaciones de ningún estudiante.</div>
          </div>
          <div class="flex flex-wrap justify-center gap-4 w-full">
            <button id="btn-success-continue" class="btn-chunky btn-green text-lg py-2.5 px-6 shadow-xl">Siguiente Reto ➔</button>
            <button id="btn-success-home" class="btn-chunky bg-purple-700 text-white border-purple-400 hover:bg-purple-800 text-lg py-2.5 px-6 shadow-xl">🏛️ Volver al Panel</button>
          </div>
        </div>`;
      document.getElementById('btn-success-continue')?.addEventListener('click', goNext);
      document.getElementById('btn-success-home')?.addEventListener('click', () => { window.SoundEngine.playPop(); window.SidebarModule?.navigateTo('dashboard'); });
      return;
    }

    this.updateStars();
    window.ConfettiEngine.celebrate(3500);
    const student = window.AppState.getCurrentStudent();
    const totalStars = student ? (student.stars || 0) : 0;

    let sessionApprovalBanner = '';
    let isSessionComplete = false;
    if (this.currentWorldId && this.currentSessionId) {
      const assessment = window.AppState.getSessionAssessment(this.currentWorldId, this.currentSessionId, student?.id);
      if (assessment && assessment.isApproved && assessment.completedCount === assessment.totalCount && assessment.totalCount > 0) {
        isSessionComplete = true;
        const mundo = window.CNEB_DATA.mundos[this.currentWorldId];
        const idx = mundo.sesiones.findIndex(s => s.id === this.currentSessionId);
        const next = mundo.sesiones[idx + 1];
        const nextAccess = next && student ? window.SchoolManagement.getSessionAccess(student.id, this.currentWorldId, next.id) : null;
        sessionApprovalBanner = `
          <div class="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl border-2 border-emerald-300 text-center animate-bounce">
            <div class="text-3xl mb-1">🎉 🔓 🌟</div>
            <div class="text-xl font-black font-fun tracking-wide">¡SESIÓN APROBADA CON ÉXITO!</div>
            <p class="text-xs text-emerald-100 font-bold mt-1">${next ? (nextAccess?.allowed ? `¡Desbloqueaste la Sesión ${next.numero}! 🚀` : `La Sesión ${next.numero} se abrirá cuando tu profesora la habilite 👩‍🏫`) : '¡Culminaste todas las sesiones de esta competencia! 🏆'}</p>
          </div>`;
      }
    }

    mainContainer.innerHTML = `
      <div class="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-pop">
        <div class="flex items-center gap-3 text-6xl mb-4">
          <span class="animate-bounce" style="animation-delay:.1s">⭐</span><span class="animate-bounce text-7xl" style="animation-delay:.25s">⭐</span><span class="animate-bounce" style="animation-delay:.4s">⭐</span>
        </div>
        <div class="bg-white/95 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl max-w-lg w-full mb-6">
          <h2 class="text-4xl font-black text-amber-950 font-fun mb-2">¡Reto Logrado!</h2>
          <p class="text-lg text-slate-700 font-bold mb-4 font-fun">¡Ganaste 3 estrellas doradas para tu colección!</p>
          <div class="flex items-center justify-center gap-4 text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200"><span class="text-3xl">🎒</span><span class="font-fun text-xl text-amber-900 font-black">Total: ${totalStars} Estrellas</span></div>
          ${sessionApprovalBanner}
        </div>
        <div class="flex flex-wrap justify-center gap-4 w-full">
          <button id="btn-success-continue" class="btn-chunky btn-green text-xl py-3 px-8 shadow-xl"><span>${isSessionComplete ? 'Continuar Aventura' : 'Siguiente Reto'}</span><span>➔</span></button>
          <button id="btn-success-home" class="btn-chunky btn-yellow text-lg py-3 px-6 shadow-xl"><span>🏠 Menú Principal</span></button>
        </div>
      </div>`;

    window.Kusi.say(isSessionComplete ? '¡Fantástico! ¡Has aprobado toda la sesión!' : '¡Excelente trabajo! Ganaste 3 estrellas doradas. ¡Sigue adelante!');
    document.getElementById('btn-success-continue')?.addEventListener('click', () => {
      if (isSessionComplete) { window.SoundEngine.playPop(); this.showWorld(this.currentWorldId || 'cantidad'); } else goNext();
    });
    document.getElementById('btn-success-home')?.addEventListener('click', () => { window.SoundEngine.playPop(); this.showHome(); });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
