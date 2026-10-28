/**
 * CATÁLOGO CURRICULAR MAESTRO CNEB - EDUCACIÓN INICIAL (CICLO II: 3, 4 Y 5 AÑOS)
 * Basado en el Currículo Nacional de la Educación Básica (MINEDU - Perú)
 * RVM N° 094-2020-MINEDU y Programa Curricular de Educación Inicial.
 * 
 * Áreas Curriculares Oficiales:
 * - Matemática (Color: Ámbar / Naranja)
 * - Comunicación (Color: Celeste / Azul)
 * - Personal Social (Color: Rosa / Fucsia)
 * - Psicomotriz (Color: Verde Lima)
 * - Ciencia y Tecnología (Color: Verde Menta / Turquesa)
 * - Competencias Transversales (Color: Púrpura / Violeta)
 */

window.CNEB_CURRICULUM = {
  // Ciclos Educativos
  ciclos: [
    {
      id: 'ciclo_1',
      nombre: 'Ciclo I (Cuna)',
      rango: '0 a 2 años',
      descripcion: 'Atención integral, exploración sensorial, desarrollo motor autónomo y primeros vínculos afectivos.'
    },
    {
      id: 'ciclo_2',
      nombre: 'Ciclo II (Jardín)',
      rango: '3 a 5 años',
      descripcion: 'Desarrollo de la autonomía, socialización, pensamiento matemático vivencial, comunicación y descubrimiento del entorno.'
    }
  ],

  // Niveles / Edades de Educación Inicial (Ciclo II) con identidad visual pedagógica
  edades: {
    '3': {
      edad: 3,
      ciclo: 'Ciclo II',
      nombre: 'Aula 3 Años',
      alias: 'Semillitas Curiosas 🌱',
      colorName: 'emerald',
      colorHex: '#10B981',
      bgLight: 'bg-emerald-50',
      borderClass: 'border-emerald-400',
      textClass: 'text-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: '🌱',
      enfoque: 'Exploración sensorial directa, juego libre, motricidad gruesa y nociones de cantidad vivenciales con 1 criterio.'
    },
    '4': {
      edad: 4,
      ciclo: 'Ciclo II',
      nombre: 'Aula 4 Años',
      alias: 'Pequeños Exploradores 🌟',
      colorName: 'amber',
      colorHex: '#F59E0B',
      bgLight: 'bg-amber-50',
      borderClass: 'border-amber-400',
      textClass: 'text-amber-800',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: '🌟',
      enfoque: 'Comparación por 2 criterios, seriación hasta 3 objetos, conteo hasta 5, formas y nociones espaciales relativas.'
    },
    '5': {
      edad: 5,
      ciclo: 'Ciclo II',
      nombre: 'Aula 5 Años',
      alias: 'Grandes Campeones 🚀',
      colorName: 'sky',
      colorHex: '#0EA5E9',
      bgLight: 'bg-sky-50',
      borderClass: 'border-sky-400',
      textClass: 'text-sky-800',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
      icon: '🚀',
      enfoque: 'Conteo hasta 10 con marco de diez, operaciones concretas de agregar/quitar hasta 5, ordinales 1.° al 5.°, formas 2D y cuerpos 3D, longitud y balanza.'
    }
  },

  // Áreas Curriculares Oficiales del CNEB
  areas: {
    matematica: {
      id: 'matematica',
      nombre: 'Matemática',
      color: 'amber',
      colorHex: '#F59E0B',
      bgGradient: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      border: 'border-amber-400',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: '🔢',
      descripcion: 'Resolución de problemas de la vida cotidiana para construir nociones de número, forma, espacio y medida.'
    },
    comunicacion: {
      id: 'comunicacion',
      nombre: 'Comunicación',
      color: 'sky',
      colorHex: '#0284C7',
      bgGradient: 'from-sky-400 to-blue-600',
      bgLight: 'bg-sky-50',
      border: 'border-sky-400',
      badge: 'bg-sky-100 text-sky-900 border-sky-300',
      icon: '🗣️',
      descripcion: 'Expresión oral espontánea, escucha activa, aproximación a la lectura y escritura no convencional y lenguajes artísticos.'
    },
    personal_social: {
      id: 'personal_social',
      nombre: 'Personal Social',
      color: 'rose',
      colorHex: '#E11D48',
      bgGradient: 'from-rose-400 to-pink-500',
      bgLight: 'bg-rose-50',
      border: 'border-rose-400',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: '🤝',
      descripcion: 'Construcción de la propia identidad, autorregulación emocional, convivencia democrática y sentido de pertenencia.'
    },
    psicomotriz: {
      id: 'psicomotriz',
      nombre: 'Psicomotriz',
      color: 'lime',
      colorHex: '#84CC16',
      bgGradient: 'from-lime-400 to-emerald-500',
      bgLight: 'bg-lime-50',
      border: 'border-lime-400',
      badge: 'bg-lime-100 text-lime-900 border-lime-300',
      icon: '🏃',
      descripcion: 'Desarrollo motriz autónomo, esquema corporal, coordinación visomotora y expresión corporal a través del juego.'
    },
    ciencia_tecnologia: {
      id: 'ciencia_tecnologia',
      nombre: 'Ciencia y Tecnología',
      color: 'teal',
      colorHex: '#0D9488',
      bgGradient: 'from-teal-400 to-emerald-600',
      bgLight: 'bg-teal-50',
      border: 'border-teal-400',
      badge: 'bg-teal-100 text-teal-900 border-teal-300',
      icon: '🔬',
      descripcion: 'Indagación mediante la curiosidad, exploración de seres vivos y objetos del entorno para construir explicaciones.'
    },
    transversal: {
      id: 'transversal',
      nombre: 'Competencias Transversales',
      color: 'purple',
      colorHex: '#9333EA',
      bgGradient: 'from-purple-400 to-indigo-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-400',
      badge: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: '💻',
      descripcion: 'Desenvolvimiento en entornos virtuales TIC y gestión autónoma del propio proceso de aprendizaje.'
    }
  },

  // Competencias Oficiales con sus Capacidades (CNEB Oficial pp. 22-24 y pp. 91)
  competencias: {
    // === ÁREA MATEMÁTICA ===
    cantidad: {
      id: 'cantidad',
      numeroCneb: 23,
      areaId: 'matematica',
      nombre: 'Resuelve problemas de cantidad',
      icono: '🧺',
      descripcion: 'Construye nociones de número, operaciones, comparación, cuantificadores, peso y tiempo en situaciones cotidianas.',
      capacidades: [
        {
          id: 'cant_cap1',
          nombre: 'Traduce cantidades a expresiones numéricas',
          descripcion: 'Transforma relaciones entre datos de problemas en modelos de conteo, agrupación, adición y sustracción concreta.'
        },
        {
          id: 'cant_cap2',
          nombre: 'Comunica su comprensión sobre los números y las operaciones',
          descripcion: 'Expresa con palabras, señas, dibujos o material concreto las relaciones de cantidad, orden y medidas de peso/tiempo.'
        },
        {
          id: 'cant_cap3',
          nombre: 'Usa estrategias y procedimientos de estimación y cálculo',
          descripcion: 'Aplica el conteo biunívoco, seriaciones, marcos de diez, balanzas y emparejamiento para resolver retos.'
        },
        {
          id: 'cant_cap4',
          nombre: 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones',
          descripcion: 'Explica por qué un grupo tiene más elementos, por qué un objeto pesa más o por qué se realizó una acción matemática.'
        }
      ],
      desempenosPorEdad: {
        '3': 'Agrupa objetos de su entorno según un criterio perceptual (color o tamaño). Expresa expresiones como "muchos", "pocos" y realiza conteo espontáneo hasta 3.',
        '4': 'Agrupa objetos según dos criterios perceptuales. Realiza seriaciones por tamaño hasta 3 objetos. Expresa cantidades usando conteo hasta 5 y expresiones "más que", "menos que".',
        '5': 'Agrupa objetos según características perceptuales. Realiza seriaciones de hasta 5 objetos. Utiliza el conteo biunívoco hasta 10, ordinales del 1.° al 5.°, operaciones de agregar/quitar hasta 5, nociones de peso y tiempo.'
      }
    },
    espacio: {
      id: 'espacio',
      numeroCneb: 26,
      areaId: 'matematica',
      nombre: 'Resuelve problemas de forma, movimiento y localización',
      icono: '🚀',
      descripcion: 'Se orienta en el espacio, relaciona objetos con formas 2D y cuerpos 3D, realiza desplazamientos y mide longitudes.',
      capacidades: [
        {
          id: 'esp_cap1',
          nombre: 'Modela objetos con formas geométricas y sus transformaciones',
          descripcion: 'Relaciona las formas de su entorno con figuras geométricas bidimensionales y tridimensionales cotidianas.'
        },
        {
          id: 'esp_cap2',
          nombre: 'Comunica su comprensión sobre las formas y relaciones geométricas',
          descripcion: 'Describe las características de los objetos (ruedan, tienen lados rectos/curvos) y sus posiciones espaciales.'
        },
        {
          id: 'esp_cap3',
          nombre: 'Usa estrategias y procedimientos para orientarse en el espacio',
          descripcion: 'Se desplaza siguiendo rutas, cuadrículas, indicaciones direccionales y compara longitudes directamente.'
        },
        {
          id: 'esp_cap4',
          nombre: 'Argumenta afirmaciones sobre relaciones geométricas',
          descripcion: 'Explica por qué una figura rueda o no rueda, o por qué una ruta es más corta o larga que otra.'
        }
      ],
      desempenosPorEdad: {
        '3': 'Se ubica en el espacio en relación a sí mismo usando expresiones: "arriba", "abajo", "dentro", "fuera". Reconoce formas redondas en su entorno.',
        '4': 'Se ubica en el espacio usando expresiones: "cerca", "lejos", "al lado de". Identifica figuras 2D (círculo, cuadrado, triángulo) y compara "más largo que", "más corto que".',
        '5': 'Relaciona objetos con formas 2D (círculo, cuadrado, triángulo, rectángulo) y cuerpos 3D (esfera, cubo, cilindro). Se desplaza en cuadrícula y usa nociones espaciales avanzadas.'
      }
    },

    // === ÁREA COMUNICACIÓN ===
    com_oral: {
      id: 'com_oral',
      numeroCneb: 7,
      areaId: 'comunicacion',
      nombre: 'Se comunica oralmente en su lengua materna',
      icono: '🗣️',
      descripcion: 'Expresa ideas, emociones y necesidades mediante el lenguaje oral interactuando con pares y adultos.',
      capacidades: [
        { id: 'com_cap1', nombre: 'Obtiene información del texto oral', descripcion: 'Recupera y comprende información explícita de relatos y diálogos.' },
        { id: 'com_cap2', nombre: 'Infiere e interpreta información del texto oral', descripcion: 'Deduce relaciones de causa-efecto e intenciones del hablante.' },
        { id: 'com_cap3', nombre: 'Adecúa, organiza y desarrolla las ideas de forma coherente', descripcion: 'Mantiene el hilo temático al compartir sus experiencias.' },
        { id: 'com_cap4', nombre: 'Utiliza recursos no verbales y paraverbales de forma estratégica', descripcion: 'Acompaña su expresión con gestos, miradas y modulación de voz.' }
      ],
      desempenosPorEdad: {
        '3': 'Expresa sus necesidades y emociones con frases sencillas y gestos, respondiendo a preguntas directas.',
        '4': 'Participa en conversaciones del aula formulando preguntas y compartiendo relatos cotidianos entendibles.',
        '5': 'Expresa sus ideas con oraciones completas, opina sobre lo que le gusta o disgusta de un relato y argumenta sencillamente.'
      }
    },
    com_lee: {
      id: 'com_lee',
      numeroCneb: 8,
      areaId: 'comunicacion',
      nombre: 'Lee diversos tipos de textos escritos en lengua materna',
      icono: '📖',
      descripcion: 'Se aproxima a la lectura a través de imágenes, símbolos, etiquetas cotidianas y cuentos ilustrados.',
      capacidades: [
        { id: 'lee_cap1', nombre: 'Obtiene información del texto escrito', descripcion: 'Identifica imágenes, personajes y símbolos familiares en portadores de texto.' },
        { id: 'lee_cap2', nombre: 'Infiere e interpreta información del texto', descripcion: 'Anticipa el contenido del cuento o texto a partir de las ilustraciones.' },
        { id: 'lee_cap3', nombre: 'Reflexiona y evalúa la forma, contenido y contexto', descripcion: 'Opina sobre los personajes y sucesos de las historias leídas.' }
      ],
      desempenosPorEdad: {
        '3': 'Explora cuentos con ilustraciones y señala personajes que reconoce con agrado.',
        '4': 'Dice de qué tratará el cuento a partir de la carátula o láminas y sigue la lectura guiada con el dedo.',
        '5': 'Construye hipótesis sobre el texto, identifica letras de su nombre o palabras conocidas y opina sobre el mensaje del cuento.'
      }
    },
    com_arte: {
      id: 'com_arte',
      numeroCneb: 6,
      areaId: 'comunicacion',
      nombre: 'Crea proyectos desde los lenguajes artísticos',
      icono: '🎨',
      descripcion: 'Explora y experimenta con pintura, modelado, música, dramatización y danza creativa.',
      capacidades: [
        { id: 'arte_cap1', nombre: 'Explora y experimenta los lenguajes del arte', descripcion: 'Manipula colores, masas, sonidos y movimientos corporales.' },
        { id: 'arte_cap2', nombre: 'Aplica procesos creativos', descripcion: 'Genera propuestas propias para dibujar, pintar o construir objetos.' },
        { id: 'arte_cap3', nombre: 'Evalúa y socializa sus procesos y proyectos', descripcion: 'Muestra con alegría su creación y cuenta cómo lo hizo a sus compañeros.' }
      ],
      desempenosPorEdad: {
        '3': 'Explora libremente colores y texturas usando sus manos, dactilopintura y sonidos rítmicos.',
        '4': 'Combina colores primarios, modela figuras con plastilina y representa roles en juegos simbólicos.',
        '5': 'Elige sus materiales con intención, crea composiciones bidimensionales o tridimensionales y describe su obra.'
      }
    },

    // === ÁREA PERSONAL SOCIAL ===
    pers_identidad: {
      id: 'pers_identidad',
      numeroCneb: 1,
      areaId: 'personal_social',
      nombre: 'Construye su identidad',
      icono: '🪞',
      descripcion: 'Se reconoce como persona única y valiosa, autorregula sus emociones y cuida su bienestar.',
      capacidades: [
        { id: 'id_cap1', nombre: 'Se valora a sí mismo', descripcion: 'Reconoce sus características físicas, cualidades, gustos y pertenencia familiar.' },
        { id: 'id_cap2', nombre: 'Autorregula sus emociones', descripcion: 'Identifica la alegría, tristeza, enojo o miedo y busca apoyo cuando lo requiere.' }
      ],
      desempenosPorEdad: {
        '3': 'Se reconoce por su nombre, señala partes de su cuerpo y expresa alegría al compartir con su familia.',
        '4': 'Identifica sus cualidades físicas y gustos personales. Nombra sus emociones y recurre a su docente cuando se siente inseguro.',
        '5': 'Actúa de manera autónoma en actividades cotidianas, toma decisiones según sus posibilidades y regula su conducta en acuerdos de aula.'
      }
    },
    pers_convive: {
      id: 'pers_convive',
      numeroCneb: 16,
      areaId: 'personal_social',
      nombre: 'Convive y participa democráticamente en la búsqueda del bien común',
      icono: '🤝',
      descripcion: 'Interactúa con respeto con sus compañeros, cuida los materiales del aula y colabora en grupo.',
      capacidades: [
        { id: 'conv_cap1', nombre: 'Interactúa con todas las personas', descripcion: 'Comparte juegos y materiales sin discriminar a sus compañeros.' },
        { id: 'conv_cap2', nombre: 'Construye normas y asume acuerdos', descripcion: 'Participa en la elaboración y cumplimiento de las normas del aula.' },
        { id: 'conv_cap3', nombre: 'Participa en acciones que promueven el bienestar común', descripcion: 'Ordena los sectores de juego y apoya en el cuidado de las áreas compartidas.' }
      ],
      desempenosPorEdad: {
        '3': 'Juega al lado de sus compañeros, comparte juguetes con la guía de la docente y saluda al llegar.',
        '4': 'Participa en juegos grupales respetando turnos sencillos y ayuda a guardar los juguetes en su lugar.',
        '5': 'Propone normas para convivir en paz en el aula, resuelve desacuerdos mediante el diálogo y cuida los materiales comunes.'
      }
    },

    // === ÁREA PSICOMOTRIZ ===
    psic_motriz: {
      id: 'psic_motriz',
      numeroCneb: 2,
      areaId: 'psicomotriz',
      nombre: 'Se desenvuelve de manera autónoma a través de su motricidad',
      icono: '🤸',
      descripcion: 'Domina su cuerpo en el espacio con equilibrio, coordinación visomotriz y posturas saludables.',
      capacidades: [
        { id: 'mot_cap1', nombre: 'Comprende su cuerpo', descripcion: 'Interioriza su imagen corporal y posibilidades de movimiento estático y dinámico.' },
        { id: 'mot_cap2', nombre: 'Se expresa corporalmente', descripcion: 'Comunica emociones y sensaciones a través del ritmo, la danza y el juego motor.' }
      ],
      desempenosPorEdad: {
        '3': 'Corre, salta con los dos pies, trepa y manipula objetos grandes con agrado y seguridad.',
        '4': 'Camina sobre líneas rectas, salta en un pie y coordina movimientos ojo-mano al rasgar y encajar.',
        '5': 'Muestra equilibrio estático y dinámico, regula su fuerza muscular y demuestra destreza en trazos y construcciones.'
      }
    },

    // === ÁREA CIENCIA Y TECNOLOGÍA ===
    cien_indaga: {
      id: 'cien_indaga',
      numeroCneb: 20,
      areaId: 'ciencia_tecnologia',
      nombre: 'Indaga mediante métodos científicos para construir sus conocimientos',
      icono: '🌱',
      descripcion: 'Observa, experimenta, formula hipótesis y descubre fenómenos de la naturaleza y los seres vivos.',
      capacidades: [
        { id: 'ind_cap1', nombre: 'Problematiza situaciones para hacer indagación', descripcion: 'Hace preguntas guiadas por su asombro ante los fenómenos naturales.' },
        { id: 'ind_cap2', nombre: 'Diseña estrategias para hacer indagación', descripcion: 'Propone acciones para comprobar cómo crecen las plantas o interactúan los objetos.' },
        { id: 'ind_cap3', nombre: 'Genera y registra datos o información', descripcion: 'Dibuja o modela lo que observa en sus experimentos o visitas a la naturaleza.' },
        { id: 'ind_cap4', nombre: 'Analiza datos e información y comunica', descripcion: 'Expresa verbalmente sus descubrimientos sobre los animales, plantas y el agua.' }
      ],
      desempenosPorEdad: {
        '3': 'Explora con sus sentidos hojas, agua, tierra y semillas, manifestando curiosidad.',
        '4': 'Hace preguntas sobre por qué caen las hojas o flotan los objetos y dibuja lo que observó.',
        '5': 'Formula hipótesis sencillas (¿qué pasará si regamos la planta?), compara resultados y comunica sus conclusiones.'
      }
    },

    com_escribe: {
      id: 'com_escribe',
      numeroCneb: 9,
      areaId: 'comunicacion',
      nombre: 'Escribe diversos tipos de textos en su lengua materna',
      icono: '✏️',
      descripcion: 'Se aproxima a la escritura por propia iniciativa: grafismos, letras y textos dictados o escritos según sus hipótesis de escritura.',
      capacidades: [
        { id: 'esc_cap1', nombre: 'Adecúa el texto a la situación comunicativa', descripcion: 'Decide a quién le escribe y para qué (una nota, una invitación, su nombre).' },
        { id: 'esc_cap2', nombre: 'Organiza y desarrolla las ideas de forma coherente y cohesionada', descripcion: 'Mantiene un tema al dictar o escribir y lo cuenta en orden.' },
        { id: 'esc_cap3', nombre: 'Utiliza convenciones del lenguaje escrito de forma pertinente', descripcion: 'Explora la linealidad, direccionalidad y las letras de su nombre.' },
        { id: 'esc_cap4', nombre: 'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito', descripcion: 'Revisa lo que escribió con ayuda y dice qué quiso comunicar.' }
      ],
      desempenosPorEdad: {
        '3': 'Realiza trazos y garabatos por propia iniciativa para comunicar un mensaje y dice lo que "escribió".',
        '4': 'Escribe de manera no convencional (grafismos, letras sueltas) y dicta a la docente textos cortos con un propósito.',
        '5': 'Escribe su nombre y textos cortos según sus hipótesis de escritura, siguiendo la linealidad, y revisa lo escrito con apoyo.'
      }
    },

    // === ÁREA PERSONAL SOCIAL (EDUCACIÓN RELIGIOSA, EXONERABLE SEGÚN LEY 29635) ===
    pers_religiosa: {
      id: 'pers_religiosa',
      numeroCneb: 30,
      areaId: 'personal_social',
      nombre: 'Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente',
      icono: '🕊️',
      descripcion: 'Comprende que es una persona amada por Dios y expresa gratitud, respeto y cuidado por los demás y la creación. Las familias de otra confesión pueden solicitar exoneración.',
      opcional: 'Educación religiosa: exonerable a pedido de la familia (Ley 29635).',
      capacidades: [
        { id: 'rel_cap1', nombre: 'Conoce a Dios y asume su identidad religiosa como persona digna, libre y trascendente', descripcion: 'Reconoce que es amado por Dios y por su familia.' },
        { id: 'rel_cap2', nombre: 'Cultiva y valora las manifestaciones religiosas de su entorno', descripcion: 'Participa con respeto de celebraciones y expresa gratitud con gestos y palabras.' }
      ],
      desempenosPorEdad: {
        '3': 'Reconoce de manera espontánea que es amado por su familia y expresa alegría al participar de celebraciones.',
        '4': 'Expresa gratitud por la vida, la naturaleza y su familia y participa de actividades religiosas con respeto.',
        '5': 'Reconoce a Dios como creador y expresa cuidado por las personas y la naturaleza en acciones concretas.'
      }
    },

    // === COMPETENCIAS TRANSVERSALES ===
    trans_autonomo: {
      id: 'trans_autonomo',
      numeroCneb: 29,
      areaId: 'transversal',
      nombre: 'Gestiona su aprendizaje de manera autónoma',
      icono: '🧠',
      descripcion: 'Toma conciencia de lo que debe aprender, sigue una estrategia modelada y revisa con ayuda lo que logró en una tarea.',
      capacidades: [
        { id: 'aut_cap1', nombre: 'Define metas de aprendizaje', descripcion: 'Nombra qué puede lograr en una tarea con la facilitación del adulto.' },
        { id: 'aut_cap2', nombre: 'Organiza acciones estratégicas para alcanzar sus metas', descripcion: 'Sigue una estrategia que le es modelada o facilitada.' },
        { id: 'aut_cap3', nombre: 'Monitorea y ajusta su desempeño durante el proceso de aprendizaje', descripcion: 'Revisa con ayuda externa los resultados y se dispone al cambio.' }
      ],
      desempenosPorEdad: {
        '3': 'Expresa qué quiere hacer en el juego o la actividad y pide ayuda cuando no logra realizarla.',
        '4': 'Dice qué va a hacer para resolver una tarea sencilla y sigue los pasos que la docente le modela.',
        '5': 'Nombra lo que puede lograr en una tarea, sigue una estrategia facilitada y revisa con ayuda cómo le fue.'
      }
    },
    trans_tic: {
      id: 'trans_tic',
      numeroCneb: 28,
      areaId: 'transversal',
      nombre: 'Se desenvuelve en entornos virtuales generados por las TIC',
      icono: '💻',
      descripcion: 'Interactúa con tablets, computadoras y aplicaciones educativas con fines de aprendizaje lúdico y ético.',
      capacidades: [
        { id: 'tic_cap1', nombre: 'Personaliza entornos virtuales', descripcion: 'Selecciona su avatar, reconoce su usuario y navega por la interfaz con facilidad.' },
        { id: 'tic_cap2', nombre: 'Interactúa en entornos virtuales', descripcion: 'Arrastra, toca y resuelve retos interactivos respetando tiempos y normas de uso.' }
      ],
      desempenosPorEdad: {
        '3': 'Toca la pantalla táctil con intencionalidad para activar sonidos y elementos visuales interactivos.',
        '4': 'Arrastra y suelta elementos en la pantalla reconociendo su perfil y escuchando las instrucciones de voz de Kusi.',
        '5': 'Navega autónomamente entre retos digitales, completa secuencias y cuida los dispositivos tecnológicos del aula.'
      }
    }
  },

  // Competencias que el CNEB (Cuadro N.° 1) también desarrolla en el CICLO I (0 a 2 años),
  // con el nombre que reciben en cuna y su desempeño de referencia.
  cicloI: {
    pers_identidad: { nombre: 'Construye su identidad', desempeno: 'Se identifica con su nombre y los miembros de su familia; participa en sus cuidados y busca consuelo en su adulto significativo.' },
    pers_convive: { nombre: 'Se relaciona con las personas', desempeno: 'Se relaciona con niños y adultos de su espacio cotidiano y manifiesta lo que le agrada o incomoda con gestos y palabras.' },
    psic_motriz: { nombre: 'Se desarrolla motrizmente', desempeno: 'Explora las partes de su cuerpo y realiza acciones motrices básicas para desplazarse y manipular objetos.' },
    com_oral: { nombre: 'Se comunica oralmente en lengua materna', desempeno: 'Escucha, pregunta y responde apoyándose en gestos y lenguaje corporal al interactuar con otros.' },
    cantidad: { nombre: 'Construye la noción de cantidad', desempeno: 'Explora objetos con sus sentidos, establece agrupaciones y comprende expresiones sencillas de cantidad y tiempo.' },
    espacio: { nombre: 'Establece relaciones espaciales', desempeno: 'Se desplaza, reconoce su posición o la de los objetos y comprende expresiones sencillas de ubicación.' },
    cien_indaga: { nombre: 'Explora su entorno para conocerlo', desempeno: 'Observa y manipula objetos con todos sus sentidos y experimenta los efectos de sus acciones sobre ellos.' }
  },

  // Completa metadatos: ciclos en los que aplica cada competencia y desempeño de Ciclo I
  _init() {
    Object.values(this.competencias).forEach(c => {
      const c1 = this.cicloI[c.id];
      c.ciclos = c1 ? ['Ciclo I', 'Ciclo II'] : ['Ciclo II'];
      if (c1) {
        c.nombreCicloI = c1.nombre;
        c.desempenosPorEdad['0-2'] = c1.desempeno;
      }
    });
    return this;
  },

  appliesToCycle(comp, cycle) {
    return (comp.ciclos || ['Ciclo II']).includes(cycle);
  },

  // Desempeño adecuado a una edad (0-2 → Ciclo I; 3, 4, 5 → Ciclo II)
  getDesempeno(compId, age) {
    const c = this.getCompetencia(compId);
    if (!c) return '';
    const a = parseInt(age, 10);
    const key = a <= 2 ? '0-2' : String(a);
    return c.desempenosPorEdad[key] || c.desempenosPorEdad['5'] || '';
  },

  // Nombre de la competencia según el ciclo del aula
  getNombre(compId, cycle = 'Ciclo II') {
    const c = this.getCompetencia(compId);
    if (!c) return '';
    return cycle === 'Ciclo I' && c.nombreCicloI ? c.nombreCicloI : c.nombre;
  },

  getCompetenciasForCycle(cycle) {
    return Object.values(this.competencias).filter(c => this.appliesToCycle(c, cycle));
  },

  getAllCompetencias() {
    return Object.values(this.competencias);
  },

  // Obtener competencias de un área específica
  getCompetenciasByArea(areaId) {
    return Object.values(this.competencias).filter(c => c.areaId === areaId);
  },

  // Obtener competencia por ID
  getCompetencia(compId) {
    return this.competencias[compId] || null;
  },

  // Obtener todas las áreas
  getAreasList() {
    return Object.values(this.areas);
  },

  // Obtener lista de edades
  getEdadesList() {
    return Object.values(this.edades);
  }
};

