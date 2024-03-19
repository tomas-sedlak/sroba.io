let canvas;
let ctx;
let width;
let height;
let centerX;
let centerY;
let dx = 0;
let dy = 0;
let playerX = 0;
let playerY = 0;
let playerRadius = 64;
let maxSpeed = 4;
let playerColor;
let username;
let blobs = [];
let playing = false;

const gui = document.getElementById("gui");
const tileSize = 50;

function start() {
    const usernameInput = document.getElementById("username");
    const colorInput = document.getElementById("color");

    if (usernameInput.value != "") {
        username = usernameInput.value;
        playerColor = colorInput.value;
        gui.style.display = "none";
        playing = true;
    }
}

function init() {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = Math.floor(width / 2);
    centerY = Math.floor(height / 2);
    generateBlobs();

    requestAnimationFrame(gameLoop);
}

function randomColor() {
    let r = 255 * Math.random();
    let g = 255 * Math.random();
    let b = 255 * Math.random();
    return `rgb(${r}, ${g}, ${b})`;
}

function generateBlobs() {
    for (let i = 0; i < 300; i++) {
        const x = Math.floor(Math.random() * width * 3);
        const y = Math.floor(Math.random() * height * 3);
        const color = randomColor();

        blobs.push({
            x: x,
            y: y,
            r: 15,
            color: color,
        })
    }
}

function drawCircle(x, y, r, color, fill = true) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    fill ? ctx.fill() : ctx.stroke();
}

function drawBackground() {
    let bgOffsetX = -playerX % (tileSize);
    let bgOffsetY = -playerY % (tileSize);
    const rowCount = Math.floor(height / (tileSize)) + 2;
    const colCount = Math.floor(width / (tileSize)) + 2;

    for (let row = -1; row < rowCount; row++) {
        for (let col = -1; col < colCount; col++) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#eee";
            ctx.strokeRect(bgOffsetX + col * tileSize, bgOffsetY + row * tileSize, tileSize, tileSize);
        }
    }
}

function drawBlobs() {
    for (let i = 0; i < blobs.length; i++) {
        drawCircle(-playerX + blobs[i].x, -playerY + blobs[i].y, blobs[i].r, blobs[i].color);
    }
}

function drawPlayer() {
    drawCircle(centerX, centerY, playerRadius, playerColor);

    ctx.font = playerRadius / 64 * 24 + "px Fredoka";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeText(username, centerX, centerY);
    ctx.fillStyle = "white";
    ctx.fillText(username, centerX, centerY);
}

function increaseSize(r) {
    let sum = Math.PI * playerRadius * playerRadius + Math.PI * r * r;
    playerRadius = Math.sqrt(sum / Math.PI);
}

function collision() {
    for (let i = 0; i < blobs.length; i++) {
        let x = playerX + centerX - blobs[i].x;
        let y = playerY + centerY - blobs[i].y;
        let hyp = Math.sqrt(x * x + y * y);

        if (hyp <= playerRadius) {
            increaseSize(blobs[i].r);
            blobs.splice(i, 1);
        }
    }
}

function update() {
    collision();

    playerX += dx;
    playerY += dy;
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawBlobs();
    drawPlayer();
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("mousemove", (event) => {
    if (playing) {
        let x = event.offsetX - centerX;
        let y = event.offsetY - centerY;
        let hyp = Math.sqrt(x * x + y * y);

        dx = x * maxSpeed / hyp;
        dy = y * maxSpeed / hyp;
    }
})

document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
        dx = 0;
        dy = 0;
        playing = !playing;
    }
})

onload = init;