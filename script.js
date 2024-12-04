const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.1,
    lift: -3,
    velocity: 0
};

const birdImage = new Image();
birdImage.src = '/bat.svg';

const pipes = [];
const pipeWidth = 20;
const pipeGap = bird.height * 4;
let frame = 0;
let score = 0;
let highscore = 0;

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'rgb(143, 60, 255)';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Highscore: ${highscore}`, canvas.width - 150, 30);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }
}

function updatePipes() {
    if (frame % 120 === 0) {
        const top = Math.random() * (canvas.height / 2);
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 1;
    });

    if (pipes.length && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            resetGame();
        } else if (pipe.x + pipeWidth === bird.x) {
            updateScore();
        }
    });
}

function updateScore() {
    score++;
    if (score > highscore) {
        highscore = score;
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    score = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
}

function update() {
    updateBird();
    updatePipes();
    checkCollision();
}

function loop() {
    draw();
    update();
    frame++;
    requestAnimationFrame(loop);
}

window.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

canvas.addEventListener('touchstart', () => {
    bird.velocity = bird.lift;
});

canvas.addEventListener('mousedown', () => {
    bird.velocity = bird.lift;
});

loop();
