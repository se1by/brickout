class Paddle {
    static get PADDLE_SPEED() {
        return 250;
    }

    constructor(game, x, y, width, height, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        // this prevents "hanging" if you switch between left and right too fast
        this.goRight = false;
        this.goLeft = false;

        this.touches = {};

        if (window.isMobileOrTablet()) {
            //window.addEventListener("devicemotion", this.deviceMotion.bind(this), false);
            document.addEventListener("touchstart", this.touchStartHandler.bind(this), {passive: false});
            document.addEventListener("touchend", this.touchEndHandler.bind(this), {passive: false});
        } else {
            document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
            document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        }
    }

    deviceMotion(event) {
        let motion = window.innerWidth > window.innerHeight ? event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.x;
        if (Math.abs(motion) < 0.5) {
            this.goLeft = false;
            this.goRight = false;
            return;
        }
        if (motion < 0) {
            this.goLeft = true;
        } else {
            this.goRight = true;
        }
    }

    touchStartHandler(event) {
        event.preventDefault();
        if (event.targetTouches[0].length > 0) {
            return;
        }
        for (let i = 0; i < event.touches.length; i++) {
            let touch = event.touches[i];
            if (touch.screenX < window.innerWidth / 2) {
                this.goLeft = true;
                touch.direction = "left";
            } else {
                this.goRight = true;
                touch.direction = "right";
            }
            this.touches[touch.identifier] = touch;
        }
    }

    touchEndHandler(event) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = this.touches[event.changedTouches[i].identifier];
            if (touch === null) {
                continue;
            }
            if (touch.direction === "left") {
                this.goLeft = false;
            } else {
                this.goRight = false;
            }
            delete this.touches[touch.identifier];
        }
    }

    keyDownHandler(event) {
        if (event.key === "ArrowRight") {
            this.goRight = true;
        }
        if (event.key === "ArrowLeft") {
            this.goLeft = true;
        }
    }

    keyUpHandler(event) {
        if (event.key === "ArrowRight") {
            this.goRight = false;
        }
        if (event.key === "ArrowLeft") {
            this.goLeft = false;
        }
    }

    update(delta, xBound) {
        let paddleSpeed = this.goRight ? Paddle.PADDLE_SPEED : this.goLeft ? -Paddle.PADDLE_SPEED : 0;
        this.x += paddleSpeed * delta / 1000;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > xBound - this.width) {
            this.x = xBound - this.width;
        }

        // are we pushing some balls?
        let that = this;
        this.game.balls.forEach(function (ball) {
            if (ball.intersects(that.x, that.y, that.x + that.width, that.y + that.height)) {
                // pushing from left
                if (Math.abs(that.x - ball.x) < Math.abs(that.x + that.width - ball.x)) {
                    ball.x = that.x - ball.radius - 1;
                    if (ball.xSpeed > 0) {
                        ball.xSpeed = -ball.xSpeed;
                    }
                } else {
                    ball.x = that.x + that.width + ball.radius + 1;
                    if (ball.xSpeed < 0) {
                        ball.xSpeed = -ball.xSpeed;
                    }
                }
            }
        });
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export default Paddle;
