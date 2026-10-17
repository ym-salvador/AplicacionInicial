/**
 * MOTOR DE AUDIO Y VOZ (EDTECH INICIAL 5 AÑOS)
 * Sintetizador Web Audio API + Síntesis de Voz Web Speech API en Español
 * Cero dependencia de archivos externos para máxima confiabilidad offline
 */

class SoundAndVoiceEngine {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = window.speechSynthesis || null;
    this.spanishVoice = null;
    this.lastSpokenText = '';
    this.isMuted = false;
    this.isSpeaking = false;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;

    this.initAudioContext();
    this.initVoices();
  }

  // Inicializa o reanuda el AudioContext con la primera interacción del usuario
  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      const resume = () => {
        this.audioCtx.resume();
        window.removeEventListener('click', resume);
        window.removeEventListener('touchstart', resume);
      };
      window.addEventListener('click', resume);
      window.addEventListener('touchstart', resume);
    }
  }

  // Carga y selecciona la mejor voz en español para niños
  initVoices() {
    if (!this.speechSynth) return;

    const findVoice = () => {
      const voices = this.speechSynth.getVoices();
      if (!voices || voices.length === 0) return;

      // Prioridad: Español Perú (es-PE), luego latinoamericano (es-419, es-MX, es-US), luego español general (es)
      this.spanishVoice = voices.find(v => v.lang === 'es-PE') ||
                          voices.find(v => v.lang === 'es-419') ||
                          voices.find(v => v.lang === 'es-MX') ||
                          voices.find(v => v.lang === 'es-US') ||
                          voices.find(v => v.lang.startsWith('es-')) ||
                          voices.find(v => v.lang.startsWith('es')) ||
                          voices[0];
    };

    findVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = findVoice;
    }
  }

  // Habla un texto con voz amigable para 5 años
  speak(text, onEnd = null) {
    if (this.isMuted || !this.speechSynth) {
      if (onEnd) onEnd();
      return;
    }

    this.initAudioContext();
    this.lastSpokenText = text;

    // Cancela cualquier voz anterior para evitar sobreposiciones
    this.speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.spanishVoice) {
      utterance.voice = this.spanishVoice;
    }
    utterance.lang = 'es-PE';
    utterance.rate = 0.92;   // Velocidad pausada y comprensible para 5 años
    utterance.pitch = 1.18;  // Tono cálido, amigable y agudo infantil

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeechStart) this.onSpeechStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
      if (onEnd) onEnd();
    };

    // Timeout de seguridad en caso de que el navegador congele el utterance
    this.speechSynth.speak(utterance);
  }

  // Repite la última instrucción hablada
  repeat() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    }
  }

  // =========================================================================
  // SINTETIZADOR WEB AUDIO API (Efectos de Sonido Infantiles)
  // =========================================================================

  // Pop de burbuja al tocar un botón u objeto
  playPop() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    const now = this.audioCtx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Soltar objeto con toque suave (thud de madera infantil)
  playDrop() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Nota de conteo ascendente (1 al 10 en escala pentatónica mayor alegre)
  playCount(step = 1) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
    const freq = baseFreqs[Math.min(Math.max(step - 1, 0), baseFreqs.length - 1)];

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Acierto / Éxito (Arpegio alegre estilo xilófono infantil: Do-Mi-Sol-Do)
  playSuccess() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Error constructivo: Toque suave y cálido de reflexión (NUNCA buzz agresivo)
  playGentleTryAgain() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const notes = [440.00, 392.00]; // La4, Sol4 suave
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  // Fanfarria de Victoria Completa (Celebración de mundo o logro)
  playVictory() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const melody = [
      { f: 523.25, d: 0.12 }, // Do
      { f: 523.25, d: 0.12 }, // Do
      { f: 523.25, d: 0.12 }, // Do
      { f: 659.25, d: 0.3 },  // Mi
      { f: 783.99, d: 0.3 },  // Sol
      { f: 1046.50, d: 0.6 }  // Do agudo
    ];

    let timeOffset = this.audioCtx.currentTime;
    melody.forEach(note => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, timeOffset);

      gain.gain.setValueAtTime(0.4, timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + note.d);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(timeOffset);
      osc.stop(timeOffset + note.d);

      timeOffset += note.d * 0.9;
    });
  }
}

// Instancia global
window.SoundEngine = new SoundAndVoiceEngine();
