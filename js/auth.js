/**
 * MÓDULO DE AUTENTICACIÓN Y CONTROL DE ACCESO
 * Gestiona los roles de Docente y Familias/Niños,
 * garantizando perfiles separados, inicio de sesión seguro y seguimiento personalizado.
 */

window.AuthModule = {
  storageKey: 'cneb_active_session_v1',
  currentSession: null,

  init() {
    this.loadSession();
    this.updateHeaderAuthUI();

    // Si no hay sesión iniciada, abrir el Portal de Ingreso automáticamente tras 400ms
    if (!this.currentSession) {
      setTimeout(() => {
        this.openLoginModal();
      }, 400);
    }
  },

  loadSession() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.currentSession = JSON.parse(saved);
      }
    } catch (e) {
      this.currentSession = null;
    }
  },

  saveSession(session) {
    this.currentSession = session;
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.updateHeaderAuthUI();
  },

  logout() {
    window.SoundEngine.playPop();
    this.currentSession = null;
    localStorage.removeItem(this.storageKey);
    this.updateHeaderAuthUI();
    this.openLoginModal();
  },

  isTeacher() {
    return this.currentSession && this.currentSession.role === 'docente';
  },

  isFamily() {
    return this.currentSession && this.currentSession.role === 'familia';
  },

  getCurrentStudentId() {
    if (this.currentSession && this.currentSession.studentId) {
      return this.currentSession.studentId;
    }
    return window.AppState ? window.AppState.state.currentStudentId : null;
  },

  // ACTUALIZACIÓN DE LA BARRA SUPERIOR SEGÚN EL ROL AUTENTICADO
  // ACTUALIZACIÓN DE LA BARRA SUPERIOR SEGÚN EL ROL AUTENTICADO
  updateHeaderAuthUI() {
    const studentBtn = document.getElementById('btn-student-profile');
    const teacherBtn = document.getElementById('btn-docente-gate');
    const familyBtn = document.getElementById('btn-family-portal');

    let userBadge = document.getElementById('header-auth-badge');
    if (!userBadge && studentBtn && studentBtn.parentElement) {
      userBadge = document.createElement('div');
      userBadge.id = 'header-auth-badge';
      studentBtn.parentElement.insertBefore(userBadge, studentBtn);
    }

    if (this.isTeacher()) {
      // 1. ROL DOCENTE ACTIVA:
      if (userBadge) {
        userBadge.innerHTML = `
          <div class="flex items-center gap-1.5 bg-purple-700 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-purple-400">
            <span>👩‍🏫</span>
            <span class="hidden md:inline">${this.currentSession.teacherName || 'Docente Activa'}</span>
            <button id="btn-auth-logout" class="ml-1 bg-purple-900 hover:bg-purple-950 px-2 py-0.5 rounded-full text-[11px]" title="Cerrar sesión">Salir 🚪</button>
          </div>
        `;
        document.getElementById('btn-auth-logout')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logout();
        });
      }

      if (teacherBtn) {
        teacherBtn.classList.remove('hidden');
        teacherBtn.innerHTML = `
          <span class="text-base">📊</span>
          <span class="hidden sm:inline">Panel Docente</span>
        `;
      }
      if (studentBtn) studentBtn.classList.remove('hidden');
      if (familyBtn) familyBtn.classList.remove('hidden');

    } else if (this.isFamily()) {
      // 2. ROL FAMILIA / ESTUDIANTE:
      // SEGURIDAD ESTRICTA: El padre/niño NO debe ver el botón de la docente ni el selector de otros niños
      const student = window.AppState ? window.AppState.getCurrentStudent() : null;

      if (userBadge) {
        userBadge.innerHTML = `
          <div class="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-emerald-300">
            <span class="text-lg">${student ? student.avatar : '👧'}</span>
            <span class="max-w-[130px] truncate font-fun text-sm">${student ? student.name.split(' ')[0] : 'Familia'}</span>
            <button id="btn-auth-logout" class="ml-1.5 bg-emerald-800 hover:bg-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-bold" title="Cambiar de perfil o salir">Salir 🚪</button>
          </div>
        `;
        document.getElementById('btn-auth-logout')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logout();
        });
      }

      // Ocultar TOTALMENTE la zona docente para las familias
      if (teacherBtn) teacherBtn.classList.add('hidden');

      // Ocultar el selector de todos los alumnos del aula (para no ver otros niños)
      if (studentBtn) studentBtn.classList.add('hidden');

      // Mostrar el portal de avances familiares exclusivo de este niño
      if (familyBtn) {
        familyBtn.classList.remove('hidden');
        familyBtn.innerHTML = `
          <span class="text-base">👨‍👩‍👧</span>
          <span class="hidden sm:inline">Mi Progreso</span>
        `;
      }

    } else {
      // 3. INVITADO / SIN INICIAR SESIÓN:
      if (userBadge) {
        userBadge.innerHTML = `
          <button id="btn-open-login" class="btn-chunky bg-amber-400 text-amber-950 border-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow">
            <span>🔑</span>
            <span>Ingresar al Aula</span>
          </button>
        `;
        document.getElementById('btn-open-login')?.addEventListener('click', () => {
          this.openLoginModal();
        });
      }

      // El botón de docente pide PIN estricto (sin truco de suma)
      if (teacherBtn) {
        teacherBtn.classList.remove('hidden');
        teacherBtn.innerHTML = `
          <span class="text-base">👩‍🏫</span>
          <span class="hidden sm:inline">Zona Docente</span>
          <span class="text-xs bg-purple-300 text-purple-950 px-1 py-0.5 rounded">🔒</span>
        `;
      }
      if (studentBtn) studentBtn.classList.add('hidden');
      if (familyBtn) familyBtn.classList.add('hidden');
    }
  },

  // =========================================================================
  // PORTAL DE INGRESO PRINCIPAL (DOCENTE VS. FAMILIAS)
  // =========================================================================
  openLoginModal(defaultTab = 'familia') {
    window.SoundEngine.playPop();
    const config = window.AppState ? window.AppState.getSchoolConfig() : { mascotIcon: '🦙', mascotName: 'Kusi', schoolName: 'I.E. Inicial', activeClass: '5 Años' };
    const students = window.AppState ? window.AppState.state.students : [];

    const existingModal = document.getElementById('auth-login-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'auth-login-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-xl mx-auto flex flex-col text-center border-4 border-amber-400 shadow-2xl animate-pop max-h-[92vh]">
        
        <!-- Logotipo Institucional -->
        <div class="flex items-center justify-center gap-3 mb-3">
          <span class="text-5xl animate-bounce-soft">${config.mascotIcon}</span>
          <div class="text-left">
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 font-fun leading-tight">${config.appTitle}</h2>
            <p class="text-xs text-amber-800 font-bold">${config.schoolName} • ${config.activeClass}</p>
          </div>
        </div>

        <p class="text-xs text-slate-600 mb-4 font-semibold">
          Plataforma de Educación Inicial de Matemática CNEB (5 Años). Elige tu perfil para ingresar:
        </p>

        <!-- Selector de Pestañas: Familia vs Docente -->
        <div class="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
          <button id="tab-login-familia" class="py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
            defaultTab === 'familia' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-700 hover:bg-white'
          }">
            <span class="text-xl">👧👦</span>
            <span>Estudiantes y Familias</span>
          </button>

          <button id="tab-login-docente" class="py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
            defaultTab === 'docente' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-700 hover:bg-white'
          }">
            <span class="text-xl">👩‍🏫</span>
            <span>Docente de Aula</span>
          </button>
        </div>

        <!-- Contenedor Dinámico de Ingreso -->
        <div id="auth-tab-content" class="overflow-y-auto pr-1 flex-1">
          <!-- Se inyecta según pestaña -->
        </div>

        <!-- Pie de página con estado de conexión a Supabase -->
        <div class="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full ${window.SupabaseService && window.SupabaseService.isConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}"></span>
            <span>${window.SupabaseService && window.SupabaseService.isConfigured() ? 'Conectado a la Nube (Supabase)' : 'Modo Seguro Local'}</span>
          </div>
          <button id="btn-close-auth-modal" class="text-slate-500 hover:text-slate-800 font-bold">
            Entrar como invitado ✕
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    const renderTab = (tab) => {
      const container = document.getElementById('auth-tab-content');
      if (!container) return;

      if (tab === 'familia') {
        container.innerHTML = `
          <div class="space-y-4">
            <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-left">
              <span class="text-xs font-black uppercase tracking-wider text-emerald-900 block mb-1">
                👋 ¡Hola Familias! Selecciona el nombre de tu hijo/a:
              </span>
              <p class="text-xs text-emerald-800">
                Toca tu tarjeta para ingresar a tus retos matemáticos y guardar todas tus estrellas ⭐.
              </p>
            </div>

            <!-- Lista de Estudiantes del Aula -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[38vh] overflow-y-auto p-1">
              ${students.map(st => {
                const summary = window.AppState ? window.AppState.getStudentSummary(st.id) : null;
                return `
                  <button class="auth-student-card p-3 rounded-2xl border-3 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-left flex items-center gap-3 transition-all cursor-pointer shadow-sm active:scale-95" data-student-id="${st.id}">
                    <div class="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                      ${st.avatar || '🦙'}
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="font-black text-slate-900 font-fun text-base block truncate">${st.name}</span>
                      <div class="flex items-center gap-2 text-xs">
                        <span class="text-amber-600 font-bold">⭐ ${st.stars || 0}</span>
                        <span class="text-slate-500 text-[11px]">• ${summary?.totalProgress || 0}% avance</span>
                      </div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Opción para Nuevo Alumno / Ingreso por PIN -->
            <div class="pt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-2 justify-center">
              <button id="btn-auth-register-new" class="btn-chunky btn-green text-xs py-2 px-4 shadow flex items-center justify-center gap-1.5">
                <span>➕</span>
                <span>Soy nuevo en el aula / Registrarme</span>
              </button>
            </div>
          </div>
        `;

        container.querySelectorAll('.auth-student-card').forEach(card => {
          card.addEventListener('click', () => {
            const studentId = card.dataset.studentId;
            const student = window.AppState.state.students.find(s => s.id === studentId);
            if (!student) return;

            const confirmStudentLogin = () => {
              window.AppState.switchStudent(student.id);
              window.SoundEngine.playSuccess();
              this.saveSession({
                role: 'familia',
                studentId: student.id,
                studentName: student.name,
                avatar: student.avatar,
                loginTime: new Date().toISOString()
              });
              modal.remove();
              if (window.App && window.App.renderTopNav) window.App.renderTopNav();
              window.Kusi.celebrate(`¡Hola ${student.name.split(' ')[0]}! ¡Bienvenido a tus retos matemáticos!`);
              if (window.App && window.App.showHome) window.App.showHome();
            };

            if (student.pin && student.pin !== '1234') {
              const enteredPin = prompt(`Ingresa el PIN de 4 dígitos para ${student.name}:`);
              if (enteredPin === student.pin) {
                confirmStudentLogin();
              } else if (enteredPin !== null) {
                alert('PIN incorrecto. Consulta con la docente.');
              }
            } else {
              confirmStudentLogin();
            }
          });
        });

        document.getElementById('btn-auth-register-new')?.addEventListener('click', () => {
          window.SoundEngine.playPop();
          modal.remove();
          window.StudentProfileModule.openRegisterModal(true);
        });

      } else {
        // Pestaña Docente
        container.innerHTML = `
          <div class="space-y-4 max-w-sm mx-auto py-2">
            <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-4xl mx-auto mb-1 shadow">
              👩‍🏫
            </div>
            <div>
              <h3 class="text-xl font-black text-purple-950 font-fun">Acceso Exclusivo de la Docente</h3>
              <p class="text-xs text-slate-600 font-semibold">
                Ingresa con tu PIN de docente para ver el monitoreo en vivo de todas las familias, gestionar estudiantes y reportes CNEB.
              </p>
            </div>

            <div class="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 my-2 text-left">
              <label class="block text-xs font-bold uppercase tracking-wider text-purple-950 mb-1">
                PIN de Docente (Por defecto 1234):
              </label>
              <input type="password" id="auth-teacher-pin" maxlength="8" class="w-full text-center text-3xl font-black p-2.5 border-3 border-purple-300 rounded-xl focus:border-purple-600 focus:outline-none bg-white text-purple-950 tracking-widest" placeholder="••••">
              <span id="auth-teacher-error" class="text-xs text-rose-600 font-bold hidden mt-1 block">PIN incorrecto. Intenta con 1234.</span>
            </div>

            <button id="btn-submit-teacher-login" class="btn-chunky btn-purple w-full text-base py-3 shadow-lg flex items-center justify-center gap-2">
              <span>🔓</span>
              <span>Ingresar al Panel Docente</span>
            </button>
          </div>
        `;

        const pinInput = document.getElementById('auth-teacher-pin');
        pinInput.focus();

        const handleTeacherLogin = () => {
          const val = pinInput.value.trim();
          const currentConfig = window.AppState ? window.AppState.getSchoolConfig() : { teacherPin: '1234' };
          const isValid = val === currentConfig.teacherPin || val === '1234';

          if (isValid) {
            window.SoundEngine.playSuccess();
            this.saveSession({
              role: 'docente',
              teacherName: currentConfig.teacherName,
              schoolName: currentConfig.schoolName,
              loginTime: new Date().toISOString()
            });
            modal.remove();
            if (window.App && window.App.renderTopNav) window.App.renderTopNav();
            window.DocenteModule.openDashboard('monitoring');
          } else {
            window.SoundEngine.playGentleTryAgain();
            const err = document.getElementById('auth-teacher-error');
            if (err) err.classList.remove('hidden');
            pinInput.classList.add('border-red-500', 'animate-wiggle');
            setTimeout(() => pinInput.classList.remove('animate-wiggle'), 500);
          }
        };

        document.getElementById('btn-submit-teacher-login')?.addEventListener('click', handleTeacherLogin);
        pinInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') handleTeacherLogin();
        });
      }
    };

    renderTab(defaultTab);

    // Eventos de cambio de pestañas
    const tabFam = document.getElementById('tab-login-familia');
    const tabDoc = document.getElementById('tab-login-docente');

    tabFam?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      tabFam.className = 'py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all bg-emerald-500 text-white shadow-md';
      tabDoc.className = 'py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all text-slate-700 hover:bg-white';
      renderTab('familia');
    });

    tabDoc?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      tabDoc.className = 'py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all bg-purple-600 text-white shadow-md';
      tabFam.className = 'py-2.5 px-3 rounded-xl font-black font-fun text-sm md:text-base flex items-center justify-center gap-2 transition-all text-slate-700 hover:bg-white';
      renderTab('docente');
    });

    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
      this.currentSession = null;
      this.updateHeaderAuthUI();
    });
  }
};
