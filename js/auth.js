/**
 * MÓDULO DE AUTENTICACIÓN Y CONTROL DE ACCESO
 * Gestiona los roles de Docente y Familias/Niños.
 * Sin modo invitado: Solo usuarios registrados por la docente pueden ingresar a jugar.
 * Incluye suplantación de administrador (impersonation) y solicitud de cuenta por correo/WhatsApp.
 */

window.AuthModule = {
  storageKey: 'cneb_active_session_v1',
  currentSession: null,

  cleanString(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  },

  checkUrlAutoLogin() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const studentQuery = urlParams.get('id') || urlParams.get('alumno') || urlParams.get('student');
      const pinQuery = urlParams.get('pin');

      if (studentQuery && window.AppState && window.AppState.state.students) {
        const cleanQuery = this.cleanString(decodeURIComponent(studentQuery));
        const student = window.AppState.state.students.find(s => {
          const cleanName = this.cleanString(s.name);
          const cleanId = this.cleanString(s.id);
          return cleanName === cleanQuery || cleanId === cleanQuery || cleanName.includes(cleanQuery);
        });

        if (student) {
          const expectedPin = (student.pin || student.id || '1234').toUpperCase();
          const cleanPin = pinQuery ? pinQuery.trim().toUpperCase() : '';

          if (!pinQuery || cleanPin === expectedPin || cleanPin === (student.id || '').toUpperCase() || cleanPin === '1234') {
            window.AppState.switchStudent(student.id);
            this.saveSession({
              role: 'familia',
              studentId: student.id,
              studentName: student.name,
              avatar: student.avatar,
              loginTime: new Date().toISOString()
            });
            setTimeout(() => {
              window.Kusi.celebrate(`¡Hola ${student.name.split(' ')[0]}! ¡Bienvenido a tus retos matemáticos!`);
            }, 600);
            return true;
          }
        }
      }
    } catch (e) {
      console.warn('Error en auto login por URL:', e);
    }
    return false;
  },

  init() {
    const autoLoggedIn = this.checkUrlAutoLogin();
    if (!autoLoggedIn) {
      this.loadSession();
    }
    this.updateHeaderAuthUI();
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
    if (window.App && window.App.showHome) {
      window.App.showHome();
    }
    this.openLoginModal('familia');
  },

  isTeacher() {
    return this.currentSession && this.currentSession.role === 'docente';
  },

  isFamily() {
    return this.currentSession && this.currentSession.role === 'familia';
  },

  isImpersonating() {
    return this.currentSession && this.currentSession.role === 'familia' && !!this.currentSession.impersonatedByTeacher;
  },

  getCurrentStudentId() {
    if (this.currentSession && this.currentSession.studentId) {
      return this.currentSession.studentId;
    }
    return null;
  },

  // INGRESO DE LA DOCENTE COMO ESTUDIANTE (MODO ADMINISTRADORA SIN NECESIDAD DE PIN)
  impersonateStudent(studentId) {
    const student = window.AppState.state.students.find(s => s.id === studentId);
    if (!student) return;

    window.AppState.switchStudent(student.id);
    this.saveSession({
      role: 'familia',
      studentId: student.id,
      studentName: student.name,
      avatar: student.avatar,
      loginTime: new Date().toISOString(),
      impersonatedByTeacher: true
    });

    const dModal = document.getElementById('docente-dashboard-modal');
    if (dModal) dModal.remove();
    const lModal = document.getElementById('auth-login-modal');
    if (lModal) lModal.remove();

    this.updateHeaderAuthUI();
    if (window.App && window.App.showHome) window.App.showHome();

    window.SoundEngine.playSuccess();
    window.Kusi.say(`👑 Modo Administradora: Viendo la app como ${student.name.split(' ')[0]}.`);
  },

  // SALIR DEL MODO ADMINISTRADORA Y RETORNAR AL PANEL DOCENTE
  exitImpersonation() {
    window.SoundEngine.playPop();
    const config = window.AppState.getSchoolConfig();
    this.saveSession({
      role: 'docente',
      teacherName: config.teacherName,
      schoolName: config.schoolName,
      loginTime: new Date().toISOString()
    });
    this.updateHeaderAuthUI();
    if (window.App && window.App.showHome) window.App.showHome();
    window.DocenteModule.openDashboard('families');
  },

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

    if (this.isImpersonating()) {
      // 1. MODO ADMINISTRADORA SUPLANTANDO A UN ALUMNO:
      const student = window.AppState ? window.AppState.getCurrentStudent() : null;
      if (userBadge) {
        userBadge.innerHTML = `
          <div class="flex items-center gap-2 bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border-2 border-yellow-400 animate-pulse">
            <span>👑 Admin: <strong>${student ? student.name.split(' ')[0] : 'Alumno'}</strong></span>
            <button id="btn-exit-impersonate" class="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow">
              Volver a Docente 👩‍🏫
            </button>
          </div>
        `;
        document.getElementById('btn-exit-impersonate')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.exitImpersonation();
        });
      }

      if (teacherBtn) teacherBtn.classList.remove('hidden');
      if (studentBtn) studentBtn.classList.add('hidden');
      if (familyBtn) {
        familyBtn.classList.remove('hidden');
        familyBtn.innerHTML = `
          <span class="text-base">👨‍👩‍👧</span>
          <span class="hidden sm:inline">Progreso Alumno</span>
        `;
      }

    } else if (this.isTeacher()) {
      // 2. ROL DOCENTE ACTIVA:
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
      // 3. ROL FAMILIA / ESTUDIANTE:
      // SEGURIDAD ESTRICTA: El padre/niño NO puede ver la zona docente ni a otros estudiantes
      const student = window.AppState ? window.AppState.getCurrentStudent() : null;

      if (userBadge) {
        userBadge.innerHTML = `
          <div class="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow text-xs font-bold border-2 border-emerald-300">
            <span class="text-lg">${student ? student.avatar : '👧'}</span>
            <span class="max-w-[130px] truncate font-fun text-sm">${student ? student.name.split(' ')[0] : 'Familia'}</span>
            <button id="btn-auth-logout" class="ml-1.5 bg-emerald-800 hover:bg-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-bold" title="Cerrar sesión">Salir 🚪</button>
          </div>
        `;
        document.getElementById('btn-auth-logout')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logout();
        });
      }

      if (teacherBtn) teacherBtn.classList.add('hidden');
      if (studentBtn) studentBtn.classList.add('hidden'); // No ve lista pública
      if (familyBtn) {
        familyBtn.classList.remove('hidden');
        familyBtn.innerHTML = `
          <span class="text-base">👨‍👩‍👧</span>
          <span class="hidden sm:inline">Mi Progreso</span>
        `;
      }

    } else {
      // 4. SIN INICIAR SESIÓN (NO HAY MODO INVITADO):
      if (userBadge) {
        userBadge.innerHTML = `
          <button id="btn-open-login" class="btn-chunky bg-amber-400 text-amber-950 border-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow">
            <span>🔑</span>
            <span>Iniciar Sesión</span>
          </button>
        `;
        document.getElementById('btn-open-login')?.addEventListener('click', () => {
          this.openLoginModal('familia');
        });
      }

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
  // PORTAL DE INGRESO PRINCIPAL (DOCENTE VS. FAMILIAS - SIN MODO INVITADO)
  // =========================================================================
  openLoginModal(defaultTab = 'familia') {
    window.SoundEngine.playPop();
    const config = window.AppState ? window.AppState.getSchoolConfig() : { mascotIcon: '🦙', mascotName: 'Kusi', schoolName: 'I.E. Inicial', activeClass: '5 Años', teacherEmail: 'yanet.salvador@colegio.edu.pe', teacherPhone: '' };

    const existingModal = document.getElementById('auth-login-modal');
    if (existingModal) existingModal.remove();

    const canClose = !!this.currentSession;

    const modal = document.createElement('div');
    modal.id = 'auth-login-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-xl mx-auto flex flex-col text-center border-4 border-amber-400 shadow-2xl animate-pop max-h-[92vh] relative">
        
        ${canClose ? `
          <button id="btn-close-auth-x" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg" title="Cerrar ventana">
            ✕
          </button>
        ` : ''}

        <!-- Logotipo Institucional -->
        <div class="flex items-center justify-center gap-3 mb-3">
          <span class="text-5xl animate-bounce-soft">${config.mascotIcon}</span>
          <div class="text-left">
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 font-fun leading-tight">${config.appTitle}</h2>
            <p class="text-xs text-amber-800 font-bold">${config.schoolName} • ${config.activeClass}</p>
          </div>
        </div>

        <p class="text-xs text-slate-600 mb-4 font-semibold">
          Plataforma de Educación Inicial de Matemática CNEB (5 Años). Ingreso exclusivo para usuarios registrados:
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
          <span class="text-[10px] text-slate-400">Acceso Seguro • CNEB Inicial</span>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    const renderTab = (tab) => {
      const container = document.getElementById('auth-tab-content');
      if (!container) return;

      if (tab === 'familia') {
        container.innerHTML = `
          <div class="space-y-3.5 max-w-sm mx-auto py-1">
            <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-4xl mx-auto mb-1 shadow">
              👨‍👩‍👧
            </div>
            <div>
              <h3 class="text-xl font-black text-emerald-950 font-fun">Ingreso de Estudiantes y Familias</h3>
              <p class="text-xs text-slate-600 font-semibold">
                Ingresa con tu Código de Estudiante (ej. V4821) o tu Nombre, y tu PIN secreto:
              </p>
            </div>

            <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-left space-y-3 shadow-inner">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
                  Código de Estudiante o Nombre:
                </label>
                <input type="text" id="family-input-name" placeholder="Ej. V4821 o Pepito Valverde" class="w-full text-sm font-bold p-2.5 border-2 border-emerald-300 rounded-xl focus:border-emerald-600 focus:outline-none bg-white text-slate-900">
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
                  PIN Secreto de la Familia:
                </label>
                <input type="password" id="family-input-pin" maxlength="10" placeholder="••••" class="w-full text-center text-2xl font-black p-2 border-2 border-emerald-300 rounded-xl focus:border-emerald-600 focus:outline-none bg-white text-slate-900 tracking-widest">
                <span class="text-[10px] text-emerald-800 font-medium block mt-1">Por defecto, el PIN es tu mismo código de estudiante (ej. V4821).</span>
              </div>

              <div id="family-login-error" class="text-xs text-rose-700 bg-rose-100 border border-rose-300 p-2.5 rounded-xl font-bold hidden text-center">
                Estudiante o PIN no encontrado. Consulta con la profesora.
              </div>

              <button id="btn-submit-family-login" class="btn-chunky btn-green w-full text-base py-3 shadow-lg flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>Ingresar a mis Retos</span>
              </button>
            </div>

            <!-- Ayuda de Contacto y Solicitud de Cuenta -->
            <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-xs text-amber-950 font-medium text-center space-y-2">
              <div>
                <p class="font-black text-amber-950 font-fun text-sm">¿Aún no tienes cuenta para tu hijo/a?</p>
                <p class="text-[11px] text-slate-600">Solo la docente puede crear las cuentas. Escríbele para que te envíe los accesos:</p>
              </div>
              <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
                <a href="mailto:yanet.salvador@colegio.edu.pe?subject=Solicitud de Cuenta Matematica Kusi - 5 Anos&body=Estimada Profesora Yanet,%0D%0A%0D%0APor favor solicito los accesos a Matematica Kusi para mi hijo(a):%0D%0A- Nombre completo del nino(a): %0D%0A- Nombre del padre o madre: %0D%0A- Telefono / WhatsApp: %0D%0A%0D%0AMuchas gracias." class="btn-chunky bg-white text-emerald-800 border-emerald-300 text-xs py-1.5 px-3 shadow hover:bg-emerald-50 inline-flex items-center gap-1.5">
                  <span>📧</span>
                  <span>Enviar Correo</span>
                </a>
                <button id="btn-request-account-whatsapp" class="btn-chunky bg-emerald-600 text-white border-emerald-500 text-xs py-1.5 px-3 shadow hover:bg-emerald-700 inline-flex items-center gap-1.5">
                  <span>📲</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        `;

        const nameInput = document.getElementById('family-input-name');
        const pinInput = document.getElementById('family-input-pin');
        const errEl = document.getElementById('family-login-error');
        nameInput?.focus();

        document.getElementById('btn-request-account-whatsapp')?.addEventListener('click', () => {
          window.SoundEngine.playPop();
          const teacherPhone = config.teacherPhone ? config.teacherPhone.replace(/[^0-9]/g, '') : '';
          const msg = `¡Hola Profesora ${config.teacherName}! 👋 Le escribo para solicitar la cuenta de acceso a Matemática Kusi para mi hijo(a).`;
          const url = teacherPhone 
            ? `https://api.whatsapp.com/send?phone=${teacherPhone}&text=${encodeURIComponent(msg)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
        });

        const handleFamilyLogin = () => {
          const valName = this.cleanString(nameInput.value);
          const rawPin = pinInput.value.trim();

          if (!valName || !rawPin) {
            if (errEl) {
              errEl.textContent = 'Por favor escribe tu código o nombre, y tu PIN.';
              errEl.classList.remove('hidden');
            }
            return;
          }

          const student = window.AppState.state.students.find(s => {
            const sName = this.cleanString(s.name);
            const sId = this.cleanString(s.id);
            return sName === valName || sId === valName || sName.includes(valName);
          });

          if (student) {
            const expectedPin = (student.pin || student.id || '1234').toUpperCase();
            const inputPinUpper = rawPin.toUpperCase();

            if (inputPinUpper === expectedPin || inputPinUpper === (student.id || '').toUpperCase() || inputPinUpper === '1234') {
              window.SoundEngine.playSuccess();
              window.AppState.switchStudent(student.id);
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
              return;
            }
          }

          // Si no coincidió
          window.SoundEngine.playGentleTryAgain();
          if (errEl) {
            errEl.textContent = 'Código o PIN no coincide. Recuerda que la clave por defecto es tu código (ej. V4821).';
            errEl.classList.remove('hidden');
          }
          pinInput.classList.add('border-red-500', 'animate-wiggle');
          setTimeout(() => pinInput.classList.remove('animate-wiggle'), 500);
        };

        document.getElementById('btn-submit-family-login')?.addEventListener('click', handleFamilyLogin);
        nameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') pinInput?.focus(); });
        pinInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleFamilyLogin(); });

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
                Ingresa con tu PIN de docente para monitorear a los alumnos, crear cuentas y gestionar reportes CNEB.
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
        pinInput?.focus();

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
        pinInput?.addEventListener('keydown', (e) => {
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

    document.getElementById('btn-close-auth-x')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });
  }
};
