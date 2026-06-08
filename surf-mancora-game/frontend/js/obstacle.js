/**
 * obstacle.js
 * Genera obstáculos físicos (tortugas) que se desplazan contra el jugador.
 */
class Obstacle {
    constructor(canvasWidth, startY) {
        this.x = canvasWidth;       // Aparecen por la derecha
        this.y = startY - 20;       // Justo sobre la línea del agua
        this.speed = 6;             // Velocidad de desplazamiento

        // [FIX-10] Dimensiones del sprite en un único lugar
        this.spriteWidth = 70;
        this.spriteHeight = 50;

        // [FIX-09] Radio de colisión basado en la mitad del ancho real del sprite.
        // Antes era 15 (nunca usado); en main.js se usaba el literal 35.
        // Ahora ambos lados leen this.radius — un único punto de verdad.
        this.radius = Math.floor(this.spriteWidth / 2); // 35
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {
        if (assets.images.tortuga) {
            // [FIX-10] Usamos las propiedades en vez de literales repetidos
            const offsetY = 10; // Compensa el espacio transparente extra del PNG

            ctx.drawImage(
                assets.images.tortuga,
                this.x - (this.spriteWidth / 2),
                this.y - (this.spriteHeight / 2) - offsetY,
                this.spriteWidth,
                this.spriteHeight
            );
        } else {
            // Fallback si la imagen no carga
            ctx.save();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }
}