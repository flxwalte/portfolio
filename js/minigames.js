/* ============================================================
   DLBAS PRO ARCADE - LOGIC & PIXEL ART
   ============================================================ */
let gameLoop = null;
const KEYS = {};
window.onkeydown = e => { 
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
    KEYS[e.code] = true; 
};
window.onkeyup = e => KEYS[e.code] = false;

// --- JUEGO 1: "THE DEBUGGER" (Dungeon Crawler de 1 Bit) ---
// Tienes que encontrar la "Llave de Oro" y llegar al "Portal de Salida"
window.initGame1 = function() {
    const cvs = document.getElementById('m1');
    const ctx = cvs.getContext('2d');
    cvs.width = 300; cvs.height = 300;

    let map = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1],
    ];
    let p = { x: 1, y: 1 }, key = false, exit = { x: 8, y: 7 };
    let count = 0;

    function draw() {
        if(++count < 8) { gameLoop = requestAnimationFrame(draw); return; }
        count = 0;

        // Movimiento por grid
        let nx = p.x, ny = p.y;
        if(KEYS['ArrowUp']) ny--;
        if(KEYS['ArrowDown']) ny++;
        if(KEYS['ArrowLeft']) nx--;
        if(KEYS['ArrowRight']) nx++;

        if(map[ny][nx] === 0) { p.x = nx; p.y = ny; }
        if(p.x === 8 && p.y === 1) key = true;
        if(key && p.x === exit.x && p.y === exit.y) {
            DlbasBot.say("<b>SISTEMA REPARADO:</b> Has escapado del bug.", 'b');
            cancelAnimationFrame(gameLoop); return;
        }

        ctx.fillStyle = "#000"; ctx.fillRect(0,0,300,300);
        for(let y=0; y<10; y++){
            for(let x=0; x<10; x++){
                if(map[y][x] === 1) {
                    ctx.fillStyle = "#333";
                    ctx.fillRect(x*30, y*30, 28, 28);
                }
            }
        }
        // Llave
        if(!key) { ctx.fillStyle = "#ff0"; ctx.fillRect(8*30+10, 1*30+10, 10, 10); }
        // Salida
        ctx.fillStyle = key ? "#0f0" : "#f00";
        ctx.fillRect(exit.x*30+5, exit.y*30+5, 20, 20);
        // Jugador
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(p.x*30+5, p.y*30+5, 20, 20);
        
        gameLoop = requestAnimationFrame(draw);
    }
    draw();
};

// --- JUEGO 2: "CODE INVADERS" (Shooter con Partículas) ---
window.initGame2 = function() {
    const cvs = document.getElementById('m2');
    const ctx = cvs.getContext('2d');
    cvs.width = 300; cvs.height = 300;

    let player = { x: 140, y: 260, w: 20 };
    let bullets = [], enemies = [], particles = [];

    function spawnEnemy() {
        enemies.push({ x: Math.random()*260, y: -20, speed: 1 + Math.random()*2 });
    }

    function update() {
        ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(0,0,300,300);

        // Controles
        if(KEYS['ArrowLeft'] && player.x > 0) player.x -= 5;
        if(KEYS['ArrowRight'] && player.x < 280) player.x += 5;
        if(KEYS['Space'] && bullets.length < 5) {
            bullets.push({ x: player.x+10, y: player.y });
            playS(800, 'square', 0.05);
            KEYS['Space'] = false; // Disparo semi-auto
        }

        // Balas
        bullets.forEach((b, i) => {
            b.y -= 7;
            ctx.fillStyle = "#fff"; ctx.fillRect(b.x, b.y, 2, 10);
            if(b.y < 0) bullets.splice(i, 1);
        });

        // Enemigos (Bugs de código)
        if(Math.random() < 0.03) spawnEnemy();
        enemies.forEach((e, ei) => {
            e.y += e.speed;
            ctx.fillStyle = "#ff4444";
            ctx.font = "12px monospace";
            ctx.fillText("BUG", e.x, e.y);

            // Colisión bala
            bullets.forEach((b, bi) => {
                if(b.x > e.x && b.x < e.x+30 && b.y > e.y-10 && b.y < e.y) {
                    enemies.splice(ei, 1);
                    bullets.splice(bi, 1);
                    playS(200, 'sawtooth', 0.1);
                }
            });
            if(e.y > 300) { cancelAnimationFrame(gameLoop); DlbasBot.say("CRASH: Los bugs infectaron el kernel.", 'b'); }
        });

        // Jugador
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(player.x, player.y, 20, 10);
        ctx.fillRect(player.x+8, player.y-5, 4, 5);

        gameLoop = requestAnimationFrame(update);
    }
    update();
};