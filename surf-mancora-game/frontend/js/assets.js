/**
 * assets.js
 * Gestiona la precarga de imágenes antes de iniciar el juego.
 */
class AssetManager {
    constructor() {
        this.images = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    /**
     * Carga una imagen de forma asíncrona y la almacena por nombre.
     *
     * @param {string} name - Clave para acceder a la imagen (ej: 'surfer')
     * @param {string} src  - Ruta del archivo de imagen
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(name, src) {
        this.totalAssets++;
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.images[name] = img;
                this.loadedAssets++;
                this.updateProgressBar();
                resolve(img);
            };
            img.onerror = (e) => reject(e);
        });
    }

    /**
     * [FIX-18] Dibuja una barra de progreso real en el canvas
     * mientras se cargan los assets. Antes solo hacía console.log.
     */
    updateProgressBar() {
        const canvas = document.getElementById('surfCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const percentage = this.loadedAssets / this.totalAssets;

        const barWidth = 300;
        const barHeight = 20;
        const barX = (canvas.width - barWidth) / 2;
        const barY = (canvas.height - barHeight) / 2;

        // Fondo del canvas durante la carga
        ctx.fillStyle = '#1a2a3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Título
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏄 Cargando Máncora...', canvas.width / 2, barY - 20);
        ctx.restore();

        // Barra de fondo (gris)
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 10);
        ctx.fill();
        ctx.restore();

        // Barra de progreso (azul mar)
        ctx.save();
        ctx.fillStyle = '#006994';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth * percentage, barHeight, 10);
        ctx.fill();
        ctx.restore();

        // Porcentaje en texto
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${Math.floor(percentage * 100)}%`,
            canvas.width / 2,
            barY + barHeight + 20
        );
        ctx.restore();
    }
}

// Instancia global
const assets = new AssetManager();