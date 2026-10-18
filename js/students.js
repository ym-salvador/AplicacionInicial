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
      <div class="modal-content p-6 max-w-xl mx-auto flex flex-col text-center border-4 border-amber-400 shadow-2xl max-h-[90vh]">
        
        <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-3xl animate-bounce-soft">🦙</span>
            <div class="text-left">
              <h3 class="text-2xl font-black text-amber-950 font-fun leading-none">¿Quién está jugando hoy?</h3>
              <p class="text-xs text-amber-800 font-bold mt-0.5">Toca tu nombre para guardar tus estrellas y juegos</p>
            </div>
          </div>
          <button id="btn-close-selector" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-lg">
            ✕
          </button>
        </div>

        <!-- Cuadrícula de Estudiantes Registrados -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3 overflow-y-auto max-h-[50vh] p-1">
          ${students.map(st => {
            const isSelected = st.id === currentStudent?.id;
            const summary = window.AppState.getStudentSummary(st.id);
            return `
              <button class="student-select-card p-3 rounded-2xl border-4 text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-amber-500 bg-amber-50 shadow-md scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50 shadow-sm'
              }" data-student-id="${st.id}">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  ${st.avatar || '🦙'}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-900 font-fun text-base truncate block">${st.name}</span>
                    ${isSelected ? '<span class="text-xs bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-bold">Activo</span>' : ''}
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs font-bold text-amber-600">⭐ ${st.stars}</span>
                    <span class="text-[11px] text-slate-500">• ${summary?.totalProgress || 0}% avance</span>
                  </div>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Botón para Registrar Nuevo Estudiante -->
        <div class="pt-4 border-t-2 border-amber-200 mt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button id="btn-open-register-student" class="btn-chunky btn-green text-base py-3 px-6 shadow-md flex items-center justify-center gap-2">
            <span>➕</span>
            <span>Soy nuevo / Escribir mi nombre</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos
    document.getElementById('btn-close-selector')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    modal.querySelectorAll('.student-select-card').forEach(card => {
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
  },

  // MODAL: REGISTRAR ALUMNO (SOLO AUTORIZADO PARA DOCENTE)
  openRegisterModal() {
    if (!window.AuthModule || !window.AuthModule.isTeacher()) {
      window.AuthModule.openLoginModal('familia');
      return;
    }
    window.DocenteModule.openDashboard('families');
    const formBox = document.getElementById('add-family-form-box');
    if (formBox) {
      formBox.classList.remove('hidden');
      document.getElementById('new-child-name')?.focus();
    }
  }
};
