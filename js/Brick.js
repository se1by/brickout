class Brick {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = 1;
    }

    kill() {
        this.alpha = 0.99;
    }

    draw(ctx) {
        if (this.alpha < 1) {
            this.alpha *= 0.95;
            this.y += 5;
        }

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.rgbaColor();
        ctx.fill();
        ctx.closePath();
    }

    rgbaColor() {
        let r = parseInt(this.color.slice(1, 3), 16);
        let g = parseInt(this.color.slice(3, 5), 16);
        let b = parseInt(this.color.slice(5, 7), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + this.alpha + ")";
    }
}

export default Brick;
