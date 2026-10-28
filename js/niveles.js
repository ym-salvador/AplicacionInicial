/**
 * NIVELES DE DIFICULTAD POR EDAD (3, 4 Y 5 AÑOS) PARA LOS 23 RETOS
 * Según el CNEB la competencia es la misma en todo el Ciclo II; lo que cambia es el
 * DESEMPEÑO esperado. Cada reto consulta aquí sus parámetros (cantidad de objetos,
 * criterios, rango numérico, opciones y consigna) según la edad del niño que juega.
 *
 * La edad la decide App.getPlayingAge(): la del aula del estudiante o, en Modo
 * Comprobación, la elegida por la Directora / Docente (botones 3 / 4 / 5 años).
 * Los niños de Ciclo I (0 a 2 años) usan el nivel de 3 años.
 */

window.CNEB_NIVELES = {
  config: {
    // ===== MUNDO 1: CANTIDAD =====
    j1_1_color: {
      3: { colores: ['red', 'yellow'], porColor: 2, voz: 'Mira las frutas. Lleva cada fruta a la canasta de su color: roja o amarilla.' },
      4: { colores: ['red', 'yellow', 'green'], porColor: 2, voz: '¡Bienvenido a la Bodeguita! Arrastra cada fruta a la canasta de su mismo color: roja, amarilla o verde.' },
      5: { colores: ['red', 'yellow', 'green'], porColor: 3, voz: '¡Bienvenido a la Bodeguita! Hay muchas frutas mezcladas. Arrastra cada una a la canasta de su mismo color: roja, amarilla o verde.' }
    },
    j1_2_tamano: {
      3: { pares: 2, voz: 'Hay frutas grandes y frutas pequeñitas. Las grandes van a la caja grande y las pequeñitas a la caja pequeña.' },
      4: { pares: 3, voz: '¡Mira los tamaños! Arrastra las frutas grandes a la caja grande y las pequeñitas a la caja pequeña.' },
      5: { pares: 4, voz: '¡Mira bien los tamaños! Arrastra cada fruta grande a la caja grande y cada fruta pequeña a la caja pequeña.' }
    },
    j1_3_cuantificadores: {
      3: { opciones: ['muchas', 'pocas'], preguntas: ['muchas'], muchas: 6, pocas: 2 },
      4: { opciones: ['muchas', 'pocas', 'ninguna'], preguntas: ['ninguna', 'muchas'], muchas: 6, pocas: 1 },
      5: { opciones: ['muchas', 'pocas', 'ninguna'], preguntas: ['muchas', 'pocas', 'ninguna'], muchas: 7, pocas: 2 }
    },
    j1_4_mas_menos: {
      4: { mas: 5, menos: 2, preguntas: ['mas'] },
      5: { mas: 6, menos: 4, preguntas: ['mas', 'menos'] }
    },
    j2_1_plantas: {
      3: { cantidad: 3 }, 4: { cantidad: 4 }, 5: { cantidad: 5 }
    },
    j2_2_zanahorias: {
      3: { cantidad: 3, voz: 'El conejito quiere sus zanahorias. Pon primero la más cortita, luego la mediana y al final la más larga.' },
      4: { cantidad: 4, voz: '¡El conejito quiere sus zanahorias! Arrastra desde la zanahoria más cortita hasta la más larga.' },
      5: { cantidad: 5, voz: '¡El conejito quiere sus zanahorias! Arrastra con tu dedito desde la zanahoria más cortita hasta la más larga.' }
    },
    j2_3_trencito: {
      4: { ordinales: [1, 2, 3] },
      5: { ordinales: [2, 3, 4, 5] }
    },
    j2_4_primero_ultimo: {
      3: { fila: 3, preguntas: ['primero'] },
      4: { fila: 4, preguntas: ['primero', 'ultimo'] },
      5: { fila: 5, preguntas: ['primero', 'ultimo'] }
    },
    j3_1_conteo10: {
      3: { hasta: 3, voz: 'Toca cada naranja para guardarla en la canasta. Contemos: uno, dos, tres.' },
      4: { hasta: 5, voz: '¡Vamos al mercado! Toca cada naranja una por una para guardarla en la canasta hasta llegar a cinco.' },
      5: { hasta: 10, voz: '¡Vamos al mercado! Toca cada naranja una por una para guardarla en la canasta hasta llegar a diez.' }
    },
    j3_2_agregar: {
      4: { max: 3 }, 5: { max: 5 }
    },
    j3_3_quitar: {
      4: { max: 3 }, 5: { max: 5 }
    },
    j3_4_balanza: {
      3: { preguntas: ['mas'], pares: [0] },
      4: { preguntas: ['mas', 'menos'], pares: [0, 1] },
      5: { preguntas: ['mas', 'menos'], pares: [0, 1, 2, 3] }
    },
    j3_5_tiempo: {
      3: { escenarios: [0], preguntas: ['despues'] },
      4: { escenarios: [0, 1], preguntas: ['despues'] },
      5: { escenarios: [0, 1, 2], preguntas: ['despues', 'antes'] }
    },

    // ===== MUNDO 2: FORMA, MOVIMIENTO Y LOCALIZACIÓN =====
    esp_j1_formas2d: {
      3: { formas: ['circulo', 'cuadrado'] },
      4: { formas: ['circulo', 'cuadrado', 'triangulo'] },
      5: { formas: ['circulo', 'cuadrado', 'triangulo', 'rectangulo'] }
    },
    esp_j1_cuerpos3d: {
      4: { cuerpos: ['esfera', 'cubo'] },
      5: { cuerpos: ['esfera', 'cubo', 'cilindro'] }
    },
    esp_j1_clasificacion: {
      3: { opciones: 2, preguntas: ['rueda'] },
      4: { opciones: 3, preguntas: ['rueda'] },
      5: { opciones: 4, preguntas: ['rueda', 'no_rueda'] }
    },
    esp_j2_cerca_lejos: {
      3: { preguntas: ['cerca'] },
      4: { preguntas: ['cerca', 'lejos'] },
      5: { preguntas: ['cerca', 'lejos'] }
    },
    esp_j2_al_lado: {
      4: { zonas: 2 }, 5: { zonas: 3 }
    },
    esp_j2_posiciones: {
      4: { preguntas: ['agua'] }, 5: { preguntas: ['agua', 'montana'] }
    },
    esp_j3_desplazamiento: {
      3: { grid: 2 }, 4: { grid: 3 }, 5: { grid: 4 }
    },
    esp_j3_mas_largo: {
      4: { caminos: 2 }, 5: { caminos: 3 }
    },
    esp_j3_mas_corto: {
      3: { cintas: 2, contraste: 'alto' },
      4: { cintas: 2, contraste: 'medio' },
      5: { cintas: 3, contraste: 'bajo' }
    },
    esp_j3_puente: {
      4: { tablas: 2 }, 5: { tablas: 3 }
    }
  },

  // Edad efectiva para los niveles (3, 4 o 5). Ciclo I usa el nivel de 3 años.
  getAge() {
    const raw = (window.App && typeof window.App.getPlayingAge === 'function') ? window.App.getPlayingAge() : 5;
    const a = parseInt(raw, 10) || 5;
    if (a <= 3) return 3;
    if (a >= 5) return 5;
    return 4;
  },

  // Parámetros de un reto para la edad activa (si la edad no tiene nivel propio, usa el más cercano)
  get(gameId) {
    const c = this.config[gameId];
    if (!c) return {};
    const age = this.getAge();
    return c[age] || c[age + 1] || c[age - 1] || c[5] || c[4] || c[3] || {};
  },

  label() {
    return `${this.getAge()} años`;
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Insignia pequeña para mostrar la edad del nivel en la cabecera del reto
  badge() {
    const age = this.getAge();
    const theme = window.SchoolManagement ? window.SchoolManagement.ageTheme(age) : { icon: '⭐', badge: 'bg-slate-100 text-slate-700' };
    return `<span class="text-[10px] font-black px-2 py-0.5 rounded-full ${theme.badge}" title="Nivel de dificultad según la edad">${theme.icon} Nivel ${age} años</span>`;
  }
};
