import Ball from './Ball.js'
import Paddle from "./Paddle.js";
import Brick from "./Brick.js";

class Game {

    constructor(ctx) {
        this.ctx = ctx;
        this.isPaused = false;
        this.isFrozen = false;
        this.paddle = new Paddle(this, 363, 570, 75, 10, "#FF00FF");

        this.balls = [];
        this.balls[0] = new Ball(this, this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, 5,
            "#" + ((1 << 24) * Math.random() | 0).toString(16), {x: 0, y: -1}, 500);

        this.bricks = [];
        let brickWidth = 70;
        let brickHeight = 20;
        let columns = 8;
        let rows = 6;
        for (let i = 0; i < rows * columns; i++) {
            this.bricks[i] = new Brick(40 + i % columns * (brickWidth + 20),
                40 + Math.floor(i / columns) * (brickHeight + 10), brickWidth, brickHeight, "#FF00FF");
        }
        this.lives = 3;
        this.score = 0;
        this.lastRun = new Date().getTime();

        if (window.isMobileOrTablet()) {
            document.getElementById("gameCanvas").ontouchstart = this.touchHandler.bind(this);
        }
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    }

    touchHandler() {
        this.isPaused = !this.isPaused;
    }

    keyDownHandler(event) {
        if (event.key === "Escape") {
            this.isPaused = !this.isPaused;
        } else if (event.key === "+") {
            this.balls.forEach(function (ball) {
                ball.xSpeed *= 2;
                ball.ySpeed *= 2;
            });
        } else if (event.key === "-") {
            this.balls.forEach(function (ball) {
                ball.xSpeed /= 2;
                ball.ySpeed /= 2;
            });
        } else if (event.key === " ") {
            this.balls.push(new Ball(this, this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, 5, "#" + ((1 << 24) * Math.random() | 0).toString(16),
                {x: 0, y: -1}, 500));
        } else if (event.key === "r") {
            this.reset();
        } else if (event.key === "f") {
            this.isFrozen = !this.isFrozen;
        }
    }

    reset() {
        this.lives = 3;
        this.score = 0;
        this.balls = [];
        this.paddle.x = this.ctx.canvas.width / 2 - this.paddle.width / 2;
        this.bricks = [];
        let brickWidth = 70;
        let brickHeight = 20;
        let columns = 8;
        let rows = 6;
        for (let i = 0; i < rows * columns; i++) {
            this.bricks[i] = new Brick(40 + i % columns * (brickWidth + 20),
                40 + Math.floor(i / columns) * (brickHeight + 10), brickWidth, brickHeight, "#FF00FF");
        }
    }

    update() {
        let delta = new Date().getTime() - this.lastRun;
        this.lastRun = new Date().getTime();

        //convenience
        let ctx = this.ctx;
        let width = 800; //ctx.canvas.width;
        let height = 600; ctx.canvas.height;

        //clear canvas
        ctx.clearRect(0, 0, width, height);
        //draw background
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();

        if (this.lives < 1) {
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.font = "bold 16px Arial";
            ctx.fillText("Game Over", (width / 2) - 40, (height / 2) - 10);
            ctx.fillText("Score: " + Math.floor(this.score), (width / 2) - 30, (height / 2) + 20);
            ctx.closePath();
            requestAnimationFrame(this.update.bind(this));
            return;
        }

        if (this.isPaused) {
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.font = "bold 16px Arial";
            ctx.fillText("Paused", (width / 2) - 20, (height / 2) + 8);
            ctx.closePath();
            requestAnimationFrame(this.update.bind(this));
            return;

        }

        document.getElementById("fpsCounter").innerHTML = "FPS: " + Math.floor(1000 / delta);
        if (this.balls.length > 0 && !this.isFrozen) {
            this.score += delta / 1000;
        }

        //draw lives count
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.fillText("Lives: " + this.lives, 10, 20);
        ctx.closePath();

        // draw score
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.font = "12 px Arial";
        ctx.fillText("Score: " + Math.floor(this.score), width - 8 * (7 + Math.floor(this.score).toString().length), 20);
        ctx.closePath();

        let that = this;
        this.balls.forEach(function (ball) {
            if (!that.isFrozen) {
                ball.update(delta);
            }
            ball.draw(ctx);
        });

        if (!this.isFrozen) {
            this.paddle.update(delta, width);
        }
        this.paddle.draw(ctx);

        let newBalls = this.balls.filter(function (element) {
            return !element.isDead;
        });

        this.lives -= (this.balls.length - newBalls.length);

        if (newBalls.length === 0) {
            newBalls.push(new Ball(this, this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, 5,
                "#" + ((1 << 24) * Math.random() | 0).toString(16), {x: 0, y: -1}, 500));
        }
        this.balls = newBalls;

        this.bricks = this.bricks.filter(function (brick) {
            return brick.alpha > 0.1;
        });

        this.bricks.forEach(function (brick) {
            brick.draw(ctx);
        });

        requestAnimationFrame(this.update.bind(this));
    }
}

export default Game;
