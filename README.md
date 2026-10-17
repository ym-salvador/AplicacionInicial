# 🌟 Aplicación Matemática Inicial (5 Años) - CNEB Ciclo II

> **Software Educativo Interactivo y Gamificado de Matemática para Educación Inicial**  
> Basado estrictamente en el **Currículo Nacional de la Educación Básica (CNEB)** del Ministerio de Educación del Perú (Ciclo II - Nivel 2).

---

## 🎯 Enfoque Pedagógico y UX Infantil

- **Público Objetivo:** Niños de 5 años (etapa prelectora).
- **Cero Dependencia de Lectura:** Instrucciones y retroalimentaciones guiadas por voz (Web Speech API en español), íconos de alta legibilidad y la compañía de **Kusi**, la alpaca andina guía.
- **Interacciones Táctiles y Físicas:**
  - **Arrastre y Soltado Real (*Physics Drag & Drop*):** En juegos de clasificación, seriación y ubicación espacial, los niños deben arrastrar físicamente cada objeto con su dedito hacia la canasta, caja o ranura correspondiente. No se auto-coloca al hacer clic.
  - **Botones y Elementos Gigantes (Touch Targets > 64px):** Diseñados ergonómicamente para pantallas táctiles y tablets.
- **Enfoque de Resolución de Problemas y Material Concreto:** Transición pedagógica de material concreto vivencial a representaciones gráficas interactivas.

---

## 🗺️ Estructura de Mundos y Sesiones

### 🍎 Mundo 1: Resuelve Problemas de Cantidad
1. **Sesión 1: "Agrupamos y Comparamos en la Bodeguita de Don Lucho"**
   - *Juego 1.1:* Agrupación por color (arrastre a canastas roja, amarilla y verde).
   - *Juego 1.2:* Agrupación por tamaño (arrastre a caja grande y caja pequeña).
   - *Juego 1.3:* Nociones espaciales y cuantificadores ("muchos", "pocos", "ninguno").
   - *Juego 1.4:* Expresión de peso ("pesa más", "pesa menos").
2. **Sesión 2: "Ordenamos y Contamos los Tesoros del Huerto"**
   - *Juego 2.1:* Seriación por tamaño de hasta 5 elementos (plantitas del huerto).
   - *Juego 2.2:* Seriación inversa (zanahorias de mayor a menor).
   - *Juego 2.3:* Correspondencia uno a uno (regaderas y macetas).
   - *Juego 2.4:* Números ordinales ("primero", "segundo", "tercero").
3. **Sesión 3: "Jugamos al Mercado con Don Lucho"**
   - *Juego 3.1:* Conteo hasta 10 con Marco de Diez y correspondencia término a término.
   - *Juego 3.2:* Situaciones de agregar hasta 5 patitos en la laguna.
   - *Juego 3.3:* Situaciones de quitar hasta 5 manzanas del árbol.
   - *Juego 3.4:* Balanza mágica comparativa de pesos.
   - *Juego 3.5:* Nociones temporales cotidianas ("antes", "después").

### 📐 Mundo 2: Resuelve Problemas de Forma, Movimiento y Localización
1. **Sesión 1: "Formas 2D y Cuerpos 3D en el Entorno"**
   - *Juego 1.1:* El Museo de las Formas 2D (círculo, cuadrado, triángulo, rectángulo).
   - *Juego 1.2:* Cuerpos geométricos 3D cotidianos (esfera, cubo, cilindro).
   - *Juego 1.3:* Clasificación dinámica: ¿Rueda o no rueda?
2. **Sesión 2: "Ubicación Espacial en el Parque"**
   - *Juego 2.1:* Cerca y lejos del árbol (arrastre físico de la pelota ⚽).
   - *Juego 2.2:* Al lado del tobogán (arrastre físico del osito 🧸).
   - *Juego 2.3:* Cerca del agua en la laguna (arrastre físico del barquito ⛵).
3. **Sesión 3: "Rutas y Medidas en el Jardín"**
   - *Juego 3.1:* Desplazamientos en cuadrícula con flechas direccionales táctiles gigantes.
   - *Juego 3.2:* Comparación de longitud: El camino más largo.
   - *Juego 3.3:* Comparación de longitud: Cintas de fiesta más cortas.
   - *Juego 3.4:* El puente de madera para cruzar el río (selección de tabla más larga).

---

## 👩‍🏫 Panel de Gestión Docente y Monitoreo del Aula

- **Sábana de Monitoreo Grupal:** Visualización en tiempo real de todos los estudiantes registrados, indicando quiénes ya resolvieron, quiénes están en proceso y quiénes están pendientes (sin actividad).
- **Escala Oficial CNEB Ciclo II:** Evaluación cualitativa automática (`AD`: Logro Destacado, `A`: Logro Esperado, `B`: En Proceso, `C`: En Inicio).
- **Exportación a Excel (CSV):** Descarga en un clic de la sábana de notas de todo el salón para la carpeta pedagógica.
- **Reporte Pedagógico Imprimible y Exportable a PDF:** Formato oficial con membrete MINEDU y conclusiones descriptivas oficiales para el SIAGIE.

---

## 👨‍👩‍👧 Portal para Familias

- **Privacidad Total:** Cada familia consulta únicamente el progreso de su propio hijo/a.
- **Medallero Infantil:** Logros gamificados para incentivar la motivación.
- **Pautas para Casa:** 3 ideas sencillas y cotidianas para estimular el pensamiento matemático en el hogar.
- **Diploma de Honor:** Diploma personalizado imprimible para reconocer el esfuerzo del niño/a.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalaciones complejas ni servidores de backend. Está construida con tecnologías web estándar:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ym-salvador/AplicacionInicial.git
   ```
2. Abre el archivo `index.html` en cualquier navegador moderno (Google Chrome, Microsoft Edge, Safari o Firefox).
3. ¡Listo para jugar y aprender!

---

## 🛠️ Tecnologías Empleadas

- **HTML5 Semántico y Accesible.**
- **Vanilla JavaScript (ES6+):** Arquitectura modular, sin dependencias pesadas.
- **Motor Touch & Drag Engine:** Basado en la Pointer Events API con soporte simultáneo para pantallas táctiles y ratón.
- **Web Speech API:** Síntesis de voz en español natural con entonación empática infantil.
- **Web Audio API:** Síntesis de efectos sonoros procedurales para retroalimentación inmediata.
- **TailwindCSS CDN:** Estilos responsivos, modernos y paletas de color armoniosas adaptadas a la primera infancia.

---

*Desarrollado con enfoque pedagógico inclusivo para la Educación Inicial del Perú.* 🇵🇪
