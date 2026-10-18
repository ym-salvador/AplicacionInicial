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

  // CREDENCIALES GLOBALES DEL AULA (Permiten que GitHub Pages funcione automáticamente en los celulares de los padres)
  defaultUrl: 'https://xzmlusxjnvlfftncrkdh.supabase.co',
  defaultKey: 'sb_publishable__ObKQyunta2TcQxLiRNu5A_5nV8bVod',

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
    // Si están configuradas permanentemente en el código, usarlas en todos los dispositivos
    if (this.defaultUrl && this.defaultKey) {
      return {
        url: this.defaultUrl,
        key: this.defaultKey
      };
    }
    try {
      const saved = localStorage.getItem(this.configKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.key) {
          return parsed;
        }
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
        const mascotIcon = (!data.mascot_icon || data.mascot_icon === 'llama' || data.mascot_icon.length > 4) ? '🦙' : data.mascot_icon;
        return {
          schoolName: data.school_name,
          activeClass: data.active_class,
          teacherName: data.teacher_name,
          teacherPhone: data.teacher_phone || '',
          mascotIcon: mascotIcon,
          mascotName: data.mascot_name || 'Kusi',
          appTitle: data.app_title || `Matemática ${data.mascot_name || 'Kusi'}`,
          teacherPin: data.teacher_pin || '1234',
          institutionLogo: data.institution_logo || '',
          directorName: data.director_name || 'Lic. María Elena Pérez',
          directorTitle: data.director_title || 'Directora',
          directorSignature: data.director_signature || '',
          teacherTitle: data.teacher_title || 'Docente de Aula',
          teacherSignature: data.teacher_signature || '',
          certificateCity: data.certificate_city || 'Lima'
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
      const cleanIcon = (!config.mascotIcon || config.mascotIcon === 'llama' || config.mascotIcon.length > 4) ? '🦙' : config.mascotIcon;
      const basePayload = {
        school_name: config.schoolName,
        active_class: config.activeClass,
        teacher_name: config.teacherName,
        teacher_phone: config.teacherPhone || '',
        mascot_icon: cleanIcon,
        mascot_name: config.mascotName || 'Kusi',
        app_title: config.appTitle || `Matemática ${config.mascotName || 'Kusi'}`,
        teacher_pin: config.teacherPin || '1234',
        updated_at: new Date().toISOString()
      };

      // Payload extendido con personalización de diplomas
      const fullPayload = {
        ...basePayload,
        institution_logo: config.institutionLogo || '',
        director_name: config.directorName || 'Lic. María Elena Pérez',
        director_title: config.directorTitle || 'Directora',
        director_signature: config.directorSignature || '',
        teacher_title: config.teacherTitle || 'Docente de Aula',
        teacher_signature: config.teacherSignature || '',
        certificate_city: config.certificateCity || 'Lima'
      };

      try {
        const { error: fullErr } = await this.client
          .from('colegio_config')
          .update(fullPayload)
          .eq('id', 'aula_default');
        if (!fullErr) return true;
      } catch (e) {
        // Fallback si las columnas nuevas aún no existen en Supabase
      }

      // Fallback seguro a columnas base
      const { error: updateErr } = await this.client
        .from('colegio_config')
        .update(basePayload)
        .eq('id', 'aula_default');

      if (updateErr) {
        const { error: upsertErr } = await this.client
          .from('colegio_config')
          .upsert({ id: 'aula_default', ...basePayload }, { onConflict: 'id' });
        if (upsertErr) throw upsertErr;
      }
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

      // Cargar usuarios para enlazar correos de los padres
      const { data: users } = await this.client
        .from('usuarios')
        .select('id, email, telefono, nombre');
      const usersMap = new Map();
      if (users && Array.isArray(users)) {
        users.forEach(u => usersMap.set(u.id, u));
      }

      return students.map(st => {
        const studentEvals = window.AppState ? window.AppState.getDefaultEvaluations() : {};
        if (evalsByStudent[st.id]) {
          Object.assign(studentEvals, evalsByStudent[st.id]);
        }
        const parentUser = st.parent_id ? usersMap.get(st.parent_id) : null;
        return {
          id: st.id,
          name: st.nombre,
          avatar: st.avatar || '🦙',
          age: st.edad || 5,
          stars: st.estrellas || 0,
          pin: st.pin_acceso || st.id || '1234',
          parentName: st.parent_nombre || (parentUser ? parentUser.nombre : ''),
          parentPhone: st.parent_telefono || (parentUser ? parentUser.telefono : ''),
          parentEmail: (parentUser && parentUser.email) ? parentUser.email : '',
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

      // Si se proporcionó información del padre/madre (nombre, email o teléfono), registrar en usuarios
      if ((studentData.parentName || studentData.parentEmail || studentData.parentPhone) && !parentId) {
        const { data: parentUser, error: errParent } = await this.client
          .from('usuarios')
          .insert({
            nombre: studentData.parentName || ('Familia de ' + studentData.name),
            email: studentData.parentEmail || null,
            telefono: studentData.parentPhone || '',
            rol: 'padre',
            pin_acceso: studentData.pin || studentData.id
          })
          .select()
          .single();

        if (!errParent && parentUser) {
          parentId = parentUser.id;
        }
      } else if (parentId) {
        await this.client
          .from('usuarios')
          .update({
            nombre: studentData.parentName || 'Familia',
            email: studentData.parentEmail || null,
            telefono: studentData.parentPhone || '',
            pin_acceso: studentData.pin || studentData.id
          })
          .eq('id', parentId);
      }

      const { error } = await this.client
        .from('estudiantes')
        .upsert({
          id: studentData.id,
          nombre: studentData.name,
          avatar: studentData.avatar || '🦙',
          edad: studentData.age || 5,
          estrellas: studentData.stars || 0,
          pin_acceso: studentData.pin || studentData.id,
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

  // ACTUALIZAR DIRECTAMENTE EL PIN DE UN ESTUDIANTE
  async updateStudentPin(studentId, newPin) {
    if (!this.isConfigured()) return false;
    try {
      const { error } = await this.client
        .from('estudiantes')
        .update({ pin_acceso: newPin })
        .eq('id', studentId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Error actualizando PIN en Supabase:', err);
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

