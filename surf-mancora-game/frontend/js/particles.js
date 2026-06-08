/**
 * particles.js
 * Sistema de partículas para simular la estela de agua de la tabla de surf.
 */

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Velocidad aleatoria para dispersión (Eje X e Y)
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * -3 - 2; // Impulso hacia arriba
        this.life = 1.0; // Opacidad inicial
        this.size = Math.random() * 3 + 1; // Tamaño de la gota
        this.gravity = 0.15; // Fuerza de gravedad
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity; // La gravedad tira de la gota hacia abajo
        this.life -= 0.03; // La gota desaparece gradualmente
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}