/**
 * ESTRUCTURA CURRICULAR CNEB POR SESIONES DE APRENDIZAJE
 * Educación Inicial - Ciclo II (3, 4 y 5 Años) - Área Matemática
 * Estándar de Aprendizaje de Nivel 2 (RVM N° 094-2020-MINEDU)
 *
 * Cada sesión declara:
 *  - capacidades: IDs de las capacidades CNEB que moviliza (ver cneb-curriculum.js).
 *  - desempenoPorEdad: la adecuación del desempeño para 3, 4 y 5 años.
 * Cada juego declara:
 *  - edades: las edades para las que el reto es pertinente. Un niño de 3 años
 *    solo verá los retos marcados con 3; uno de 5 años verá los marcados con 5.
 */

window.CNEB_DATA = {
  mundos: {
    // MUNDO 1: RESUELVE PROBLEMAS DE CANTIDAD
    cantidad: {
      id: 'cantidad',
      nombre: 'Aventuras de Cantidad',
      competencia: 'Resuelve problemas de cantidad',
      numeroCneb: 23,
      estandar: 'Nivel 2: Explora su entorno inmediato según sus características perceptuales al agrupar, ordenar hasta el quinto lugar, seriar hasta 5 objetos, comparar cantidades y pesos, y agregar y quitar hasta 5 elementos, realizando representaciones con su cuerpo, material concreto o dibujos. Expresa la cantidad de hasta 10 objetos, usando cuantificadores: "muchos", "pocos", "ninguno", y expresiones: "más que", "menos que", "pesa más", "pesa menos", "ayer", "hoy" y "mañana", en situaciones cotidianas.',
      icono: '🧺',
      color: 'from-amber-400 to-orange-500',
      sesiones: [
        {
          id: 'sesion_1',
          numero: 1,
          titulo: 'Sesión 1: Agrupamos y Comparamos en la Bodeguita',
          proposito: 'Que las niñas y los niños agrupen objetos por color y tamaño, y comparen colecciones usando cuantificadores (muchos, pocos, ninguno, más que, menos que).',
          desempenoCneb: 'Establece relaciones entre objetos según características perceptuales al comparar y agrupar. Usa cuantificadores: "muchos", "pocos", "ninguno" y expresiones "más que", "menos que".',
          desempenoPorEdad: {
            '3': 'Agrupa objetos según un solo criterio perceptual (color o tamaño) y expresa "muchos" o "pocos" al observar colecciones.',
            '4': 'Agrupa objetos según dos criterios y compara colecciones usando "muchos", "pocos", "ninguno", "más que" y "menos que".',
            '5': 'Agrupa, compara y argumenta por qué una colección tiene más o menos elementos usando todos los cuantificadores.'
          },
          capacidades: ['cant_cap1', 'cant_cap2', 'cant_cap4'],
          icono: '🍎',
          juegos: [
            { id: 'j1_1_color', titulo: 'Agrupar por Color', subtitulo: 'Canastas roja, amarilla y verde', icono: '🎨', tipo: 'agrupacion_color', edades: [3, 4, 5] },
            { id: 'j1_2_tamano', titulo: 'Agrupar por Tamaño', subtitulo: 'Frutas grandes y pequeñitas', icono: '📏', tipo: 'agrupacion_tamano', edades: [3, 4, 5] },
            { id: 'j1_3_cuantificadores', titulo: 'Cuantificadores', subtitulo: 'Muchos, pocos y ninguno', icono: '🧺', tipo: 'cuantificadores', edades: [3, 4, 5] },
            { id: 'j1_4_mas_menos', titulo: 'Comparar Colecciones', subtitulo: '¿Dónde hay más que o menos que?', icono: '⚖️', tipo: 'mas_menos', edades: [4, 5] }
          ]
        },
        {
          id: 'sesion_2',
          numero: 2,
          titulo: 'Sesión 2: Seriación en el Huerto y el Trencito',
          proposito: 'Que las niñas y los niños ordenen hasta 5 objetos de menor a mayor tamaño e identifiquen posiciones ordinales del 1.° al 5.° lugar.',
          desempenoCneb: 'Realiza seriaciones por tamaño, longitud y grosor hasta con 5 objetos. Establece correspondencia uno a uno e identifica el lugar que ocupa un objeto hasta el quinto lugar (1.° al 5.°).',
          desempenoPorEdad: {
            '3': 'Ordena objetos por tamaño con apoyo del adulto e identifica quién está primero y quién al último en una fila.',
            '4': 'Realiza seriaciones de hasta 3 objetos por tamaño o longitud e identifica el primero y el último lugar.',
            '5': 'Realiza seriaciones de hasta 5 objetos e identifica el lugar que ocupa un objeto del 1.° al 5.°.'
          },
          capacidades: ['cant_cap2', 'cant_cap3'],
          icono: '🚂',
          juegos: [
            { id: 'j2_1_plantas', titulo: 'Seriación de Plantitas', subtitulo: 'Del más pequeño al más grande (5 objetos)', icono: '🌱', tipo: 'seriacion_5', edades: [5] },
            { id: 'j2_2_zanahorias', titulo: 'Zanahorias para el Conejo', subtitulo: 'De la más corta a la más larga', icono: '🥕', tipo: 'seriacion_zanahorias', edades: [3, 4, 5] },
            { id: 'j2_3_trencito', titulo: 'Los Vagones del Trencito', subtitulo: 'Identifica del 1.° al 5.° lugar', icono: '🚆', tipo: 'ordinales_5', edades: [5] },
            { id: 'j2_4_primero_ultimo', titulo: 'Primero y Último', subtitulo: 'Posiciones relativas en la fila', icono: '🚩', tipo: 'primero_ultimo', edades: [3, 4, 5] }
          ]
        },
        {
          id: 'sesion_3',
          numero: 3,
          titulo: 'Sesión 3: Conteo, Operaciones Concretas y Balanza',
          proposito: 'Que las niñas y los niños cuenten hasta 10 con voz y material concreto, resuelvan adiciones y sustracciones sencillas hasta 5, y comparen pesos y nociones de tiempo.',
          desempenoCneb: 'Utiliza el conteo hasta 10 en situaciones cotidianas. Resuelve situaciones sencillas de agregar o quitar hasta 5 elementos. Compara pesos ("pesa más", "pesa menos") y usa nociones temporales ("antes", "después").',
          desempenoPorEdad: {
            '3': 'Compara pesos de dos objetos ("pesa más", "pesa menos") y ordena dos momentos de su rutina ("antes", "después").',
            '4': 'Cuenta hasta 5 objetos, agrega o quita hasta 3 elementos con material concreto y compara pesos.',
            '5': 'Cuenta hasta 10 con correspondencia uno a uno, agrega y quita hasta 5 elementos, compara pesos y secuencias temporales.'
          },
          capacidades: ['cant_cap1', 'cant_cap3', 'cant_cap4'],
          icono: '🔢',
          juegos: [
            { id: 'j3_1_conteo10', titulo: 'Canasta de las 10 Naranjas', subtitulo: 'Conteo biunívoco 1 al 10 con sonido', icono: '🍊', tipo: 'conteo_10', edades: [5] },
            { id: 'j3_2_agregar', titulo: 'Patitos en la Laguna', subtitulo: 'Situaciones de agregar hasta 5', icono: '🦆', tipo: 'agregar_5', edades: [4, 5] },
            { id: 'j3_3_quitar', titulo: 'El Pícnic de las Galletas', subtitulo: 'Situaciones de quitar hasta 5', icono: '🍪', tipo: 'quitar_5', edades: [4, 5] },
            { id: 'j3_4_balanza', titulo: 'La Balanza Mágica', subtitulo: 'Pesa más y pesa menos', icono: '⚖️', tipo: 'balanza_pesos', edades: [3, 4, 5] },
            { id: 'j3_5_tiempo', titulo: 'Antes y Después', subtitulo: 'Secuencias de la rutina diaria', icono: '⏳', tipo: 'tiempo_secuencias', edades: [3, 4, 5] }
          ]
        }
      ]
    },

    // MUNDO 2: RESUELVE PROBLEMAS DE FORMA, MOVIMIENTO Y LOCALIZACIÓN
    espacio: {
      id: 'espacio',
      nombre: 'Exploradores del Espacio',
      competencia: 'Resuelve problemas de forma, movimiento y localización',
      numeroCneb: 26,
      estandar: 'Nivel 2: Establece relaciones entre las formas de los objetos de su entorno y las formas geométricas bidimensionales y tridimensionales. Establece relaciones de medida en situaciones cotidianas y expresa longitud ("es más largo que", "es más corto que"). Se ubica a sí mismo y ubica objetos en el espacio cerca de, lejos de, al lado de; hacia adelante, hacia atrás, hacia un lado, hacia el otro lado.',
      icono: '🚀',
      color: 'from-sky-400 to-indigo-500',
      sesiones: [
        {
          id: 'sesion_esp_1',
          numero: 1,
          titulo: 'Sesión 1: Formas 2D y Cuerpos 3D en el Entorno',
          proposito: 'Que las niñas y los niños relacionen objetos reales de su entorno con formas geométricas bidimensionales (círculo, cuadrado, triángulo, rectángulo) y tridimensionales (esfera, cubo, cilindro).',
          desempenoCneb: 'Establece relaciones entre las formas de los objetos que están a su alrededor y las formas geométricas bidimensionales (círculo, cuadrado, triángulo, rectángulo) y tridimensionales (esfera, cubo, cilindro).',
          desempenoPorEdad: {
            '3': 'Reconoce objetos redondos y cuadrados de su entorno y descubre cuáles ruedan.',
            '4': 'Identifica círculo, cuadrado y triángulo en objetos cotidianos y diferencia los que ruedan de los que no.',
            '5': 'Relaciona objetos con formas 2D (círculo, cuadrado, triángulo, rectángulo) y cuerpos 3D (esfera, cubo, cilindro).'
          },
          capacidades: ['esp_cap1', 'esp_cap2'],
          icono: '🔷',
          juegos: [
            { id: 'esp_j1_formas2d', titulo: 'El Museo de las Formas 2D', subtitulo: 'Círculo, cuadrado, triángulo y rectángulo', icono: '🟡', tipo: 'formas_2d', edades: [3, 4, 5] },
            { id: 'esp_j1_cuerpos3d', titulo: 'Cuerpos 3D en la Vida Real', subtitulo: 'Esfera, cubo y cilindro', icono: '🥫', tipo: 'cuerpos_3d', edades: [4, 5] },
            { id: 'esp_j1_clasificacion', titulo: '¿Rueda o No Rueda?', subtitulo: 'Diferencia figuras planas de cuerpos redondos', icono: '⚽', tipo: 'rueda_no_rueda', edades: [3, 4, 5] }
          ]
        },
        {
          id: 'sesion_esp_2',
          numero: 2,
          titulo: 'Sesión 2: Ubicación Espacial en el Parque',
          proposito: 'Que las niñas y los niños ubiquen personajes y objetos en el espacio usando las expresiones "cerca de", "lejos de" y "al lado de".',
          desempenoCneb: 'Se ubica a sí mismo y ubica objetos en el espacio en el que se encuentra; organiza sus movimientos y acciones usando expresiones: "cerca de", "lejos de", "al lado de".',
          desempenoPorEdad: {
            '3': 'Se ubica en relación a sí mismo y a un objeto usando "cerca" y "lejos".',
            '4': 'Ubica objetos usando "cerca de", "lejos de" y "al lado de" con un punto de referencia.',
            '5': 'Ubica personajes y objetos siguiendo varias indicaciones espaciales combinadas.'
          },
          capacidades: ['esp_cap2', 'esp_cap3'],
          icono: '📍',
          juegos: [
            { id: 'esp_j2_cerca_lejos', titulo: 'Cerca y Lejos del Árbol', subtitulo: 'Puntos de referencia con la pelota', icono: '🌳', tipo: 'cerca_lejos', edades: [3, 4, 5] },
            { id: 'esp_j2_al_lado', titulo: 'Al Lado del Tobogán', subtitulo: 'Sentando al osito en su lugar', icono: '🛝', tipo: 'al_lado', edades: [4, 5] },
            { id: 'esp_j2_posiciones', titulo: 'El Parque de Kusi', subtitulo: 'Coloca a los amigos según la indicación', icono: '🎪', tipo: 'posiciones_parque', edades: [4, 5] }
          ]
        },
        {
          id: 'sesion_esp_3',
          numero: 3,
          titulo: 'Sesión 3: Desplazamientos y Medida de Longitud',
          proposito: 'Que las niñas y los niños guíen a un personaje en una cuadrícula con flechas direccionales y comparen longitudes ("es más largo que", "es más corto que").',
          desempenoCneb: 'Expresa los desplazamientos usando: "hacia adelante", "hacia atrás", "hacia un lado", "hacia el otro lado". Establece relaciones de medida usando "es más largo que", "es más corto que".',
          desempenoPorEdad: {
            '3': 'Compara dos objetos y señala cuál es "más corto" con apoyo visual marcado.',
            '4': 'Compara longitudes usando "más largo que" y "más corto que" entre dos o tres objetos.',
            '5': 'Se desplaza en una cuadrícula siguiendo flechas y compara longitudes para resolver un problema.'
          },
          capacidades: ['esp_cap3', 'esp_cap4'],
          icono: '🧭',
          juegos: [
            { id: 'esp_j3_desplazamiento', titulo: 'El Laberinto de Fido', subtitulo: 'Cuadrícula con flechas direccionales', icono: '🐶', tipo: 'laberinto_flechas', edades: [5] },
            { id: 'esp_j3_mas_largo', titulo: 'El Camino Más Largo Que...', subtitulo: 'Recorrido con baldosas y flores', icono: '🐌', tipo: 'camino_largo', edades: [4, 5] },
            { id: 'esp_j3_mas_corto', titulo: 'Cintas de Fiesta Más Cortas', subtitulo: 'Compara tamaños de cintas coloridas', icono: '🎀', tipo: 'cinta_corta', edades: [3, 4, 5] },
            { id: 'esp_j3_puente', titulo: 'El Puente de Madera', subtitulo: 'Elige la tabla más larga para cruzar el río', icono: '🪵', tipo: 'puente_largo', edades: [4, 5] }
          ]
        }
      ]
    }
  },

  escala: {
    AD: {
      sigla: 'AD',
      nombre: 'Logro Destacado',
      descripcion: 'El estudiante evidencia un nivel superior a lo esperado respecto del estándar del Ciclo II.',
      criterio: 'Resuelve a la primera oportunidad con autonomía, iniciativa y sin requerir pistas adicionales.'
    },
    A: {
      sigla: 'A',
      nombre: 'Logro Esperado',
      descripcion: 'El estudiante evidencia el nivel esperado respecto del estándar del Ciclo II.',
      criterio: 'Resuelve satisfactoriamente las actividades en 1 o 2 intentos de manera autónoma.'
    },
    B: {
      sigla: 'B',
      nombre: 'En Proceso',
      descripcion: 'El estudiante está próximo o cerca al nivel esperado respecto del estándar del Ciclo II.',
      criterio: 'Resuelve la actividad tras reflexionar con las pistas amigables de Kusi (error constructivo).'
    },
    C: {
      sigla: 'C',
      nombre: 'En Inicio',
      descripcion: 'El estudiante muestra un progreso incipiente respecto del estándar del Ciclo II.',
      criterio: 'Presenta dudas frecuentes y requiere el acompañamiento directo del docente o adulto mediador.'
    }
  },

  // =========================================================================
  // AYUDANTES DE CONSULTA
  // =========================================================================
  getMundosList() {
    return Object.values(this.mundos);
  },

  getSesion(worldId, sessionId) {
    const mundo = this.mundos[worldId];
    if (!mundo) return null;
    return mundo.sesiones.find(s => s.id === sessionId) || null;
  },

  // Retos de una sesión pertinentes para una edad (3, 4 o 5). Sin edad: todos.
  getJuegos(worldId, sessionId, age = null) {
    const sesion = this.getSesion(worldId, sessionId);
    if (!sesion) return [];
    const edad = parseInt(age, 10);
    if (!edad) return sesion.juegos;
    const filtered = sesion.juegos.filter(j => !j.edades || j.edades.includes(edad));
    return filtered.length > 0 ? filtered : sesion.juegos;
  },

  // Total de retos que verá un estudiante de cierta edad en todos los mundos
  getTotalJuegosForAge(age = null) {
    return this.getMundosList().reduce((acc, mundo) => {
      return acc + mundo.sesiones.reduce((a, s) => a + this.getJuegos(mundo.id, s.id, age).length, 0);
    }, 0);
  }
};
