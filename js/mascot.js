/**
 * MASCOTA KUSI LA VICUÑITA ANDINA
 * Guía pedagógica infantil con expresiones faciales animadas,
 * habla sincronizada y retroalimentación formativa constructiva.
 */

class KusiMascot {
  constructor() {
    this.mood = 'idle'; // 'idle', 'speaking', 'happy', 'thinking'
    this.currentMessage = '¡Hola! Vamos a jugar y divertirnos con los números.';
    this.domElement = null;
    this.mouthElement = null;
    this.bubbleElement = null;
    this.eyesElement = null;

    // Conectar eventos del SoundEngine para animar boca al hablar
    if (window.SoundEngine) {
      window.SoundEngine.onSpeechStart = () => this.setSpeaking(true);
      window.SoundEngine.onSpeechEnd = () => this.setSpeaking(false);
    }
  }

  // Genera el SVG enriquecido de Kusi la Vicuñita
  getSVG(size = 130) {
    return `
      <svg class="kusi-svg" width="${size}" height="${size * 1.15}" viewBox="0 0 160 185" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Sombras y gradientes -->
          <linearGradient id="vicuna-fur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F4C28D"/>
            <stop offset="50%" stop-color="#E29E5B"/>
            <stop offset="100%" stop-color="#C57E3B"/>
          </linearGradient>
          <linearGradient id="chullo-stripes" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#E11D48"/>
            <stop offset="25%" stop-color="#F59E0B"/>
            <stop offset="50%" stop-color="#0284C7"/>
            <stop offset="75%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#8B5CF6"/>
          </linearGradient>
          <filter id="shadow-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
          </filter>
        </defs>

        <!-- Sombra en el suelo -->
        <ellipse cx="80" cy="180" rx="45" ry="5" fill="#000000" opacity="0.12" />

        <!-- Cuerpo y pecho lanudito -->
        <path d="M50 120 C45 150 48 175 60 178 C70 180 90 180 100 178 C112 175 115 150 110 120 Z" fill="url(#vicuna-fur)" />
        <path d="M62 135 C60 165 72 175 80 175 C88 175 100 165 98 135 C95 125 65 125 62 135 Z" fill="#FFFBF5" />

        <!-- Cuello esbelto de vicuña -->
        <path d="M68 95 L65 130 C75 134 85 134 95 130 L92 95 Z" fill="url(#vicuna-fur)" />

        <!-- Orejitas tiernas -->
        <path d="M48 55 C38 32 40 18 48 18 C56 18 58 35 56 60 Z" fill="url(#vicuna-fur)" />
        <path d="M48 50 C42 34 43 25 48 24 C52 24 53 35 52 54 Z" fill="#FECDD3" />

        <path d="M112 55 C122 32 120 18 112 18 C104 18 102 35 104 60 Z" fill="url(#vicuna-fur)" />
        <path d="M112 50 C118 34 117 25 112 24 C108 24 107 35 108 54 Z" fill="#FECDD3" />

        <!-- Cabeza tierna -->
        <ellipse cx="80" cy="78" rx="36" ry="32" fill="url(#vicuna-fur)" filter="url(#shadow-soft)" />

        <!-- Chullo andino colorido con pompón -->
        <path d="M44 65 C44 38 60 22 80 22 C100 22 116 38 116 65 C105 60 92 63 80 60 C68 63 55 60 44 65 Z" fill="url(#chullo-stripes)" />
        <!-- Orejeras del chullo -->
        <path d="M46 62 L42 84 L53 76 Z" fill="#E11D48" />
        <path d="M114 62 L118 84 L107 76 Z" fill="#E11D48" />
        <!-- Pompón esponjoso del chullo -->
        <circle cx="80" cy="18" r="10" fill="#FDE047" />
        <circle cx="76" cy="15" r="3" fill="#FFF" opacity="0.6"/>

        <!-- Hocico de vicuñita blanco/crema -->
        <ellipse cx="80" cy="88" rx="18" ry="14" fill="#FFFBF5" />
        <!-- Naricita de corazón -->
        <path d="M77 82 C77 80 83 80 83 82 C83 85 80 88 80 88 C80 88 77 85 77 82 Z" fill="#881337" />

        <!-- Ojos grandes y tiernos con reflejos infantiles -->
        <g id="kusi-eyes" class="kusi-eyes-group">
          <!-- Ojo izquierdo -->
          <ellipse cx="65" cy="74" rx="7.5" ry="8.5" fill="#1E293B" />
          <circle cx="63" cy="71" r="3.2" fill="#FFFFFF" />
          <circle cx="67" cy="76" r="1.5" fill="#FFFFFF" />

          <!-- Ojo derecho -->
          <ellipse cx="95" cy="74" rx="7.5" ry="8.5" fill="#1E293B" />
          <circle cx="93" cy="71" r="3.2" fill="#FFFFFF" />
          <circle cx="97" cy="76" r="1.5" fill="#FFFFFF" />

          <!-- Mejillitas sonrojadas -->
          <ellipse cx="54" cy="84" rx="6" ry="4" fill="#FB7185" opacity="0.45" />
          <ellipse cx="106" cy="84" rx="6" ry="4" fill="#FB7185" opacity="0.45" />
        </g>

        <!-- Boca interactiva animada -->
        <g id="kusi-mouth">
          <!-- Boca sonriente base -->
          <path class="mouth-smile" d="M74 92 Q80 97 86 92" stroke="#881337" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <!-- Boca abierta al hablar / celebrar (oculta por defecto) -->
          <ellipse class="mouth-talking hidden" cx="80" cy="94" rx="5" ry="4.5" fill="#881337" />
          <ellipse class="mouth-talking hidden" cx="80" cy="96" rx="3.5" ry="2" fill="#F43F5E" />
        </g>
      </svg>
    `;
  }

