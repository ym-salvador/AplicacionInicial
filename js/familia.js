/**
 * MÓDULO FAMILIAR - PORTAL DE AVANCES PARA PADRES Y FAMILIAS
 * Vista exclusiva y privada para que cada familia consulte el progreso de su propio hijo/a,
 * con medallero, aprendizajes clave en lenguaje cercano, pautas para el hogar y diploma imprimible.
 */

window.FamiliaModule = {
  openPortal() {
    window.SoundEngine.playPop();
    const student = window.AppState.getCurrentStudent();
    if (!student) return;

    const config = window.AppState.getSchoolConfig();
    const summary = window.AppState.getStudentSummary(student.id);
    const todayDate = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
    const isDiplomaUnlocked = (summary.totalCompleted >= 23);

    const modal = document.createElement('div');
    modal.id = 'familia-portal-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-3xl mx-auto flex flex-col max-h-[92vh] border-4 border-emerald-400 shadow-2xl">
        
        <!-- Cabecera del Portal Familiar -->
        <div class="flex items-center justify-between pb-3 border-b-2 border-emerald-200 mb-4 no-print">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-sm">
              👨‍👩‍👧
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 font-fun leading-tight">Portal para Familias: Mi Progreso</h2>
              <p class="text-xs text-emerald-800 font-bold">${config.schoolName} • ${config.activeClass}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-share-whatsapp-top" class="btn-chunky bg-emerald-600 text-white border-emerald-500 text-xs md:text-sm py-2 px-3.5 shadow flex items-center gap-1.5 hover:bg-emerald-700" title="Enviar avance por WhatsApp">
              <span>📲</span>
              <span class="hidden sm:inline">Enviar a la Profe</span>
            </button>
            <button id="btn-portal-diploma" class="btn-chunky ${isDiplomaUnlocked ? 'btn-yellow animate-bounce-soft shadow-lg' : 'bg-slate-100 text-slate-600 border-slate-300 shadow-sm'} text-xs md:text-sm py-2 px-3.5 flex items-center gap-1.5" title="${isDiplomaUnlocked ? '¡Diploma oficial desbloqueado! Clic para ver e imprimir' : 'El diploma se desbloquea al completar las 23 misiones (' + summary.totalCompleted + '/23)'}">
              <span>${isDiplomaUnlocked ? '🎓' : '🔒'}</span>
              <span>${isDiplomaUnlocked ? '¡Mi Diploma!' : `Diploma (${summary.totalCompleted}/23)`}</span>
            </button>
            <button id="btn-close-familia" class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs md:text-sm py-2 px-3.5 hover:bg-slate-200">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Contenido Desplazable del Portal -->
        <div id="familia-content-scroll" class="overflow-y-auto pr-1 flex-1 space-y-5">
          
          <!-- Tarjeta de Bienvenida Personalizada del Niño -->
          <div class="bg-gradient-to-r from-amber-100 via-emerald-100 to-sky-100 border-3 border-emerald-300 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-4 text-center sm:text-left">
              <div class="w-16 h-16 rounded-2xl bg-white border-3 border-emerald-400 flex items-center justify-center text-4xl shadow-md">
                ${student.avatar || '🦙'}
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 block">Estudiante del Ciclo II:</span>
                <h3 class="text-2xl font-black text-slate-900 font-fun">${student.name}</h3>
                <p class="text-xs text-slate-600 font-semibold">${config.schoolName} • ${config.activeClass}</p>
              </div>
            </div>

            <!-- Métricas Clave de Logros -->
            <div class="flex items-center gap-3">
              <div class="bg-white/90 border-2 border-amber-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">⭐</span>
                <span class="font-black text-amber-950 font-fun text-xl block leading-tight">${student.stars}</span>
                <span class="text-[10px] text-slate-500 font-bold">Estrellitas</span>
              </div>
              <div class="bg-white/90 border-2 border-emerald-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">🎯</span>
                <span class="font-black text-emerald-950 font-fun text-xl block leading-tight">${summary.totalCompleted}/23</span>
                <span class="text-[10px] text-slate-500 font-bold">Misiones</span>
              </div>
              <div class="bg-white/90 border-2 border-sky-300 rounded-2xl p-2.5 text-center min-w-[85px] shadow-sm">
                <span class="text-xl">📈</span>
                <span class="font-black text-sky-950 font-fun text-xl block leading-tight">${summary.totalProgress}%</span>
                <span class="text-[10px] text-slate-500 font-bold">Avance</span>
              </div>
            </div>
          </div>

          <!-- ===================================================================
               NUEVA SECCIÓN: ESTADO DEL DIPLOMA OFICIAL (ACTIVACIÓN FORMATIVA)
               =================================================================== -->
          <div class="${isDiplomaUnlocked ? 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-200 border-3 border-amber-400' : 'bg-slate-50 border-2 border-slate-300'} rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3.5 text-center sm:text-left">
              <div class="w-14 h-14 rounded-2xl ${isDiplomaUnlocked ? 'bg-amber-400 text-amber-950 shadow-md animate-bounce-soft' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-3xl flex-shrink-0">
                ${isDiplomaUnlocked ? '🏆' : '🔒'}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <h4 class="text-base sm:text-lg font-black ${isDiplomaUnlocked ? 'text-amber-950' : 'text-slate-800'} font-fun">
                    Diploma Oficial de Logro Matemático
                  </h4>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${isDiplomaUnlocked ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}">
                    ${isDiplomaUnlocked ? '✅ ¡Completado y Desbloqueado!' : `En camino: ${summary.totalCompleted}/23 retos`}
                  </span>
                </div>
                <p class="text-xs ${isDiplomaUnlocked ? 'text-amber-900 font-semibold' : 'text-slate-600'} mt-1">
                  ${isDiplomaUnlocked 
                    ? `¡Felicitaciones! ${student.name} ha culminado exitosamente todas las misiones. Su diploma oficial firmado ya está disponible para descargar o imprimir.` 
                    : `El diploma se activa automáticamente cuando ${student.name.split(' ')[0]} completa las 23 misiones formativas. Le faltan ${23 - summary.totalCompleted} retos.`}
                </p>
              </div>
            </div>

            <button id="btn-card-diploma" class="btn-chunky ${isDiplomaUnlocked ? 'btn-yellow text-sm py-2.5 px-5 shadow-md' : 'bg-white text-slate-700 border-slate-300 text-xs py-2 px-4 shadow-sm hover:bg-slate-100'} flex items-center gap-1.5 flex-shrink-0">
              <span>${isDiplomaUnlocked ? '📜 Ver e Imprimir Diploma (PDF)' : 'ℹ️ ¿Cómo desbloquearlo?'}</span>
            </button>
          </div>

          <!-- ===================================================================
               PERFIL Y CAMBIO DE CLAVE / PIN DE LA FAMILIA
               =================================================================== -->
          <div class="bg-white border-3 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h4 class="text-lg font-black text-emerald-950 font-fun flex items-center gap-2">
                <span>🔐</span>
                <span>Mi Perfil y Clave Secreta de Acceso</span>
              </h4>
              <span class="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                ID: ${student.id}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Cambiar Animalito Avatar del Niño(a):
                </label>
                <select id="family-edit-avatar" class="w-full text-base font-bold p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50">
                  ${window.StudentProfileModule ? window.StudentProfileModule.avatars.map(av => `<option value="${av}" ${av === student.avatar ? 'selected' : ''}>${av} Animalito</option>`).join('') : '<option value="🦙">🦙 Llamita</option>'}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tu PIN / Clave Secreta de Acceso:
                </label>
                <input type="text" id="family-edit-pin" value="${student.pin || student.id}" maxlength="8" class="w-full text-center text-sm font-black p-2.5 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 tracking-widest uppercase">
                <span class="text-[10px] text-slate-500 block mt-1">Con este código o PIN ingresas desde cualquier celular o tablet.</span>
              </div>
            </div>

            <div class="flex justify-end pt-2 border-t border-slate-100">
              <button id="btn-save-family-profile" class="btn-chunky btn-green text-xs md:text-sm py-2 px-5 shadow flex items-center gap-1.5">
                <span>💾</span>
                <span>Guardar Cambios de Perfil</span>
              </button>
            </div>
            <div id="family-profile-saved-toast" class="hidden text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-center">
              ✓ ¡Perfil y clave actualizados correctamente!
            </div>
          </div>

          <!-- Botón de Sincronización Directa por WhatsApp con la Docente -->
          <div class="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-5 text-center shadow-sm">
            <h4 class="text-lg font-black text-emerald-950 font-fun mb-1">
              ¿Jugaste en casa sin conexión o quieres avisar a la profesora?
            </h4>
            <p class="text-xs text-slate-600 font-medium mb-3 max-w-lg mx-auto">
              Presiona este botón para enviar un mensaje de WhatsApp a <strong>${config.teacherName || 'la Docente'}</strong> con un enlace que actualizará automáticamente tus logros en el aula.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button id="btn-share-whatsapp" class="btn-chunky bg-emerald-600 text-white border-emerald-500 text-sm py-2.5 px-6 shadow-md flex items-center gap-2 hover:bg-emerald-700">
                <span>📲</span>
                <span>Enviar Progreso por WhatsApp a la Docente</span>
              </button>
              <button id="btn-copy-sync-code" class="btn-chunky bg-white text-emerald-900 border-emerald-300 text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 hover:bg-emerald-100">
                <span>📋</span>
                <span>Copiar Enlace de Sincronización</span>
              </button>
            </div>
            <div id="copy-sync-toast" class="hidden text-xs text-emerald-800 font-bold mt-2">
              ✓ Enlace de reporte copiado. ¡Puedes pegarlo en WhatsApp!
            </div>
          </div>

          <!-- Resumen de Competencias para los Padres -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Competencia 1: Cantidad -->
            <div class="bg-white border-3 border-amber-300 rounded-3xl p-4 shadow-sm">
              <div class="flex items-center justify-between mb-3 border-b border-amber-100 pb-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🧺</span>
                  <h4 class="text-base font-black text-amber-950 font-fun">Mundo 1: Cantidad</h4>
                </div>
                <span class="text-xs font-black px-2.5 py-0.5 rounded-lg ${window.DocenteModule?.getBadgeClass ? window.DocenteModule.getBadgeClass(summary.cantidad.grade) : 'bg-amber-100 text-amber-900'}">
                  ${summary.cantidad.grade}
                </span>
              </div>
              <p class="text-xs text-slate-600 mb-3 font-medium">
                Aprende a agrupar objetos por color y tamaño, ordenar hasta 5 elementos, contar hasta el 10 y resolver pequeños problemas de agregar y quitar.
              </p>
              <div class="bg-amber-50 rounded-2xl p-2.5 text-xs text-amber-950 space-y-1">
                <div class="flex justify-between font-bold">
                  <span>Misiones superadas:</span>
                  <span>${summary.cantidad.completed}/${summary.cantidad.total} (${summary.cantidad.percent}%)</span>
                </div>
                <div class="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" style="width: ${summary.cantidad.percent}%"></div>
                </div>
              </div>
            </div>

            <!-- Competencia 2: Espacio -->
            <div class="bg-white border-3 border-sky-300 rounded-3xl p-4 shadow-sm">
              <div class="flex items-center justify-between mb-3 border-b border-sky-100 pb-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🚀</span>
                  <h4 class="text-base font-black text-sky-950 font-fun">Mundo 2: Espacio y Formas</h4>
                </div>
                <span class="text-xs font-black px-2.5 py-0.5 rounded-lg ${window.DocenteModule?.getBadgeClass ? window.DocenteModule.getBadgeClass(summary.espacio.grade) : 'bg-sky-100 text-sky-900'}">
                  ${summary.espacio.grade}
                </span>
              </div>
              <p class="text-xs text-slate-600 mb-3 font-medium">
                Reconoce formas del entorno (círculo, cuadrado, esfera, cubo), se ubica usando "cerca/lejos" y guía a su personaje programando desplazamientos con flechitas.
              </p>
              <div class="bg-sky-50 rounded-2xl p-2.5 text-xs text-sky-950 space-y-1">
                <div class="flex justify-between font-bold">
                  <span>Misiones superadas:</span>
                  <span>${summary.espacio.completed}/${summary.espacio.total} (${summary.espacio.percent}%)</span>
                </div>
                <div class="w-full bg-sky-200 h-2 rounded-full overflow-hidden">
                  <div class="bg-sky-500 h-full rounded-full" style="width: ${summary.espacio.percent}%"></div>
                </div>
              </div>
            </div>

          </div>

          <!-- Orientaciones pedagógicas de apoyo familiar -->
          <div class="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm">
            <h4 class="text-base font-black text-slate-900 font-fun mb-2 flex items-center gap-2">
              <span class="text-xl">🌟</span>
              <span>¿Qué está aprendiendo en esta etapa (5 años)?</span>
            </h4>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
              <li>
                <span><strong>Pensamiento Lógico:</strong> Explica por qué agrupa elementos y compara si hay "más que" o "menos que" en situaciones reales.</span>
              </li>
              <li>
                <span><strong>Resolución de Problemas:</strong> Utiliza el conteo como estrategia espontánea y comprende que al agregar cosas la cantidad aumenta.</span>
              </li>
              <li>
                <span><strong>Formas y Orientación Espacial:</strong> Reconoce figuras geométricas y cuerpos que ruedan, ubicando objetos "cerca de", "lejos de" y "al lado de".</span>
              </li>
            </ul>
          </div>

          <!-- Consejos Prácticos para Jugar Matemática en Familia -->
          <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm">
            <h4 class="text-base font-black text-amber-950 font-fun mb-2 flex items-center gap-2">
              <span class="text-xl">💡</span>
              <span>Ideas de 5 minutos para jugar matemática en casa:</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900">
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🍳 Al poner la mesa:</strong>
                "¿Cuántas cucharas necesitamos para todos?", "¿Hay muchas o pocas servilletas?"
              </div>
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🧺 Al ordenar la ropa:</strong>
                Emparejar medias por color o guardar los zapatos ordenándolos del más pequeño al más grande.
              </div>
              <div class="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <strong class="block text-slate-900 mb-1">🌳 Camino al parque:</strong>
                "Demos 5 pasos gigantes", "¿Qué está más cerca: el arbolito o la tienda?"
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-familia')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    // Acción de diploma (solo se abre si está desbloqueado, o muestra modal explicativo si está bloqueado)
    const handleDiplomaClick = () => {
      if (isDiplomaUnlocked) {
        this.openDiplomaModal(student, config, summary);
      } else {
        this.showLockedDiplomaModal(student, summary);
      }
    };

    document.getElementById('btn-portal-diploma')?.addEventListener('click', handleDiplomaClick);
    document.getElementById('btn-card-diploma')?.addEventListener('click', handleDiplomaClick);

    const handleShareWhatsApp = () => {
      window.SoundEngine.playSuccess();
      const syncToken = window.AppState.generateSyncPayload(student.id);
      const baseUrl = window.location.origin + window.location.pathname;
      const syncUrl = `${baseUrl}?sync=${encodeURIComponent(syncToken)}`;

      const message = `¡Hola Profesora ${config.teacherName}! 🌟\n` +
        `Le comparto el avance de mi hijo(a) en Matemática Divertida (${config.mascotName} ${config.mascotIcon}):\n\n` +
        `👶 Estudiante: *${student.name}*\n` +
        `🏫 ${config.schoolName} - ${config.activeClass}\n` +
        `⭐ Estrellas ganadas: *${student.stars}*\n` +
        `🎯 Misiones completadas: *${summary.totalCompleted}/23* (${summary.totalProgress}% de avance)\n` +
        `🧺 Cantidad: *${summary.cantidad.grade}* (${summary.cantidad.completed}/${summary.cantidad.total})\n` +
        `🚀 Espacio y Formas: *${summary.espacio.grade}* (${summary.espacio.completed}/${summary.espacio.total})\n\n` +
        `📲 *Para sincronizar automáticamente estos datos en su Panel Docente, pulse aquí:*\n` +
        `${syncUrl}`;

      let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      if (config.teacherPhone) {
        const cleanPhone = config.teacherPhone.replace(/[^0-9]/g, '');
        if (cleanPhone) {
          waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
        }
      }

      window.open(waUrl, '_blank');
    };

    const handleCopySyncCode = () => {
      window.SoundEngine.playPop();
      const syncToken = window.AppState.generateSyncPayload(student.id);
      const baseUrl = window.location.origin + window.location.pathname;
      const syncUrl = `${baseUrl}?sync=${encodeURIComponent(syncToken)}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(syncUrl).then(() => {
          const toast = document.getElementById('copy-sync-toast');
          if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3500);
          }
        }).catch(() => {
          prompt("Copia este enlace de reporte para enviarlo a la profesora:", syncUrl);
        });
      } else {
        prompt("Copia este enlace de reporte para enviarlo a la profesora:", syncUrl);
      }
    };

    document.getElementById('btn-share-whatsapp')?.addEventListener('click', handleShareWhatsApp);
    document.getElementById('btn-share-whatsapp-top')?.addEventListener('click', handleShareWhatsApp);
    document.getElementById('btn-copy-sync-code')?.addEventListener('click', handleCopySyncCode);

    document.getElementById('btn-save-family-profile')?.addEventListener('click', () => {
      const newAvatar = document.getElementById('family-edit-avatar')?.value || student.avatar;
      const newPin = document.getElementById('family-edit-pin')?.value.trim();

      if (!newPin) {
        alert("Por favor ingresa un PIN de acceso (ej. tu código de estudiante o 4 números).");
        return;
      }

      const updated = window.AppState.updateStudent(student.id, {
        avatar: newAvatar,
        pin: newPin
      });

      if (updated) {
        window.SoundEngine.playSuccess();
        const toast = document.getElementById('family-profile-saved-toast');
        if (toast) {
          toast.classList.remove('hidden');
          setTimeout(() => toast.classList.add('hidden'), 3500);
        }
        if (window.App && window.App.renderTopNav) window.App.renderTopNav();
        window.Kusi.celebrate("¡Tu perfil y PIN se actualizaron con éxito!");
      }
    });
  },

  // MODAL EXPLICATIVO CUANDO EL DIPLOMA AÚN ESTÁ BLOQUEADO
  showLockedDiplomaModal(student, summary) {
    window.SoundEngine.playPop();
    const remaining = 23 - (summary.totalCompleted || 0);

    const modal = document.createElement('div');
    modal.id = 'locked-diploma-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6 max-w-md mx-auto text-center border-4 border-amber-400 shadow-2xl animate-pop">
        <div class="w-20 h-20 rounded-full bg-amber-100 border-3 border-amber-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow">
          🔒
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          ¡Diploma en Camino!
        </span>
        <h3 class="text-2xl font-black text-slate-900 font-fun mt-2 mb-1">
          ¡Casi llegas a tu meta, ${student.name.split(' ')[0]}!
        </h3>
        <p class="text-sm text-slate-700 font-medium mb-3">
          El <strong>Diploma Oficial de Logro Matemático</strong> se otorga a los niños que completan todos los desafíos del aula.
        </p>

        <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left space-y-2 mb-4">
          <div class="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Tu avance actual:</span>
            <span class="text-amber-800 font-fun text-sm">${summary.totalCompleted}/23 misiones (${summary.totalProgress}%)</span>
          </div>
          <div class="w-full bg-amber-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div class="bg-gradient-to-r from-amber-400 to-purple-500 h-full rounded-full transition-all duration-300" style="width: ${summary.totalProgress}%"></div>
          </div>
          <p class="text-xs text-slate-600 font-bold text-center mt-2">
            ⭐ Te faltan solo <strong class="text-purple-700 text-sm">${remaining} misiones</strong> para desbloquearlo e imprimirlo.
          </p>
        </div>

        <button id="btn-close-locked-diploma" class="btn-chunky btn-green text-base py-2.5 px-6 shadow-md w-full">
          ¡A jugar y ganar mi Diploma! 🚀
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-locked-diploma')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });
  },

  // MODAL OFICIAL PARA VER E IMPRIMIR EL DIPLOMA EN ALTA CALIDAD
  openDiplomaModal(student, config, summary, isTeacher = false) {
    window.SoundEngine.playSuccess();
    if (window.Kusi?.celebrate) window.Kusi.celebrate("¡Felicitaciones por tu gran logro matemático!");

    const todayDate = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

    const modal = document.createElement('div');
    modal.id = 'diploma-view-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-4 sm:p-6 max-w-4xl mx-auto flex flex-col max-h-[96vh] border-4 border-amber-400 shadow-2xl bg-amber-50/60">
        
        <!-- Barra de Acciones del Diploma (No se imprime) -->
        <div class="flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-3 no-print-diploma no-print">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">🎓</span>
            <div>
              <h3 class="text-xl font-black text-amber-950 font-fun leading-tight">Diploma Oficial de Reconocimiento</h3>
              <p class="text-xs text-amber-800 font-bold">
                ${isTeacher ? 'Vista de Administradora Docente' : 'Reconocimiento de Logro para el Estudiante'}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-do-print-diploma" class="btn-chunky btn-yellow text-xs sm:text-sm py-2 px-4 shadow-lg flex items-center gap-1.5 animate-pop font-black" title="Imprimir o guardar como PDF">
              <span>🖨️</span>
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button id="btn-close-diploma-view" class="btn-chunky bg-slate-100 text-slate-700 border-slate-300 text-xs sm:text-sm py-2 px-3 hover:bg-slate-200">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Contenedor Desplazable con el Diploma -->
        <div class="overflow-y-auto flex-1 p-2">
          
          <!-- MARCO OFICIAL DEL CERTIFICADO (A4 LANDSCAPE / PORTRAIT COMPATIBLE) -->
          <div id="diploma-certificate-frame" class="p-6 sm:p-10 border-8 border-double border-amber-500 rounded-3xl bg-amber-50/90 text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden">
            
            <!-- Decoraciones de esquina -->
            <div class="absolute top-2 left-3 text-2xl select-none opacity-40">✨</div>
            <div class="absolute top-2 right-3 text-2xl select-none opacity-40">✨</div>
            <div class="absolute bottom-2 left-3 text-2xl select-none opacity-40">✨</div>
            <div class="absolute bottom-2 right-3 text-2xl select-none opacity-40">✨</div>

            <!-- Encabezado Institucional -->
            <div class="mb-2">
              <div class="text-4xl sm:text-5xl mb-1">${config.mascotIcon} ⭐ ${config.mascotIcon}</div>
              <p class="text-[10px] sm:text-xs uppercase font-extrabold text-amber-800 tracking-widest">
                REPÚBLICA DEL PERÚ • CURRÍCULO NACIONAL CNEB (CICLO II - 5 AÑOS)
              </p>
              <h2 class="text-sm sm:text-base uppercase font-black text-amber-950 tracking-wider mt-0.5">
                ${config.schoolName}
              </h2>
              <p class="text-xs font-bold text-amber-800">${config.activeClass}</p>
            </div>

            <!-- Título Principal del Diploma -->
            <div class="my-4">
              <h1 class="text-3xl sm:text-4xl font-black text-amber-950 font-fun tracking-wide drop-shadow-xs">
                DIPLOMA DE LOGRO MATEMÁTICO
              </h1>
              <p class="text-xs sm:text-sm font-bold text-slate-600 mt-1 uppercase tracking-wider">
                Se otorga con mucho orgullo y alegría a:
              </p>
            </div>

            <!-- Nombre Destacado del Estudiante -->
            <div class="my-3 py-2 border-b-4 border-dashed border-amber-400 max-w-lg mx-auto">
              <span class="text-3xl sm:text-4xl font-black text-amber-900 font-fun tracking-wide block">
                ${student.avatar} ${student.name}
              </span>
            </div>

            <!-- Texto Oficial de Mérito -->
            <p class="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto font-medium leading-relaxed my-4">
              Por su curiosidad, constancia y notable entusiasmo al resolver exitosamente los desafíos lúdicos de 
              <strong>Cantidad, Formas, Movimiento y Localización</strong> junto a su mascota compañera 
              <strong>${config.mascotName} ${config.mascotIcon}</strong>.
            </p>

            <!-- Sellos de Logro -->
            <div class="flex items-center justify-center gap-4 my-4">
              <span class="bg-amber-100 text-amber-950 border-2 border-amber-300 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                ⭐ ${student.stars} Estrellas Ganadas
              </span>
              <span class="bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                🎯 23/23 Misiones Completadas (100%)
              </span>
            </div>

            <!-- Sección de Firmas y Fecha -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end mt-8 pt-4 border-t-2 border-amber-300 text-xs">
              <div class="text-center">
                <span class="font-bold text-slate-800 block text-xs sm:text-sm">${todayDate}</span>
                <span class="text-slate-500 text-[10px]">Fecha de Entrega</span>
              </div>
              <div class="text-center">
                <span class="font-fun font-bold text-amber-900 text-sm sm:text-base block">${config.mascotName} ${config.mascotIcon}</span>
                <span class="text-slate-500 text-[10px]">Mascota Guía</span>
              </div>
              <div class="text-center border-t border-slate-400 sm:border-t-0 pt-1">
                <span class="font-bold text-slate-800 block text-xs sm:text-sm">${config.teacherName}</span>
                <span class="text-slate-500 text-[10px]">Docente de Aula</span>
              </div>
              <div class="text-center border-t border-slate-400 sm:border-t-0 pt-1">
                <span class="font-bold text-slate-800 block text-xs sm:text-sm">Dirección Pedagógica</span>
                <span class="text-slate-500 text-[10px]">${config.schoolName}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-diploma-view')?.addEventListener('click', () => {
      window.SoundEngine.playPop();
      modal.remove();
    });

    document.getElementById('btn-do-print-diploma')?.addEventListener('click', () => {
      window.SoundEngine.playSuccess();
      document.body.classList.add('printing-diploma-only');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-diploma-only');
      }, 1500);
    });

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-diploma-only');
    }, { once: true });
  }
};
