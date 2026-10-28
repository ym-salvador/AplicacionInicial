/**
 * MÓDULO DE GESTIÓN INSTITUCIONAL (AÑOS, AULAS, DOCENTES, MATRÍCULA Y PLANIFICACIÓN)
 *
 * MODELO DE DATOS (todo vive en AppState.state y se guarda en localStorage / Supabase):
 *
 *   adminProfile  → la Directora / Administradora: usuario, PIN, nombre, título.
 *   academicYears → ['2025', '2026', ...] y activeYear.
 *   teachers[]    → docentes con usuario, PIN y assignedClassrooms (ids de aulas).
 *   classrooms[]  → aulas por año y edad (3, 4, 5) con docente, color y su PLAN:
 *                   plan[worldId] = { enabled, sessions: {sesion_x: true/false}, focus: {sesion_x: [capId...]} }
 *   students[]    → cada estudiante tiene classroomId, year, age, status y
 *                   assignedCompetencies (asignación individual).
 *
 * REGLA DE ACCESO DE UN ESTUDIANTE A UN RETO (una sola fuente de verdad: getSessionAccess):
 *   1. La competencia debe estar habilitada en el PLAN DEL AULA.
 *   2. La competencia debe estar asignada al ESTUDIANTE (toggle individual).
 *   3. La sesión debe estar habilitada en el plan del aula (sesión de clase activa).
 *   4. La sesión anterior debe estar APROBADA (progresión secuencial CNEB).
 *   El personal (admin / docente) siempre puede entrar en Modo Comprobación.
 */

