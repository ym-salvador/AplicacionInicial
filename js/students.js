/**
 * MÓDULO DE PERFILES INFANTILES Y SELECCIÓN DE ESTUDIANTES
 * Permite a los niños o familias elegir su perfil, registrarse con su nombre y avatar,
 * y cambiar de estudiante en tablets o pantallas compartidas de Educación Inicial.
 */

window.StudentProfileModule = {
  avatars: ['🦙', '🦁', '🐰', '🐻', '🦊', '🐬', '🦋', '🐼', '🐸', '🦄', '🐝', '🦉'],
  selectedAvatar: '🦙',

  init() {
    this.updateHeaderDisplay();
    
    // Si no hay estudiante activo o es la primera vez, se puede abrir el selector
    document.getElementById('btn-student-profile')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      this.openSelectorModal();
    });
  },

  updateHeaderDisplay() {
    const student = window.AppState.getCurrentStudent();
    if (!student) return;

    const avatarEl = document.getElementById('header-student-avatar');
    const nameEl = document.getElementById('header-student-name');
    const starCount = document.getElementById('star-count');

    if (avatarEl) avatarEl.textContent = student.avatar || '🦙';
    if (nameEl) nameEl.textContent = student.name.split(' ')[0] || 'Estudiante';
    if (starCount) starCount.textContent = student.stars || 0;
  },

  // MODAL: ¿QUIÉN ESTÁ JUGANDO HOY?
  openSelectorModal() {
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
        <div class="grid grid-cols-2 sm:grid-cols-2 gap-3.5 my-3 overflow-y-auto max-h-[50vh] p-1">
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
          
          // Refresca la vista actual si corresponde
          if (window.App.currentView === 'home') {
            window.App.showHome();
          }
        }
      });
    });

    document.getElementById('btn-open-register-student')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
      this.openRegisterModal();
    });
  },

  // MODAL: REGISTRARSE COMO NUEVO ESTUDIANTE
  openRegisterModal() {
    this.selectedAvatar = '🦙';

    const modal = document.createElement('div');
    modal.id = 'student-register-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-emerald-400 shadow-2xl">
        
        <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow">
          🎨
        </div>

        <h3 class="text-2xl font-black text-slate-900 font-fun mb-1">¡Bienvenido a Matemática Divertida!</h3>
        <p class="text-slate-600 text-sm mb-4">Escribe tu nombre y elige tu animalito favorito:</p>

        <!-- Campo de Nombre -->
        <div class="my-3 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Tu Nombre o Apodo:</label>
          <input type="text" id="reg-student-name" placeholder="Ej. Valentina, Mateo..." maxlength="25" class="w-full text-xl font-black font-fun p-3 border-3 border-amber-300 rounded-2xl focus:border-emerald-500 focus:outline-none shadow-inner bg-amber-50/50 text-slate-800">
        </div>

        <!-- Selector de Avatar -->
        <div class="my-4 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Elige tu animalito:</label>
          <div id="avatar-grid" class="grid grid-cols-6 gap-2">
            ${this.avatars.map(av => `
              <button type="button" class="avatar-option-btn w-12 h-12 rounded-2xl border-3 border-slate-200 bg-white flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all ${av === '🦙' ? 'border-emerald-500 bg-emerald-50 scale-105' : ''}" data-avatar="${av}">
                ${av}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex gap-3 justify-center mt-6">
          <button id="btn-cancel-register" class="btn-chunky bg-slate-200 text-slate-700 border-slate-300 text-sm py-2 px-5">
            Cancelar
          </button>
          <button id="btn-submit-register" class="btn-chunky btn-green text-base py-3 px-6 shadow-md">
            ¡Listo para Jugar! 🚀
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const inputName = document.getElementById('reg-student-name');
    inputName.focus();

    // Selección de avatar
    modal.querySelectorAll('.avatar-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playPop();
        modal.querySelectorAll('.avatar-option-btn').forEach(b => {
          b.classList.remove('border-emerald-500', 'bg-emerald-50', 'scale-105');
        });
        btn.classList.add('border-emerald-500', 'bg-emerald-50', 'scale-105');
        this.selectedAvatar = btn.dataset.avatar;
      });
    });

    document.getElementById('btn-cancel-register')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
      this.openSelectorModal();
    });

    const handleRegister = () => {
      const name = inputName.value.trim();
      if (!name) {
        window.SoundEngine.playGentleTryAgain();
        inputName.classList.add('border-red-500', 'animate-wiggle');
        setTimeout(() => inputName.classList.remove('animate-wiggle'), 500);
        return;
      }

      const newStudent = window.AppState.addStudent(name, this.selectedAvatar);
      if (newStudent) {
        window.SoundEngine.playSuccess();
        this.updateHeaderDisplay();
        modal.remove();
        window.Kusi.celebrate(`¡Bienvenido ${newStudent.name}! ¡Tienes un nuevo perfil para jugar matemática!`);
        if (window.App.currentView === 'home') {
          window.App.showHome();
        }
      }
    };

    document.getElementById('btn-submit-register')?.addEventListener('click', handleRegister);
    inputName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleRegister();
    });
  }
};
