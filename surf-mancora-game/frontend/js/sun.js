class Sun {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();

        // Rayos
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 / 8) * i;

            let x1 = this.x + Math.cos(angle) * 25;
            let y1 = this.y + Math.sin(angle) * 25;

            let x2 = this.x + Math.cos(angle) * 35;
            let y2 = this.y + Math.sin(angle) * 35;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "orange";
            ctx.stroke();
        }
    }
}