window.SchoolManagement = {
  defaultYears: ['2025', '2026'],

  defaultAdmin: {
    id: 'admin_1',
    role: 'admin',
    username: 'admin',
    name: 'Lic. María Elena Pérez',
    title: 'Directora / Administradora General',
    pin: '1234',
    email: 'direccion@hugograndez.edu.pe',
    phone: '999888777',
    avatar: '🏛️'
  },

  defaultTeachers: [
    { id: 'doc_1', name: 'Prof. Yanet Huaman Salvador', username: 'yanet.huaman', pin: '1234', title: 'Docente de Aula (5 Años)', email: 'yanet.huaman@hugograndez.edu.pe', phone: '987654321', avatar: '👩‍🏫', assignedClassrooms: ['aula_5_conejitos_2026'] },
    { id: 'doc_2', name: 'Prof. Carmen Delgadillo', username: 'carmen.delgadillo', pin: '1234', title: 'Docente de Aula (4 Años)', email: 'carmen.delgadillo@hugograndez.edu.pe', phone: '984512345', avatar: '👩‍🏫', assignedClassrooms: ['aula_4_estrellitas_2026'] },
    { id: 'doc_3', name: 'Prof. Silvia Ramos', username: 'silvia.ramos', pin: '1234', title: 'Docente de Aula (3 Años)', email: 'silvia.ramos@hugograndez.edu.pe', phone: '978112233', avatar: '👩‍🏫', assignedClassrooms: ['aula_3_gotitas_2026'] }
  ],

  defaultClassrooms: [
    { id: 'aula_5_conejitos_2026', year: '2026', age: 5, cycle: 'Ciclo II', name: 'Aula Los Conejitos (5 Años)', section: 'A', shift: 'Mañana', teacherId: 'doc_1', teacherName: 'Prof. Yanet Huaman Salvador', color: 'sky', icon: '🚀', capacity: 25 },
    { id: 'aula_4_estrellitas_2026', year: '2026', age: 4, cycle: 'Ciclo II', name: 'Aula Pequeñas Estrellitas (4 Años)', section: 'B', shift: 'Mañana', teacherId: 'doc_2', teacherName: 'Prof. Carmen Delgadillo', color: 'amber', icon: '🌟', capacity: 22 },
    { id: 'aula_3_gotitas_2026', year: '2026', age: 3, cycle: 'Ciclo II', name: 'Aula Gotitas de Amor (3 Años)', section: 'C', shift: 'Mañana', teacherId: 'doc_3', teacherName: 'Prof. Silvia Ramos', color: 'emerald', icon: '🌱', capacity: 20 }
  ],

  // Identidad visual por edad (CNEB Ciclo II). 0-2 años = Ciclo I (cuna).
  ageTheme(age) {
    const a = parseInt(age, 10);
    const themes = {
      3: { age: 3, cycle: 'Ciclo II', label: '3 Años', alias: 'Semillitas Curiosas', icon: '🌱', color: 'emerald', border: 'border-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-900', badge: 'badge-age-3', solid: 'bg-emerald-600 text-white', gradient: 'from-emerald-100 to-teal-50' },
      4: { age: 4, cycle: 'Ciclo II', label: '4 Años', alias: 'Pequeños Exploradores', icon: '🌟', color: 'amber', border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-900', badge: 'badge-age-4', solid: 'bg-amber-600 text-white', gradient: 'from-amber-100 to-orange-50' },
      5: { age: 5, cycle: 'Ciclo II', label: '5 Años', alias: 'Grandes Campeones', icon: '🚀', color: 'sky', border: 'border-sky-400', bg: 'bg-sky-50', text: 'text-sky-900', badge: 'badge-age-5', solid: 'bg-sky-600 text-white', gradient: 'from-sky-100 to-indigo-50' }
    };
    if (themes[a]) return themes[a];
    return { age: a || 0, cycle: 'Ciclo I', label: `${a || 0} Años`, alias: 'Cuna', icon: '🍼', color: 'rose', border: 'border-rose-400', bg: 'bg-rose-50', text: 'text-rose-900', badge: 'badge-age-3', solid: 'bg-rose-600 text-white', gradient: 'from-rose-100 to-pink-50' };
  },

  cycleForAge(age) {
    return parseInt(age, 10) <= 2 ? 'Ciclo I' : 'Ciclo II';
  },

  // =========================================================================
  // INICIALIZACIÓN Y MIGRACIONES
  // =========================================================================
  init() {
    if (!window.AppState) return;
    const state = window.AppState.state;
    let changed = false;

    if (!Array.isArray(state.academicYears) || state.academicYears.length === 0) { state.academicYears = [...this.defaultYears]; changed = true; }
    if (!state.activeYear) { state.activeYear = '2026'; changed = true; }
    if (!state.academicYears.includes(String(state.activeYear))) { state.academicYears.push(String(state.activeYear)); state.academicYears.sort(); changed = true; }

    // Perfil de administración: hereda el antiguo "PIN maestro" si existía
    if (!state.adminProfile) {
      state.adminProfile = { ...this.defaultAdmin, pin: state.teacherPin || this.defaultAdmin.pin };
      if (state.directorName) state.adminProfile.name = state.directorName;
      changed = true;
    }
    if (!state.adminProfile.username) { state.adminProfile.username = 'admin'; changed = true; }
    if (!state.adminProfile.avatar) { state.adminProfile.avatar = '🏛️'; changed = true; }

    if (!Array.isArray(state.teachers) || state.teachers.length === 0) { state.teachers = JSON.parse(JSON.stringify(this.defaultTeachers)); changed = true; }
    if (!Array.isArray(state.classrooms) || state.classrooms.length === 0) { state.classrooms = JSON.parse(JSON.stringify(this.defaultClassrooms)); changed = true; }

    state.teachers.forEach(t => {
      if (!Array.isArray(t.assignedClassrooms)) { t.assignedClassrooms = []; changed = true; }
      if (!t.avatar) { t.avatar = '👩‍🏫'; changed = true; }
    });

    state.classrooms.forEach(c => {
      c.age = parseInt(c.age, 10) || 5;
      c.year = String(c.year || state.activeYear);
      if (!c.cycle) { c.cycle = this.cycleForAge(c.age); changed = true; }
      if (!c.plan) { c.plan = this.getDefaultPlan(); changed = true; }
      // Sincronizar docente ↔ aula en ambos sentidos
      if (c.teacherId) {
        const t = this.getTeacher(c.teacherId);
        if (t) {
          c.teacherName = t.name;
          if (!t.assignedClassrooms.includes(c.id)) { t.assignedClassrooms.push(c.id); changed = true; }
        }
      }
    });

    (state.students || []).forEach(st => {
      if (!st.status) { st.status = 'activo'; changed = true; }
      if (!st.year) { st.year = String(state.activeYear); changed = true; }
      if (!st.age) { st.age = 5; changed = true; }
      if (!st.classroomId || !this.getClassroom(st.classroomId)) {
        const target = this.findClassroomForAge(st.age, st.year);
        st.classroomId = target ? target.id : '';
        changed = true;
      }
      if (!Array.isArray(st.assignedCompetencies)) { st.assignedCompetencies = ['cantidad', 'espacio']; changed = true; }
      if (!Array.isArray(st.history)) { st.history = [{ year: st.year, classroomId: st.classroomId, age: st.age }]; changed = true; }
      delete st.assignedCapacities; // modelo antiguo (ya no se usa)
    });

    if (changed) window.AppState.saveState();

    // Usuarios con formato apellido.inicial para estudiantes, docentes y administración
    if (typeof window.AppState.migrateUsernames === 'function') {
      const r = window.AppState.migrateUsernames();
      if (r.changed) this.persist();
    }
  },

  // Guardar y sincronizar la estructura institucional (aulas, docentes, años, admin)
  persist() {
    window.AppState.state.structureUpdatedAt = new Date().toISOString();
    window.AppState.saveState();
    if (window.SupabaseService && window.SupabaseService.isConfigured() && typeof window.SupabaseService.saveSchoolStructure === 'function') {
      clearTimeout(this._syncTimer);
      this._syncTimer = setTimeout(() => {
        window.SupabaseService.saveSchoolStructure(this.exportStructure()).catch(() => {});
      }, 800);
    }
    window.dispatchEvent(new CustomEvent('cneb:structure-changed'));
  },

  exportStructure() {
    const s = window.AppState.state;
    return {
      academicYears: s.academicYears,
      activeYear: s.activeYear,
      adminProfile: s.adminProfile,
      teachers: s.teachers,
      classrooms: s.classrooms,
      updatedAt: s.structureUpdatedAt || new Date().toISOString()
    };
  },

  importStructure(data) {
    if (!data || typeof data !== 'object') return false;
    const s = window.AppState.state;
    const localTime = s.structureUpdatedAt ? new Date(s.structureUpdatedAt).getTime() : 0;
    const remoteTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
    if (remoteTime <= localTime) return false;
    if (Array.isArray(data.academicYears)) s.academicYears = data.academicYears;
    if (data.activeYear) s.activeYear = String(data.activeYear);
    if (data.adminProfile) s.adminProfile = data.adminProfile;
    if (Array.isArray(data.teachers)) s.teachers = data.teachers;
    if (Array.isArray(data.classrooms)) s.classrooms = data.classrooms;
    s.structureUpdatedAt = data.updatedAt;
    window.AppState.saveState();
    this.init();
    window.dispatchEvent(new CustomEvent('cneb:structure-changed'));
    return true;
  },

  // =========================================================================
  // PERFIL DE ADMINISTRACIÓN (DIRECTORA)
  // =========================================================================
  getAdmin() {
    return window.AppState.state.adminProfile || this.defaultAdmin;
  },

  updateAdmin(updates = {}) {
    const admin = this.getAdmin();
    ['name', 'title', 'username', 'email', 'phone', 'avatar'].forEach(k => {
      if (updates[k] !== undefined) admin[k] = String(updates[k]).trim();
    });
    if (updates.pin !== undefined && String(updates.pin).trim()) admin.pin = String(updates.pin).trim();
    window.AppState.state.adminProfile = admin;
    // El nombre de la directora también firma los diplomas
    if (updates.name !== undefined) window.AppState.state.directorName = admin.name;
    this.persist();
    return admin;
  },

  verifyAdmin(username, pin) {
    const admin = this.getAdmin();
    const u = String(username || '').trim().toLowerCase();
    const p = String(pin || '').trim();
    if (!p) return false;
    const userOk = !u || u === String(admin.username || 'admin').toLowerCase() || (admin.legacyUsername && u === String(admin.legacyUsername).toLowerCase());
    return userOk && p === String(admin.pin);
  },

  // =========================================================================
  // AÑOS LECTIVOS
  // =========================================================================
  getYears() {
    return window.AppState.state.academicYears || this.defaultYears;
  },

  getActiveYear() {
    return String(window.AppState.state.activeYear || '2026');
  },

  setActiveYear(year) {
    window.AppState.state.activeYear = String(year);
    window.AppState.saveState();
    window.dispatchEvent(new CustomEvent('cneb:year-changed', { detail: { year: String(year) } }));
  },

  // Crea un año nuevo. Si cloneFromYear está definido, copia la estructura de aulas (sin alumnos).
  addYear(yearStr, options = {}) {
    const clean = String(yearStr || '').trim();
    if (!/^\d{4}$/.test(clean)) return { success: false, message: 'Escribe un año válido de 4 dígitos (ej. 2027).' };
    const years = this.getYears();
    if (years.includes(clean)) return { success: false, message: `El año ${clean} ya existe.` };
    years.push(clean);
    years.sort();
    window.AppState.state.academicYears = years;

    let cloned = 0;
    if (options.cloneFromYear) {
      this.getClassrooms(options.cloneFromYear).forEach(c => {
        const copy = {
          ...JSON.parse(JSON.stringify(c)),
          id: `aula_${c.age}_${clean}_${Math.random().toString(36).slice(2, 7)}`,
          year: clean,
          name: c.name.replace(String(options.cloneFromYear), clean),
          plan: this.getDefaultPlan(c.cycle || this.cycleForAge(c.age))
        };
        window.AppState.state.classrooms.push(copy);
        const t = this.getTeacher(copy.teacherId);
        if (t && !t.assignedClassrooms.includes(copy.id)) t.assignedClassrooms.push(copy.id);
        cloned++;
      });
    }
    this.persist();
    return { success: true, year: clean, cloned };
  },

  // Promueve a los estudiantes activos del año origen al año destino (3→4, 4→5, 5→egresa).
  promoteStudents(fromYear, toYear) {
    const from = String(fromYear);
    const to = String(toYear);
    if (from === to) return { success: false, message: 'El año de origen y destino deben ser distintos.' };
    if (!this.getYears().includes(to)) return { success: false, message: `Primero crea el año ${to}.` };

    const result = { success: true, promoted: 0, graduated: 0, pendingClassroom: 0, skipped: 0 };
    (window.AppState.state.students || []).forEach(st => {
      if (String(st.year) !== from || st.status !== 'activo') { result.skipped++; return; }
      const nextAge = (parseInt(st.age, 10) || 5) + 1;
      if (!Array.isArray(st.history)) st.history = [];
      st.history.push({ year: st.year, classroomId: st.classroomId, age: st.age, closedAt: new Date().toISOString() });

      if (nextAge > 5) {
        st.status = 'egresado';
        st.graduatedYear = from;
        result.graduated++;
        return;
      }
      const current = this.getClassroom(st.classroomId);
      const target = this.findClassroomForAge(nextAge, to, current ? current.section : null);
      st.age = nextAge;
      st.year = to;
      st.classroomId = target ? target.id : '';
      // Al cambiar de edad empieza un nuevo recorrido de retos
      st.evaluaciones = window.AppState.getDefaultEvaluations();
      st.assignedCompetencies = ['cantidad', 'espacio'];
      if (target) result.promoted++; else result.pendingClassroom++;
    });
    this.setActiveYear(to);
    this.persist();
    return result;
  },

  findClassroomForAge(age, year, preferredSection = null) {
    const list = this.getClassrooms(year).filter(c => parseInt(c.age, 10) === parseInt(age, 10));
    if (list.length === 0) return null;
    if (preferredSection) {
      const same = list.find(c => c.section === preferredSection);
      if (same) return same;
    }
    return list[0];
  },

  // =========================================================================
  // AULAS
  // =========================================================================
  getClassrooms(year = null) {
    const list = window.AppState.state.classrooms || [];
    if (!year) return list;
    return list.filter(c => String(c.year) === String(year)).sort((a, b) => a.age - b.age || (a.section || '').localeCompare(b.section || ''));
  },

  getClassroom(classroomId) {
    return (window.AppState.state.classrooms || []).find(c => c.id === classroomId) || null;
  },

  getClassroomsForTeacher(teacherId, year = null) {
    const t = this.getTeacher(teacherId);
    if (!t) return [];
    return this.getClassrooms(year || this.getActiveYear()).filter(c => c.teacherId === teacherId || t.assignedClassrooms.includes(c.id));
  },

  addClassroom(data) {
    const age = parseInt(data.age, 10) || 5;
    const year = String(data.year || this.getActiveYear());
    const theme = this.ageTheme(age);
    const id = `aula_${age}_${year}_${Date.now().toString(36)}`;
    const newClassroom = {
      id,
      year,
      age,
      cycle: this.cycleForAge(age),
      name: String(data.name || `Aula ${theme.label}`).trim(),
      section: String(data.section || 'A').toUpperCase(),
      shift: data.shift || 'Mañana',
      teacherId: data.teacherId || '',
      teacherName: '',
      color: data.color || theme.color,
      icon: data.icon || theme.icon,
      capacity: parseInt(data.capacity, 10) || 25,
      plan: this.getDefaultPlan(this.cycleForAge(age))
    };
    window.AppState.state.classrooms.push(newClassroom);
    this.linkTeacher(newClassroom, data.teacherId);
    this.persist();
    return newClassroom;
  },

  updateClassroom(id, updates) {
    const c = this.getClassroom(id);
    if (!c) return null;
    const prevTeacher = c.teacherId;
    if (updates.name !== undefined) c.name = String(updates.name).trim();
    if (updates.section !== undefined) c.section = String(updates.section || 'A').toUpperCase();
    if (updates.shift !== undefined) c.shift = updates.shift;
    if (updates.capacity !== undefined) c.capacity = parseInt(updates.capacity, 10) || 25;
    if (updates.icon !== undefined && updates.icon) c.icon = updates.icon;
    if (updates.age !== undefined) {
      const newAge = parseInt(updates.age, 10) || 5;
      if (newAge !== c.age) {
        const prevCycle = c.cycle;
        c.age = newAge;
        c.cycle = this.cycleForAge(newAge);
        // Si cambia de ciclo (cuna ↔ jardín) el plan curricular se reinicia según el CNEB
        if (prevCycle !== c.cycle) c.plan = this.getDefaultPlan(c.cycle);
        const theme = this.ageTheme(newAge);
        c.color = theme.color;
        if (!updates.icon) c.icon = theme.icon;
        // Los alumnos del aula heredan la edad del aula
        this.getStudentsByClassroom(c.id).forEach(st => { st.age = newAge; });
      }
    }
    if (updates.teacherId !== undefined && updates.teacherId !== prevTeacher) {
      const old = this.getTeacher(prevTeacher);
      if (old) old.assignedClassrooms = old.assignedClassrooms.filter(x => x !== c.id);
      this.linkTeacher(c, updates.teacherId);
    }
    this.persist();
    return c;
  },

  linkTeacher(classroom, teacherId) {
    const t = this.getTeacher(teacherId);
    classroom.teacherId = t ? t.id : '';
    classroom.teacherName = t ? t.name : '';
    if (t && !t.assignedClassrooms.includes(classroom.id)) t.assignedClassrooms.push(classroom.id);
  },

  deleteClassroom(id) {
    const studentsInClass = this.getStudentsByClassroom(id);
    if (studentsInClass.length > 0) {
      return { success: false, message: `No se puede eliminar: el aula tiene ${studentsInClass.length} estudiante(s). Cámbialos de aula primero.` };
    }
    window.AppState.state.classrooms = (window.AppState.state.classrooms || []).filter(c => c.id !== id);
    this.getTeachers().forEach(t => { t.assignedClassrooms = t.assignedClassrooms.filter(x => x !== id); });
    this.persist();
    return { success: true };
  },

  // =========================================================================
  // PLAN DE SESIONES DEL AULA (QUÉ COMPETENCIAS, SESIONES Y CAPACIDADES ESTÁN ACTIVAS)
  // =========================================================================
  // ¿La competencia tiene retos interactivos (mundo)? Solo Matemática: cantidad y espacio.
  hasGames(compId) {
    return !!(window.CNEB_DATA && window.CNEB_DATA.mundos[compId]);
  },

  // Plan por defecto para un aula: TODAS las competencias CNEB del ciclo quedan activas
  // (según Cuadro N.° 1 del CNEB), con todas sus capacidades priorizadas.
  // Las de Matemática además traen sus sesiones de clase (retos interactivos).
  getDefaultPlan(cycle = 'Ciclo II') {
    const plan = {};
    const CU = window.CNEB_CURRICULUM;
    CU.getAllCompetencias().forEach(comp => {
      const applies = CU.appliesToCycle(comp, cycle) && !comp.opcional;
      const mundo = window.CNEB_DATA ? window.CNEB_DATA.mundos[comp.id] : null;
      if (mundo) {
        plan[comp.id] = { enabled: applies, sessions: {}, focus: {} };
        mundo.sesiones.forEach(s => {
          plan[comp.id].sessions[s.id] = true;
          plan[comp.id].focus[s.id] = [...(s.capacidades || [])];
        });
      } else {
        plan[comp.id] = { enabled: applies, sessions: {}, focus: { general: comp.capacidades.map(cp => cp.id) } };
      }
    });
    return plan;
  },

  getClassroomPlan(classroomId) {
    const c = this.getClassroom(classroomId);
    const def = this.getDefaultPlan(c ? c.cycle : 'Ciclo II');
    if (!c) return def;
    if (!c.plan) c.plan = def;
    // Completar claves que falten (competencias, sesiones o capacidades nuevas)
    Object.keys(def).forEach(w => {
      if (!c.plan[w]) c.plan[w] = def[w];
      if (!c.plan[w].sessions) c.plan[w].sessions = def[w].sessions;
      if (!c.plan[w].focus) c.plan[w].focus = def[w].focus;
      Object.keys(def[w].sessions).forEach(sId => {
        if (c.plan[w].sessions[sId] === undefined) c.plan[w].sessions[sId] = true;
        if (!Array.isArray(c.plan[w].focus[sId])) c.plan[w].focus[sId] = def[w].focus[sId];
      });
      if (def[w].focus.general && !Array.isArray(c.plan[w].focus.general)) c.plan[w].focus.general = def[w].focus.general;
    });
    return c.plan;
  },

  setCompetencyEnabled(classroomId, worldId, enabled) {
    const plan = this.getClassroomPlan(classroomId);
    if (!plan[worldId]) return false;
    plan[worldId].enabled = !!enabled;
    this.persist();
    return true;
  },

  setSessionEnabled(classroomId, worldId, sessionId, enabled) {
    const plan = this.getClassroomPlan(classroomId);
    if (!plan[worldId]) return false;
    plan[worldId].sessions[sessionId] = !!enabled;
    this.persist();
    return true;
  },

  toggleFocusCapacity(classroomId, worldId, sessionId, capId) {
    const plan = this.getClassroomPlan(classroomId);
    if (!plan[worldId]) return false;
    const list = plan[worldId].focus[sessionId] || [];
    const idx = list.indexOf(capId);
    if (idx >= 0) list.splice(idx, 1); else list.push(capId);
    plan[worldId].focus[sessionId] = list;
    this.persist();
    return idx < 0;
  },

  // Competencias activas de un aula (opcionalmente filtradas por área)
  getActiveCompetencies(classroomId, areaId = null) {
    const plan = this.getClassroomPlan(classroomId);
    return window.CNEB_CURRICULUM.getAllCompetencias().filter(c => plan[c.id]?.enabled && (!areaId || c.areaId === areaId));
  },

  // Aplica la malla oficial del CNEB a las aulas indicadas (o a todas las del año activo):
  // activa las competencias que corresponden al ciclo de cada aula y abre todas sus sesiones.
  applyCurriculumToClassrooms(classroomIds = null) {
    const targets = classroomIds ? classroomIds.map(id => this.getClassroom(id)).filter(Boolean) : this.getClassrooms(this.getActiveYear());
    targets.forEach(c => { c.plan = this.getDefaultPlan(c.cycle); });
    this.persist();
    return targets.length;
  },

  // Copia el plan de un aula a las demás aulas de la misma edad del mismo año
  copyPlanToSameAge(classroomId) {
    const src = this.getClassroom(classroomId);
    if (!src) return 0;
    const plan = this.getClassroomPlan(classroomId);
    const targets = this.getClassrooms(src.year).filter(c => c.id !== src.id && c.age === src.age);
    targets.forEach(c => { c.plan = JSON.parse(JSON.stringify(plan)); });
    this.persist();
    return targets.length;
  },

  // Resumen legible del plan para una competencia (lo que verá el estudiante)
  describePlan(classroomId, worldId) {
    const plan = this.getClassroomPlan(classroomId)[worldId];
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!plan) return '';
    if (!mundo) {
      if (!plan.enabled) return 'Competencia pausada en esta aula.';
      const n = (plan.focus.general || []).length;
      return `Competencia activa en esta aula • ${n} capacidad(es) priorizada(s). Se evalúa de forma directa (AD/A/B/C) desde Evaluación.`;
    }
    if (!plan.enabled) return 'Competencia pausada para toda el aula: los estudiantes la verán bloqueada.';
    const on = mundo.sesiones.filter(s => plan.sessions[s.id]).map(s => s.numero);
    const off = mundo.sesiones.filter(s => !plan.sessions[s.id]).map(s => s.numero);
    let txt = on.length ? `Sesiones habilitadas: ${on.join(', ')}.` : 'Ninguna sesión habilitada.';
    if (off.length) txt += ` Pausadas: ${off.join(', ')}.`;
    txt += ' Cada estudiante además debe aprobar la sesión anterior para avanzar.';
    return txt;
  },

  // =========================================================================
  // DOCENTES
  // =========================================================================
  getTeachers() {
    return window.AppState.state.teachers || [];
  },

  getTeacher(teacherId) {
    if (!teacherId) return null;
    return this.getTeachers().find(t => t.id === teacherId) || null;
  },

  getTeacherByUsername(username) {
    const clean = String(username || '').trim().toLowerCase();
    if (!clean) return null;
    return this.getTeachers().find(t => (t.username || '').toLowerCase() === clean || (t.legacyUsername || '').toLowerCase() === clean) || null;
  },

  verifyTeacher(teacherId, pin) {
    const t = this.getTeacher(teacherId);
    if (!t) return false;
    return String(pin || '').trim() === String(t.pin || '');
  },

  addTeacher(data) {
    const name = String(data.name || '').trim();
    if (!name) return null;
    const sp = window.AppState.splitName(name);
    const username = String(data.username || window.AppState.buildUsername(sp.firstName, sp.lastName)).trim().toLowerCase();
    if (this.getTeacherByUsername(username)) return { error: `El usuario "${username}" ya existe. Elige otro.` };
    const id = `doc_${Date.now().toString(36)}`;
    const t = {
      id,
      name,
      username,
      pin: String(data.pin || '1234').trim() || '1234',
      title: String(data.title || 'Docente de Aula').trim(),
      email: String(data.email || '').trim(),
      phone: String(data.phone || '').trim(),
      avatar: data.avatar || '👩‍🏫',
      assignedClassrooms: []
    };
    window.AppState.state.teachers.push(t);
    this.assignTeacherClassrooms(id, data.assignedClassrooms || [], false);
    this.persist();
    return t;
  },

  updateTeacher(id, updates) {
    const t = this.getTeacher(id);
    if (!t) return null;
    if (updates.username !== undefined) {
      const other = this.getTeacherByUsername(updates.username);
      if (other && other.id !== id) return { error: `El usuario "${updates.username}" ya pertenece a otro docente.` };
      t.username = String(updates.username).trim();
    }
    ['name', 'title', 'email', 'phone', 'avatar'].forEach(k => { if (updates[k] !== undefined) t[k] = String(updates[k]).trim(); });
    if (updates.pin !== undefined && String(updates.pin).trim()) t.pin = String(updates.pin).trim();
    (window.AppState.state.classrooms || []).forEach(c => { if (c.teacherId === id) c.teacherName = t.name; });
    if (Array.isArray(updates.assignedClassrooms)) this.assignTeacherClassrooms(id, updates.assignedClassrooms, false);
    this.persist();
    return t;
  },

  // Asigna aulas (del año activo) a un docente y libera las que ya no tiene
  assignTeacherClassrooms(teacherId, classroomIds, persist = true) {
    const t = this.getTeacher(teacherId);
    if (!t) return false;
    const year = this.getActiveYear();
    const wanted = new Set(classroomIds || []);
    this.getClassrooms(year).forEach(c => {
      if (wanted.has(c.id)) {
        // Quitar al docente anterior de esa aula
        if (c.teacherId && c.teacherId !== teacherId) {
          const prev = this.getTeacher(c.teacherId);
          if (prev) prev.assignedClassrooms = prev.assignedClassrooms.filter(x => x !== c.id);
        }
        c.teacherId = teacherId;
        c.teacherName = t.name;
        if (!t.assignedClassrooms.includes(c.id)) t.assignedClassrooms.push(c.id);
      } else if (c.teacherId === teacherId) {
        c.teacherId = '';
        c.teacherName = '';
        t.assignedClassrooms = t.assignedClassrooms.filter(x => x !== c.id);
      }
    });
    if (persist) this.persist();
    return true;
  },

  deleteTeacher(id) {
    window.AppState.state.teachers = this.getTeachers().filter(t => t.id !== id);
    (window.AppState.state.classrooms || []).forEach(c => {
      if (c.teacherId === id) { c.teacherId = ''; c.teacherName = ''; }
    });
    this.persist();
    return true;
  },

  // =========================================================================
  // ESTUDIANTES Y MATRÍCULA
  // =========================================================================
  getStudentsByClassroom(classroomId) {
    return (window.AppState.state.students || []).filter(s => s.classroomId === classroomId && s.status !== 'retirado');
  },

  getStudentsByYear(year = null, includeInactive = false) {
    const targetYear = String(year || this.getActiveYear());
    return (window.AppState.state.students || []).filter(s => String(s.year) === targetYear && (includeInactive || s.status === 'activo'));
  },

  getStudentsByAge(age, year = null) {
    return this.getStudentsByYear(year).filter(s => parseInt(s.age, 10) === parseInt(age, 10));
  },

  // Estudiantes visibles según el perfil activo (admin: año activo, docente: sus aulas, alumno: él mismo)
  getVisibleStudents(session = null) {
    const ses = session || (window.AuthModule ? window.AuthModule.currentSession : null);
    const all = window.AppState.state.students || [];
    if (!ses) return [];
    if (ses.role === 'admin') return this.getStudentsByYear(this.getActiveYear());
    if (ses.role === 'docente') {
      const ids = new Set(this.getClassroomsForTeacher(ses.teacherId).map(c => c.id));
      return all.filter(s => ids.has(s.classroomId) && s.status === 'activo');
    }
    if (ses.studentId) return all.filter(s => s.id === ses.studentId);
    return [];
  },

  // Aula por defecto para un alumno nuevo creado desde pantallas heredadas (Zona Docente)
  resolveDefaultClassroom(preferredId = null) {
    if (preferredId && this.getClassroom(preferredId)) return this.getClassroom(preferredId);
    const ses = window.AuthModule ? window.AuthModule.currentSession : null;
    if (ses && ses.role === 'docente') {
      const mine = this.getClassroomsForTeacher(ses.teacherId);
      if (mine.length) return mine[0];
    }
    const list = this.getClassrooms(this.getActiveYear());
    return list.find(c => c.age === 5) || list[0] || null;
  },

  enrollStudent(data) {
    const classroom = this.getClassroom(data.classroomId) || this.resolveDefaultClassroom();
    const student = window.AppState.addStudent(
      data.name,
      data.avatar || '🦙',
      data.parentName || '',
      data.parentPhone || '',
      data.parentEmail || '',
      data.pin || '',
      null,
      { classroomId: classroom ? classroom.id : '', year: classroom ? classroom.year : this.getActiveYear(), age: classroom ? classroom.age : (parseInt(data.age, 10) || 5) }
    );
    return student;
  },

  transferStudent(studentId, newClassroomId) {
    const student = (window.AppState.state.students || []).find(s => s.id === studentId);
    const classroom = this.getClassroom(newClassroomId);
    if (!student || !classroom) return false;
    if (!Array.isArray(student.history)) student.history = [];
    student.history.push({ year: student.year, classroomId: student.classroomId, age: student.age, closedAt: new Date().toISOString() });
    student.classroomId = classroom.id;
    student.year = classroom.year;
    student.age = classroom.age;
    student.status = 'activo';
    window.AppState.saveState();
    if (window.SupabaseService && window.SupabaseService.isConfigured()) window.SupabaseService.saveStudent(student);
    return true;
  },

  setStudentStatus(studentId, status) {
    const student = (window.AppState.state.students || []).find(s => s.id === studentId);
    if (!student) return false;
    student.status = status;
    window.AppState.saveState();
    if (window.SupabaseService && window.SupabaseService.isConfigured()) window.SupabaseService.saveStudent(student);
    return true;
  },

  getStudentAge(studentId) {
    const st = (window.AppState.state.students || []).find(s => s.id === studentId);
    if (!st) return 5;
    const c = this.getClassroom(st.classroomId);
    return parseInt(c ? c.age : st.age, 10) || 5;
  },

  // =========================================================================
  // REGLAS DE ACCESO (ÚNICA FUENTE DE VERDAD PARA ALUMNOS)
  // =========================================================================
  getStudentAccess(studentId, worldId) {
    const student = (window.AppState.state.students || []).find(s => s.id === studentId);
    if (!student) return { allowed: false, code: 'no_student', reason: 'No se encontró al estudiante.' };
    if (student.status !== 'activo') return { allowed: false, code: 'inactive', reason: 'Tu matrícula no está activa este año.' };
    const classroom = this.getClassroom(student.classroomId);
    if (!classroom) return { allowed: false, code: 'no_classroom', reason: 'Aún no tienes un aula asignada. Tu profesora debe matricularte en un aula.' };
    const plan = this.getClassroomPlan(classroom.id)[worldId];
    if (!plan || !plan.enabled) return { allowed: false, code: 'plan_off', reason: 'Tu profesora pausó este mundo para toda el aula.' };
    const assigned = (student.assignedCompetencies || []).includes(worldId);
    if (!assigned) return { allowed: false, code: 'not_assigned', reason: 'Tu profesora aún no te ha asignado este mundo. Pídele que lo active en su panel.' };
    const anySession = Object.values(plan.sessions || {}).some(Boolean);
    if (!anySession) return { allowed: false, code: 'no_sessions', reason: 'Tu profesora no ha habilitado ninguna sesión todavía.' };
    return { allowed: true, code: 'ok', reason: '' };
  },

  getSessionAccess(studentId, worldId, sessionId) {
    const worldAccess = this.getStudentAccess(studentId, worldId);
    if (!worldAccess.allowed) return { ...worldAccess, planEnabled: false, isUnlocked: false };
    const student = (window.AppState.state.students || []).find(s => s.id === studentId);
    const plan = this.getClassroomPlan(student.classroomId)[worldId];
    const planEnabled = !!plan.sessions[sessionId];
    const isUnlocked = window.AppState.isSessionUnlocked(worldId, sessionId, studentId);
    const mundo = window.CNEB_DATA.mundos[worldId];
    const idx = mundo ? mundo.sesiones.findIndex(s => s.id === sessionId) : 0;
    if (!planEnabled) return { allowed: false, code: 'session_off', reason: 'Tu profesora aún no ha abierto esta sesión de clase.', planEnabled, isUnlocked };
    if (!isUnlocked) return { allowed: false, code: 'locked', reason: `Primero debes completar y aprobar la Sesión ${idx}.`, planEnabled, isUnlocked };
    return { allowed: true, code: 'ok', reason: '', planEnabled, isUnlocked };
  },

  // Sesión en la que se encuentra actualmente un estudiante (para el panel docente)
  getStudentStage(studentId, worldId) {
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return null;
    for (const ses of mundo.sesiones) {
      const approved = window.AppState.isSessionApproved(worldId, ses.id, studentId);
      if (!approved) {
        const access = this.getSessionAccess(studentId, worldId, ses.id);
        return { session: ses, access };
      }
    }
    return { session: null, access: { allowed: true, code: 'completed', reason: 'Completó todas las sesiones.' } };
  }
};
