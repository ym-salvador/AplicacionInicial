/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN - CNEB INICIAL (5 AÑOS)
 * Orquestador integral de los Dos Mundos (Cantidad y Espacio) con 6 Sesiones Pedagógicas,
 * 23 minijuegos al 100%, sistema de voz sincronizado, celebraciones y panel formativo.
 */

window.App = {
  currentView: 'home', // 'home', 'world', 'session', 'game'
  currentWorldId: null,
  currentSessionId: null,
  currentGameId: null,

  async init() {
    this.applySchoolConfig();
    this.renderTopNav();
    window.StudentProfileModule?.init();

    // Sincronización en tiempo real desde Supabase si está configurado
    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      await this.syncFromCloud();
    }

    window.AuthModule?.init();
    this.checkSyncUrl();
    this.showHome();

    // Si no hay sesión activa, abrir el modal de ingreso (solo usuarios generados pueden jugar)
    if (!window.AuthModule || !window.AuthModule.currentSession) {
      setTimeout(() => {
        window.AuthModule?.openLoginModal('familia');
      }, 350);
    }

    // Actualización reactiva al cambiar configuración escolar y de mascota
    window.addEventListener('cneb:config-updated', () => {
      this.applySchoolConfig();
      if (this.currentView === 'home') {
        this.showHome();
      }
    });

    // Eventos globales de la barra superior
    document.getElementById('btn-family-portal')?.addEventListener('click', () => {
      window.FamiliaModule.openPortal();
    });

    document.getElementById('btn-docente-gate')?.addEventListener('click', () => {
      window.DocenteModule.openGate();
    });

    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      window.SoundEngine.isMuted = !window.SoundEngine.isMuted;
      const icon = document.getElementById('sound-icon');
      if (icon) {
        icon.textContent = window.SoundEngine.isMuted ? '🔇' : '🔊';
      }
      if (!window.SoundEngine.isMuted) {
        window.SoundEngine.playPop();
        window.Kusi.say("¡Sonido activado!");
      }
    });

    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.showHome();
    });
  },

  async syncFromCloud() {
    if (!window.SupabaseService || !window.SupabaseService.isConfigured()) return;
    try {
      // 1. Configuración del colegio
      const remoteConfig = await window.SupabaseService.fetchSchoolConfig();
      if (remoteConfig) {
        window.AppState.updateSchoolConfig(remoteConfig, false);
        this.applySchoolConfig();
      }

      // 2. Estudiantes y notas desde la nube
      const remoteStudents = await window.SupabaseService.fetchStudentsWithEvals();
      if (remoteStudents && Array.isArray(remoteStudents)) {
        if (remoteStudents.length > 0) {
          const map = new Map();
          remoteStudents.forEach(st => map.set(st.id, st));
          window.AppState.state.students.forEach(st => {
            if (!map.has(st.id)) map.set(st.id, st);
          });
          window.AppState.state.students = Array.from(map.values());
          window.AppState.saveState();
        } else if (window.AppState.state.students.length > 0) {
          // Si Supabase recién se crea y está vacío, subir automáticamente los estudiantes
          for (const st of window.AppState.state.students) {
            await window.SupabaseService.saveStudent(st);
          }
        }
      }
    } catch (e) {
      console.warn('Advertencia al sincronizar con la nube:', e);
    }
  },

  checkSyncUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('sync')) {
        const token = urlParams.get('sync');
        const res = window.AppState.importSyncPayload(token);
        if (res.success) {
          window.SoundEngine.playSuccess();
          this.renderTopNav();

          // Modal festivo de confirmación de sincronización
          const syncModal = document.createElement('div');
          syncModal.className = 'modal-overlay';
          syncModal.innerHTML = `
            <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-emerald-400 shadow-2xl animate-pop">
              <div class="w-20 h-20 rounded-full bg-emerald-100 border-3 border-emerald-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow">
                ${res.student.avatar || '🎉'}
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">¡Sincronización Exitosa!</span>
              <h3 class="text-2xl font-black text-slate-900 font-fun mt-2 mb-1">
                ${res.isNew ? '¡Nuevo Alumno Registrado!' : '¡Avance Actualizado!'}
              </h3>
              <p class="text-sm text-slate-700 font-bold mb-3">
                Los datos de <span class="text-emerald-700">${res.student.name}</span> (${res.student.stars} ⭐ estrellas) se han guardado en tu Panel Docente.
              </p>
              <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 font-medium mb-4 text-left space-y-1">
                <div>🎯 Misiones completadas: <strong>${res.summary?.totalCompleted || 0}/23</strong> (${res.summary?.totalProgress || 0}%)</div>
                <div>🧺 Cantidad: <strong>${res.summary?.cantidad?.grade || 'Sin evaluar'}</strong> (${res.summary?.cantidad?.completed || 0} retos)</div>
                <div>🚀 Espacio y Formas: <strong>${res.summary?.espacio?.grade || 'Sin evaluar'}</strong> (${res.summary?.espacio?.completed || 0} retos)</div>
              </div>
              <button id="btn-sync-modal-close" class="btn-chunky btn-green text-base py-2.5 px-6 shadow-md w-full">
                ¡Entendido! Ver en la App 🚀
              </button>
            </div>
          `;
          document.body.appendChild(syncModal);
          document.getElementById('btn-sync-modal-close')?.addEventListener('click', () => {
            window.SoundEngine.playPop();
            syncModal.remove();
          });

          // Limpiar el parámetro de la URL sin recargar
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
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

    if (logoMascot) logoMascot.textContent = config.mascotIcon || '🦙';
    if (logoTitle) logoTitle.textContent = config.appTitle || `Matemática ${config.mascotName || 'Kusi'}`;
    if (logoSchool) {
      logoSchool.textContent = config.schoolName || 'CNEB 5 Años';
      logoSchool.title = `${config.schoolName} • ${config.activeClass}`;
    }
  },

  renderTopNav() {
    this.applySchoolConfig();
    window.StudentProfileModule?.updateHeaderDisplay();
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

  // 1. MENÚ PRINCIPAL: ELECCIÓN DE MUNDO
  showHome() {
    this.currentView = 'home';
    this.currentWorldId = null;
    this.currentSessionId = null;
    this.currentGameId = null;

    document.getElementById('btn-nav-home')?.classList.add('hidden');
    const mainContainer = document.getElementById('app-main-content');

    const config = window.AppState.getSchoolConfig();
    const isAuth = window.AuthModule && window.AuthModule.currentSession;
    const currentStudent = isAuth ? window.AppState.getCurrentStudent() : null;
    const evalCant = window.AppState.getWorldOverallAssessment('cantidad');
    const evalEsp = window.AppState.getWorldOverallAssessment('espacio');

    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[75vh] px-4 py-6">
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2.5 bg-white/95 border-4 border-amber-300 px-6 py-2 rounded-full shadow-lg mb-3">
            <span class="text-2xl">${config.mascotIcon}</span>
            <span class="font-black text-amber-950 font-fun text-lg md:text-xl">${config.schoolName} • ${config.activeClass}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 font-fun drop-shadow-md">
            ¡Matemática Mágica con ${config.mascotName}!
          </h1>
          <p class="text-lg md:text-xl text-slate-700 font-bold mt-1 font-fun">
            Elige un mundo para explorar sus 3 sesiones de aprendizaje:
          </p>

          ${isAuth ? `
            <!-- Banner Privado para Alumno Autenticado -->
            <div class="flex flex-wrap items-center justify-center gap-2.5 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-amber-300 rounded-2xl px-4 py-2 mt-4 shadow-sm inline-flex">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${currentStudent?.avatar || '🦙'}</span>
                <span class="text-xs md:text-sm font-bold text-slate-800">
                  Jugando en casa como: <strong class="text-amber-950 font-black font-fun text-base">${currentStudent?.name || 'Estudiante'}</strong>
                  <span class="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 ml-1">ID: ${currentStudent?.id || ''}</span>
                </span>
              </div>
              <button id="btn-quick-family-portal" class="btn-chunky bg-emerald-100 text-emerald-900 border-emerald-300 text-xs py-1 px-3 shadow-sm flex items-center gap-1 hover:bg-emerald-200">
                <span>👨‍👩‍👧</span>
                <span>Mi Progreso y Clave</span>
              </button>
              <button id="btn-quick-logout" class="btn-chunky bg-white text-slate-600 border-slate-300 text-xs py-1 px-2.5 shadow-sm flex items-center gap-1 hover:bg-slate-100">
                <span>🚪 Salir</span>
              </button>
            </div>
          ` : `
            <!-- Banner Seguro para Visitantes (Sin exponer datos de alumnos) -->
            <div class="flex flex-wrap items-center justify-center gap-2.5 bg-gradient-to-r from-purple-100 via-indigo-50 to-amber-100 border-2 border-purple-300 rounded-2xl px-5 py-3 mt-4 shadow-md inline-flex">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🔒</span>
                <span class="text-xs md:text-sm font-bold text-slate-800">
                  Aula Virtual Protegida • <strong>Solo pueden jugar estudiantes registrados</strong>
                </span>
              </div>
              <button id="btn-home-login-now" class="btn-chunky bg-emerald-600 text-white border-emerald-400 text-xs py-1.5 px-4 shadow hover:bg-emerald-700 flex items-center gap-1">
                <span>🔑</span>
                <span>Ingresar</span>
              </button>
            </div>
          `}
        </div>

        <!-- Tarjetas de los Dos Grandes Mundos del CNEB -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <!-- MUNDO 1: AVENTURAS DE CANTIDAD -->
          <div id="card-world-cantidad" class="world-card bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 border-amber-400 group">
            <div class="w-24 h-24 rounded-full bg-amber-400 border-4 border-white shadow-xl flex items-center justify-center text-5xl mb-3 group-hover:scale-110 transition-transform">
              🧺
            </div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-black uppercase tracking-wider bg-amber-600 text-white px-3 py-1 rounded-full">Competencia 1</span>
              <span class="text-xs font-black px-2.5 py-1 rounded-full ${window.DocenteModule.getBadgeClass(evalCant.overall)}">
                ${evalCant.overall === 'Sin evaluar' ? '3 Sesiones' : `Nivel: ${evalCant.overall}`}
              </span>
            </div>
            <h2 class="text-3xl font-black text-amber-950 font-fun mb-2">Aventuras de Cantidad</h2>
            <p class="text-amber-900 font-semibold text-sm mb-5">
              1. Agrupar y Comparar • 2. Seriación y Ordinales • 3. Conteo al 10, Balanza y Operaciones.
            </p>
            <button id="btn-world-cantidad-go" type="button" class="btn-chunky btn-yellow w-full text-lg py-3">
              <span>Entrar a Cantidad</span>
              <span class="text-2xl">➔</span>
            </button>
          </div>

          <!-- MUNDO 2: EXPLORADORES DEL ESPACIO (100% OPERATIVO CON 3 SESIONES) -->
          <div id="card-world-espacio" class="world-card bg-gradient-to-br from-sky-200 via-indigo-100 to-purple-200 border-sky-400 group">
            <div class="w-24 h-24 rounded-full bg-sky-400 border-4 border-white shadow-xl flex items-center justify-center text-5xl mb-3 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-black uppercase tracking-wider bg-sky-600 text-white px-3 py-1 rounded-full">Competencia 2</span>
              <span class="text-xs font-black px-2.5 py-1 rounded-full ${window.DocenteModule.getBadgeClass(evalEsp.overall)}">
                ${evalEsp.overall === 'Sin evaluar' ? '3 Sesiones' : `Nivel: ${evalEsp.overall}`}
              </span>
            </div>
            <h2 class="text-3xl font-black text-sky-950 font-fun mb-2">Exploradores del Espacio</h2>
            <p class="text-sky-900 font-semibold text-sm mb-5">
              1. Formas 2D y 3D • 2. Ubicación Espacial (cerca/lejos/al lado) • 3. Laberinto de Flechas y Longitud.
            </p>
            <button id="btn-world-espacio-go" type="button" class="btn-chunky btn-blue w-full text-lg py-3">
              <span>Entrar a Espacio</span>
              <span class="text-2xl">➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.Kusi.render('#mascot-host');
    window.Kusi.say("¡Hola amiguito! Toca la tarjeta amarilla para Aventuras de Cantidad o la tarjeta azul para Exploradores del Espacio.");

    // Control de ingreso seguro y sin fallas a los dos mundos
    const handleEnterWorld = (worldId, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      window.SoundEngine.playPop();

      if (!window.AuthModule || !window.AuthModule.currentSession) {
        window.SoundEngine.playGentleTryAgain();
        window.AuthModule.openLoginModal('familia');
        return;
      }
      this.showWorld(worldId);
    };

    document.getElementById('card-world-cantidad')?.addEventListener('click', (e) => handleEnterWorld('cantidad', e));
    document.getElementById('btn-world-cantidad-go')?.addEventListener('click', (e) => handleEnterWorld('cantidad', e));

    document.getElementById('card-world-espacio')?.addEventListener('click', (e) => handleEnterWorld('espacio', e));
    document.getElementById('btn-world-espacio-go')?.addEventListener('click', (e) => handleEnterWorld('espacio', e));

    document.getElementById('btn-home-login-now')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      window.AuthModule.openLoginModal('familia');
    });

    document.getElementById('btn-quick-family-portal')?.addEventListener('click', () => {
      window.FamiliaModule.openPortal();
    });

    document.getElementById('btn-quick-logout')?.addEventListener('click', () => {
      window.AuthModule.logout();
    });
  },

  // 2. VISTA DE LAS 3 SESIONES DE CUALQUIER MUNDO
  showWorld(worldId) {
    if (!window.AuthModule || !window.AuthModule.currentSession) {
      window.SoundEngine.playGentleTryAgain();
      window.AuthModule.openLoginModal('familia');
      return;
    }

    this.currentView = 'world';
    this.currentWorldId = worldId;
    document.getElementById('btn-nav-home')?.classList.remove('hidden');

    const mainContainer = document.getElementById('app-main-content');
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return;

    const currentStudent = window.AppState.getCurrentStudent();
    const isCantidad = worldId === 'cantidad';
    const themeBorder = isCantidad ? 'border-amber-300' : 'border-sky-300';
    const themeBtn = isCantidad ? 'btn-yellow' : 'btn-blue';
    const themeBadge = isCantidad ? 'bg-amber-600' : 'bg-sky-600';

    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <!-- Cabecera del Mundo -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-5 bg-white/90 backdrop-blur-md p-4 rounded-3xl border-3 ${themeBorder} shadow-md">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${mundo.icono}</span>
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-fun">${mundo.nombre}</h2>
              <p class="text-xs text-slate-600 font-bold">3 Sesiones Pedagógicas • ${mundo.competencia}</p>
            </div>
          </div>
          <button id="btn-back-to-home" class="btn-chunky ${themeBtn} text-sm py-2 px-5">
            ⬅ Menú Principal
          </button>
        </div>

        <!-- 3 Tarjetas de Sesión -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${mundo.sesiones.map(ses => {
            const assessment = window.AppState.getSessionAssessment(worldId, ses.id);
            const grade = assessment?.grade || 'Sin evaluar';
            const completed = assessment?.completedCount || 0;
            const total = assessment?.totalCount || 0;

            return `
              <div class="world-card bg-white border-4 ${themeBorder} p-5 rounded-3xl shadow-lg flex flex-col justify-between text-left" data-session="${ses.id}">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-4xl">${ses.icono}</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${window.DocenteModule.getBadgeClass(grade)}">
                      ${grade === 'Sin evaluar' ? `${completed}/${total} Retos` : `Logro: ${grade}`}
                    </span>
                  </div>

                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Sesión ${ses.numero}</span>
                  <h3 class="text-xl font-black text-slate-900 font-fun mb-2 leading-snug">
                    ${ses.titulo.split(':')[1] || ses.titulo}
                  </h3>
                  <p class="text-xs text-slate-600 font-medium mb-3">
                    ${ses.proposito}
                  </p>
                </div>

                <!-- Lista de Juegos -->
                <div class="space-y-1.5 my-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span class="text-[11px] font-bold text-slate-800 block mb-1">Retos de la sesión:</span>
                  ${ses.juegos.map(j => {
                    const isDone = currentStudent?.evaluaciones?.[j.id]?.completed;
                    return `
                      <div class="flex items-center justify-between text-xs text-slate-700">
                        <span>${j.icono} ${j.titulo}</span>
                        <span>${isDone ? '✅' : '⚪'}</span>
                      </div>
                    `;
                  }).join('')}
                </div>

                <button class="btn-chunky ${themeBtn} w-full text-base py-2.5 mt-2 font-fun session-enter-btn" data-session="${ses.id}">
                  <span>Abrir Sesión ${ses.numero}</span>
                  <span>➔</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('btn-back-to-home')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.showHome();
    });

    mainContainer.querySelectorAll('.session-enter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        const sId = btn.dataset.session;
        this.showSessionGames(worldId, sId);
      });
    });

    window.Kusi.say(isCantidad ?
      "¡Estás en Aventuras de Cantidad! Elige una de las tres sesiones para jugar." :
      "¡Bienvenido a Exploradores del Espacio! Elige una de las tres sesiones de formas, ubicación y caminos."
    );
  },

  // 3. VISTA DE LOS JUEGOS DE UNA SESIÓN
  showSessionGames(worldId, sessionId) {
    if (!window.AuthModule || !window.AuthModule.currentSession) {
      window.SoundEngine.playGentleTryAgain();
      window.AuthModule.openLoginModal('familia');
      return;
    }

    this.currentView = 'session';
    this.currentWorldId = worldId;
    this.currentSessionId = sessionId;

    const mundo = window.CNEB_DATA.mundos[worldId];
    const session = mundo.sesiones.find(s => s.id === sessionId);
    if (!session) return;

    const currentStudent = window.AppState.getCurrentStudent();
    const isCantidad = worldId === 'cantidad';
    const themeBorder = isCantidad ? 'border-amber-300' : 'border-sky-300';
    const themeBtn = isCantidad ? 'btn-yellow' : 'btn-blue';

    const mainContainer = document.getElementById('app-main-content');
    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-4">
        <!-- Cabecera de la sesión -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white/90 p-4 rounded-3xl border-3 ${themeBorder} shadow">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${session.icono}</span>
            <div>
              <h2 class="text-2xl font-black text-slate-800 font-fun">${session.titulo}</h2>
              <p class="text-xs text-slate-600 font-bold">${session.proposito}</p>
            </div>
          </div>
          <button id="btn-back-to-sessions" class="btn-chunky ${themeBtn} text-sm py-2 px-4">
            ⬅ Todas las Sesiones
          </button>
        </div>

        <!-- Tarjetas de Juegos de la Sesión -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${session.juegos.length > 3 ? '4' : '3'} gap-5">
          ${session.juegos.map(j => {
            const ev = currentStudent?.evaluaciones?.[j.id];
            const isCompleted = ev?.completed;
            const grade = ev?.lastGrade;

            return `
              <div class="game-card group cursor-pointer" data-game="${j.id}">
                <div class="flex justify-between w-full items-start">
                  <span class="text-4xl group-hover:scale-110 transition-transform">${j.icono}</span>
                  ${isCompleted ? `
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-black ${window.DocenteModule.getBadgeClass(grade)}">
                      ✓ ${grade}
                    </span>
                  ` : `
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      ¡Jugar!
                    </span>
                  `}
                </div>

                <div class="my-3 text-center">
                  <h3 class="text-base font-black text-slate-800 font-fun group-hover:text-amber-600 transition-colors">
                    ${j.titulo}
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-1">
                    ${j.subtitulo}
                  </p>
                </div>

                <button class="btn-chunky ${themeBtn} w-full text-xs py-2 font-fun">
                  ¡Empezar Reto! ➔
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('btn-back-to-sessions')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.showWorld(worldId);
    });

    mainContainer.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        window.SoundEngine.playPop();
        const gameId = card.dataset.game;
        this.launchGame(gameId);
      });
    });

    window.Kusi.say(`¡Estás en la ${session.titulo}! Toca uno de los retos para comenzar.`);
  },

  // 4. LANZAMIENTO Y DESPACHO DE UN MINIJUEGO
  launchGame(gameId) {
    if (!window.AuthModule || !window.AuthModule.currentSession) {
      window.SoundEngine.playGentleTryAgain();
      window.AuthModule.openLoginModal('familia');
      return;
    }

    this.currentView = 'game';
    this.currentGameId = gameId;

    const mainContainer = document.getElementById('app-main-content');
    mainContainer.innerHTML = `
      <div class="max-w-5xl mx-auto px-2 py-2 flex flex-col min-h-[75vh]">
        <div class="flex items-center justify-between mb-2 px-2">
          <button id="btn-exit-game" class="btn-chunky btn-coral text-sm py-2 px-4 flex items-center gap-1.5">
            <span>⬅</span>
            <span>Volver</span>
          </button>
          <div class="text-slate-600 font-fun font-bold text-sm bg-white/80 px-4 py-1.5 rounded-full border shadow-sm">
            ¡Tú puedes lograrlo!
          </div>
        </div>

        <div id="game-active-stage" class="flex-1 w-full bg-white/70 backdrop-blur-md rounded-3xl border-4 border-white shadow-xl p-3">
          <!-- Renderizado dinámico del minijuego -->
        </div>
      </div>
    `;

    document.getElementById('btn-exit-game')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      if (this.currentSessionId) {
        this.showSessionGames(this.currentWorldId, this.currentSessionId);
      } else {
        this.showWorld(this.currentWorldId || 'cantidad');
      }
    });

    const stage = document.getElementById('game-active-stage');

    // Despacho de todos los juegos de los dos mundos
    switch (gameId) {
      // MUNDO 1 - SESIÓN 1
      case 'j1_1_color': window.Sesion1Games.playColor(stage); break;
      case 'j1_2_tamano': window.Sesion1Games.playTamano(stage); break;
      case 'j1_3_cuantificadores': window.Sesion1Games.playCuantificadores(stage); break;
      case 'j1_4_mas_menos': window.Sesion1Games.playMasMenos(stage); break;

      // MUNDO 1 - SESIÓN 2
      case 'j2_1_plantas': window.Sesion2Games.playPlantas(stage); break;
      case 'j2_2_zanahorias': window.Sesion2Games.playZanahorias(stage); break;
      case 'j2_3_trencito': window.Sesion2Games.playTrencito(stage); break;
      case 'j2_4_primero_ultimo': window.Sesion2Games.playPrimeroUltimo(stage); break;

      // MUNDO 1 - SESIÓN 3
      case 'j3_1_conteo10': window.GameConteo.init(stage); break;
      case 'j3_2_agregar': window.GameOperaciones.playAgregar(stage); break;
      case 'j3_3_quitar': window.GameOperaciones.playQuitar(stage); break;
      case 'j3_4_balanza': window.GamePesoTiempo.playBalanza(stage); break;
      case 'j3_5_tiempo': window.GamePesoTiempo.playTiempo(stage); break;

      // MUNDO 2 - SESIÓN 1 (FORMAS 2D Y 3D)
      case 'esp_j1_formas2d': window.SesionEsp1Games.playFormas2D(stage); break;
      case 'esp_j1_cuerpos3d': window.SesionEsp1Games.playCuerpos3D(stage); break;
      case 'esp_j1_clasificacion': window.SesionEsp1Games.playClasificacion(stage); break;

      // MUNDO 2 - SESIÓN 2 (UBICACIÓN ESPACIAL)
      case 'esp_j2_cerca_lejos': window.SesionEsp2Games.playCercaLejos(stage); break;
      case 'esp_j2_al_lado': window.SesionEsp2Games.playAlLado(stage); break;
      case 'esp_j2_posiciones': window.SesionEsp2Games.playPosiciones(stage); break;

      // MUNDO 2 - SESIÓN 3 (DESPLAZAMIENTO Y LONGITUD)
      case 'esp_j3_desplazamiento': window.GameDesplazamiento.init(stage); break;
      case 'esp_j3_mas_largo': window.GameLongitud.playMasLargo(stage); break;
      case 'esp_j3_mas_corto': window.GameLongitud.playMasCorto(stage); break;
      case 'esp_j3_puente': window.GameLongitud.playPuente(stage); break;

      default:
        stage.innerHTML = '<p class="text-center font-bold">Cargando reto...</p>';
    }
  },

  // 5. PANTALLA DE CELEBRACIÓN DE RETO LOGRADO
  showGameSuccess(gameId) {
    this.updateStars();
    window.ConfettiEngine.celebrate(3500);

    const student = window.AppState.getCurrentStudent();
    const totalStars = student ? (student.stars || 0) : (window.AppState.stars || 0);

    const mainContainer = document.getElementById('app-main-content');
    mainContainer.innerHTML = `
      <div class="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-pop">
        <div class="flex items-center gap-3 text-6xl mb-4">
          <span class="animate-bounce" style="animation-delay: 0.1s;">⭐</span>
          <span class="animate-bounce text-7xl" style="animation-delay: 0.25s;">⭐</span>
          <span class="animate-bounce" style="animation-delay: 0.4s;">⭐</span>
        </div>

        <div class="bg-white/95 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl max-w-lg w-full mb-6">
          <h2 class="text-4xl font-black text-amber-950 font-fun mb-2">
            ¡Reto Logrado!
          </h2>
          <p class="text-lg text-slate-700 font-bold mb-4 font-fun">
            ¡Ganaste 3 estrellas doradas para tu colección!
          </p>

          <div class="flex items-center justify-center gap-4 text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <span class="text-3xl">🎒</span>
            <span class="font-fun text-xl text-amber-900 font-black">
              Total: ${totalStars} Estrellas
            </span>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 w-full">
          <button id="btn-success-continue" class="btn-chunky btn-green text-xl py-3 px-8 shadow-xl">
            <span>Siguiente Reto</span>
            <span>➔</span>
          </button>
          <button id="btn-success-home" class="btn-chunky btn-yellow text-lg py-3 px-6 shadow-xl">
            <span>🏠 Menú Principal</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-success-continue')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      if (this.currentSessionId) {
        this.showSessionGames(this.currentWorldId, this.currentSessionId);
      } else {
        this.showWorld(this.currentWorldId || 'cantidad');
      }
    });

    document.getElementById('btn-success-home')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.showHome();
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