// =========================================================================
// MUNDOS VIVENCIALES: actividades de aula sugeridas para las competencias sin retos digitales.
// Cada competencia tiene 3 "sesiones vivenciales"; el desempeño por edad indica cómo graduarlas.
// =========================================================================
window.CNEB_CURRICULUM.actividades = {
  com_oral: [
    { icono: '🎤', titulo: 'La noticia del día', material: 'Micrófono de juguete, alfombra de asamblea', pasos: 'En asamblea cada niño cuenta algo que le pasó. La docente pregunta "¿y luego?", "¿por qué?" para ampliar el relato y cuida los turnos de habla.' },
    { icono: '📖', titulo: 'Cuento con preguntas', material: 'Cuento ilustrado grande', pasos: 'Se lee el cuento mostrando las láminas. Se hacen preguntas literales (¿quién?, ¿dónde?) e inferenciales (¿qué pasará?, ¿cómo se siente?).' },
    { icono: '🎭', titulo: 'Adivina quién soy', material: 'Tarjetas de animales', pasos: 'Un niño describe un animal sin decir su nombre (cómo es, qué come, qué sonido hace) y el grupo adivina. Se intercambian roles.' }
  ],
  com_lee: [
    { icono: '📚', titulo: 'Biblioteca del aula', material: 'Libros y cuentos variados', pasos: 'Exploración libre de libros. Cada niño elige uno, señala personajes y cuenta a un compañero de qué cree que trata.' },
    { icono: '🔎', titulo: '¿De qué tratará?', material: 'Un cuento nuevo tapado', pasos: 'Se muestra solo la carátula y se anticipa el contenido. Luego se lee y se compara con lo que imaginaron.' },
    { icono: '🏷️', titulo: 'Leemos el aula', material: 'Carteles, etiquetas de sectores, nombres', pasos: 'Recorrido por el aula "leyendo" carteles y etiquetas; buscan su nombre y palabras conocidas en los portadores de texto.' }
  ],
  com_escribe: [
    { icono: '✏️', titulo: 'Escribo mi nombre', material: 'Tarjeta con su nombre, hojas, crayolas', pasos: 'Cada niño observa su tarjeta y escribe su nombre a su manera (trazos, letras). Luego firma sus trabajos del día.' },
    { icono: '💌', titulo: 'Carta a mi familia', material: 'Hojas, sobres, colores', pasos: 'Los niños dictan a la docente un mensaje para su familia y lo "escriben" con dibujos y grafismos. Se lo llevan a casa.' },
    { icono: '📋', titulo: 'Lista para la bodeguita', material: 'Papel, plumones, productos de juguete', pasos: 'Para jugar a la bodeguita elaboran la lista de lo que comprarán con dibujos y letras, y la leen al "vendedor".' }
  ],
  com_arte: [
    { icono: '🎨', titulo: 'Dactilopintura libre', material: 'Témperas, papelógrafos, mandiles', pasos: 'Exploran colores y texturas con las manos. Al final cada uno cuenta qué pintó y cómo lo hizo.' },
    { icono: '🧱', titulo: 'Modelamos con masa', material: 'Masa casera o plastilina', pasos: 'Crean figuras libres o un personaje del cuento leído. Exponen sus creaciones en una "galería" del aula.' },
    { icono: '🎶', titulo: 'Banda musical reciclada', material: 'Latas, botellas con semillas, cajas', pasos: 'Construyen instrumentos, exploran sonidos y acompañan una canción siguiendo el ritmo.' }
  ],
  pers_identidad: [
    { icono: '🪞', titulo: 'Yo soy así', material: 'Espejo grande, hojas', pasos: 'Frente al espejo cada niño describe sus características físicas, lo que le gusta y luego se dibuja.' },
    { icono: '😊', titulo: 'Las caritas de las emociones', material: 'Tarjetas de emociones', pasos: 'Identifican alegría, tristeza, enojo y miedo en tarjetas, cuentan cuándo las sintieron y qué pueden hacer para calmarse.' },
    { icono: '👨‍👩‍👧', titulo: 'Mi familia', material: 'Fotos familiares, hojas', pasos: 'Presentan a su familia con una foto o dibujo y comparten una costumbre familiar que les gusta.' }
  ],
  pers_convive: [
    { icono: '📜', titulo: 'Nuestros acuerdos', material: 'Papelógrafo, dibujos', pasos: 'En asamblea proponen acuerdos para convivir en el aula, los dibujan y los firman con su nombre.' },
    { icono: '🤝', titulo: 'Juego de turnos', material: 'Juego de mesa sencillo o ronda', pasos: 'Juegan respetando turnos y reglas sencillas; la docente media cuando surge un desacuerdo preguntando cómo resolverlo.' },
    { icono: '🧹', titulo: 'Cuidamos nuestro aula', material: 'Cartel de responsabilidades', pasos: 'Se asignan responsabilidades rotativas (regar plantas, ordenar sectores) y se reconoce el aporte de cada uno.' }
  ],
  pers_religiosa: [
    { icono: '🙏', titulo: 'Gracias por…', material: 'Alfombra de asamblea', pasos: 'Ronda en la que cada niño agradece por algo de su día: su familia, sus amigos, la naturaleza.' },
    { icono: '🌱', titulo: 'Cuidamos la creación', material: 'Plantas del aula, regaderas', pasos: 'Cuidan las plantas o una mascota del aula y conversan sobre por qué es importante cuidar lo que nos rodea.' },
    { icono: '🕊️', titulo: 'Celebraciones de mi comunidad', material: 'Imágenes de fiestas locales', pasos: 'Comparten cómo celebra su familia y participan con respeto de las celebraciones de la comunidad educativa.' }
  ],
  psic_motriz: [
    { icono: '🏃', titulo: 'Circuito motor', material: 'Colchonetas, aros, túnel, conos', pasos: 'Recorren un circuito saltando, trepando y reptando. Se gradúa la dificultad según la edad (altura, equilibrio).' },
    { icono: '🎯', titulo: 'Lanzar y atrapar', material: 'Pelotas de distintos tamaños, cajas', pasos: 'Lanzan a una caja o a un compañero, primero con pelotas grandes y luego pequeñas, variando la distancia.' },
    { icono: '💃', titulo: 'Bailamos con el cuerpo', material: 'Música variada, pañuelos', pasos: 'Expresan con el cuerpo lo que les transmite la música (rápido, lento, alegre, triste) y crean movimientos propios.' }
  ],
  cien_indaga: [
    { icono: '🌱', titulo: 'Sembramos frijoles', material: 'Vasos, algodón, frijoles, agua', pasos: 'Siembran, formulan hipótesis (¿qué pasará?), observan durante días y registran con dibujos los cambios.' },
    { icono: '💧', titulo: '¿Flota o se hunde?', material: 'Tina con agua, objetos variados', pasos: 'Antes de probar, predicen si cada objeto flotará; luego comprueban y conversan sobre por qué pasó.' },
    { icono: '🔍', titulo: 'Exploradores del patio', material: 'Lupas, frascos, hojas de registro', pasos: 'Exploran el patio con lupas buscando hojas, insectos y piedras; describen lo que observan y lo dibujan.' }
  ],
  trans_tic: [
    { icono: '📱', titulo: 'Mi perfil en la app', material: 'Tablet o computadora con Matemática Kusi', pasos: 'Cada niño ingresa eligiendo su aula y su avatar, reconoce su nombre y navega por los mundos con ayuda.' },
    { icono: '🎮', titulo: 'Reto guiado', material: 'Tablet con la app', pasos: 'Resuelven un reto de Matemática escuchando las instrucciones de la mascota y respetando el turno en el dispositivo.' },
    { icono: '📸', titulo: 'Registramos con fotos', material: 'Tablet o celular del aula', pasos: 'Toman una foto de su trabajo (construcción, dibujo) y comentan lo que hicieron. Se conversa sobre el cuidado del dispositivo.' }
  ],
  trans_autonomo: [
    { icono: '🗓️', titulo: '¿Qué haré hoy?', material: 'Cartel de sectores de juego', pasos: 'Antes del juego libre cada niño elige el sector y dice qué quiere hacer; al terminar cuenta si lo logró.' },
    { icono: '✅', titulo: 'Mi lista de pasos', material: 'Pictogramas de una actividad', pasos: 'Siguen los pasos de una actividad (lavarse las manos, preparar una ensalada) usando pictogramas y marcan lo cumplido.' },
    { icono: '🔄', titulo: '¿Cómo me fue?', material: 'Caritas de autoevaluación', pasos: 'En la asamblea de cierre cada niño señala qué logró, qué le costó y qué hará distinto mañana.' }
  ]
};

window.CNEB_CURRICULUM.getActividades = function (compId) {
  return this.actividades[compId] || [];
};

window.CNEB_CURRICULUM._init();
