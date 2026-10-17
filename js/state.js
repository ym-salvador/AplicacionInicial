/**
 * GESTOR DE ESTADO Y EVALUACIÓN FORMATIVA CNEB (MUNDOS 1 Y 2)
 * Evaluación formativa completa para las 6 sesiones (3 de Cantidad y 3 de Espacio)
 * Escala oficial (AD, A, B, C) y conclusiones descriptivas oficiales para SIAGIE.
 */

class AppStateManager {
  constructor() {
    this.storageKey = 'cneb_mate5_app_state_v3';
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      childName: 'Estudiante de 5 años',
      childAge: 5,
      institution: 'I.E. Inicial',
      stars: 0,
      currentWorld: null,
      currentSession: null,
      currentGame: null,
      evaluaciones: {
        // MUNDO 1: CANTIDAD
        // Sesión 1
        j1_1_color: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j1_2_tamano: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j1_3_cuantificadores: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j1_4_mas_menos: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        // Sesión 2
        j2_1_plantas: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j2_2_zanahorias: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j2_3_trencito: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j2_4_primero_ultimo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        // Sesión 3
        j3_1_conteo10: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j3_2_agregar: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j3_3_quitar: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j3_4_balanza: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        j3_5_tiempo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },

        // MUNDO 2: ESPACIO, FORMA Y MOVIMIENTO
        // Sesión 1: Formas 2D y 3D
        esp_j1_formas2d: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j1_cuerpos3d: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j1_clasificacion: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        // Sesión 2: Ubicación Espacial
        esp_j2_cerca_lejos: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j2_al_lado: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j2_posiciones: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        // Sesión 3: Desplazamiento y Longitud
        esp_j3_desplazamiento: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j3_mas_largo: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j3_mas_corto: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null },
        esp_j3_puente: { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null }
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...this.getDefaultState(),
          ...parsed,
          evaluaciones: { ...this.getDefaultState().evaluaciones, ...(parsed.evaluaciones || {}) }
        };
      }
    } catch (e) {
      console.warn('Error al cargar estado:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error al guardar estado:', e);
    }
  }

  // Registra el resultado de un minijuego aplicando la escala CNEB
  recordResult(gameId, isSuccess, hintsCount = 0) {
    if (!this.state.evaluaciones[gameId]) {
      this.state.evaluaciones[gameId] = { attempts: 0, successes: 0, hintsUsed: 0, completed: false, lastGrade: null };
    }

    const item = this.state.evaluaciones[gameId];
    item.attempts += 1;
    item.hintsUsed += hintsCount;

    if (isSuccess) {
      item.successes += 1;
      item.completed = true;
      this.state.stars += 3;

      // Criterios CNEB Nivel 2 (RVM N° 094-2020-MINEDU)
      if (item.attempts === 1 && hintsCount === 0) {
        item.lastGrade = 'AD'; // Logro Destacado (autonomía inmediata)
      } else if (item.attempts <= 2 && hintsCount <= 1) {
        item.lastGrade = 'A'; // Logro Esperado (autónomo)
      } else if (hintsCount >= 2 || item.attempts > 2) {
        item.lastGrade = 'B'; // En Proceso (error constructivo con pistas)
      } else {
        item.lastGrade = 'B';
      }
    } else {
      if (!item.completed) {
        item.lastGrade = 'C'; // En Inicio
      }
    }

    this.saveState();
  }

  // Obtiene evaluación y porcentaje de una sesión específica en cualquier mundo
  getSessionAssessment(worldId, sessionId) {
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return null;

    const session = mundo.sesiones.find(s => s.id === sessionId);
    if (!session) return null;

    const items = session.juegos.map(j => {
      const ev = this.state.evaluaciones[j.id];
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

    return {
      session,
      grade,
      items,
      completedCount,
      totalCount: session.juegos.length,
      progressPercent: Math.round((completedCount / session.juegos.length) * 100)
    };
  }

  // Evaluación global de un mundo ('cantidad' o 'espacio')
  getWorldOverallAssessment(worldId) {
    const mundo = window.CNEB_DATA.mundos[worldId];
    if (!mundo) return null;

    const sessionAssessments = mundo.sesiones.map(ses => this.getSessionAssessment(worldId, ses.id));
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

    return {
      competencia: mundo,
      overall,
      sesiones: sessionAssessments
    };
  }

  // Genera Conclusiones Descriptivas Oficiales MINEDU para SIAGIE
  generateConclusion(worldId) {
    const assessment = this.getWorldOverallAssessment(worldId);
    const name = this.state.childName || 'El niño/a';

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

  updateChildName(name) {
    this.state.childName = name.trim() || 'Estudiante de 5 años';
    this.saveState();
  }

  resetProgress() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

// Instancia global
window.AppState = new AppStateManager();
