class Ball {
    constructor(game, x, y, radius, color, direction, velocity) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.direction = direction;
        this.velocity = velocity;
        this.isDead = false;
    }

    update(delta) {
        if (this.isDead) {
            return;
        }
        // normalize direction vector
        let tempX = this.direction.x / (Math.abs(this.direction.x) + Math.abs(this.direction.y));
        let tempY = this.direction.y / (Math.abs(this.direction.x) + Math.abs(this.direction.y));
        this.direction.x = tempX;
        this.direction.y = tempY;

        let xDistance = (this.direction.x * this.velocity) * delta / 1000;
        let yDistance = (this.direction.y * this.velocity) * delta / 1000;
        let xBound = 800;// this.game.ctx.canvas.width;
        let yBound = 600; //this.game.ctx.canvas.height;

        let beforeX = this.x;
        let beforeY = this.y;
        this.x += xDistance;
        if (this.x < this.radius) {
            this.x = this.radius;
            this.direction.x = -this.direction.x;
        } else if (this.x > xBound - this.radius) {
            this.x = xBound - this.radius;
            this.direction.x = -this.direction.x;
        }

        this.y += yDistance;
        if (this.y < this.radius) {
            this.y = this.radius;
            this.direction.y *= -1;
        } else if (this.y > yBound + this.radius) {
            this.isDead = true;
        }

        let paddle = this.game.paddle;

        // We hit the paddle
        if (this.intersects(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y + paddle.height)) {
            let intersectsTop = beforeY + this.radius < paddle.y && this.y + this.radius >= paddle.y;
            let intersectsBottom = beforeY - this.radius > paddle.y + paddle.height && this.y - this.radius <= paddle.y + paddle.height;
            let intersectsLeft = beforeX + this.radius < paddle.x && this.x + this.radius >= paddle.x;
            let intersectsRight = beforeX - this.radius > paddle.x + paddle.width && this.x - this.radius <= paddle.x + paddle.width;

            if (intersectsTop) {
                this.y = paddle.y - this.radius - 1;
                this.direction.x = -(paddle.x + paddle.width / 2 - this.x) / paddle.width * 2;
                this.direction.y = Math.abs(this.direction.x) - 1;
            } else if (intersectsBottom) {
                this.direction.y = -this.direction.y;
                this.y = paddle.y + paddle.height + this.radius + 1;
            }
            if (intersectsLeft) {
                this.direction.x = -this.direction.x;
                this.x = paddle.x - this.radius - 1;
            } else if (intersectsRight) {
                this.direction.x = -this.direction.x;
                this.x = paddle.x + paddle.width + this.radius + 1;
            }
        }

        // Check if we hit a brick
        let that = this;
        this.game.bricks.forEach(function (brick) {
            if (brick.alpha < 1) {
                return;
            }
            if (that.intersects(brick.x, brick.y, brick.x + brick.width, brick.y + brick.height)) {
                let intersectsTop = beforeY + that.radius < brick.y && that.y + that.radius >= brick.y;
                let intersectsBottom = beforeY - that.radius > brick.y + brick.height && that.y - that.radius <= brick.y + brick.height;
                let intersectsLeft = beforeX + that.radius < brick.x && that.x + that.radius >= brick.x;
                let intersectsRight = beforeX - that.radius > brick.x + brick.width && that.x - that.radius <= brick.x + brick.width;

                if (intersectsTop || intersectsBottom) {
                    that.direction.y = -that.direction.y;
                }
                if (intersectsLeft || intersectsRight) {
                    that.direction.x = -that.direction.x;
                }
                brick.kill();
                that.game.score += 10;
            }
        })
    }

    intersects(startX, startY, endX, endY) {
        return this.x + this.radius >= startX && this.x - this.radius <= endX
            && this.y + this.radius >= startY && this.y - this.radius <= endY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export default Ball;
