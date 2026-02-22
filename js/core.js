/* ============================================================
   DLBAS CORE OS v4.5 - FINAL ADAPTED
   ============================================================ */

// --- 1. CONFIGURACIÓN DE AUDIO ---
let audioCtx = null, isMuted = false;
function initA() { if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playS(f, t, d, v=0.05, s=0){ 
    if(!audioCtx || isMuted) return; 
    const o=audioCtx.createOscillator(), g=audioCtx.createGain(); 
    o.type=t; 
    o.frequency.setValueAtTime(f, audioCtx.currentTime); 
    if(s) o.frequency.exponentialRampToValueAtTime(s, audioCtx.currentTime+d); 
    g.gain.setValueAtTime(v, audioCtx.currentTime); 
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime+d); 
    o.connect(g); g.connect(audioCtx.destination); 
    o.start(); o.stop(audioCtx.currentTime+d); 
}

// --- 2. SISTEMA DE CARTUCHOS PIXELADOS ---
function drawP(c, m, x, y, s, col) { 
    m.forEach((r, ri) => r.forEach((v, ci) => { 
        if(v > 0) { 
            c.fillStyle = v===2?'#2563eb':v===3?'#fff':col; 
            c.fillRect(x+(ci*s), y+(ri*s), s, s); 
        } 
    })); 
}

const gameArt = {
    1: { t: "PIXEL DINO", col: "#4ade80", m: [[0,1,1,0],[1,1,1,0],[0,1,1,1],[0,1,0,1]] },
    2: { t: "BIT SNAKE", col: "#f472b6", m: [[1,1,0,0],[0,1,1,0],[0,0,1,1],[1,1,1,1]] },
    3: { t: "BOUNCE.SYS", col: "#3b82f6", m: [[0,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,0]] },
    4: { t: "BOT CLICKER", col: "#fbbf24", m: [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]] }
};

function renderCartridges() {
    [1, 2, 3, 4].forEach(id => {
        const canvas = document.getElementById(`m${id}`);
        if(canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = 120; canvas.height = 120;
            ctx.imageSmoothingEnabled = false;
            // Fondo plástico
            ctx.fillStyle = "#2a2a2a";
            ctx.fillRect(5, 5, 110, 110);
            // Arte central
            drawP(ctx, gameArt[id].m, 35, 25, 12, gameArt[id].col);
            // Letrero Retro Rojo
            ctx.fillStyle = "#b91c1c";
            ctx.fillRect(5, 85, 110, 25);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 10px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(gameArt[id].t, 60, 102);
        }
    });
}

// --- 3. LÓGICA DE INICIO DE JUEGOS ---
function startM(id) {
    initA();
    
    // 1. DESACTIVAR JUEGO DE CABECERA
    // Suponiendo que tu juego de cabecera tiene una variable de control:
    if(window.headerGame) window.headerGame.active = false; 
    // Si usas el startGame() original, lo pausamos:
    if(typeof isPlaying !== 'undefined') isPlaying = false; 

    // 2. LIMPIAR Y ENFOCAR
    const canvas = document.getElementById(`m${id}`);
    if(canvas) {
        canvas.focus();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 3. CARGAR LÓGICA COMPLEJA
    if (typeof window["initGame" + id] === "function") {
        window["initGame" + id]();
        DlbasBot.say(`<b>MODO EXCLUSIVO:</b> Teclado vinculado al Juego ${id}.`, 'b');
    }
}

// Reactivar juego de cabecera al hacer click fuera
document.addEventListener('click', (e) => {
    if(!e.target.closest('.game-card')) {
        if(window.headerGame) window.headerGame.active = true;
    }
});

// --- 4. ASISTENTE ANALISTA TÉCNICO ---
const DlbasBot = {
    step: 'negocio',
    memoria: { rubro: '', tecnico: '', email: '' },

    init() {
        setTimeout(() => this.say("<b>[DLBAS NEURAL INTERFACE]</b> Bienvenido Walter."), 1000);
        setTimeout(() => this.say("Analizador de proyectos activo. <b>¿Cuál es tu rubro de negocio?</b>"), 2000);
    },

    say(txt, type = 'b') {
        const box = document.getElementById('chat-msgs');
        if(!box) return;
        const d = document.createElement('div');
        d.className = `m ${type}`;
        d.innerHTML = txt;
        box.appendChild(d);
        box.scrollTop = box.scrollHeight;
        if(type === 'b') playS(400, 'sine', 0.05, 0.02);
    },

    analizar(input) {
        const u = input.toLowerCase();
        if (this.step === 'negocio') {
            this.memoria.rubro = input;
            this.say(`Sector <b>${input}</b> detectado.`);
            this.say("¿Qué necesidades técnicas tienes? (Pagos, Base de datos, APIs, App móvil...)");
            this.step = 'tecnico';
        } 
        else if (this.step === 'tecnico') {
            this.memoria.tecnico = input;
            this.say("Calculando stack óptimo...");
            this.say(`Walter preparará una propuesta técnica para: <i>"${input}"</i>. ¿Tu <b>Email</b>?`);
            this.step = 'contacto';
        }
        else if (this.step === 'contacto' && u.includes("@")) {
            this.memoria.email = input;
            this.say("<b>TRANSACCIÓN COMPLETADA.</b> Walter recibirá el informe técnico en segundos.");
            this.step = 'fin';
        }
    }
};

function sendMsg() {
    const i = document.getElementById('chat-in');
    const v = i.value.trim();
    if(!v) return;
    DlbasBot.say(v, 'u');
    i.value = "";
    setTimeout(() => DlbasBot.analizar(v), 600);
}

// --- 5. ARRANQUE ---
window.addEventListener('load', () => {
    renderCartridges();
    DlbasBot.init();
    const chatInput = document.getElementById('chat-in');
    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMsg();
        });
    }
});

// UI Helpers
function toggleTheme(e) { e.stopPropagation(); document.body.classList.toggle('light-mode'); }
function toggleMute(e) { e.stopPropagation(); isMuted = !isMuted; document.getElementById('muteBtn').innerText = isMuted ? "🔇" : "🔊"; }