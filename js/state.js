/**
 * GESTOR DE ESTADO MULTI-ESTUDIANTE Y EVALUACIÓN FORMATIVA CNEB (CICLO II - 5 AÑOS)
 * Soporta registro y seguimiento individual y grupal de todos los estudiantes del aula,
 * almacenamiento en localStorage, cálculo de avances para el panel docente y portal familiar.
 */

class AppStateManager {
  constructor() {
    this.storageKey = 'cneb_mate5_multistudent_v1';
    this.state = this.loadState();
  }

  // Desempeños y minijuegos vacíos para un estudiante
  getDefaultEvaluations() {
    return {
      // MUNDO 1: CANTIDAD
      j1_1_color: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j1_2_tamano: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j1_3_cuantificadores: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j1_4_mas_menos: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j2_1_plantas: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j2_2_zanahorias: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j2_3_trencito: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j2_4_primero_ultimo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j3_1_conteo10: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j3_2_agregar: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j3_3_quitar: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j3_4_balanza: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      j3_5_tiempo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },

      // MUNDO 2: ESPACIO, FORMA Y MOVIMIENTO
      esp_j1_formas2d: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j1_cuerpos3d: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j1_clasificacion: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j2_cerca_lejos: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j2_al_lado: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j2_posiciones: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j3_desplazamiento: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j3_mas_largo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j3_mas_corto: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
      esp_j3_puente: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null }
    };
  }

  // Estudiantes iniciales con progreso de muestra para que la docente vea el seguimiento
  getInitialStudents() {
    const student1Evals = this.getDefaultEvaluations();
    // Valentina ha avanzado varios retos
    student1Evals.j1_1_color = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };
    student1Evals.j1_2_tamano = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };
    student1Evals.j1_3_cuantificadores = { attempts: 2, successes: 1, hintsUsed: 1, completed: true, lastGrade: 'A' };
    student1Evals.j1_4_mas_menos = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };
    student1Evals.j2_1_plantas = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };
    student1Evals.esp_j1_formas2d = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };
    student1Evals.esp_j2_cerca_lejos = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };

    const student2Evals = this.getDefaultEvaluations();
    // Mateo en proceso
    student2Evals.j1_1_color = { attempts: 2, successes: 1, hintsUsed: 1, completed: true, lastGrade: 'A' };
    student2Evals.j1_2_tamano = { attempts: 3, successes: 1, hintsUsed: 2, completed: true, lastGrade: 'B' };
    student2Evals.esp_j1_formas2d = { attempts: 2, successes: 1, hintsUsed: 1, completed: true, lastGrade: 'A' };

    const student3Evals = this.getDefaultEvaluations();
    // Camila empezando
    student3Evals.j1_1_color = { attempts: 1, successes: 1, hintsUsed: 0, completed: true, lastGrade: 'AD' };

    // Liam pendiente (sin jugar aún)
    const student4Evals = this.getDefaultEvaluations();

    return [
      {
        id: 'est_1',
        name: 'Valentina Gómez',
        avatar: '🦙',
        age: 5,
        registeredAt: '2026-10-15',
        lastActive: '2026-10-17 16:30',
        stars: 21,
        assignedCompetencies: ['cantidad', 'espacio'],
        evaluaciones: student1Evals
      },
      {
        id: 'est_2',
        name: 'Mateo Quispe',
        avatar: '🦁',
        age: 5,
        registeredAt: '2026-10-15',
        lastActive: '2026-10-17 11:15',
        stars: 9,
        assignedCompetencies: ['cantidad', 'espacio'],
        evaluaciones: student2Evals
      },
      {
        id: 'est_3',
        name: 'Camila Flores',
        avatar: '🐰',
        age: 5,
        registeredAt: '2026-10-16',
        lastActive: '2026-10-16 15:45',
        stars: 3,
        assignedCompetencies: ['cantidad'],
        evaluaciones: student3Evals
      },
      {
        id: 'est_4',
        name: 'Liam Rojas',
        avatar: '🐻',
        age: 5,
        registeredAt: '2026-10-16',
        lastActive: null, // Pendiente: No ha iniciado
        stars: 0,
        assignedCompetencies: ['espacio'],
        evaluaciones: student4Evals
      }
    ];
  }

  getDefaultState() {
    return {
      activeClass: 'Aula Los Conejitos (5 Años)',
      schoolName: 'I.E.P. PNP HUGO GRANDEZ OCMIN',
      teacherName: 'Prof. Yanet Huaman Salvador',
      teacherPhone: '',
      mascotIcon: '🦙',
      mascotName: 'Kusi',
      appTitle: 'Matemática Kusi',
      teacherPin: '1234',
      institutionLogo: '',
      directorName: 'Lic. María Elena Pérez',
      directorTitle: 'Directora',
      directorSignature: '',
      teacherTitle: 'Docente de Aula',
      teacherSignature: '',
      certificateCity: 'Lima',
      currentStudentId: 'est_1',
      students: this.getInitialStudents()
    };
  }

  getSchoolConfig() {
    let icon = this.state.mascotIcon;
    if (!icon || icon === 'llama' || icon.length > 4) icon = '🦙';
    return {
      schoolName: this.state.schoolName || 'I.E.P. PNP HUGO GRANDEZ OCMIN',
      activeClass: this.state.activeClass || 'Aula Los Conejitos (5 Años)',
      teacherName: this.state.teacherName || 'Prof. Yanet Huaman Salvador',
      teacherPhone: this.state.teacherPhone || '',
      mascotIcon: icon,
      mascotName: this.state.mascotName || 'Kusi',
      appTitle: this.state.appTitle || `Matemática ${this.state.mascotName || 'Kusi'}`,
      // El PIN de administración vive en el perfil de la Directora (adminProfile)
      teacherPin: (this.state.adminProfile && this.state.adminProfile.pin) || this.state.teacherPin || '1234',
      institutionLogo: this.state.institutionLogo || '',
      directorName: this.state.directorName || 'Lic. María Elena Pérez',
      directorTitle: this.state.directorTitle || 'Directora',
      directorSignature: this.state.directorSignature || '',
      teacherTitle: this.state.teacherTitle || 'Docente de Aula',
      teacherSignature: this.state.teacherSignature || '',
      certificateCity: this.state.certificateCity || 'Lima'
    };
  }

  updateSchoolConfig(config, syncToCloud = true) {
    if (config.schoolName !== undefined) this.state.schoolName = config.schoolName.trim();
    if (config.activeClass !== undefined) this.state.activeClass = config.activeClass.trim();
    if (config.teacherName !== undefined) this.state.teacherName = config.teacherName.trim();
    if (config.teacherPhone !== undefined) this.state.teacherPhone = config.teacherPhone.trim();
    if (config.mascotIcon !== undefined) {
      this.state.mascotIcon = (!config.mascotIcon || config.mascotIcon === 'llama' || config.mascotIcon.length > 4) ? '🦙' : config.mascotIcon;
    }
    if (config.mascotName !== undefined) {
      this.state.mascotName = config.mascotName.trim() || 'Kusi';
      this.state.appTitle = `Matemática ${this.state.mascotName}`;
    }
    if (config.teacherPin !== undefined) {
      this.state.teacherPin = config.teacherPin.trim() || '1234';
      if (this.state.adminProfile) this.state.adminProfile.pin = this.state.teacherPin;
    }
    if (config.directorName !== undefined && this.state.adminProfile && config.directorName.trim()) {
      this.state.adminProfile.name = config.directorName.trim();
    }
    if (config.institutionLogo !== undefined) this.state.institutionLogo = config.institutionLogo.trim();
    if (config.directorName !== undefined) this.state.directorName = config.directorName.trim();
    if (config.directorTitle !== undefined) this.state.directorTitle = config.directorTitle.trim();
    if (config.directorSignature !== undefined) this.state.directorSignature = config.directorSignature.trim();
    if (config.teacherTitle !== undefined) this.state.teacherTitle = config.teacherTitle.trim();
    if (config.teacherSignature !== undefined) this.state.teacherSignature = config.teacherSignature.trim();
    if (config.certificateCity !== undefined) this.state.certificateCity = config.certificateCity.trim();

    this.saveState();

    if (syncToCloud && window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveSchoolConfig(this.getSchoolConfig()).catch(err => {
        console.warn('Error sincronizando colegio_config a Supabase:', err);
      });
    }

    window.dispatchEvent(new CustomEvent('cneb:config-updated', { detail: this.getSchoolConfig() }));
  }

  // GENERAR CARGA ÚTIL DE SINCRONIZACIÓN PARA ENVÍO POR WHATSAPP O ENLACE
  generateSyncPayload(studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return null;

    const summary = this.getStudentSummary(student.id);

    const payload = {
      v: 1,
      id: student.id,
      name: student.name,
      avatar: student.avatar || '🦙',
      stars: student.stars || 0,
      lastActive: student.lastActive || new Date().toLocaleString('es-PE'),
      assignedCompetencies: student.assignedCompetencies || ['cantidad', 'espacio'],
      evals: student.evaluaciones || {},
      summary: {
        totalCompleted: summary?.totalCompleted || 0,
        totalProgress: summary?.totalProgress || 0,
        cantGrade: summary?.cantidad?.grade || 'Sin evaluar',
        espGrade: summary?.espacio?.grade || 'Sin evaluar'
      }
    };

    try {
      const jsonStr = JSON.stringify(payload);
      // Codificación Base64 segura para UTF-8 (soporta tildes y emojis)
      const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
      return encoded;
    } catch (e) {
      console.error('Error al generar payload de sincronización:', e);
      return null;
    }
  }

  // IMPORTAR CARGA ÚTIL DE SINCRONIZACIÓN (DESDE ENLACE O CÓDIGO)
  importSyncPayload(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      return { success: false, error: 'Código o enlace vacío.' };
    }

    try {
      let token = rawToken.trim();
      // Si el usuario pegó el enlace completo
      if (token.includes('sync=')) {
        const urlMatch = token.match(/sync=([^&#\s]+)/);
        if (urlMatch) {
          token = urlMatch[1];
        }
      }

      token = decodeURIComponent(token);
      // Decodificación Base64 segura para UTF-8
      const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(token), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const data = JSON.parse(jsonStr);

      if (!data || !data.name) {
        return { success: false, error: 'El formato de los datos no es válido.' };
      }

      // Buscar si el estudiante ya existe en la lista de la docente por nombre
      const cleanName = data.name.trim();
      let student = this.state.students.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
      let isNew = false;

      if (!student) {
        isNew = true;
        const newId = 'est_' + Date.now();
        student = {
          id: newId,
          name: cleanName,
          avatar: data.avatar || '🦙',
          age: 5,
          registeredAt: new Date().toISOString().split('T')[0],
          lastActive: data.lastActive || new Date().toLocaleString('es-PE'),
          stars: data.stars || 0,
          assignedCompetencies: data.assignedCompetencies || ['cantidad', 'espacio'],
          evaluaciones: data.evals || this.getDefaultEvaluations()
        };
        this.state.students.push(student);
      } else {
        // Actualizar datos del estudiante existente con lo jugado en casa
        student.stars = Math.max(student.stars || 0, data.stars || 0);
        if (data.avatar) student.avatar = data.avatar;
        student.lastActive = data.lastActive || new Date().toLocaleString('es-PE');
        if (data.assignedCompetencies) student.assignedCompetencies = data.assignedCompetencies;
        if (data.evals) {
          student.evaluaciones = {
            ...student.evaluaciones,
            ...data.evals
          };
        }
      }

      this.state.currentStudentId = student.id;
      this.saveState();

      return {
        success: true,
        isNew,
        student,
        summary: this.getStudentSummary(student.id)
      };
    } catch (e) {
      console.error('Error al importar sincronización:', e);
      return { success: false, error: 'El código no es válido o está dañado.' };
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students && Array.isArray(parsed.students) && parsed.students.length > 0) {
          const loaded = {
            ...this.getDefaultState(),
            ...parsed
          };
          if (!loaded.mascotIcon || loaded.mascotIcon === 'llama' || loaded.mascotIcon.length > 4) {
            loaded.mascotIcon = '🦙';
          }
          if (loaded.students && Array.isArray(loaded.students)) {
            loaded.students.forEach(st => {
              if (!st.assignedCompetencies || !Array.isArray(st.assignedCompetencies)) {
                st.assignedCompetencies = ['cantidad', 'espacio'];
              }
            });
          }
          return loaded;
        }
      }
    } catch (e) {
      console.warn('Error al cargar estado multi-estudiante:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error al guardar estado multi-estudiante:', e);
    }
  }

  // Obtiene el estudiante activo actual
  getCurrentStudent() {
    let student = this.state.students.find(s => s.id === this.state.currentStudentId);
    if (!student && this.state.students.length > 0) {
      student = this.state.students[0];
      this.state.currentStudentId = student.id;
    }
    return student;
  }

  // Compatibilidad con código previo que accede a this.state.childName y this.state.stars
  get childName() {
    const s = this.getCurrentStudent();
    return s ? s.name : 'Estudiante de 5 años';
  }

  get stars() {
    const s = this.getCurrentStudent();
    return s ? s.stars : 0;
  }

  set stars(val) {
    const s = this.getCurrentStudent();
    if (s) {
      s.stars = val;
      this.saveState();
    }
  }

  // Acceso seguro a las evaluaciones del estudiante activo
  get evaluaciones() {
    const s = this.getCurrentStudent();
    return s ? s.evaluaciones : this.getDefaultEvaluations();
  }

  // REGISTRA RESULTADO DE UN JUEGO PARA EL ESTUDIANTE ACTIVO
  recordResult(gameId, isSuccess, hintsCount = 0) {
    // Si la Directora o Docente está comprobando el reto de manera libre, no alterar notas de alumnos
    if (window.AuthModule && (window.AuthModule.isAdmin() || window.AuthModule.isPureTeacher())) {
      console.log(`[Modo Comprobación Pedagógica] Reto ${gameId}: éxito=${isSuccess}`);
      return;
    }

    const student = this.getCurrentStudent();
    if (!student) return;

    if (!student.evaluaciones[gameId]) {
      student.evaluaciones[gameId] = { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null };
    }

    const item = student.evaluaciones[gameId];
    item.attempts += 1;
    item.hintsUsed += hintsCount;

    // Medición del tiempo transcurrido en el reto (segundos)
    if (window.App && window.App.currentGameStartTime) {
      const elapsed = Math.round((Date.now() - window.App.currentGameStartTime) / 1000);
      if (elapsed > 0 && elapsed < 3600) {
        item.timeSeconds = (item.timeSeconds || 0) + elapsed;
      }
      window.App.currentGameStartTime = Date.now();
    }

    if (isSuccess) {
      item.successes += 1;
      item.completed = true;
      item.completedAt = new Date().toISOString();
      student.stars = (student.stars || 0) + 3;
      this.state.stars = student.stars;

      // Criterios CNEB Nivel 2 (RVM N° 094-2020-MINEDU)
      if (item.attempts === 1 && hintsCount === 0) {
        item.lastGrade = 'AD'; // Logro Destacado (autonomía inmediata al 1er intento)
      } else if (item.attempts <= 2 && hintsCount <= 1) {
        item.lastGrade = 'A'; // Logro Esperado (autónomo)
      } else {
        item.lastGrade = 'B'; // En Proceso (con andamiaje)
      }
    } else {
      if (!item.completed) {
        item.lastGrade = 'C'; // En Inicio
      }
    }

    // Actualiza timestamp de última actividad
    const now = new Date();
    student.lastActive = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }) + ' ' + 
                         now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    this.saveState();

    // Sincronización transparente en tiempo real a Supabase
    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveEvaluation(student.id, gameId, item, student.stars);
    }
  }

  // =========================================================================
  // USUARIOS: formato apellido.inicial (ej. gomez.v), únicos y sin palabras inapropiadas
  // =========================================================================
  normalizeToken(str) {
    return String(str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  }

  // Divide "Nombres Apellidos" en nombre y apellido paterno (convención peruana: nombres + paterno + materno)
  splitName(fullName) {
    const parts = String(fullName || '').trim().replace(/^(prof\.?|lic\.?|sra\.?|sr\.?|dra\.?|dr\.?)\s+/i, '').split(/\s+/).filter(Boolean);
    const compound = ['maria', 'jose', 'juan', 'ana', 'luis', 'carlos', 'jesus', 'rosa', 'luz', 'miguel', 'angel', 'del', 'de', 'la', 'los'];
    if (parts.length === 0) return { firstName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
    if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] };
    if (parts.length === 3) {
      // "María Elena Pérez" → nombre compuesto; "Camila Flores Ruiz" → paterno en el medio
      const secondIsName = compound.includes(this.normalizeToken(parts[1])) || compound.includes(this.normalizeToken(parts[0]));
      return secondIsName ? { firstName: `${parts[0]} ${parts[1]}`, lastName: parts[2] } : { firstName: parts[0], lastName: parts[1] };
    }
    return { firstName: `${parts[0]} ${parts[1]}`, lastName: parts[2] };
  }

  isInappropriate(username) {
    const bad = ['puta', 'puto', 'mierda', 'culo', 'pene', 'verga', 'pija', 'concha', 'cono', 'joder', 'cabron', 'pendej', 'maric', 'polla', 'teta', 'chucha', 'pinga', 'caca', 'pedo', 'zorra', 'perra', 'sexo', 'idiota', 'tonto', 'pito', 'pipi', 'kaka', 'carajo', 'cojud', 'huevon', 'mamon', 'nazi', 'anal'];
    const u = this.normalizeToken(username);
    return bad.some(w => u.includes(w));
  }

  // Todos los usuarios ya existentes (estudiantes, docentes, administración)
  existingUsernames(excludeId = null) {
    const set = new Set();
    (this.state.students || []).forEach(s => { if (s.id !== excludeId) set.add(String(s.id).toLowerCase()); });
    (this.state.teachers || []).forEach(t => { if (t.id !== excludeId && t.username) set.add(String(t.username).toLowerCase()); });
    if (this.state.adminProfile && this.state.adminProfile.username && excludeId !== 'admin') set.add(String(this.state.adminProfile.username).toLowerCase());
    return set;
  }

  // Construye apellido.inicial garantizando unicidad (gomez.v, gomez.v2…) y evitando palabras inapropiadas
  buildUsername(firstName, lastName, excludeId = null) {
    let surname = this.normalizeToken(String(lastName || '').trim().split(/\s+/)[0]);
    const name = this.normalizeToken(String(firstName || '').trim().split(/\s+/)[0]);
    if (!surname) surname = name || 'alumno';
    let base = `${surname}.${name.charAt(0) || 'a'}`;
    if (this.isInappropriate(base)) {
      // Si la combinación suena mal se prueban dos letras del nombre; si el apellido mismo es la causa,
      // se invierte el orden (nombre.inicial del apellido) para no exponer al estudiante.
      const alternatives = [`${surname}.${name.slice(0, 2) || 'ax'}`, `${name || 'alumno'}.${surname.charAt(0)}`, `${name || 'alumno'}x.${surname.charAt(0)}`, `alumno.${surname.charAt(0)}`];
      base = alternatives.find(alt => !this.isInappropriate(alt)) || alternatives[alternatives.length - 1];
    }
    const taken = this.existingUsernames(excludeId);
    let candidate = base;
    let n = 2;
    while (taken.has(candidate)) { candidate = `${base}${n}`; n++; }
    return candidate;
  }

  // Usuario del estudiante a partir de su nombre completo (o de nombres y apellidos separados)
  generateStudentId(fullName, firstName = null, lastName = null) {
    const split = (firstName || lastName) ? { firstName: firstName || '', lastName: lastName || '' } : this.splitName(fullName);
    return this.buildUsername(split.firstName, split.lastName);
  }

  // PIN numérico de 4 dígitos (se entrega a la familia junto con el usuario)
  generatePin() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  // Migra usuarios antiguos (est_1, V4821, nombre.apellido) al formato apellido.inicial
  migrateUsernames() {
    const pattern = /^[a-z]+x?\.[a-z]{1,2}\d*$/;
    let changed = false;
    const renames = [];

    (this.state.students || []).forEach(s => {
      if (!s.firstName || !s.lastName) {
        const sp = this.splitName(s.name);
        s.firstName = s.firstName || sp.firstName;
        s.lastName = s.lastName || sp.lastName;
        changed = true;
      }
      if (!pattern.test(String(s.id || ''))) {
        const oldId = s.id;
        const newId = this.buildUsername(s.firstName, s.lastName, oldId);
        s.legacyId = oldId;
        s.id = newId;
        if (!s.pin || String(s.pin).toUpperCase() === String(oldId).toUpperCase()) s.pin = this.generatePin();
        if (this.state.currentStudentId === oldId) this.state.currentStudentId = newId;
        renames.push({ oldId, student: s });
        changed = true;
      } else if (!s.pin || String(s.pin).toLowerCase() === String(s.id).toLowerCase()) {
        s.pin = this.generatePin();
        changed = true;
      }
    });

    (this.state.teachers || []).forEach(t => {
      if (!pattern.test(String(t.username || ''))) {
        const sp = this.splitName(t.name);
        t.legacyUsername = t.username;
        t.username = this.buildUsername(sp.firstName, sp.lastName, t.id);
        changed = true;
      }
    });

    const admin = this.state.adminProfile;
    if (admin && !pattern.test(String(admin.username || ''))) {
      const sp = this.splitName(admin.name);
      admin.legacyUsername = admin.username;
      admin.username = this.buildUsername(sp.firstName, sp.lastName, 'admin');
      changed = true;
    }

    if (changed) this.saveState();
    if (renames.length && window.SupabaseService && window.SupabaseService.isConfigured() && typeof window.SupabaseService.renameStudent === 'function') {
      renames.forEach(r => window.SupabaseService.renameStudent(r.oldId, r.student).catch(() => {}));
    }
    return { changed, renamed: renames.length };
  }

  // CAMBIAR DE ESTUDIANTE ACTIVO
  switchStudent(studentId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (student) {
      this.state.currentStudentId = studentId;
      this.saveState();
      return student;
    }
    return null;
  }

  // REGISTRAR NUEVO ESTUDIANTE CON DATOS FAMILIARES (SOLO DOCENTE)
  // ID: Letra del apellido + 4 números aleatorios (Ej: V4821)
  // PIN inicial: El mismo ID (Ej: V4821), modificable por la familia o docente
  addStudent(name, avatar = '🦙', parentName = '', parentPhone = '', parentEmail = '', pin = '', forcedId = null, opts = {}) {
    const cleanName = name.trim();
    if (!cleanName) return null;

    // Aula, año y edad: vienen de la matrícula o se resuelven según el perfil activo
    let classroom = null;
    if (window.SchoolManagement) {
      classroom = window.SchoolManagement.resolveDefaultClassroom(opts.classroomId || null);
    }
    const enrollClassroomId = classroom ? classroom.id : (opts.classroomId || '');
    const enrollYear = String(opts.year || (classroom ? classroom.year : '') || (window.SchoolManagement ? window.SchoolManagement.getActiveYear() : '2026'));
    const enrollAge = parseInt(opts.age || (classroom ? classroom.age : 5), 10) || 5;

    // Usuario apellido.inicial (si el formulario ya lo previsualizó y sigue libre, se respeta)
    const split = (opts.firstName || opts.lastName) ? { firstName: opts.firstName || '', lastName: opts.lastName || '' } : this.splitName(cleanName);
    let newId = (forcedId && forcedId.trim()) ? forcedId.trim().toLowerCase() : '';
    if (!newId || this.existingUsernames().has(newId)) newId = this.buildUsername(split.firstName, split.lastName);

    // PIN: el indicado por la docente o un PIN numérico de 4 dígitos (nunca igual al usuario)
    let initialPin = (pin && pin.trim() && pin.trim().toLowerCase() !== newId) ? pin.trim() : this.generatePin();

    const newStudent = {
      id: newId,
      name: cleanName,
      firstName: split.firstName,
      lastName: split.lastName,
      avatar: avatar || '🦙',
      age: enrollAge,
      year: enrollYear,
      classroomId: enrollClassroomId,
      status: 'activo',
      history: [{ year: enrollYear, classroomId: enrollClassroomId, age: enrollAge }],
      parentName: parentName ? parentName.trim() : '',
      parentPhone: parentPhone ? parentPhone.trim() : '',
      parentEmail: parentEmail ? parentEmail.trim() : '',
      pin: initialPin,
      registeredAt: new Date().toISOString().split('T')[0],
      lastActive: null,
      stars: 0,
      assignedCompetencies: ['cantidad', 'espacio'],
      evaluaciones: this.getDefaultEvaluations()
    };

    this.state.students.push(newStudent);
    this.saveState();

    // Sincronización en la nube Supabase
    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveStudent(newStudent);
    }

    return newStudent;
  }

  // ACTUALIZAR DATOS / PERFIL / PIN DE UN ESTUDIANTE
  updateStudent(studentId, updates = {}) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return null;

    if (updates.name !== undefined) student.name = updates.name.trim();
    if (updates.avatar !== undefined) student.avatar = updates.avatar;
    if (updates.parentName !== undefined) student.parentName = updates.parentName.trim();
    if (updates.parentPhone !== undefined) student.parentPhone = updates.parentPhone.trim();
    if (updates.parentEmail !== undefined) student.parentEmail = updates.parentEmail.trim();
    if (updates.pin !== undefined) student.pin = updates.pin.trim();
    if (updates.assignedCompetencies !== undefined && Array.isArray(updates.assignedCompetencies)) {
      student.assignedCompetencies = updates.assignedCompetencies;
    }

    this.saveState();

    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveStudent(student);
    }

    return student;
  }

  // RESTABLECER PIN DE UN ESTUDIANTE (nuevo PIN numérico de 4 dígitos o uno específico)
  resetStudentPin(studentId, customPin = null) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return null;

    const targetPin = (customPin && customPin.trim()) ? customPin.trim() : this.generatePin();
    student.pin = targetPin;
    this.saveState();

    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveStudent(student);
    }

    return targetPin;
  }

  // ELIMINAR ESTUDIANTE
  deleteStudent(studentId) {
    if (this.state.students.length <= 1) {
      alert("Debe haber al menos un estudiante en la lista.");
      return false;
    }
    this.state.students = this.state.students.filter(s => s.id !== studentId);
    if (this.state.currentStudentId === studentId) {
      this.state.currentStudentId = this.state.students[0].id;
    }
    this.saveState();

    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.deleteStudent(studentId);
    }

    return true;
  }

  // REINICIAR PROGRESO DE UN ESTUDIANTE ESPECÍFICO
  resetStudentProgress(studentId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (student) {
      student.stars = 0;
      student.lastActive = null;
      student.evaluaciones = this.getDefaultEvaluations();
      this.saveState();
      return true;
    }
    return false;
  }

  // EVALUACIÓN DE UNA SESIÓN (Soporta studentId opcional para ver a cualquier alumno)
  getSessionAssessment(worldId, sessionId, studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return null;

    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return null;

    const session = mundo.sesiones.find(s => s.id === sessionId);
    if (!session) return null;

    const juegos = this.getJuegosForStudent(worldId, sessionId, student);
    const items = juegos.map(j => {
      const ev = student.evaluaciones[j.id];
      return {
        juego: j,
        calificacion: ev?.lastGrade || 'Sin evaluar',
        attempts: ev?.attempts || 0,
        hints: ev?.hintsUsed || 0,
        completed: ev?.completed || false
      };
    });

    const validGrades = items.filter(i => i.calificacion !== 'Sin evaluar').map(i => i.calificacion);
    let grade = 'Sin evaluar';

    if (validGrades.length > 0) {
      const counts = { AD: 0, A: 0, B: 0, C: 0 };
      validGrades.forEach(g => { if (counts[g] !== undefined) counts[g]++; });

      if (counts.AD >= validGrades.length * 0.7) grade = 'AD';
      else if ((counts.AD + counts.A) >= validGrades.length * 0.6) grade = 'A';
      else if ((counts.B + counts.C) >= validGrades.length * 0.5) grade = 'B';
      else grade = 'C';
    }

    const completedCount = items.filter(i => i.completed).length;
    const isApproved = this.isSessionApproved(worldId, sessionId, student.id);
    const isUnlocked = this.isSessionUnlocked(worldId, sessionId, student.id);

    return {
      session,
      grade,
      items,
      completedCount,
      totalCount: juegos.length,
      progressPercent: juegos.length ? Math.round((completedCount / juegos.length) * 100) : 0,
      isApproved,
      isUnlocked
    };
  }

  // RETOS QUE CORRESPONDEN A UN ESTUDIANTE SEGÚN SU EDAD (3, 4 O 5 AÑOS)
  getJuegosForStudent(worldId, sessionId, studentOrId = null) {
    const student = (studentOrId && typeof studentOrId === 'object') ? studentOrId
      : (studentOrId ? this.state.students.find(s => s.id === studentOrId) : this.getCurrentStudent());
    const age = student ? (window.SchoolManagement ? window.SchoolManagement.getStudentAge(student.id) : student.age) : null;
    return window.CNEB_DATA.getJuegos(worldId, sessionId, age);
  }

  // ESTUDIANTES VISIBLES PARA EL PERFIL ACTIVO (admin: año activo, docente: sus aulas)
  getVisibleStudents() {
    if (window.SchoolManagement) return window.SchoolManagement.getVisibleStudents();
    return this.state.students;
  }

  // EVALUACIÓN GLOBAL DE UN MUNDO (Soporta studentId opcional)
  getWorldOverallAssessment(worldId, studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return null;

    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return null;

    const sessionAssessments = mundo.sesiones.map(ses => this.getSessionAssessment(worldId, ses.id, student.id));
    const validGrades = sessionAssessments.map(s => s.grade).filter(g => g !== 'Sin evaluar');

    let overall = 'Sin evaluar';
    if (validGrades.length > 0) {
      const counts = { AD: 0, A: 0, B: 0, C: 0 };
      validGrades.forEach(g => { if (counts[g] !== undefined) counts[g]++; });

      if (counts.AD >= validGrades.length * 0.6) overall = 'AD';
      else if ((counts.AD + counts.A) >= validGrades.length * 0.6) overall = 'A';
      else if ((counts.B + counts.C) >= validGrades.length * 0.5) overall = 'B';
      else overall = 'C';
    }

    const totalGames = sessionAssessments.reduce((acc, s) => acc + s.totalCount, 0);
    const totalCompleted = sessionAssessments.reduce((acc, s) => acc + s.completedCount, 0);
    const progressPercent = totalGames ? Math.round((totalCompleted / totalGames) * 100) : 0;

    return {
      competencia: mundo,
      overall,
      sesiones: sessionAssessments,
      totalGames,
      totalCompleted,
      progressPercent
    };
  }

  // =========================================================================
  // SISTEMA DE PROGRESIÓN SECUENCIAL Y APROBACIÓN DE SESIONES CNEB
  // =========================================================================

  // VERIFICA SI UNA SESIÓN ESPECÍFICA ESTÁ APROBADA POR EL ESTUDIANTE
  // Regla formativa: Para aprobar, debe completar todos los retos de la sesión
  // y haber alcanzado un nivel de logro válido (AD, A o B; no C ni sin evaluar).
  isSessionApproved(worldId, sessionId, studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return false;

    const mundo = window.CNEB_DATA?.mundos?.[worldId];
    if (!mundo) return false;

    const session = mundo.sesiones?.find(s => s.id === sessionId);
    if (!session || !session.juegos || session.juegos.length === 0) return false;

    const juegos = this.getJuegosForStudent(worldId, sessionId, student);
    const allGamesCompleted = juegos.every(j => {
      const ev = student.evaluaciones?.[j.id];
      return ev && ev.completed === true;
    });

    if (!allGamesCompleted) return false;

    // Verificar que no tenga calificación reprobatoria 'C'
    const grades = juegos.map(j => student.evaluaciones?.[j.id]?.lastGrade).filter(Boolean);
    const hasFailingGrade = grades.includes('C');
    return allGamesCompleted && !hasFailingGrade;
  }

  // VERIFICA SI UNA SESIÓN ESTÁ DESBLOQUEADA PARA EL ESTUDIANTE
  // Regla CNEB: Sesión 1 siempre abierta.
  // Sesión 2 requiere haber aprobado Sesión 1.
  // Sesión 3 requiere haber aprobado Sesión 2.
  isSessionUnlocked(worldId, sessionId, studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return false;

    const mundo = window.CNEB_DATA?.mundos?.[worldId];
    if (!mundo || !mundo.sesiones) return true;

    const sessionIndex = mundo.sesiones.findIndex(s => s.id === sessionId);
    if (sessionIndex <= 0) {
      // La primera sesión (índice 0) siempre está desbloqueada
      return true;
    }

    // Para desbloquear la sesión actual, la sesión inmediatamente anterior DEBE estar aprobada
    const previousSession = mundo.sesiones[sessionIndex - 1];
    return this.isSessionApproved(worldId, previousSession.id, student.id);
  }

  // =========================================================================
  // GESTIÓN Y ASIGNACIÓN INDIVIDUAL DE COMPETENCIAS POR ESTUDIANTE
  // =========================================================================

  // VERIFICA SI UNA COMPETENCIA ESTÁ ASIGNADA A UN ESTUDIANTE
  isCompetencyAssigned(studentId, worldId) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return false;
    const assigned = student.assignedCompetencies || ['cantidad', 'espacio'];
    return assigned.includes(worldId);
  }

  // OBTIENE LA LISTA DE COMPETENCIAS ASIGNADAS AL ESTUDIANTE
  getStudentAssignedCompetencies(studentId) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    if (!student) return ['cantidad', 'espacio'];
    return student.assignedCompetencies || ['cantidad', 'espacio'];
  }

  // ASIGNA COMPETENCIAS A UN ESTUDIANTE ESPECÍFICO
  setStudentAssignedCompetencies(studentId, competencies) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return false;

    const valid = Array.isArray(competencies) ? competencies.filter(c => c === 'cantidad' || c === 'espacio') : [];
    student.assignedCompetencies = valid;
    this.saveState();

    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveStudent(student);
    }

    window.dispatchEvent(new CustomEvent('cneb:assignments-updated', { detail: { studentId, assignedCompetencies: valid } }));
    return true;
  }

  // ASIGNA COMPETENCIAS DE FORMA MASIVA A TODOS LOS ESTUDIANTES DEL AULA
  setBulkCompetencyAssignment(competencies) {
    const valid = Array.isArray(competencies) ? competencies.filter(c => c === 'cantidad' || c === 'espacio') : [];
    this.state.students.forEach(st => {
      st.assignedCompetencies = [...valid];
      if (window.SupabaseService && window.SupabaseService.isConfigured()) {
        window.SupabaseService.saveStudent(st);
      }
    });
    this.saveState();
    window.dispatchEvent(new CustomEvent('cneb:assignments-updated', { detail: { bulk: true, assignedCompetencies: valid } }));
    return true;
  }

  // ALTERNA UNA COMPETENCIA ESPECÍFICA (ON/OFF) PARA UN ESTUDIANTE
  toggleStudentCompetency(studentId, worldId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return false;

    let current = student.assignedCompetencies || ['cantidad', 'espacio'];
    if (current.includes(worldId)) {
      current = current.filter(c => c !== worldId);
    } else {
      current = [...current, worldId];
    }
    return this.setStudentAssignedCompetencies(studentId, current);
  }

  // =========================================================================
  // CALIFICACIÓN POR COMPETENCIA EN LAS ÁREAS SIN RETOS INTERACTIVOS
  // (Comunicación, Personal Social, Psicomotriz, Ciencia, Transversales)
  // =========================================================================
  getAreaGrade(studentId, compId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student || !student.areaGrades) return null;
    return student.areaGrades[compId] || null;
  }

  setAreaGrade(studentId, compId, grade, note = '') {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return false;
    if (!student.areaGrades) student.areaGrades = {};
    if (!grade) {
      delete student.areaGrades[compId];
    } else {
      student.areaGrades[compId] = { grade, note: (note || '').trim(), updatedAt: new Date().toISOString() };
    }
    this.saveState();
    if (window.SupabaseService && window.SupabaseService.isConfigured()) {
      window.SupabaseService.saveStudent(student);
    }
    return true;
  }

  // CONCLUSIÓN DESCRIPTIVA PARA UNA COMPETENCIA SIN RETOS (A PARTIR DEL NIVEL Y EL DESEMPEÑO DE LA EDAD)
  generateAreaConclusion(studentId, compId) {
    const student = this.state.students.find(s => s.id === studentId);
    const comp = window.CNEB_CURRICULUM.getCompetencia(compId);
    if (!student || !comp) return '';
    const g = this.getAreaGrade(studentId, compId);
    const name = student.name;
    const age = window.SchoolManagement ? window.SchoolManagement.getStudentAge(student.id) : student.age;
    const cycle = age <= 2 ? 'Ciclo I' : 'Ciclo II';
    const nombre = window.CNEB_CURRICULUM.getNombre(compId, cycle);
    const desempeno = window.CNEB_CURRICULUM.getDesempeno(compId, age);
    if (!g) {
      return `${name} aún no cuenta con calificación en la competencia *"${nombre}"* (${cycle} - ${age} años). Desempeño esperado: ${desempeno}`;
    }
    const nivel = { AD: 'un **Logro Destacado (AD)**', A: 'el **Logro Esperado (A)**', B: 'un nivel **En Proceso (B)**', C: 'un nivel **En Inicio (C)**' }[g.grade] || g.grade;
    const matiz = {
      AD: 'Supera lo esperado para su edad:',
      A: 'Evidencia el desempeño esperado para su edad:',
      B: 'Se aproxima al desempeño esperado con acompañamiento de la docente:',
      C: 'Requiere mediación cercana para iniciar el desempeño esperado:'
    }[g.grade] || '';
    const recomendacion = {
      AD: 'Ofrecerle situaciones nuevas que le permitan ampliar y explicar lo que ya logra.',
      A: 'Continuar brindando oportunidades variadas para consolidar este aprendizaje en casa y en el aula.',
      B: 'Acompañar con andamiaje, modelado y más oportunidades de práctica en situaciones cotidianas.',
      C: 'Priorizar experiencias vivenciales diarias con mediación directa del adulto.'
    }[g.grade] || '';
    const evidencia = g.note ? ` Evidencia observada: *${g.note.trim()}*.` : '';
    return `${name} evidencia ${nivel} en la competencia *"${nombre}"* (${cycle} - ${age} años). ${matiz} ${desempeno}${evidencia}\n**Recomendación Pedagógica:** ${recomendacion}`;
  }

  // CÁLCULO DE PROGRESO COMPLETO DE CADA ESTUDIANTE PARA EL PANEL DOCENTE
  getStudentSummary(studentId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return null;

    const cant = this.getWorldOverallAssessment('cantidad', student.id);
    const esp = this.getWorldOverallAssessment('espacio', student.id);

    const totalGames = (cant?.totalGames || 13) + (esp?.totalGames || 10);
    const totalCompleted = (cant?.totalCompleted || 0) + (esp?.totalCompleted || 0);
    const totalProgress = totalGames ? Math.round((totalCompleted / totalGames) * 100) : 0;

    let status = 'pendiente'; // 'pendiente', 'en_proceso', 'completado'
    if (totalCompleted === totalGames) {
      status = 'completado';
    } else if (totalCompleted > 0) {
      status = 'en_proceso';
    }

    // Métricas detalladas de calidad pedagógica y tiempo CNEB
    let countAD = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let totalAttempts = 0;
    let totalHints = 0;
    let totalTimeSeconds = 0;
    let lastCompletedAt = null;

    if (student.evaluaciones) {
      Object.values(student.evaluaciones).forEach(ev => {
        if (ev) {
          if (ev.lastGrade === 'AD') countAD++;
          else if (ev.lastGrade === 'A') countA++;
          else if (ev.lastGrade === 'B') countB++;
          else if (ev.lastGrade === 'C') countC++;

          totalAttempts += (ev.attempts || 0);
          totalHints += (ev.hintsUsed || 0);
          totalTimeSeconds += (ev.timeSeconds || 0);

          if (ev.completedAt) {
            if (!lastCompletedAt || new Date(ev.completedAt) > new Date(lastCompletedAt)) {
              lastCompletedAt = ev.completedAt;
            }
          }
        }
      });
    }

    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    const formattedTime = totalTimeSeconds > 0 
      ? (minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`)
      : (totalCompleted > 0 ? `${totalCompleted * 35}s est.` : '0s');

    return {
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      age: student.age,
      classroomId: student.classroomId,
      year: student.year,
      lastActive: student.lastActive || 'Aún no ha jugado',
      hasPlayed: totalCompleted > 0,
      totalCompleted,
      totalGames,
      totalProgress,
      status,
      stars: student.stars || 0,
      countAD,
      countA,
      countB,
      countC,
      totalAttempts,
      totalHints,
      totalTimeSeconds,
      formattedTime,
      lastCompletedAt,
      cantidad: {
        grade: cant?.overall || 'Sin evaluar',
        percent: cant?.progressPercent || 0,
        completed: cant?.totalCompleted || 0,
        total: cant?.totalGames || 13,
        isAssigned: (student.assignedCompetencies || ['cantidad', 'espacio']).includes('cantidad'),
        sesiones: cant?.sesiones || []
      },
      espacio: {
        grade: esp?.overall || 'Sin evaluar',
        percent: esp?.progressPercent || 0,
        completed: esp?.totalCompleted || 0,
        total: esp?.totalGames || 10,
        isAssigned: (student.assignedCompetencies || ['cantidad', 'espacio']).includes('espacio'),
        sesiones: esp?.sesiones || []
      },
      assignedCompetencies: student.assignedCompetencies || ['cantidad', 'espacio']
    };
  }

  // CUADRO DE MÉRITO Y RANKING DEL AULA (CRITERIOS FORMATIVOS CNEB)
  // Criterio 1: Estrellas totales (Máx 69)
  // Criterio 2 (Desempate CNEB): Mayor cantidad de retos en Logro Destacado (AD al 1er intento sin pistas)
  // Criterio 3 (Mayor autonomía): Mayor cantidad de retos en Logro Esperado (A)
  // Criterio 4 (Efectividad): Menos intentos totales requeridos
  // Criterio 5 (Tiempo / Agilidad): Menor tiempo acumulado en segundos
  // Criterio 6: Alfabético por nombre
  getRankedStudents() {
    const list = this.getVisibleStudents().map(s => this.getStudentSummary(s.id)).filter(Boolean);

    list.sort((a, b) => {
      // 1. Mayor cantidad de estrellas
      if ((b.stars || 0) !== (a.stars || 0)) {
        return (b.stars || 0) - (a.stars || 0);
      }
      // 2. Desempate formativo CNEB: Mayor cantidad de AD (1er intento sin pistas)
      if ((b.countAD || 0) !== (a.countAD || 0)) {
        return (b.countAD || 0) - (a.countAD || 0);
      }
      // 3. Mayor cantidad de A
      if ((b.countA || 0) !== (a.countA || 0)) {
        return (b.countA || 0) - (a.countA || 0);
      }
      // 4. Efectividad: Menor número de intentos
      if ((a.totalAttempts || 0) !== (b.totalAttempts || 0) && (a.totalAttempts || 0) > 0 && (b.totalAttempts || 0) > 0) {
        return (a.totalAttempts || 0) - (b.totalAttempts || 0);
      }
      // 5. Menor tiempo de juego
      if ((a.totalTimeSeconds || 0) > 0 && (b.totalTimeSeconds || 0) > 0 && (a.totalTimeSeconds || 0) !== (b.totalTimeSeconds || 0)) {
        return (a.totalTimeSeconds || 0) - (b.totalTimeSeconds || 0);
      }
      // 6. Alfabético por nombre
      return (a.name || '').localeCompare(b.name || '');
    });

    return list.map((st, index) => ({
      ...st,
      rank: index + 1
    }));
  }

  // RESUMEN CONSOLIDADO DE TODA LA CLASE PARA LA DOCENTE
  getClassSummary() {
    const summaries = this.getRankedStudents();
    const total = summaries.length;
    const completed = summaries.filter(s => s.status === 'completado').length;
    const inProgress = summaries.filter(s => s.status === 'en_proceso').length;
    const pending = summaries.filter(s => s.status === 'pendiente').length;

    const avgProgress = total > 0 ? Math.round(summaries.reduce((acc, s) => acc + s.totalProgress, 0) / total) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      activeCount: completed + inProgress,
      avgProgress,
      students: summaries
    };
  }

  // CONCLUSIONES DESCRIPTIVAS SIAGIE
  generateConclusion(worldId, studentId = null) {
    const student = studentId ? this.state.students.find(s => s.id === studentId) : this.getCurrentStudent();
    const assessment = this.getWorldOverallAssessment(worldId, student?.id);
    const name = student?.name || 'El niño/a';

    if (worldId === 'cantidad') {
      switch (assessment.overall) {
        case 'AD':
          return `${name} demuestra un **Logro Destacado (AD)** en la competencia *"Resuelve problemas de cantidad"* (Ciclo II - 5 años). 
          En la **Sesión 1**, clasifica objetos con notable autonomía según color y tamaño, empleando con exactitud los cuantificadores "muchos", "pocos", "ninguno" y expresiones "más que" y "menos que". 
          En la **Sesión 2**, realiza seriaciones ordenando con fluidez hasta 5 objetos de menor a mayor e identifica con seguridad posiciones ordinales del 1.° al 5.° lugar. 
          En la **Sesión 3**, demuestra conteo biunívoco espontáneo hasta el 10, resuelve con agilidad situaciones de agregar y quitar hasta 5 elementos y discrimina pesos con la balanza ("pesa más", "pesa menos").
          \n**Recomendación Pedagógica:** Plantearle retos que impliquen formular preguntas de conteo e inventar pequeños problemas de adición a partir de cuentos vivenciales.`;

        case 'A':
          return `${name} evidencia el **Logro Esperado (A)** en la competencia *"Resuelve problemas de cantidad"*. 
          Participa activamente en las 3 sesiones de aprendizaje: agrupa material concreto según criterios perceptuales, ordena colecciones de hasta 5 elementos por longitud/tamaño y ubica el lugar que ocupan los objetos hasta el quinto puesto. Resuelve problemas aditivos sencillos de agregar y quitar hasta 5 de forma autónoma y utiliza nociones de tiempo cotidiano ("antes", "después").
          \n**Recomendación Pedagógica:** Seguir fortaleciendo en el hogar el conteo cotidiano con elementos de la cocina (frutas, cubiertos) y juegos de mesa sencillos.`;

        case 'B':
          return `${name} se sitúa **En Proceso (B)** en la competencia *"Resuelve problemas de cantidad"*. 
          Muestra entusiasmo en los retos lúdicos y logra agrupar, ordenar y contar hasta el 10 cuando se le ofrecen pistas visuales y auditivas (retroalimentación formativa de la mascota Kusi). En situaciones de agregar y quitar, reflexiona a partir de ensayos sucesivos.
          \n**Recomendación Pedagógica:** Brindar mayor vivenciación con material concreto estructurado y no estructurado (bloques, semillas, chapitas) antes de pasar a representaciones simbólicas.`;

        default:
          return `${name} se encuentra **En Inicio (C)** en la competencia *"Resuelve problemas de cantidad"*. 
          Inicia la interacción con los juegos pero requiere acompañamiento cercano del docente o adulto mediador para consolidar la correspondencia término a término y la secuencia numérica verbal.
          \n**Recomendación Pedagógica:** Favorecer experiencias sensoriales diarias de juego libre donde compare tamaños (grande/pequeño) y cuente libremente hasta 5 con su propio cuerpo.`;
      }
    } else {
      // MUNDO 2: ESPACIO, FORMA Y MOVIMIENTO
      switch (assessment.overall) {
        case 'AD':
          return `${name} alcanza un **Logro Destacado (AD)** en la competencia *"Resuelve problemas de forma, movimiento y localización"*.
          En la **Sesión 1**, relaciona brillantemente objetos de su entorno con formas bidimensionales (círculo, cuadrado, triángulo, rectángulo) y cuerpos tridimensionales (esfera, cubo, cilindro).
          En la **Sesión 2**, se orienta con destreza en el espacio y ubica objetos con gran precisión empleando nociones "cerca de", "lejos de" y "al lado de".
          En la **Sesión 3**, programa y ejecuta desplazamientos precisos en la cuadrícula usando flechas direccionales y compara longitudes distinguiendo "más largo que" y "más corto que" sin dudar.
          \n**Recomendación Pedagógica:** Impulsar la creación de pequeños planos de su casa o escuela y juegos de construcción con bloques geométricos variados.`;

        case 'A':
          return `${name} logra el **Logro Esperado (A)** en la competencia *"Resuelve problemas de forma, movimiento y localización"*.
          Reconoce las figuras geométricas y cuerpos 3D en objetos cotidianos, ubica objetos tomando puntos de referencia ("cerca de", "lejos de", "al lado de") y guía con autonomía a personajes a través de cuadrículas utilizando nociones de dirección (adelante, atrás, a los lados). Compara distancias y longitudes satisfactoriamente.
          \n**Recomendación Pedagógica:** Promover en el parque o patio juegos motores de trayectorias como "carrera de obstáculos" o seguir huellitas de colores.`;

        case 'B':
          return `${name} se encuentra **En Proceso (B)** en la competencia *"Resuelve problemas de forma, movimiento y localización"*.
          Identifica las figuras 2D básicas (círculo, cuadrado) y se desplaza en cuadrículas tras ensayar con el apoyo de las pistas de Kusi. Discrimina longitudes cuando los objetos tienen contrastes marcados.
          \n**Recomendación Pedagógica:** Fortalecer el esquema corporal y la orientación espacial vivenciando primero con su propio cuerpo (dar dos pasos adelante, ponerse al lado de mamá) antes del plano gráfico.`;

        default:
          return `${name} se sitúa **En Inicio (C)** en la competencia *"Resuelve problemas de forma, movimiento y localización"*.
          Muestra curiosidad por los laberintos y formas, pero requiere mediación continua para discriminar cuerpos tridimensionales y orientarse usando términos de distancia y dirección.
          \n**Recomendación Pedagógica:** Propiciar la manipulación diaria de pelotas, cajas y latas vacías para experimentar cómo ruedan o se apilan los objetos.`;
      }
    }
  }
}

// Instancia global
window.AppState = new AppStateManager();
