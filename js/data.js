/**
 * ESTRUCTURA CURRICULAR CNEB POR SESIONES DE APRENDIZAJE
 * Educación Inicial - Ciclo II (5 Años) - Matemática
 * Estándar de Aprendizaje de Nivel 2 (RVM N° 094-2020-MINEDU)
 */

window.CNEB_DATA = {
  mundos: {
    // MUNDO 1: RESUELVE PROBLEMAS DE CANTIDAD
    cantidad: {
      id: 'cantidad',
      nombre: 'Aventuras de Cantidad',
      competencia: 'Resuelve problemas de cantidad',
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
          icono: '🍎',
          juegos: [
            { id: 'j1_1_color', titulo: 'Agrupar por Color', subtitulo: 'Canastas roja, amarilla y verde', icono: '🎨', tipo: 'agrupacion_color' },
            { id: 'j1_2_tamano', titulo: 'Agrupar por Tamaño', subtitulo: 'Frutas grandes y pequeñitas', icono: '📏', tipo: 'agrupacion_tamano' },
            { id: 'j1_3_cuantificadores', titulo: 'Cuantificadores', subtitulo: 'Muchos, pocos y ninguno', icono: '🧺', tipo: 'cuantificadores' },
            { id: 'j1_4_mas_menos', titulo: 'Comparar Colecciones', subtitulo: '¿Dónde hay más que o menos que?', icono: '⚖️', tipo: 'mas_menos' }
          ]
        },
        {
          id: 'sesion_2',
          numero: 2,
          titulo: 'Sesión 2: Seriación en el Huerto y el Trencito',
          proposito: 'Que las niñas y los niños ordenen hasta 5 objetos de menor a mayor tamaño e identifiquen posiciones ordinales del 1.° al 5.° lugar.',
          desempenoCneb: 'Realiza seriaciones por tamaño, longitud y grosor hasta con 5 objetos. Establece correspondencia uno a uno e identifica el lugar que ocupa un objeto hasta el quinto lugar (1.° al 5.°).',
          icono: '🚂',
          juegos: [
            { id: 'j2_1_plantas', titulo: 'Seriación de Plantitas', subtitulo: 'Del más pequeño al más grande (5 objetos)', icono: '🌱', tipo: 'seriacion_5' },
            { id: 'j2_2_zanahorias', titulo: 'Zanahorias para el Conejo', subtitulo: 'De la más corta a la más larga', icono: '🥕', tipo: 'seriacion_zanahorias' },
            { id: 'j2_3_trencito', titulo: 'Los Vagones del Trencito', subtitulo: 'Identifica del 1.° al 5.° lugar', icono: '🚆', tipo: 'ordinales_5' },
            { id: 'j2_4_primero_ultimo', titulo: 'Primero y Último', subtitulo: 'Posiciones relativas en la fila', icono: '🚩', tipo: 'primero_ultimo' }
          ]
        },
        {
          id: 'sesion_3',
          numero: 3,
          titulo: 'Sesión 3: Conteo, Operaciones Concretas y Balanza',
          proposito: 'Que las niñas y los niños cuenten hasta 10 con voz y material concreto, resuelvan adiciones y sustracciones sencillas hasta 5, y comparen pesos y nociones de tiempo.',
          desempenoCneb: 'Utiliza el conteo hasta 10 en situaciones cotidianas. Resuelve situaciones sencillas de agregar o quitar hasta 5 elementos. Compara pesos ("pesa más", "pesa menos") y usa nociones temporales ("antes", "después").',
          icono: '🔢',
          juegos: [
            { id: 'j3_1_conteo10', titulo: 'Canasta de las 10 Naranjas', subtitulo: 'Conteo biunívoco 1 al 10 con sonido', icono: '🍊', tipo: 'conteo_10' },
            { id: 'j3_2_agregar', titulo: 'Patitos en la Laguna', subtitulo: 'Situaciones de agregar hasta 5', icono: '🦆', tipo: 'agregar_5' },
            { id: 'j3_3_quitar', titulo: 'El Pícnic de las Galletas', subtitulo: 'Situaciones de quitar hasta 5', icono: '🍪', tipo: 'quitar_5' },
            { id: 'j3_4_balanza', titulo: 'La Balanza Mágica', subtitulo: 'Pesa más y pesa menos', icono: '⚖️', tipo: 'balanza_pesos' },
            { id: 'j3_5_tiempo', titulo: 'Antes y Después', subtitulo: 'Secuencias de la rutina diaria', icono: '⏳', tipo: 'tiempo_secuencias' }
          ]
        }
      ]
    },

    // MUNDO 2: RESUELVE PROBLEMAS DE FORMA, MOVIMIENTO Y LOCALIZACIÓN
    espacio: {
      id: 'espacio',
      nombre: 'Exploradores del Espacio',
      competencia: 'Resuelve problemas de forma, movimiento y localización',
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
          icono: '🔷',
          juegos: [
            { id: 'esp_j1_formas2d', titulo: 'El Museo de las Formas 2D', subtitulo: 'Círculo, cuadrado, triángulo y rectángulo', icono: '🟡', tipo: 'formas_2d' },
            { id: 'esp_j1_cuerpos3d', titulo: 'Cuerpos 3D en la Vida Real', subtitulo: 'Esfera, cubo y cilindro', icono: '🥫', tipo: 'cuerpos_3d' },
            { id: 'esp_j1_clasificacion', titulo: '¿Rueda o No Rueda?', subtitulo: 'Diferencia figuras planas de cuerpos redondos', icono: '⚽', tipo: 'rueda_no_rueda' }
          ]
        },
        {
          id: 'sesion_esp_2',
          numero: 2,
          titulo: 'Sesión 2: Ubicación Espacial en el Parque',
          proposito: 'Que las niñas y los niños ubiquen personajes y objetos en el espacio usando las expresiones "cerca de", "lejos de" y "al lado de".',
          desempenoCneb: 'Se ubica a sí mismo y ubica objetos en el espacio en el que se encuentra; organiza sus movimientos y acciones usando expresiones: "cerca de", "lejos de", "al lado de".',
          icono: '📍',
          juegos: [
            { id: 'esp_j2_cerca_lejos', titulo: 'Cerca y Lejos del Árbol', subtitulo: 'Puntos de referencia con la pelota', icono: '🌳', tipo: 'cerca_lejos' },
            { id: 'esp_j2_al_lado', titulo: 'Al Lado del Tobogán', subtitulo: 'Sentando al osito en su lugar', icono: '🛝', tipo: 'al_lado' },
            { id: 'esp_j2_posiciones', titulo: 'El Parque de Kusi', subtitulo: 'Coloca a los amigos según la indicación', icono: '🎪', tipo: 'posiciones_parque' }
          ]
        },
        {
          id: 'sesion_esp_3',
          numero: 3,
          titulo: 'Sesión 3: Desplazamientos y Medida de Longitud',
          proposito: 'Que las niñas y los niños guíen a un personaje en una cuadrícula con flechas direccionales y comparen longitudes ("es más largo que", "es más corto que").',
          desempenoCneb: 'Expresa los desplazamientos usando: "hacia adelante", "hacia atrás", "hacia un lado", "hacia el otro lado". Establece relaciones de medida usando "es más largo que", "es más corto que".',
          icono: '🧭',
          juegos: [
            { id: 'esp_j3_desplazamiento', titulo: 'El Laberinto de Fido', subtitulo: 'Cuadrícula con flechas direccionales', icono: '🐶', tipo: 'laberinto_flechas' },
            { id: 'esp_j3_mas_largo', titulo: 'El Camino Más Largo Que...', subtitulo: 'Recorrido con baldosas y flores', icono: '🐌', tipo: 'camino_largo' },
            { id: 'esp_j3_mas_corto', titulo: 'Cintas de Fiesta Más Cortas', subtitulo: 'Compara tamaños de cintas coloridas', icono: '🎀', tipo: 'cinta_corta' },
            { id: 'esp_j3_puente', titulo: 'El Puente de Madera', subtitulo: 'Elige la tabla más larga para cruzar el río', icono: '🪵', tipo: 'puente_largo' }
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
  }
};
