/**
 * CONEXIÓN Y SERVICIOS EN LA NUBE CON SUPABASE
 * Sincronización en tiempo real para Docentes, Padres y Niños
 * Con soporte offline y fallback transparente a localStorage.
 */

window.SupabaseService = {
  // Configuración predeterminada o guardada en localStorage
  configKey: 'cneb_supabase_credentials_v1',
  client: null,
  isReady: false,

  init() {
    const creds = this.getCredentials();
    if (creds.url && creds.key && window.supabase) {
      try {
        this.client = window.supabase.createClient(creds.url, creds.key);
        this.isReady = true;
        console.log('✓ Supabase conectado exitosamente a:', creds.url);
      } catch (err) {
        console.warn('Error al inicializar cliente Supabase:', err);
        this.isReady = false;
      }
    } else {
      this.isReady = false;
    }
  },

  getCredentials() {
    try {
      const saved = localStorage.getItem(this.configKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      url: '',
      key: ''
    };
  },

  saveCredentials(url, key) {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    localStorage.setItem(this.configKey, JSON.stringify({ url: cleanUrl, key: cleanKey }));
    this.init();
    return this.isReady;
  },

  isConfigured() {
    return this.isReady && this.client !== null;
  },

  // 1. CARGAR CONFIGURACIÓN DEL COLEGIO DESDE LA NUBE
  async fetchSchoolConfig() {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client
        .from('colegio_config')
        .select('*')
        .eq('id', 'aula_default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        return {
          schoolName: data.school_name,
          activeClass: data.active_class,
          teacherName: data.teacher_name,
          teacherPhone: data.teacher_phone || '',
          mascotIcon: data.mascot_icon || '🦙',
          mascotName: data.mascot_name || 'Kusi',
          appTitle: data.app_title || `Matemática ${data.mascot_name || 'Kusi'}`,
          teacherPin: data.teacher_pin || '1234'
        };
      }
    } catch (err) {
      console.warn('Error consultando colegio_config en Supabase:', err);
    }
    return null;
  },

  // 2. GUARDAR CONFIGURACIÓN DEL COLEGIO EN LA NUBE
  async saveSchoolConfig(config) {
    if (!this.isConfigured()) return false;
    try {
      const { error } = await this.client
        .from('colegio_config')
        .upsert({
          id: 'aula_default',
          school_name: config.schoolName,
          active_class: config.activeClass,
          teacher_name: config.teacherName,
          teacher_phone: config.teacherPhone || '',
          mascot_icon: config.mascotIcon || '🦙',
          mascot_name: config.mascotName || 'Kusi',
          app_title: config.appTitle || `Matemática ${config.mascotName || 'Kusi'}`,
          teacher_pin: config.teacherPin || '1234',
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Error guardando colegio_config en Supabase:', err);
      return false;
    }
  },

  // 3. CARGAR TODOS LOS ESTUDIANTES Y SUS NOTAS DESDE SUPABASE
  async fetchStudentsWithEvals() {
    if (!this.isConfigured()) return null;
    try {
      const { data: students, error: errSt } = await this.client
        .from('estudiantes')
        .select('*')
        .order('nombre', { ascending: true });

      if (errSt) throw errSt;
      if (!students || students.length === 0) return [];

      const { data: evals, error: errEv } = await this.client
        .from('evaluaciones')
        .select('*');

      if (errEv) throw errEv;

      const evalsByStudent = {};
      (evals || []).forEach(ev => {
        if (!evalsByStudent[ev.estudiante_id]) {
          evalsByStudent[ev.estudiante_id] = {};
        }
        evalsByStudent[ev.estudiante_id][ev.juego_id] = {
          attempts: ev.intentos,
          successes: ev.aciertos,
          hintsUsed: ev.pistas,
          completed: ev.completado,
          lastGrade: ev.calificacion
        };
      });

      return students.map(st => {
        const studentEvals = window.AppState ? window.AppState.getDefaultEvaluations() : {};
        if (evalsByStudent[st.id]) {
          Object.assign(studentEvals, evalsByStudent[st.id]);
        }
        return {
          id: st.id,
          name: st.nombre,
          avatar: st.avatar || '🦙',
          age: st.edad || 5,
          stars: st.estrellas || 0,
          pin: st.pin_acceso || '1234',
          parentName: st.parent_nombre || '',
          parentPhone: st.parent_telefono || '',
          parentId: st.parent_id,
          registeredAt: st.created_at ? st.created_at.split('T')[0] : '2026-10-17',
          lastActive: st.ultimo_acceso ? new Date(st.ultimo_acceso).toLocaleString('es-PE') : null,
          evaluaciones: studentEvals
        };
      });
    } catch (err) {
      console.warn('Error obteniendo estudiantes desde Supabase:', err);
      return null;
    }
  },

  // 4. CREAR O ACTUALIZAR ESTUDIANTE Y SU CUENTA FAMILIAR
  async saveStudent(studentData) {
    if (!this.isConfigured()) return false;
    try {
      let parentId = studentData.parentId;

      // Si se proporcionó información del padre/madre, asegurar registro en usuarios
      if (studentData.parentName && !parentId) {
        const { data: parentUser, error: errParent } = await this.client
          .from('usuarios')
          .insert({
            nombre: studentData.parentName,
            telefono: studentData.parentPhone || '',
            rol: 'padre',
            pin_acceso: studentData.pin || '1234'
          })
          .select()
          .single();

        if (!errParent && parentUser) {
          parentId = parentUser.id;
        }
      }

      const { error } = await this.client
        .from('estudiantes')
        .upsert({
          id: studentData.id,
          nombre: studentData.name,
          avatar: studentData.avatar || '🦙',
          edad: studentData.age || 5,
          estrellas: studentData.stars || 0,
          pin_acceso: studentData.pin || '1234',
          parent_id: parentId || null,
          parent_nombre: studentData.parentName || '',
          parent_telefono: studentData.parentPhone || '',
          ultimo_acceso: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Error guardando estudiante en Supabase:', err);
      return false;
    }
  },

  // 5. REGISTRAR RESULTADO DE EVALUACIÓN CNEB EN LA NUBE
  async saveEvaluation(studentId, gameId, evalItem, currentStars) {
    if (!this.isConfigured()) return false;
    try {
      // 1. Actualizar estrellas y último acceso del estudiante
      await this.client
        .from('estudiantes')
        .update({
          estrellas: currentStars,
          ultimo_acceso: new Date().toISOString()
        })
        .eq('id', studentId);

      // 2. Guardar evaluación
      const { error } = await this.client
        .from('evaluaciones')
        .upsert({
          estudiante_id: studentId,
          juego_id: gameId,
          intentos: evalItem.attempts || 1,
          aciertos: evalItem.successes || 1,
          pistas: evalItem.hintsUsed || 0,
          completado: evalItem.completed || true,
          calificacion: evalItem.lastGrade || 'A',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'estudiante_id,juego_id'
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Error guardando evaluación en Supabase:', err);
      return false;
    }
  },

  // 6. ELIMINAR ESTUDIANTE DE LA NUBE
  async deleteStudent(studentId) {
    if (!this.isConfigured()) return false;
    try {
      const { error } = await this.client
        .from('estudiantes')
        .delete()
        .eq('id', studentId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Error eliminando estudiante en Supabase:', err);
      return false;
    }
  }
};

// Inicialización automática
if (typeof window !== 'undefined') {
  window.SupabaseService.init();
}