  // Renderiza el componente de la mascota en el contenedor especificado
  render(containerSelector = '#mascot-host') {
    const host = document.querySelector(containerSelector);
    if (!host) return;

    host.innerHTML = `
      <div id="kusi-mascot-wrapper" class="mascot-container flex items-end">
        <div id="kusi-svg-holder" class="mascot-svg-wrapper animate-bounce-soft" title="¡Soy Kusi! Tócame para escucharte">
          ${this.getSVG(110)}
        </div>
        <div id="kusi-bubble" class="mascot-speech-bubble select-none flex items-center gap-3">
          <span id="kusi-text" class="flex-1">${this.currentMessage}</span>
          <button id="btn-speaker-repeat" class="btn-chunky btn-yellow btn-circle flex-shrink-0" style="width: 54px; height: 54px; min-width: 54px; min-height: 54px;" title="Repetir voz">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.domElement = document.getElementById('kusi-mascot-wrapper');
    this.bubbleElement = document.getElementById('kusi-bubble');
    this.mouthElement = document.getElementById('kusi-mouth');
    this.eyesElement = document.getElementById('kusi-eyes');

    // Eventos de toque en Kusi o en el botón parlante
    const repeatVoice = () => {
      window.SoundEngine.playPop();
      window.SoundEngine.repeat();
      this.animateBounce();
    };

    document.getElementById('kusi-svg-holder')?.addEventListener('click', repeatVoice);
    document.getElementById('btn-speaker-repeat')?.addEventListener('click', repeatVoice);
  }

  // Establece y dice una instrucción
  say(message, onEnd = null) {
    this.currentMessage = message;
    const textEl = document.getElementById('kusi-text');
    if (textEl) {
      textEl.textContent = message;
    }
    window.SoundEngine.speak(message, onEnd);
  }

  // Alterna animación de hablar
  setSpeaking(isSpeaking) {
    const mouthSmile = this.mouthElement?.querySelector('.mouth-smile');
    const mouthTalking = this.mouthElement?.querySelectorAll('.mouth-talking');

    if (isSpeaking) {
      mouthSmile?.classList.add('hidden');
      mouthTalking?.forEach(el => el.classList.remove('hidden'));
      this.domElement?.querySelector('.mascot-svg-wrapper')?.classList.add('animate-wiggle');
    } else {
      mouthSmile?.classList.remove('hidden');
      mouthTalking?.forEach(el => el.classList.add('hidden'));
      this.domElement?.querySelector('.mascot-svg-wrapper')?.classList.remove('animate-wiggle');
    }
  }

  // Celebración cuando el niño logra un reto
  celebrate(customMessage = null) {
    const celebrations = [
      '¡Bravo! ¡Lo lograste!',
      '¡Excelente trabajo, campeón!',
      '¡Qué inteligente eres! ¡Muy bien!',
      '¡Yupi! ¡Completaste el reto!'
    ];
    const msg = customMessage || celebrations[Math.floor(Math.random() * celebrations.length)];
    
    const svgHolder = document.getElementById('kusi-svg-holder');
    if (svgHolder) {
      svgHolder.style.animation = 'celebrationJump 0.8s ease-in-out';
      setTimeout(() => {
        svgHolder.style.animation = '';
      }, 900);
    }

    this.say(msg);
  }

  // Retroalimentación formativa y error constructivo (NUNCA punitivo)
  giveHint(hintText) {
    const svgHolder = document.getElementById('kusi-svg-holder');
    if (svgHolder) {
      svgHolder.classList.add('animate-wiggle');
      setTimeout(() => svgHolder.classList.remove('animate-wiggle'), 1200);
    }
    window.SoundEngine.playGentleTryAgain();
    this.say(hintText);
  }

  animateBounce() {
    const svgHolder = document.getElementById('kusi-svg-holder');
    if (svgHolder) {
      svgHolder.style.transform = 'scale(1.15) translateY(-10px)';
      setTimeout(() => {
        svgHolder.style.transform = '';
      }, 250);
    }
  }
}

// Instancia global
window.Kusi = new KusiMascot();
