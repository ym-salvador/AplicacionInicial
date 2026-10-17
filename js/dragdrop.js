/**
 * MOTOR UNIVERSAL DE ARRASTRE Y SOLTADO INFANTIL (DRAG & DROP TÁCTIL Y MOUSE)
 * Especialmente diseñado para motricidad de 5 años (PointerEvents y Touch nativo).
 * Exige arrastrar al contenedor correcto; NUNCA coloca automáticamente al hacer clic.
 */

window.ChildDragDrop = {
  makeDraggable(element, config = {}) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let currentHoverZone = null;
    let hasMoved = false;

    const targetSelector = config.targetSelector || '.drop-zone';

    const onPointerDown = (e) => {
      // Solo botón primario
      if (e.button !== undefined && e.button !== 0) return;
      if (element.classList.contains('placed')) return;

      element.setPointerCapture(e.pointerId);
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      element.style.transition = 'none';
      element.style.touchAction = 'none';
      element.classList.add('selected');
      window.SoundEngine.playPop();

      if (config.onGrab) config.onGrab(element);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.hypot(dx, dy) > 8) {
        hasMoved = true;
      }

      if (hasMoved) {
        element.classList.add('is-dragging');
        element.style.zIndex = '9999';
        element.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.15) rotate(${dx * 0.05}deg)`;

        // Detectar zona debajo del puntero
        element.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        element.style.pointerEvents = 'auto';

        const dropZone = elementBelow?.closest(targetSelector);

        if (dropZone !== currentHoverZone) {
          if (currentHoverZone) {
            currentHoverZone.classList.remove('drag-over');
          }
          currentHoverZone = dropZone;
          if (currentHoverZone) {
            currentHoverZone.classList.add('drag-over');
          }
        }
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;

      try {
        element.releasePointerCapture(e.pointerId);
      } catch (err) {}

      element.classList.remove('is-dragging', 'selected');

      // Limpiar zona resaltada
      if (currentHoverZone) {
        currentHoverZone.classList.remove('drag-over');
      }

      // Si solo hizo clic o toque sin arrastrar
      if (!hasMoved) {
        element.style.transform = '';
        element.style.transition = 'transform 0.2s ease';
        element.classList.add('animate-wiggle');
        setTimeout(() => element.classList.remove('animate-wiggle'), 500);

        if (config.onClickNoDrag) {
          config.onClickNoDrag(element);
        } else {
          window.Kusi.say("¡Arrastra el objeto con tu dedito hasta donde corresponde!");
        }
        return;
      }

      // Buscar zona final de soltado
      element.style.pointerEvents = 'none';
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      element.style.pointerEvents = 'auto';

      const finalDropZone = elementBelow?.closest(targetSelector);

      let accepted = false;
      if (finalDropZone && config.onDrop) {
        accepted = config.onDrop(element, finalDropZone);
      }

      if (accepted) {
        // Aceptado con éxito en la zona correcta
        element.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0.4';
        element.classList.add('placed');
        element.disabled = true;
      } else {
        // Rechazado o soltado fuera: resorte suave de vuelta al estante
        element.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
        element.style.transform = 'translate3d(0, 0, 0)';
        setTimeout(() => {
          element.style.transform = '';
          element.style.transition = '';
        }, 360);

        if (finalDropZone && config.onWrongDrop) {
          config.onWrongDrop(element, finalDropZone);
        } else if (config.onMissDrop) {
          config.onMissDrop(element);
        }
      }

      currentHoverZone = null;
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
  }
};
