/**
 * ANIMADOR DE CONFETI Y ESTRELLAS EN CANVAS PURO
 * Efecto de celebración festiva para autonomía y autoconfianza (CNEB)
 */

window.ConfettiEngine = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,

  init() {
    let cvs = document.getElementById('confetti-canvas');
    if (!cvs) {
      cvs = document.createElement('canvas');
      cvs.id = 'confetti-canvas';
      cvs.style.position = 'fixed';
      cvs.style.top = '0';
      cvs.style.left = '0';
      cvs.style.width = '100vw';
      cvs.style.height = '100vh';
      cvs.style.pointerEvents = 'none';
      cvs.style.zIndex = '9999';
      document.body.appendChild(cvs);
    }
    this.canvas = cvs;
    this.ctx = cvs.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  celebrate(durationMs = 2800) {
    this.init();
    const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];
    this.particles = [];

    // Crear 80 partículas de fiesta
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 - 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (this.animId) cancelAnimationFrame(this.animId);
    const startTime = Date.now();

    const loop = () => {
      const elapsed = Date.now() - startTime;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // Gravedad
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / durationMs);

        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      });

      if (elapsed < durationMs) {
        this.animId = requestAnimationFrame(loop);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    };

    loop();
  }
};
