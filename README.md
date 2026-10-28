# 🌟 Plataforma de Gestión Curricular y Aprendizaje Inicial (3, 4 y 5 Años) - CNEB Ciclo II
### *Aventuras Matemáticas con Kusi* | Software Educativo Gamificado, Gestión Institucional, Evaluación Formativa CNEB y Sincronización en la Nube

> **Basado estrictamente en el Currículo Nacional de la Educación Básica (CNEB)** del Ministerio de Educación del Perú (**RVM N° 094-2020-MINEDU** - Ciclo II: 3, 4 y 5 Años).  
> Diseñado para equipos directivos, docentes de aula, estudiantes en etapa prelectora y familias.

[![CNEB Ciclo II](https://img.shields.io/badge/CNEB-Ciclo%20II%20(3,%204,%205%20A%C3%B1os)-blue.svg)](https://www.gob.pe/minedu)
[![RVM 094-2020-MINEDU](https://img.shields.io/badge/MINEDU-RVM%20094--2020-emerald.svg)](https://www.gob.pe/minedu)
[![Gestión Institucional](https://img.shields.io/badge/Gesti%C3%B3n-Directora%20%7C%20Docentes%20%7C%20Aulas-orange.svg)](#)
[![Supabase](https://img.shields.io/badge/Cloud-Supabase%20PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com)
[![Offline First](https://img.shields.io/badge/Storage-Offline%20First%20(LocalStorage)-amber.svg)](#)
[![Web Speech API](https://img.shields.io/badge/Speech-Web%20Speech%20API-purple.svg)](#)

---

## 📋 Tabla de Contenidos

1. [Visión General y Enfoque Pedagógico CNEB](#-visión-general-y-enfoque-pedagógico-cneb)
2. [Nuevo Sidebar Institucional y Navegación Dinámica](#-nuevo-sidebar-institucional-y-navegación-dinámica)
3. [Estructura por Edades y Ciclos (3, 4 y 5 Años con Código de Color)](#-estructura-por-edades-y-ciclos-3-4-y-5-años-con-código-de-color)
4. [Malla Curricular CNEB: Áreas, Competencias y Capacidades](#-malla-curricular-cneb-áreas-competencias-y-capacidades)
5. [Planificador Granular de Competencias por Capacidades](#-planificador-granular-de-competencias-por-capacidades)
6. [Perfiles de Usuario: Administrador (Directora), Docentes y Estudiantes](#-perfiles-de-usuario-administrador-directora-docentes-y-estudiantes)
7. [Gestión Escolar: Años Lectivos, Aulas y Matrícula Anual](#-gestión-escolar-años-lectivos-aulas-y-matrícula-anual)
8. [Zona de Retos: 2 Mundos, 6 Sesiones, 23 Juegos y Modo Comprobación](#-zona-de-retos-2-mundos-6-sesiones-23-juegos-y-modo-comprobación)
9. [Evaluación Formativa Oficial CNEB (AD, A, B, C) y SIAGIE](#-evaluación-formativa-oficial-cneb-ad-a-b-c-y-siagie)
10. [Portal para Familias y Acompañamiento en Casa](#-portal-para-familias-y-acompañamiento-en-casa)
11. [Personalización Institucional y Diplomas de Honor](#-personalización-institucional-y-diplomas-de-honor)
12. [Arquitectura Técnica y Estructura de Archivos](#-arquitectura-técnica-y-estructura-de-archivos)
13. [Guía de Instalación y Despliegue](#-guía-de-instalación-y-despliegue)

---

## 🎯 Visión General y Enfoque Pedagógico CNEB

La aplicación es un entorno interactivo de aprendizaje matemático desarrollado específicamente para niños y niñas de **5 años**. Responde a los estándares de aprendizaje del **Nivel 2** del CNEB, abordando integralmente las dos competencias curriculares del área de Matemática:

1. **Competencia 1: Resuelve problemas de cantidad.**
2. **Competencia 2: Resuelve problemas de forma, movimiento y localización.**

### Pilares Pedagógicos:
* **Pedagogía del Error Constructivo ("Aprender del Error"):** En estricto cumplimiento normativo, la aplicación elimina los sonidos agresivos de error, pantallas de *"Perdiste"* y cruces rojas. Cuando el niño requiere apoyo, la mascota guía ofrece pistas auditivas y visuales reflexivas (*scaffolding*).
* **Transición Concreto-Gráfico-Simbólico:** Respeta el proceso evolutivo infantil mediante representaciones vivenciales y materiales manipulativos digitales.
* **Evaluación Formativa Oficial:** Clasificación cualitativa automática bajo la escala oficial de calificación del Ciclo II: **AD** (*Logro Destacado*), **A** (*Logro Esperado*), **B** (*En Proceso*) y **C** (*En Inicio*).
* **Generación de Conclusiones Descriptivas para SIAGIE:** Redacción técnica automática lista para transferir a las libretas de notas y al sistema oficial del MINEDU.

---

## 🧭 Nuevo Sidebar Institucional y Navegación Dinámica

La aplicación incorpora una barra lateral interactiva (**Sidebar / Sliderbar**) desplegable y colapsable ([`js/sidebar.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/sidebar.js)), diseñada para ofrecer una experiencia ergonómica tanto en computadoras de escritorio como en tablets y dispositivos móviles:

* **Colapso Inteligente:** Permite expandir o contraer el menú lateral (`300px` expandido ➔ `82px` contraído) para maximizar el área de trabajo en pantallas táctiles.
* **Drawer Móvil Táctil:** En teléfonos celulares y tablets se convierte en un menú flotante con telón de fondo semitransparente (*backdrop blur*).
* **Tarjeta de Perfil Activo:** Identifica en todo momento el usuario y rol conectado:
  * 🏛️ **Administradora General (Directora):** Lic. María Elena Pérez.
  * 👩‍🏫 **Docente de Aula:** Con aula y sección asignadas.
  * 🎒 **Estudiante:** Con su avatar animal, aula y edad.
* **Acceso Rápido a Ciclos y Años:** Selector de año lectivo (`2024`, `2025`, `2026`, `2027`) y botón para cambiar de perfil con un solo toque.
* **Organización en Bloques Temáticos:**
  * **Gestión Institucional:** Dashboard, Aulas y Edades (3, 4, 5), Docentes y Aulas, Matrícula Anual.
  * **Pedagogía CNEB:** Malla Curricular CNEB, Planificar Capacidades, Evaluación Formativa & SIAGIE.
  * **Aventuras y Retos:** Mundos y Retos (acceso libre con *Modo Comprobación* para directores y docentes).
  * **Configuración:** Datos de la I.E., mascota, logos y firmas de diplomas.

---

## 🎨 Estructura por Edades y Ciclos (3, 4 y 5 Años con Código de Color)

En estricta concordancia con el **Currículo Nacional de la Educación Básica (CNEB - Ciclo II de Educación Inicial)**, la plataforma diferencia pedagógica y visualmente los tres grupos etarios:

| Edad | Ciclo CNEB | Color Distintivo | Hitos de Aprendizaje CNEB |
| :--- | :---: | :---: | :--- |
| **3 Años** | **Ciclo II** | 🟢 **Verde Esmeralda** (`#10b981`) | Agrupación libre por 1 criterio perceptual propio (color, forma o tamaño); nociones espaciales básicas con su propio cuerpo (*arriba/abajo*, *dentro/fuera*); conteo espontáneo hasta 3. |
| **4 Años** | **Ciclo II** | 🟡 **Ámbar Cálido** (`#f59e0b`) | Agrupación por 2 criterios combinados; seriación hasta 3 objetos; cuantificadores (*muchos*, *pocos*, *pesa más/menos*); conteo hasta 5; nociones espaciales relativas (*cerca/lejos*). |
| **5 Años** | **Ciclo II** | 🔵 **Azul Cielo** (`#0284c7`) | Agrupación por criterios complejos; seriaciones hasta 5 objetos; números ordinales (1.° al 5.°); conteo con correspondencia hasta 10 (Marco de Diez); resolución de problemas de agregar y quitar hasta 5; balanza; figuras 2D, cuerpos 3D y cuadrículas de desplazamiento. |

Cada aula creada en el sistema queda catalogada con su respectiva insignia de edad y color (`badge-age-3`, `badge-age-4`, `badge-age-5`), facilitando a la directora y maestras la supervisión inmediata.

---

## 📚 Malla Curricular CNEB: Áreas, Competencias y Capacidades

Implementado en [`js/cneb-curriculum.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/cneb-curriculum.js), el sistema integra las **6 áreas curriculares oficiales de Educación Inicial**:

1. **Matemática** (🎨 Ámbar):
   * *Competencia 23:* Resuelve problemas de cantidad.
     * Capacidades: Traduce cantidades a expresiones numéricas; Comunica su comprensión sobre los números y las operaciones; Usa estrategias y procedimientos de estimación y cálculo.
   * *Competencia 26:* Resuelve problemas de forma, movimiento y localización.
     * Capacidades: Modela objetos con formas geométricas y sus transformaciones; Comunica su comprensión sobre las formas y relaciones geométricas; Usa estrategias y procedimientos para orientarse en el espacio.
2. **Comunicación** (🎨 Azul):
   * *Competencia 7:* Se comunica oralmente en su lengua materna.
   * *Competencia 8:* Lee diversos tipos de textos en su lengua materna.
   * *Competencia 9:* Escribe diversos tipos de textos en su lengua materna.
   * *Competencia 6:* Crea proyectos desde los lenguajes artísticos.
3. **Personal Social** (🎨 Rosa):
   * *Competencia 1:* Construye su identidad.
   * *Competencia 16:* Convive y participa democráticamente en la búsqueda del bien común.
4. **Psicomotriz** (🎨 Verde Lima):
   * *Competencia 2:* Se desenvuelve de manera autónoma a través de su motricidad.
5. **Ciencia y Tecnología** (🎨 Turquesa):
   * *Competencia 20:* Indaga mediante métodos científicos para construir sus conocimientos.
6. **Competencias Transversales** (🎨 Púrpura):
   * *Competencia 28:* Se desenvuelve en entornos virtuales generados por las TIC.
   * *Competencia 29:* Gestiona su aprendizaje de manera autónoma.

Cada competencia incluye sus descripciones de estándares por ciclos y los desempeños esperados diferenciados por edad (3, 4 y 5 años).

---

## 🎯 Planificador Granular de Competencias por Capacidades

El módulo de planificación docente ([`js/school-management.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/school-management.js)) permite a las maestras y al equipo directivo habilitar o pausar **capacidades específicas por sesión de clase**:

* **Asignación Diferenciada:** En lugar de solo activar una competencia en bloque, la docente decide qué capacidad exacta se trabajará en la sesión del día (por ejemplo: activar solo *"Traduce cantidades"* para la Sesión 1 y pausar *"Usa estrategias de cálculo"*).
* **Control por Alumno o Masivo:** Se puede activar capacidades individualmente para un estudiante que requiere refuerzo o aplicarlo a toda el aula con un solo toque.
* **Retroalimentación en Tiempo Real:** El estudiante solo tiene acceso a los retos interactivos cuya capacidad ha sido autorizada por su maestra.

---

## 👤 Perfiles de Usuario: Administrador, Docentes y Estudiantes

La plataforma erradica definitivamente el ingreso forzado como estudiante. Cuenta con un sistema de triple rol en [`js/auth.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/auth.js):

### 1. 🏛️ Perfil Administrador (Directora del Plantel):
* **Panel de Control Integral:** Accede directamente al **Dashboard Directivo** con estadísticas del colegio, métricas de logro CNEB por aula y porcentaje institucional de avance.
* **Supervisión de Aulas y Docentes:** Crea años lectivos, crea aulas para 3, 4 y 5 años, contrata/registra docentes y les asigna su aula y sección.
* **Evaluación Directa y Monitoreo:** Puede calificar cualitativamente a cualquier estudiante del colegio en la matriz formativa oficial (AD, A, B, C) e imprimir su informe de progreso para el SIAGIE.
* **🎮 Modo Comprobación Pedagógica:**
  * Cuando la directora ingresa a la zona de minijuegos o retos, **no juega en nombre de ningún alumno**.
  * Todos los mundos, sesiones y retos están desbloqueados sin restricción para permitir la inspección técnica y didáctica.
  * Al completar un reto en Modo Comprobación, el sistema muestra una celebración institucional y **no altera las notas ni las estrellas de los estudiantes**.

### 2. 👩‍🏫 Perfil Docente de Aula:
* Accede con su usuario personal y PIN secreto.
* Administra exclusivamente a los estudiantes de su aula asignada por año lectivo.
* Realiza la matrícula anual de nuevos niños, planifica capacidades por sesión y genera conclusiones descriptivas oficiales.
* Cuenta también con el *Modo Comprobación Pedagógica* para probar los desafíos antes de presentarlos a sus niños.

### 3. 🎒 Perfil Estudiante y Familia:
* El niño ingresa seleccionando su aula y tocando su avatar animal, o mediante su enlace QR/WhatsApp.
* Entorno 100% lúdico, sin menús administrativos ni distracciones.
* Resuelve los retos asignados sesión por sesión, progresando de manera secuencial y acumulando estrellas en su medallero.

---

## 🏫 Gestión Escolar: Años Lectivos, Aulas y Matrícula Anual

* **Gestión Multianual:** Configuración y conmutación ágil de años lectivos (`2024`, `2025`, `2026`, `2027`).
* **Matrícula Anual y Traslados:** Registro de nuevos estudiantes asignándolos de inmediato al año y aula correspondiente (ej. *Aula Estrellitas - 5 Años*, *Aula Gotitas - 4 Años*).
* **Asignación Docente Anual:** Una docente puede estar a cargo de un aula en el año 2025 y de otra diferente en el año 2026 manteniendo su historial intacto.

---

## 🧸 Experiencia de Usuario Infantil (UX/UI Prelectora)

* **Cero Dependencia de Lectura:**
  * **Síntesis de Voz Asistida (Web Speech API):** Instrucciones orales moduladas con timbre infantil, afectivo y pausado en español neutro (`rate: 0.92`, `pitch: 1.18`).
  * **Botón Parlante Autónomo:** Permite al niño repetir la instrucción cuantas veces lo requiera pulsando el botón junto a la mascota.
* **Física Real de Arrastre y Soltado (*Physics Drag & Drop Engine*):**
  * Basado en la **Pointer Events API** nativa; funciona con pantallas táctiles, tablets, pizarras interactivas y mouse.
  * El niño debe sostener y arrastrar físicamente cada objeto hasta su contenedor (no se auto-coloca con un simple clic).
* **Diseño Ergonómico Chunky 3D:**
  * Objetos táctiles gigantes con áreas de toque superiores a **64x64px** (hasta 110px).
  * Botones con relieve tridimensional que proporcionan retroalimentación visual al ser presionados.
* **Sintetizador de Audio Procedural (Web Audio API):**
  * Efectos sonoros generados mediante osciladores senoidales matemáticos sin necesidad de descargar archivos de audio externos, garantizando funcionamiento 100% offline.
* **Motor de Confeti y Celebración:**
  * Animaciones de confeti físico y lluvia de estrellas en Canvas HTML5 nativo al culminar cada reto.

---

## 🗺️ Malla Curricular Integral: 2 Mundos, 6 Sesiones y 23 Retos

```
                          SISTEMA MATEMÁTICO CNEB (5 AÑOS)
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
 MUNDO 1: AVENTURAS DE CANTIDAD                          MUNDO 2: EXPLORADORES DEL ESPACIO
 (13 Retos Interactivos)                                 (10 Retos Interactivos)
        │                                                                 │
 ├── Sesión 1: Agrupamos y Comparamos                    ├── Sesión 1: Formas 2D y Cuerpos 3D
 │   (4 Retos: Color, Tamaño, Cuantificadores, Más/Menos) │   (3 Retos: Figuras 2D, Cuerpos 3D, ¿Rueda?)
 ├── Sesión 2: Seriación y Trencito                      ├── Sesión 2: Ubicación en el Parque
 │   (4 Retos: 5 Plantas, Zanahorias, Ordinales, Posición)│   (3 Retos: Cerca/Lejos, Al Lado, El Parque)
 └── Sesión 3: Conteo, Operaciones y Balanza             └── Sesión 3: Desplazamientos y Longitud
     (5 Retos: Conteo 10, Agregar, Quitar, Balanza, Rutina)   (4 Retos: Laberinto, Más Largo, Más Corto, Puente)
```

### 🧺 MUNDO 1: Resuelve Problemas de Cantidad (13 Retos)

#### Sesión 1: "Agrupamos y Comparamos en la Bodeguita de Don Lucho"
* **Reto 1.1: Agrupación por Color:** Arrastre táctil de frutas a canastas de colores rojo, amarillo y verde.
* **Reto 1.2: Agrupación por Tamaño:** Clasificación de frutas grandes en caja grande y pequeñas en caja pequeña.
* **Reto 1.3: Cuantificadores ("Muchos", "Pocos", "Ninguno"):** Discriminación de canastas según la cantidad de elementos.
* **Reto 1.4: Comparar Colecciones ("Más que" / "Menos que"):** Comparación de platos con frutillas para determinar dónde hay mayor o menor cantidad.

#### Sesión 2: "Seriación en el Huerto y el Trencito de los Ordinales"
* **Reto 2.1: Seriación por Tamaño de 5 Elementos:** Ordenar 5 plantitas desde la semilla germinada hasta el árbol frondoso (del 1.° al 5.° puesto).
* **Reto 2.2: Seriación de Longitud:** Ordenar 5 zanahorias de la más corta a la más larga para el conejo.
* **Reto 2.3: Los Vagones del Trencito (Números Ordinales):** Identificación del animal que viaja en una posición ordinal específica (1.° al 5.° vagón).
* **Reto 2.4: Posiciones Relativas (Primero y Último):** Identificar quién se encuentra primero junto a la estación y quién está al final de la fila.

#### Sesión 3: "Conteo, Operaciones Concretas y Balanza"
* **Reto 3.1: Conteo hasta 10 con Marco de Diez:** Conteo biunívoco con sonido progresivo y llenado del *Ten-Frame* oficial.
* **Reto 3.2: Situaciones de Agregar hasta 5:** Adición vivencial agregando patitos que llegan nadando a la laguna (ej. $2 + 1 = 3$).
* **Reto 3.3: Situaciones de Quitar hasta 5:** Sustracción vivencial en el picnic donde un monito come galletitas del plato (ej. $4 - 1 = 3$).
* **Reto 3.4: La Balanza Mágica:** Brazo basculante interactivo para comparar nociones de peso (*"pesa más"* e inclina la balanza, *"pesa menos"*).
* **Reto 3.5: Nociones Temporales ("Antes" y "Después"):** Ordenamiento secuencial de actividades de la rutina diaria (despertar, lavarse, alimentarse).

---

### 🚀 MUNDO 2: Resuelve Problemas de Forma, Movimiento y Localización (10 Retos)

#### Sesión 1: "Formas 2D y Cuerpos 3D en el Entorno"
* **Reto 1.1: El Museo de las Formas 2D:** Asociación de objetos reales con figuras planas (círculo, cuadrado, triángulo y rectángulo).
* **Reto 1.2: Cuerpos Geométricos 3D Cotidianos:** Identificación de cuerpos tridimensionales en la vida real (esfera, cubo, cilindro).
* **Reto 1.3: Clasificación Dinámica: ¿Rueda o No Rueda?:** Discriminación de cuerpos redondos que ruedan frente a figuras o bloques planos.

#### Sesión 2: "Ubicación Espacial en el Parque"
* **Reto 2.1: Cerca y Lejos del Árbol:** Colocación física de la pelota cerca o lejos tomando como punto de referencia el árbol del parque.
* **Reto 2.2: Al Lado del Tobogán:** Ubicación física del osito sentado exactamente al lado del tobogán.
* **Reto 2.3: El Parque de Kusi (Posiciones Relativas):** Ubicación del barquito cerca de la orilla de la laguna y otros elementos del entorno.

#### Sesión 3: "Desplazamientos y Medida de Longitud"
* **Reto 3.1: El Laberinto de Fido:** Guía del perrito en cuadrícula 4x4 utilizando flechas táctiles gigantes (*adelante*, *atrás*, *hacia un lado*, *hacia el otro lado*).
* **Reto 3.2: Comparación de Longitud: El Camino Más Largo Que...:** Comparación perceptual de dos senderos de baldosas con flores.
* **Reto 3.3: Comparación de Longitud: Cintas de Fiesta Más Cortas:** Discriminación de la cinta decorativa más corta.
* **Reto 3.4: El Puente de Madera:** Elección de la tabla con la longitud correcta para ayudar a Kusi a cruzar el río a salvo.

---

## 🔐 Módulo de Autenticación y Control de Accesos

Implementado en [`js/auth.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/auth.js) para garantizar seguridad, privacidad escolar y facilidad para niños:

* **Sin Modo Invitado Anónimo:** Solo los estudiantes registrados en la nómina oficial del aula pueden acceder a jugar y registrar avances.
* **Dos Roles de Usuario:**
  * **Docente Administradora:** Protegida con PIN secreto configurable (por defecto `1234`).
  * **Estudiantes y Familias:** Cada estudiante cuenta con un **Código de Estudiante** auto-generado (formato: `[Letra del Apellido] + [4 dígitos]`, ej. `V4821`), un PIN personal y su avatar animal.
* **Enlaces de Auto-Login por URL:**
  * Permite generar enlaces directos con parámetros: `index.html?id=V4821&pin=V4821`.
  * Los padres solo tocan el enlace desde WhatsApp en su celular y el sistema inicia sesión automáticamente, dando la bienvenida al niño por voz: *"¡Hola Valentina! ¡Bienvenida a tus retos matemáticos!"*.
* **Modo Suplantación (*Admin Impersonation*):**
  * La docente puede entrar al entorno de cualquier alumno desde la tabla de familias con un clic (`👁️ Ingresar`) sin requerir conocer la clave del padre.
* **Restablecimiento Rápido de PIN:**
  * Si una familia olvida su PIN, la docente puede restablecerlo en un clic a su Código de Estudiante original.

---

## ☁️ Sincronización en la Nube con Supabase y Modo Offline

Implementado en [`js/supabase-config.js`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/js/supabase-config.js) con esquema SQL en [`supabase_schema.sql`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/supabase_schema.sql):

```
┌───────────────────────┐         Sincronización en Tiempo Real         ┌───────────────────────┐
│  Dispositivo Alumno   │ ◄──────────────────────────────────────────► │  Supabase PostgreSQL  │
│ (Celular/Tablet Casa) │                                               │     (Cloud Database)  │
└───────────────────────┘                                               └──────────┬────────────┘
            │ Fallback Offline                                                     │
            ▼                                                                      ▼
┌───────────────────────┐                                               ┌───────────────────────┐
│ LocalStorage del Disp.│                                               │ Panel Docente del Aula│
│ (100% Funcional)      │                                               │ (Sábana de Monitoreo) │
└───────────────────────┘                                               └───────────────────────┘
```

* **Arquitectura Híbrida Offline-First:**
  * La aplicación es 100% funcional sin conexión a internet utilizando `localStorage`.
  * Si hay conexión a internet y Supabase está configurado, sincroniza estrellas, intentos, pistas y calificaciones en tiempo real.
* **Tablas de la Base de Datos:**
  1. `colegio_config`: Datos institucionales, nombre de docente, aula, mascota, logos y firmas.
  2. `usuarios`: Cuentas de docentes y familias con roles tipificados.
  3. `estudiantes`: Nómina de alumnos con avatar, estrellas, teléfono de contacto y fecha de último acceso.
  4. `evaluaciones`: Matriz de progreso (juego, intentos, pistas, completado, nota oficial CNEB).
* **Seguridad RLS (Row Level Security):** Políticas configuradas para consumo seguro mediante la clave anónima pública (*anon key*).

---

## 👩‍🏫 Panel de Gestión y Monitoreo Docente (5 Pestañas)

Protegido por el botón `👩‍🏫 Zona Docente 🔒` en la cabecera (PIN por defecto: `1234`), ofrece cinco módulos integrales de gestión pedagógica:

### 1. 📊 Pestaña 1: Monitoreo del Aula (Sábana Grupal)
* **Tarjetas KPI en Tiempo Real:** Total de estudiantes, completados al 100%, en proceso, pendientes y promedio de avance general.
* **Podio de Honor:** Reconocimiento gráfico para los 3 primeros puestos con mayor cantidad de estrellas acumuladas.
* **Insignias y Asignación Rápida:** Visualización directa de las competencias asignadas a cada estudiante con acceso directo al panel de asignación.
* **Filtros Semaforizados:** Filtrado por estado (*Completado*, *En Proceso*, *Pendiente*).
* **Exportación a Excel (CSV):** Descarga inmediata con un clic de la nómina completa con sus porcentajes y notas CNEB para la carpeta pedagógica.
* **Sincronización Manual:** Botón para pegar cadenas de avance enviadas por familias que no tuvieron conexión a internet.

### 2. 📄 Pestaña 2: Ficha Individual CNEB (Informe para SIAGIE)
* Selector rápido de cualquier estudiante de la nómina.
* **Evaluación Cualitativa Oficial:** Desglose por competencia y sesión en escala **AD, A, B, C**.
* **Generador de Conclusiones Descriptivas Oficiales:** Redacción automática basada en logros y dificultades para ambas competencias (Cantidad y Espacio), lista para copiar al SIAGIE.
* **Impresión en PDF Limpio:** Formato con membrete oficial del colegio optimizado para entrega a padres o archivo institucional.

### 3. 👥 Pestaña 3: Familias y Accesos
* Formulario de registro de nuevos estudiantes con generación automática de Código ID y PIN.
* **Envío Directo por WhatsApp:** Genera automáticamente el mensaje formal de la maestra con el enlace directo y lo envía al WhatsApp del padre de familia.
* **Envío por Correo Electrónico:** Genera el correo formal con asunto y cuerpo preformateado (`mailto:`).
* Acciones de restablecimiento de PIN, modo suplantación (impersonación de prueba) y eliminación segura de registros.

### 4. 🎯 Pestaña 4: Asignar Competencias (Control Pedagógico Diferenciado)
* **Asignación Individualizada:** Permite a la docente activar o pausar de manera diferenciada las competencias curriculares (*Resuelve problemas de cantidad* y *Resuelve problemas de forma, movimiento y localización*) para cada estudiante.
* **Interruptores Táctiles Interactivos:** Toggles ergonómicos de un solo toque (`✅ ASIGNADA` / `⚪ INACTIVA`) con autoguardado inmediato y sincronización a la nube Supabase.
* **Acciones Masivas Rápidas:** Botones para asignar `"Ambas a Todos"`, `"Solo Cantidad"`, `"Solo Espacio"` o `"Pausar Todas"` en un solo clic.
* **Métricas y Buscador en Tiempo Real:** KPI cards con resumen del aula y barra de búsqueda predictiva por nombre o ID.
* **Indicador de Progresión Secuencial:** Monitor visual del avance secuencial por sesión (`S1 ➔ S2 ➔ S3`) con candados y estados de aprobación.
* **Regla Pedagógica de Desbloqueo Secuencial CNEB:**
  * Dentro de cada competencia asignada, el estudiante resuelve sesión por sesión.
  * La **Sesión 1** está abierta por defecto.
  * La **Sesión 2** permanece bloqueada hasta que el estudiante haya completado y **aprobado** satisfactoriamente la Sesión 1 (calificación AD, A o B).
  * La **Sesión 3** permanece bloqueada hasta aprobar la Sesión 2.
  * Si una competencia no ha sido asignada al estudiante, aparece bloqueada con aviso de Kusi en el menú principal.

### 5. ⚙️ Pestaña 5: Colegio, Mascota y Configuración de Diplomas
* **Catálogo de más de 30 Mascotas Guía:** Selección de la figura animal (fauna peruana: llamita, cuy, zorro andino, cóndor, delfín rosado, otorongo, etc.) y cambio del nombre de la mascota.
* Datos de la I.E. (Nombre del colegio, aula/sección, nombre de la docente, teléfono de WhatsApp para recibir reportes).

---

## 🎓 Personalización Institucional y Generador de Diplomas

El sistema integra un módulo de emisión y personalización de diplomas oficiales de logro:

* **Condición de Desbloqueo:** Se activa automáticamente cuando el estudiante completa las **23 misiones** (100% de la malla curricular).
* **Elementos Configurables desde el Panel Docente:**
  * **Logotipo Institucional:** Permite cargar la imagen del logo del colegio o universidad (vía archivo o URL).
  * **Firma Digital y Cargo de Dirección:** Nombre de la Directora, cargo oficial (ej. *"Directora"*) e imagen de la firma/sello.
  * **Firma Digital y Cargo de la Docente:** Cargo oficial (ej. *"Docente de Aula"*) e imagen de su firma digital.
  * **Ciudad de Emisión:** Configurable (ej. *"Lima"*, *"Arequipa"*, *"Trujillo"*).
  * **Fecha de Emisión Automática:** Registra el día exacto en el que el niño completó el reto número 23.
* **Diseño para Impresión:** Formato apaisado de alta resolución con orla dorada, avatar del alumno, estrellas alcanzadas y felicitación personalizada.

---

## 👨‍👩‍👧 Portal para Familias y Acompañamiento en Casa

Accesible mediante el botón `👨‍👩‍👧 Familia` en la cabecera:

* **Privacidad Estricta:** Cada familia solo visualiza la información y el progreso de su propio hijo/a.
* **Métricas Clave:** Visualización clara de estrellas ⭐, misiones completadas (ej. `18/23`) y porcentaje de avance.
* **Botón "Enviar a la Profe por WhatsApp":**
  * Abre WhatsApp con un mensaje pre-redactado que contiene el avance detallado del niño y un enlace de sincronización dirigido al número de la docente configurado en el sistema.
* **Medallero Infantil:** 6 medallas gamificadas correspondientes a las sesiones curriculares del CNEB.
* **Pautas Formativas para el Hogar:** Sugerencias pedagógicas breves y cotidianas de 5 minutos para afianzar el pensamiento matemático en casa (en la cocina, con la ropa, en paseos).
* **Visualización y Descarga del Diploma:** Los padres pueden visualizar e imprimir directamente el Diploma de Honor cuando su hijo alcanza la meta.

---

## 🛠️ Arquitectura Técnica y Estructura de Archivos

Desarrollado como una **Single Page Application (SPA)** moderna, autocontenida y modular, sin necesidad de compiladores o frameworks pesados:

```
Aplicacion Inicial/
├── index.html                           # Estructura principal, CDN TailwindCSS, layout con Sidebar y Viewport
├── supabase_schema.sql                  # Script SQL de creación de tablas, políticas RLS y triggers en Supabase
├── css/
│   └── styles.css                       # Sistema visual UX/UI, diseño táctil chunky 3D, badges de edad y sidebar
├── js/
│   ├── audio.js                         # Sintetizador Web Audio API procedural + motor Web Speech API
│   ├── confetti.js                      # Motor de física de confeti festivo y estrellas en Canvas nativo
│   ├── data.js                          # Malla de retos y sesiones para el área de Matemática
│   ├── cneb-curriculum.js               # Catálogo CNEB Ciclo II: 6 Áreas, Competencias, Capacidades y Desempeños (3, 4, 5 años)
│   ├── school-management.js             # Gestión Escolar: Años lectivos, Aulas por edad, Docentes, Matrícula y Capacidades
│   ├── state.js                         # Gestión central de estado, notas CNEB, SIAGIE y aislamiento de pruebas
│   ├── mascot.js                        # Mascota animada en SVG con boca móvil sincronizada por voz
│   ├── dragdrop.js                      # Motor Pointer Events API para arrastre físico táctil y ratón
│   ├── students.js                      # Gestión de perfiles infantiles, avatares y buscador en tiempo real
│   ├── auth.js                          # Control de acceso con 3 roles: Administradora, Docentes y Estudiantes
│   ├── sidebar.js                       # Barra lateral interactiva ("sliderbar"), perfil activo y conmutador de vistas
│   ├── admin-views.js                   # Renderizadores de vistas: Dashboard, Aulas, Docentes, Matrícula, CNEB, SIAGIE
│   ├── supabase-config.js               # Conexión, sincronización en tiempo real y fallback offline
│   ├── familia.js                       # Portal familiar, medallero, pautas para casa y diploma oficial
│   ├── docente.js                       # Panel legado y utilidades de configuración de diplomas
│   ├── app.js                           # Enrutador principal, despacho de juegos y Modo Comprobación Pedagógica
│   └── games/
│       ├── cantidad-agrupacion.js       # Mundo 1 - Sesión 1: 4 juegos de agrupación y cuantificadores
│       ├── cantidad-seriacion.js        # Mundo 1 - Sesión 2: 4 juegos de seriación y ordinales (1.° al 5.°)
│       ├── cantidad-conteo.js           # Mundo 1 - Sesión 3: Juego 3.1 conteo 1 al 10 con Marco de Diez
│       ├── cantidad-operaciones.js      # Mundo 1 - Sesión 3: Juegos 3.2 y 3.3 agregar y quitar hasta 5
│       ├── cantidad-peso-tiempo.js      # Mundo 1 - Sesión 3: Juegos 3.4 y 3.5 balanza mágica y secuencias
│       ├── espacio-formas.js            # Mundo 2 - Sesión 1: 3 juegos de figuras 2D, cuerpos 3D y rodar
│       ├── espacio-ubicacion.js         # Mundo 2 - Sesión 2: 3 juegos de ubicación espacial (cerca, lejos, lado)
│       ├── espacio-desplazamiento.js    # Mundo 2 - Sesión 3: Juego 3.1 cuadrícula con flechas direccionales
│       └── espacio-longitud.js          # Mundo 2 - Sesión 3: Juegos 3.2, 3.3 y 3.4 comparación de longitud
├── README.md                            # Este documento técnico integral
└── DOCUMENTACION_SISTEMA_EDTECH_CNEB.md # Documento técnico-pedagógico formal
```

### Tecnologías Clave:
* **HTML5 Semántico y Accesible.**
* **Vanilla JavaScript Modular (ES6+):** Alto rendimiento sin dependencias pesadas.
* **Supabase Client v2 (CDN):** Base de datos relacional PostgreSQL con RLS y sincronización en tiempo real.
* **TailwindCSS Play CDN:** Sistema responsivo con paleta infantil armónica y adaptabilidad móvil.
* **Web Speech API:** Síntesis de voz nativa en español.
* **Web Audio API:** Síntesis sonora procedural en código.
* **HTML5 Canvas:** Renderizado dinámico de confeti y animaciones.

---

## 🚀 Guía de Instalación y Despliegue

### Opción 1: Ejecución Local Rápida
1. Clona el repositorio:
   ```bash
   git clone https://github.com/ym-salvador/AplicacionInicial.git
   ```
2. Abre directamente el archivo `index.html` con cualquier navegador web moderno (Google Chrome, Microsoft Edge, Safari o Firefox).
3. No requiere `npm install`, Node.js ni servidor web local.

### Opción 2: Despliegue Gratuito en la Web con GitHub Pages
1. Sube el proyecto a tu repositorio de GitHub.
2. Ve a **Settings > Pages** en GitHub.
3. En **Branch**, selecciona `main` o `master` y la carpeta `/(root)`.
4. Guarda los cambios. Tu aplicación estará disponible en internet (ej. `https://tu-usuario.github.io/AplicacionInicial/`).

### Opción 3: Conexión con Supabase (Nube)
1. Crea un proyecto gratuito en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** de Supabase, copia el contenido de [`supabase_schema.sql`](file:///c:/Users/yanet/OneDrive/Desktop/Aplicacion%20Inicial/supabase_schema.sql) y ejecútalo.
3. Obtén tu **Project URL** y tu **anon public key** en **Settings > API**.
4. En la aplicación, ingresa a `👩‍🏫 Zona Docente` con el PIN `1234`, pulsa `⚡ Conectar Supabase`, pega tus credenciales y guarda.
5. ¡Todos los avances de los niños se sincronizarán en vivo en la nube!

---

*Desarrollado con compromiso pedagógico para fortalecer la Educación Inicial en el Perú.* 🇵🇪

---

## 🧭 v4.0 — Modelo de roles y lógica de asignación (reestructuración)

### Perfiles y acceso
| Perfil | Cómo ingresa | Qué ve en el menú lateral |
|---|---|---|
| 🏛️ Directora / Administradora | Usuario + PIN de **Mi Perfil** (por defecto `admin` / `1234`) | Panel Institucional, Aulas y Año Lectivo, Docentes y Usuarios, Matrícula, Malla CNEB, Planificar Sesiones, Evaluación, Monitoreo, Mundos (comprobar), Mi Perfil, Configuración |
| 👩‍🏫 Docente | Elige su nombre + PIN propio (lo crea la Dirección) | Mi Panel, Mis Estudiantes, Mis Aulas, Malla, Planificar Sesiones, Evaluación, Monitoreo, Mundos (comprobar), Mi Perfil |
| 🎒 Estudiante / Familia | Toca su aula y su perfil, o escribe su Código ID | Jugar Mundos, Mi Progreso y Diploma |

* Ya **no se crea una sesión automática**: al abrir la app aparece el selector de perfil.
* La Directora y las docentes pueden **"Entrar como"** un estudiante (o la Directora como una docente) y volver a su propio panel con un clic.
* Cada docente solo ve **sus aulas y sus estudiantes del año activo**.

### ¿Por qué un estudiante puede o no jugar un reto?
`SchoolManagement.getSessionAccess(studentId, mundo, sesión)` es la única regla, en este orden:

1. **Plan del aula** → la competencia está activa para el aula (Planificar Sesiones → interruptor de la competencia).
2. **Asignación individual** → el mundo está activo para ese estudiante (Planificar Sesiones → tarjeta del estudiante, o chips 🧺/🚀 en Matrícula).
3. **Sesión abierta** → la sesión de clase está habilitada en el plan del aula (interruptor por sesión).
4. **Progresión CNEB** → la sesión anterior está aprobada (todos sus retos completados sin "C").

Cada sesión declara las **capacidades CNEB que moviliza** y la docente puede marcar cuáles prioriza; además muestra el **desempeño adecuado a la edad** del aula (3, 4 o 5 años).

### Retos por edad
Cada minijuego declara `edades: [3, 4, 5]` en `js/data.js`. Un niño de 3 años solo ve los retos pertinentes a su edad; el diploma, el avance y la aprobación de sesiones se calculan sobre esa cantidad.

### Año lectivo
En **Aulas y Año Lectivo** la Dirección puede: crear un nuevo año (copiando la estructura de aulas), **promover** estudiantes (3→4, 4→5, 5 egresan, con historial), matricular nuevos y mover estudiantes de aula.

### Supabase
Ejecuta de nuevo `supabase_schema.sql`: agrega las columnas `aula_id`, `anio`, `estado` a `estudiantes` y la tabla `escuela_estructura` (aulas con su plan, docentes, años y perfil admin).

### Todas las áreas del CNEB en el plan del aula (v4.1)
* El plan de cada aula ahora incluye las **13 competencias** del catálogo (`js/cneb-curriculum.js`), no solo Matemática. Por defecto quedan activas las que el CNEB indica para el ciclo del aula (Ciclo I, 0 a 2 años: 7 competencias; Ciclo II, 3 a 5 años: todas, salvo Educación Religiosa que se activa a mano).
* **Malla Curricular**: filtro por área y por ciclo/edad, desempeño esperado por edad, en cuántas aulas está activa cada competencia y botón "Planificar". Botón **Aplicar malla CNEB a todas las aulas**.
* **Planificar Sesiones**: selector de área → competencia. Matemática conserva sus sesiones con retos; las demás áreas muestran el desempeño por edad, capacidades priorizadas y **calificación directa (AD/A/B/C + anotación) por estudiante**. Botones "Aplicar malla CNEB a esta aula" y "Copiar plan a las otras aulas de la misma edad".
* **Evaluación**: bloque "Otras áreas del CNEB" con la calificación directa por competencia (se guarda en `student.areaGrades` y en la columna `notas_areas` de Supabase).

### Niveles de dificultad por edad en los 23 retos (v4.3)
* `js/niveles.js` concentra los parámetros de cada reto para 3, 4 y 5 años (Ciclo I usa el nivel de 3). Cada juego los consulta al iniciar con `CNEB_NIVELES.get('id_del_reto')` y muestra la insignia "Nivel N años" en su cabecera.
* La edad la decide `App.getPlayingAge()`: la del aula del estudiante, o la elegida con los botones 3 / 4 / 5 años del **Modo Comprobación** (Mundos y Retos) para presentar o probar.
* Resumen de la progresión: agrupar por color 2→3 colores y 4→9 frutas; cuantificadores muchos/pocos → + ninguno → pregunta sorteada; seriación 3→4→5 objetos; ordinales hasta 3.° → 5.°; conteo hasta 3→5→10; agregar/quitar hasta 3 (4 años) o 5 (5 años) con cantidades sorteadas; balanza "pesa más" → también "pesa menos" y pares variados; formas círculo/cuadrado → + triángulo → + rectángulo; cuerpos esfera/cubo → + cilindro; ¿rueda? 2→3→4 opciones y "¿cuál no rueda?"; ubicación solo "cerca" → cerca/lejos → 3 zonas y "lejos del agua"; cuadrícula 2x2 → 3x3 → 4x4; longitud 2 objetos con gran contraste → 3 objetos con poco contraste.
* **Mundos Vivenciales** (v4.4): en *Mundos y Retos* también aparecen las competencias de las otras áreas como mundos "🏫 Vivencial", con filtro por área, el desempeño de la edad elegida y un modal con **3 sesiones de aula sugeridas** (materiales y desarrollo) definidas en `CNEB_CURRICULUM.actividades`. El estudiante ve en su pantalla de inicio "Mis aventuras en el aula" con las competencias activas de su aula y la medalla obtenida.
* **Nada bloqueado a la vista del niño** (v4.5): en la pantalla del estudiante solo aparecen los mundos que puede jugar y, dentro de un mundo, solo las sesiones abiertas y desbloqueadas. Si no tiene ningún mundo abierto ve un mensaje amable ("Pronto habrá nuevas aventuras"). El personal en Modo Comprobación sigue viendo todo.

### Usuarios `apellido.inicial` y acceso con usuario + PIN (v4.6)
- Todos los usuarios (estudiantes, docentes y dirección) tienen el formato **apellido.inicial** (ej. `gomez.v`, `huaman.y`, `perez.m`): sin tildes, en minúsculas, separados por un punto.
- Nunca se repiten: si dos estudiantes generan el mismo usuario se añade un número (`gomez.v2`). Si la combinación suena mal, se usan dos letras del nombre o se invierte el orden (`nombre.inicial`).
- Los usuarios antiguos (`est_1`, `V4821`, `yanet.huaman`, `admin`) se migran solos al abrir la app; el usuario anterior sigue aceptado para no cortar sesiones guardadas.
- **Nadie entra con un clic**: Dirección, docentes y familias escriben su usuario y su PIN. Los PIN de estudiantes son 4 números aleatorios, nunca iguales al usuario; se ven en Matrícula (👤 usuario / 🔑 PIN) y se pueden regenerar con "Nuevo PIN".
- Accesos iniciales: dirección `perez.m` / 1234; docentes `huaman.y`, `delgadillo.c`, `ramos.s` / 1234; estudiantes: ver su PIN en Matrícula.
