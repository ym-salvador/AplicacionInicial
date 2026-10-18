/**
 * MÓDULO DE PERFILES INFANTILES Y SELECCIÓN DE ESTUDIANTES
 * Permite a los niños o familias elegir su perfil, registrarse con su nombre y avatar,
 * y cambiar de estudiante en tablets o pantallas compartidas de Educación Inicial.
 */

window.StudentProfileModule = {
  avatars: [
    // Animalitos Andinos y Peruanos
    '🦙', '🦊', '🐹', '🦅', '🐬', '🐧',
    // Animalitos de la Selva y Sabana
    '🦁', '🐘', '🦒', '🐒', '🐯', '🐼', '🐨', '🦓', '🦥', '🦩', '🦜', '🐆',
    // Animalitos de la Granja y Hogar
    '🐶', '🐱', '🐰', '🐻', '🐸', '🐥', '🦆', '🐮', '🐷', '🐑', '🐴',
    // Mar, Jardín y Fantasía
    '🐳', '🐙', '🐢', '🦋', '🐝', '🐞', '🐌', '🦄', '🦕'
  ],
  selectedAvatar: '🦙',

  init() {
    this.updateHeaderDisplay();
    
    // Si la sesión es de familia, abre directamente su portal familiar privado
    document.getElementById('btn-student-profile')?.addEventListener('click', () => {
      if (window.AuthModule && window.AuthModule.isFamily()) {
        window.FamiliaModule.openPortal();
        return;
      }
      if (window.AuthModule && window.AuthModule.isTeacher()) {
        window.SoundEngine.playPop();
        this.openSelectorModal();
        return;
      }
      // Si no ha iniciado sesión, pide credenciales
      window.SoundEngine.playPop();
      window.AuthModule.openLoginModal('familia');
    });
  },

  checkFirstHomeVisit() {
    // Manejado por AuthModule
  },

  updateHeaderDisplay() {
    const student = window.AppState.getCurrentStudent();
    if (!student || !window.AuthModule || !window.AuthModule.currentSession) return;

    const avatarEl = document.getElementById('header-student-avatar');
    const nameEl = document.getElementById('header-student-name');
    const starCount = document.getElementById('star-count');

    if (avatarEl) avatarEl.textContent = student.avatar || '🦙';
    if (nameEl) nameEl.textContent = student.name.split(' ')[0] || 'Estudiante';
    if (starCount) starCount.textContent = student.stars || 0;
  },

  // MODAL: SELECCIÓN EXCLUSIVA (SOLO DOCENTE)
  openSelectorModal() {
    if (!window.AuthModule || !window.AuthModule.isTeacher()) {
      window.AuthModule.openLoginModal('familia');
      return;
    }

    const currentStudent = window.AppState.getCurrentStudent();
    const students = window.AppState.state.students;

    const modal = document.createElement('div');
    modal.id = 'student-selector-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-5 sm:p-6 max-w-xl mx-auto flex flex-col text-center border-4 border-amber-400 shadow-2xl max-h-[92vh]">
        
        <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl animate-bounce-soft">🦙</span>
            <div class="text-left">
              <h3 class="text-2xl font-black text-amber-950 font-fun leading-none">¿Quién está jugando hoy?</h3>
              <p class="text-xs text-amber-800 font-bold mt-0.5">Toca el perfil del estudiante para ver o registrar sus estrellas</p>
            </div>
          </div>
          <button id="btn-close-selector" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-lg transition-colors">
            ✕
          </button>
        </div>

        <!-- Buscador de Estudiante en Tiempo Real -->
        <div class="relative mb-3 text-left">
          <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 text-base">🔍</span>
          <input type="text" id="selector-student-search" 
                 placeholder="Buscar estudiante por nombre o apellido..." 
                 class="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-sm font-bold bg-amber-50/70 text-slate-800 placeholder-slate-400 transition-all shadow-inner">
          <button id="btn-clear-selector-search" class="hidden absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 text-sm font-bold">
            ✕
          </button>
        </div>

        <!-- Cuadrícula de Estudiantes Registrados -->
        <div id="selector-students-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-1 overflow-y-auto max-h-[48vh] p-1">
          ${students.map(st => {
            const isSelected = st.id === currentStudent?.id;
            const summary = window.AppState.getStudentSummary(st.id);
            return `
              <button class="student-select-card p-3 rounded-2xl border-4 text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-amber-500 bg-amber-50 shadow-md scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50 shadow-sm'
              }" data-student-id="${st.id}" data-student-name="${st.name}">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  ${st.avatar || '🦙'}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-900 font-fun text-base truncate block">${st.name}</span>
                    ${isSelected ? '<span class="text-xs bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-bold">Activo</span>' : ''}
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs font-bold text-amber-600">⭐ ${st.stars || 0}</span>
                    <span class="text-[11px] text-slate-500">• ${summary?.totalProgress || 0}% avance</span>
                  </div>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Mensaje de no encontrado en búsqueda -->
        <div id="selector-empty-search" class="hidden py-8 text-center text-slate-500 font-bold text-sm">
          🔍 No se encontró ningún estudiante con ese nombre.
        </div>

        <!-- Botón para Registrar Nuevo Estudiante (Redirige a Zona Docente Oficial) -->
        <div class="pt-3.5 border-t-2 border-amber-200 mt-2 flex flex-col items-center gap-1.5">
          <button id="btn-open-register-student" class="btn-chunky bg-purple-700 hover:bg-purple-800 text-white border-purple-900 text-xs sm:text-sm py-2.5 px-6 shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
            <span>➕</span>
            <span>Registrar Nuevo Alumno (Zona Docente)</span>
          </button>
          <p class="text-[11px] text-amber-900 font-bold">Solo la profesora genera accesos oficiales con ID ([Apellido]+4 números) y PIN.</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos de Cierre
    document.getElementById('btn-close-selector')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    // Eventos de Búsqueda en Tiempo Real
    const searchInput = document.getElementById('selector-student-search');
    const clearBtn = document.getElementById('btn-clear-selector-search');
    const cards = modal.querySelectorAll('.student-select-card');
    const emptyNotice = document.getElementById('selector-empty-search');

    const cleanStr = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    searchInput?.addEventListener('input', () => {
      const q = cleanStr(searchInput.value);
      if (q.length > 0) {
        clearBtn?.classList.remove('hidden');
      } else {
        clearBtn?.classList.add('hidden');
      }

      let visibleCount = 0;
      cards.forEach(card => {
        const name = cleanStr(card.dataset.studentName || '');
        const id = cleanStr(card.dataset.studentId || '');
        if (name.includes(q) || id.includes(q)) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (emptyNotice) {
        if (visibleCount === 0) {
          emptyNotice.classList.remove('hidden');
        } else {
          emptyNotice.classList.add('hidden');
        }
      }
    });

    clearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      cards.forEach(card => card.classList.remove('hidden'));
      emptyNotice?.classList.add('hidden');
      searchInput.focus();
    });

    // Evento Selección de Estudiante
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const studentId = card.dataset.studentId;
        const switched = window.AppState.switchStudent(studentId);
        if (switched) {
          window.SoundEngine.playSuccess();
          this.updateHeaderDisplay();
          modal.remove();
          window.Kusi.say(`¡Hola ${switched.name.split(' ')[0]}! ¡Vamos a divertirnos aprendiendo matemática!`);
          
          if (window.App.currentView === 'home') {
            window.App.showHome();
          }
        }
      });
    });

    // Evento Redirigir a Registro de Alumno
    document.getElementById('btn-open-register-student')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
      this.openRegisterModal();
    });
  },

  // MODAL: REGISTRAR ALUMNO (SOLO AUTORIZADO PARA DOCENTE)
  openRegisterModal() {
    if (!window.AuthModule || !window.AuthModule.isTeacher()) {
      window.DocenteModule.openGateModal();
      return;
    }
    window.DocenteModule.openDashboard('families');
    setTimeout(() => {
      const formBox = document.getElementById('add-family-form-box');
      if (formBox) {
        formBox.classList.remove('hidden');
        formBox.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('new-child-name')?.focus();
      }
    }, 250);
  }
};
