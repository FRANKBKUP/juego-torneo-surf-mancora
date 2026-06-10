/**
 * visual-effects.js
 * Sistema de efectos visuales mejorados para el Canvas
 * 
 * Incluye:
 * - Flash de pantalla (rojo/blanco)
 * - Explosión de partículas mejorada
 * - Escudo animado alrededor del surfista
 * - Efectos de impacto
 */

class VisualEffects {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Flash de pantalla
        this.flashOpacity = 0;
        this.flashColor = 'rgba(255, 0, 0, ';
        this.isFlashing = false;

        // Partículas de explosión mejoradas
        this.explosionParticles = [];

        // Escudo del jugador
        this.shieldOpacity = 0;
        this.shieldRadius = 60;
    }

    // ═══════════════════════════════════════════════════════════════
    // FLASH DE PANTALLA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Activa un flash rojo en la pantalla (para colisiones)
     * @param {number} duration - Duración del flash en ms (default: 200)
     */
    flashRed(duration = 200) {
        this.flashOpacity = 0.6;
        this.flashColor = 'rgba(255, 50, 50, ';
        this.isFlashing = true;

        // Fade out del flash
        const fadeSpeed = this.flashOpacity / (duration / 16); // ~60 FPS
        const fadeInterval = setInterval(() => {
            this.flashOpacity -= fadeSpeed;
            if (this.flashOpacity <= 0) {
                this.flashOpacity = 0;
                this.isFlashing = false;
                clearInterval(fadeInterval);
            }
        }, 16);
    }

    /**
     * Activa un flash blanco en la pantalla (para victoria)
     * @param {number} duration - Duración del flash en ms (default: 300)
     */
    flashWhite(duration = 300) {
        this.flashOpacity = 0.8;
        this.flashColor = 'rgba(255, 255, 255, ';
        this.isFlashing = true;

        const fadeSpeed = this.flashOpacity / (duration / 16);
        const fadeInterval = setInterval(() => {
            this.flashOpacity -= fadeSpeed;
            if (this.flashOpacity <= 0) {
                this.flashOpacity = 0;
                this.isFlashing = false;
                clearInterval(fadeInterval);
            }
        }, 16);
    }

    /**
     * Dibuja el flash actual en el Canvas
     */
    drawFlash() {
        if (this.flashOpacity > 0) {
            this.ctx.save();
            this.ctx.fillStyle = this.flashColor + this.flashOpacity + ')';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPLOSIÓN DE PARTÍCULAS MEJORADA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Crea una explosión de partículas en una posición (para soles)
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {string} color - Color de las partículas (default: 'yellow')
     * @param {number} count - Cantidad de partículas (default: 12)
     */
    createExplosion(x, y, color = 'gold', count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 4 + Math.random() * 3;

            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1.0,
                maxLife: 1.0,
                size: 3 + Math.random() * 4,
                color: color,
                gravity: 0.1
            };

            this.explosionParticles.push(particle);
        }
    }

    /**
     * Actualiza y dibuja todas las partículas de explosión
     */
    updateAndDrawExplosions() {
        for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
            const p = this.explosionParticles[i];

            // Actualizar posición
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;

            // Reducir vida
            p.life -= 0.02;

            // Dibujar
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life / p.maxLife;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Eliminar si terminó su vida
            if (p.life <= 0) {
                this.explosionParticles.splice(i, 1);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ESCUDO ANIMADO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Activa el escudo visual alrededor del surfista
     * @param {number} duration - Duración del escudo en ms (default: 3000)
     */
    activateShield(duration = 3000) {
        this.shieldOpacity = 1.0;

        // Fade out del escudo
        const fadeSpeed = 1.0 / (duration / 16);
        const fadeInterval = setInterval(() => {
            this.shieldOpacity -= fadeSpeed;
            if (this.shieldOpacity <= 0) {
                this.shieldOpacity = 0;
                clearInterval(fadeInterval);
            }
        }, 16);
    }

    /**
     * Dibuja el escudo alrededor de una posición
     * @param {number} x - Posición X del centro
     * @param {number} y - Posición Y del centro
     * @param {number} time - Tiempo actual (para animación)
     */
    drawShield(x, y, time) {
        if (this.shieldOpacity <= 0) return;

        this.ctx.save();
        this.ctx.globalAlpha = this.shieldOpacity;

        // Círculo exterior (brillo)
        this.ctx.strokeStyle = '#00FFFF';
        this.ctx.lineWidth = 3;
        const radius1 = this.shieldRadius + Math.sin(time * 0.1) * 5;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius1, 0, Math.PI * 2);
        this.ctx.stroke();

        // Círculo interior
        this.ctx.strokeStyle = '#00BBFF';
        this.ctx.lineWidth = 2;
        const radius2 = this.shieldRadius - 10;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius2, 0, Math.PI * 2);
        this.ctx.stroke();

        // Líneas radiales animadas (tipo escudo de energía)
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        const lineCount = 8;
        for (let i = 0; i < lineCount; i++) {
            const angle = (Math.PI * 2 * i) / lineCount + time * 0.05;
            const x1 = x + Math.cos(angle) * radius2;
            const y1 = y + Math.sin(angle) * radius2;
            const x2 = x + Math.cos(angle) * radius1;
            const y2 = y + Math.sin(angle) * radius1;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    // ═══════════════════════════════════════════════════════════════
    // EFECTO DE IMPACTO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Crea un efecto de impacto (onda de choque)
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     */
    createImpact(x, y) {
        // Flash rojo inmediato
        this.flashRed(150);

        // Explosión de partículas roja
        this.createExplosion(x, y, 'rgba(255, 100, 100, 0.8)', 8);
    }
}

// Instancia global
let visualEffects = null;

/**
 * Inicializar los efectos visuales (llamar en window.onload)
 */
function initializeVisualEffects() {
    const canvas = document.getElementById('surfCanvas');
    if (canvas) {
        visualEffects = new VisualEffects(canvas);
        console.log("✨ Sistema de efectos visuales inicializado");
    }
}