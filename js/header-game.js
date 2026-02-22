/**
 * HEADER-GAME.JS - "HIGH VISIBILITY EDITION"
 * Fondos azulados para resaltar al personaje blanco.
 */

(function() {
    const canvas = document.getElementById('gameCanvas');
    const bgCanvas = document.getElementById('bgCanvas');
    if (!canvas || !bgCanvas) return;

    const ctx = canvas.getContext('2d'), bgCtx = bgCanvas.getContext('2d');
    const header = document.getElementById('header');

    let gameActive = false, score = 0, level = 1, frame = 0, beat = 0;
    let obstacles = [], items = [], birds = [], bullets = [], clouds = [], stars = [];
    let lives = 3, isInvincible = false, isSuper = false, superTimer = 0, shake = 0;
    let isSlow = false, slowTimer = 0;
    let mouse = { x: 250, y: 0, dy: 0, jumps: 0, grounded: true, targetX: 250 };
    let audioCtx = null, musicTimeout = null;
    let lastTap = 0, tapCount = 0;

    const SPR = {
        mouse: [[0,0,1,1,0,0,1,1,0],[0,1,1,1,1,1,1,1,1],[0,1,1,0,1,1,1,0,1],[1,1,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[1,1,1,0,0,0,0,0,0]],
        heart: [[0,1,1,0,1,1,0],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0]],
        bird: [[1,0,0,0,1],[0,1,1,1,0],[1,1,0,1,1],[0,1,1,1,0]],
        cloud: [[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0]]
    };

    function drawP(c, m, x, y, s, color) {
        c.fillStyle = color;
        m.forEach((r, i) => r.forEach((p, j) => { if(p) c.fillRect(x+(j*s), y+(i*s), s, s); }));
    }

    let cityBuildings = [];
    function generateCity() {
        cityBuildings = [];
        // Colores de edificios oscuros para contraste
        const themes = [["#0f172a", "#1e293b", "#334155"], ["#2d1b14", "#432818", "#1e1b4b"], ["#1e1b4b", "#312e81", "#4338ca"]];
        const colors = themes[(level - 1) % themes.length] || themes[0];
        for(let i=0; i<35; i++) cityBuildings.push({ x: i*120, w: 60+Math.random()*80, h: 40+Math.random()*180, c: colors[Math.floor(Math.random()*colors.length)] });
    }

    function playNote(f, t, v, d) {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = t; o.frequency.value = f;
            g.gain.setValueAtTime(v, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(); o.stop(audioCtx.currentTime + d);
        } catch(e){}
    }

    function musicEngine() {
        if (!gameActive) return;
        const scale = [261.63, 329.63, 392.00, 440.00, 523.25];
        let bpm = (isSuper ? 200 : 110) + (level * 10);
        let tempo = 60 / bpm;
        if (beat % 4 === 0) playNote(60, 'triangle', 0.15, 0.1);
        if (beat % 2 === 0) playNote(scale[beat % 5], 'sine', 0.07, 0.2);
        beat++;
        musicTimeout = setTimeout(musicEngine, tempo * 500);
    }

    function render() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        // CIELO AZUL OSCURO (Para que resalte el blanco)
        bgCtx.fillStyle = isSuper ? "#1e1b4b" : (isSlow ? "#0c4a6e" : "#050a15"); 
        bgCtx.fillRect(0,0,bgCanvas.width, bgCanvas.height);
        
        // ESTRELLAS CON TINTE AZUL
        stars.forEach(s => { 
            s.x -= s.v; 
            if(s.x < 0) s.x = bgCanvas.width; 
            bgCtx.fillStyle = `rgba(180, 220, 255, ${s.a})`; 
            bgCtx.fillRect(s.x, s.y, 2, 2); 
        });

        const h = canvas.height;
        let normalSpeed = 4 + (level * 0.8);
        let currentSpeed = normalSpeed;
        if (isSuper) currentSpeed = normalSpeed * 2;
        else if (isSlow) currentSpeed = 4 + ((level - 1) * 0.8);

        cityBuildings.forEach(b => {
            b.x -= currentSpeed;
            if (b.x + b.w < -100) b.x = canvas.width + 100;
            ctx.fillStyle = b.c; ctx.fillRect(Math.floor(b.x), h - b.h - 30, Math.floor(b.w), b.h);
        });

        // NUBES AZULADAS
        clouds.forEach(c => { 
            c.x -= c.v; 
            if(c.x < -100) c.x = canvas.width + 100; 
            drawP(ctx, SPR.cloud, c.x, c.y, 8, "rgba(0, 225, 255, 0.2)"); 
        });

        if (gameActive) {
            frame++;
            if(shake > 0) shake *= 0.8;
            ctx.save(); ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake);
            ctx.fillStyle = "#0f172a"; ctx.fillRect(0, h-30, canvas.width, 30); // Suelo azul muy oscuro

            mouse.dy += 0.7; mouse.y += mouse.dy;
            if (mouse.y > h - 100) { mouse.y = h - 100; mouse.dy = 0; mouse.grounded = true; mouse.jumps = 0; }
            if (mouse.x < mouse.targetX) mouse.x += 1;

            if(isSuper) { superTimer--; if(superTimer <= 0) isSuper = false; }
            if(isSlow) { slowTimer--; if(slowTimer <= 0) isSlow = false; }

            let spawnRate = Math.max(50, 160 - (level * 15));
            if (frame % spawnRate === 0) {
                let r = Math.random();
                let type = (r < 0.1) ? "super" : (r < 0.22 && level > 1) ? "slow" : "norm";
                obstacles.push({ x: canvas.width + 100, t: type === "super" ? "</SUPER>" : (type === "slow" ? "<SLOW/>" : "<div>"), type: type });
            }

            if (frame % 500 === 0) birds.push({x: canvas.width + 100, y: h-190-Math.random()*60, v: 3+level});
            if (frame % 800 === 0) items.push({x: canvas.width + 100, y: h-160});

            obstacles.forEach((o, i) => {
                o.x -= currentSpeed + 1;
                ctx.fillStyle = o.type === "super" ? "#fde047" : (o.type === "slow" ? "#22d3ee" : "#4ade80");
                ctx.font = "bold 20px monospace"; ctx.fillText(o.t, o.x, h - 55);
                
                if (mouse.x < o.x + 50 && mouse.x + 45 > o.x && mouse.y + 45 > h - 100) {
                    if (o.type === "super") { isSuper = true; isSlow = false; superTimer = 600; obstacles.splice(i, 1); playNote(600, 'square', 0.2, 0.2); }
                    else if (o.type === "slow") { if(!isSuper) { isSlow = true; slowTimer = 900; } obstacles.splice(i, 1); playNote(200, 'sine', 0.2, 0.5); }
                    else if (!isInvincible && !isSuper) {
                        lives--; updateUI(); 
                        if (lives <= 0) endGame();
                        else { isInvincible = true; setTimeout(() => isInvincible = false, 1500); obstacles.splice(i, 1); shake = 20; }
                    }
                }
                if (o.x < -150) { obstacles.splice(i,1); score += isSuper ? 2 : 1; updateUI(); }
            });

            birds.forEach((b, i) => {
                b.x -= currentSpeed + 2; 
                drawP(ctx, SPR.bird, b.x, b.y, 7, "#ef4444");
                if (mouse.x < b.x + 40 && mouse.x + 40 > b.x && mouse.y < b.y + 40 && mouse.y + 40 > b.y) {
                    if (isSuper) { birds.splice(i, 1); score += 4; }
                    else if (!isInvincible) {
                        lives--; updateUI();
                        if (lives <= 0) endGame();
                        else { isInvincible = true; birds.splice(i,1); setTimeout(()=>isInvincible=false, 1500); }
                    }
                }
            });

            bullets.forEach((b, i) => {
                b.x += 18; ctx.fillStyle = "#fff"; ctx.fillRect(b.x, b.y, 15, 5);
                birds.forEach((bird, bi) => { if (b.x > bird.x && b.x < bird.x + 40 && b.y > bird.y && b.y < bird.y + 40) { birds.splice(bi, 1); bullets.splice(i, 1); score += (isSuper ? 10 : 5); updateUI(); } });
                if(b.x > canvas.width) bullets.splice(i, 1);
            });

            items.forEach((it, i) => {
                it.x -= currentSpeed; drawP(ctx, SPR.heart, it.x, it.y, 4, "#f43f5e");
                if (mouse.x < it.x + 40 && mouse.x + 40 > it.x && mouse.y < it.y + 40 && mouse.y + 40 > it.y) { lives++; updateUI(); items.splice(i, 1); playNote(800, 'sine', 0.2, 0.1); }
            });

            // PERSONAJE BLANCO (Resaltado sobre fondo azul)
            let mouseColor = isSuper ? (frame % 6 < 3 ? "#fde047" : "#ef4444") : (isSlow ? "#22d3ee" : "#ffffff");
            ctx.globalAlpha = isInvincible ? (frame % 10 < 5 ? 0.3 : 1) : 1;
            drawP(ctx, SPR.mouse, mouse.x, mouse.y, 6, mouseColor);
            ctx.restore();
        } else {
            drawP(ctx, SPR.mouse, 250, h - 100, 6, "#ffffff");
        }
        requestAnimationFrame(render);
    }

    function updateUI() {
        document.getElementById('score').innerText = score;
        let nl = Math.floor(score/20) + 1;
        if(nl !== level) { level = nl; generateCity(); } 
        document.getElementById('lvl').innerText = level;
        document.getElementById('lives').innerText = "❤".repeat(Math.max(0, lives));
    }

    function startGame() {
        score=0; level=1; frame=0; lives=3; obstacles=[]; items=[]; birds=[]; bullets=[]; isSlow=false; isSuper=false;
        generateCity(); gameActive=true; updateUI();
        document.getElementById('gameOverlay').classList.add('hidden');
        document.getElementById('mainBtn').style.display="none";
        document.getElementById('exitBtn').style.display="block";
        beat = 0; musicEngine();
    }

    function endGame() {
        gameActive = false; clearTimeout(musicTimeout);
        document.getElementById('gameOverlay').classList.remove('hidden');
        document.getElementById('mainBtn').style.display="block";
        document.getElementById('exitBtn').style.display="none";
        // Dentro de endGame()
if(window.DlbasBot) {
    DlbasBot.say(`¡Game Over! Puntuación: ${score}. Casi tan difícil como depurar un bug, ¿verdad?`);
}
    }

    window.addEventListener("keydown", e => {
        if (e.target.id === 'chat-in') return; // BLOQUEO SI ESCRIBE EN EL BOT
        if (!gameActive && e.code === "Space") startGame();
        if (!gameActive) return;
        if (e.code === "Space" || e.code === "ArrowUp") {
            e.preventDefault();
            const now = Date.now();
            if (now - lastTap < 350) {
                tapCount++;
                if (tapCount >= 2) { bullets.push({x: mouse.x+40, y: mouse.y+15}); playNote(1000, 'square', 0.1, 0.05); tapCount = 0; }
            } else { tapCount = 0; }
            lastTap = now;
            if (mouse.grounded) { mouse.dy = -14; mouse.grounded = false; mouse.jumps = 1; }
            else if (mouse.jumps < 2) { mouse.dy = -11; mouse.jumps = 2; }
        }
    });

    for(let i=0; i<50; i++) stars.push({x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, v: 0.5+Math.random(), a: Math.random()});
    for(let i=0; i<5; i++) clouds.push({x: Math.random()*window.innerWidth, y: 40+Math.random()*80, v: 0.2+Math.random()*0.3});
    canvas.width = header.offsetWidth; canvas.height = header.offsetHeight;
    bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight;
    document.getElementById('mainBtn').onclick = startGame;
    document.getElementById('exitBtn').onclick = endGame;
    generateCity(); render();
})();


