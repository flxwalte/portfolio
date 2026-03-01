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

/* ============================================================
   DLBAS MOUSE-64: HTML QUEST - FINAL STABILITY
   - Suelo Planta Baja 100% Sólido (No más caídas).
   - Hueco de escalera solo en el techo (Piso 1).
   - 12 Estrellas y Etiquetas repartidas.
   ============================================================ */

(function initEngine() {
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => { window.startMouseAdventure = renderGame; };
        document.head.appendChild(script);
    } else {
        window.startMouseAdventure = renderGame;
    }
})();

function renderGame() {
    let container = document.getElementById('mouse-game-container') || document.createElement('div');
    container.id = 'mouse-game-container';
    document.body.appendChild(container);
    container.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:99999; background:#87CEEB; overflow:hidden; display:block;";
    container.innerHTML = ""; 

    const ui = document.createElement('div');
    ui.style = "position:absolute; top:20px; left:20px; color:#fff; font-family:monospace; z-index:10000; text-shadow:2px 2px #000; font-size:18px;";
    ui.id = "mouse-ui";
    ui.innerHTML = "ESTRELLAS: 0/12 | TAGS: 0";
    container.appendChild(ui);

    // Mapa expandido con 12 estrellas 'E' y múltiples etiquetas '#'
    const WORLD_MAP = [
        [
            "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
            "tssssssssssEssssssssssssssssssssEsssssssssssssssssssssssst",
            "ts000000000000000000000000000000000000000000000000000000st",
            "ts00E00000000000000000000000000000000000000000000000E000st",
            "ts000000000000000000000000000000000000000000000000000000st",
            "ts000000000000000000mrrrm0000000000000000000000000000000st",
            "tlllllllllllmrrrmlllllllllllllllllllllllllllllllll0000000t",
            "t00000000000mrrrm0000000000000000000000000000000000000000t",
            "t00000000000mrrrm0000000000000000000000000000000000000000t",
            "t000tttttttttteeetttttttttttttttttttttttttttttttt00000000t",
            "t000tsssssstssssskkkkkkstssssssssss#sssssssssssst00000000t",
            "t000tsssssstsssssssssssstssssssssssssssssssssssst00000000t",
            "t000tsssssstsssssssssssstssssssssss#sssssssssssst00000000t",
            "t000tssssss#ssssssssssssDssssssssssssssssssssssst00000000t",
            "t000tsssssstsssssssssssstssssssssssssssssssssssst00000000t",
            "t000tsssssstssssssssssssttttttsttttttsttttttttttt00000000t",
            "t000tsssssstsssssssssssstEsssssstssssssstsssssst00000000t",
            "t000ttssttttssssssssssssssssssssstssssssstsssssst00000000t",
            "t000tssssssssssssssssssstsssssssstsssssssssssssst00000000t",
            "t000tssssssssssssssssssstsssssssssssssssstsssssst00000000t",
            "t000tkkkkkkkkssssssssssstsssssssstssssssstsssssst00000000t",
            "t000ttttttttttttttttttttttttttttttttttttttttttttt00000000t",
            "tlllllllllllllllllllllllllllllllllllllllllllllllllllllllllt"
        ],
        [
            "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
            "tssssssEssssssssssssstssssssssssstssssssssssEsssssssssssst",
            "ts0000000000000000000t00000000000t0000000000000000000000st",
            "ts00E0000000000000000D00000E00000D000000000000000000E000st",
            "ts0000000000000000000t00000000000t0000000000000000000000st",
            "tsssssssssssssssssssstssssssssssstssssssssssssssssssssssst",
            "tsssssssssssssssssssssssssssssssssssssssssssssssssssssssst",
            "tsssss#ssssssssssssssssssssssssss#ssssssssssssss#sssssssst",
            "tsssssssssssssssssssssssssssssssssssssssssssssssssssssssst",
            "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
            "tsssssstsssssssssssstssssssssssssssssssssssst000000000000t",
            "tsssssstsssssssssssstssssssssssssssssssssssst000000000000t",
            "tsssssstsssssssssssstssssssssssssssssssssssst000000000000t",
            "tsssssssssssssssssssssssssssssssstsssssssssst000000000000t",
            "tsssssstsssssssssssstssssssssssssssssssssssst000000000000t",
            "tsssssstssssssssssssttttttsttttttsttttttttttt000000000000t",
            "tsssssstsssssssssssstEsssssstssssssstsssssst000000000000t",
            "ttssttttssssssssssssssssssssstssssssstsssssst000000000000t",
            "tssssssssssssssssssstsssssssstsssssssssssssst000000000000t",
            "tssssssssssssssssssstsssssssssssssssstsssssst000000000000t",
            "tssssssssssssssssssstsssssssstssssssstEssssst000000000000t",
            "ttttttttttttttttttttttttttttttttttttttttttttt000000000000t",
            "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"
        ]
    ];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); 
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const collidables = [];
    const wallMeshes = [];
    const lavaZones = [];
    const interactables = []; 
    const grid = 5;
    const floorHeight = 15;
    let spawnPoint = new THREE.Vector3(0, 5, 0);
    let inventory = { stars: 0, tags: [] };

    const pixTex = (c1, c2) => {
        const canv = document.createElement('canvas'); canv.width = 8; canv.height = 8;
        const x = canv.getContext('2d'); x.fillStyle = c1; x.fillRect(0,0,8,8);
        x.fillStyle = c2; x.fillRect(0,0,4,4); x.fillRect(4,4,4,4);
        const t = new THREE.CanvasTexture(canv); t.magFilter = THREE.NearestFilter; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2,2); return t;
    };

    const wallMat = new THREE.MeshStandardMaterial({map: pixTex('#ff7675', '#d63031')});
    const floorMat = new THREE.MeshStandardMaterial({map: pixTex('#55efc4', '#00b894')});

    WORLD_MAP.forEach((piso, y) => {
        piso.forEach((row, z) => {
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                if (char === '0') continue;
                const px = (x - row.length/2) * grid;
                const pz = (z - piso.length/2) * grid;
                const py = y * floorHeight;

                // --- SOLUCIÓN HUECO SEGURA ---
                // Solo creamos el hueco si estamos en el PISO 1 (y === 1) 
                // para que el jugador pueda bajar al PISO 0 a través de él.
                if (y === 1 && char === 's' && x >= 23 && x <= 28 && z >= 11 && z <= 12) continue;

                if (char === 't' || char === 'm') {
                    const tMesh = new THREE.Mesh(new THREE.BoxGeometry(grid, floorHeight, grid), wallMat);
                    tMesh.position.set(px, py + floorHeight/2, pz);
                    scene.add(tMesh);
                    collidables.push(new THREE.Box3().setFromObject(tMesh));
                    wallMeshes.push(tMesh);
                } else if (char === 's' || char === 'r' || char === 'e') {
                    const floorBase = new THREE.Mesh(new THREE.BoxGeometry(grid, 1, grid), floorMat);
                    floorBase.position.set(px, py, pz);
                    scene.add(floorBase);
                    collidables.push(new THREE.Box3().setFromObject(floorBase));
                    if(char === 'r' && y === 0) spawnPoint.set(px, py + 5, pz);
                } else if (char === 'k') {
                    for(let i=0; i<10; i++) {
                        let step = new THREE.Mesh(new THREE.BoxGeometry(grid, 1, grid/2), new THREE.MeshStandardMaterial({color: 0x885522}));
                        step.position.set(px, py + (i * 1.5), pz - (i * 1.5));
                        scene.add(step);
                        collidables.push(new THREE.Box3().setFromObject(step));
                    }
                } else if (char === 'l') {
                    const lMesh = new THREE.Mesh(new THREE.BoxGeometry(grid, 1, grid), new THREE.MeshStandardMaterial({color: 0xff1100, emissive: 0xff1100}));
                    lMesh.position.set(px, py - 0.5, pz);
                    scene.add(lMesh);
                    lavaZones.push(new THREE.Box3().setFromObject(lMesh));
                } else if (char === 'E') {
                    const star = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0xffff00}));
                    star.position.set(px, py + 3, pz);
                    star.userData = { type: 'star' };
                    scene.add(star);
                    interactables.push(star);
                    // Suelo bajo la estrella para no caer
                    const sUnder = new THREE.Mesh(new THREE.BoxGeometry(grid, 1, grid), floorMat);
                    sUnder.position.set(px, py, pz);
                    scene.add(sUnder);
                    collidables.push(new THREE.Box3().setFromObject(sUnder));
                } else if (char === '#') {
                    const tag = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.2), new THREE.MeshStandardMaterial({color: 0x00ff00}));
                    tag.position.set(px, py + 3, pz);
                    tag.userData = { type: 'tag' };
                    scene.add(tag);
                    interactables.push(tag);
                    // Suelo bajo la etiqueta
                    const sUnder = new THREE.Mesh(new THREE.BoxGeometry(grid, 1, grid), floorMat);
                    sUnder.position.set(px, py, pz);
                    scene.add(sUnder);
                    collidables.push(new THREE.Box3().setFromObject(sUnder));
                } else if (char === 'D') {
                    const door = new THREE.Mesh(new THREE.BoxGeometry(grid, floorHeight, 1), new THREE.MeshStandardMaterial({color: 0x0984e3, transparent: true, opacity: 0.8}));
                    door.position.set(px, py + floorHeight/2, pz);
                    door.userData = { type: 'door' };
                    scene.add(door);
                    interactables.push(door);
                    collidables.push(new THREE.Box3().setFromObject(door));
                }
            }
        });
    });

    const mouse = new THREE.Group();
    mouse.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 2), new THREE.MeshStandardMaterial({color: 0xffffff})));
    mouse.position.copy(spawnPoint);
    scene.add(mouse);

    const raycaster = new THREE.Raycaster(); 
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.PointLight(0xffffff, 1, 600);
    sun.position.set(0, 100, 0);
    scene.add(sun);

    const keys = {};
    window.onkeydown = e => keys[e.code] = true;
    window.onkeyup = e => keys[e.code] = false;

    let velY = 0;

    function animate() {
        requestAnimationFrame(animate);
        let nP = mouse.position.clone();
        if(keys['ArrowUp']) nP.add(new THREE.Vector3(0,0,-1.2).applyQuaternion(mouse.quaternion));
        if(keys['ArrowDown']) nP.add(new THREE.Vector3(0,0,1.2).applyQuaternion(mouse.quaternion));
        if(keys['ArrowLeft']) mouse.rotation.y += 0.1;
        if(keys['ArrowRight']) mouse.rotation.y -= 0.1;

        velY -= 0.05; nP.y += velY;
        let floorContact = false;
        const nextBox = new THREE.Box3().setFromCenterAndSize(nP, new THREE.Vector3(1.2, 1.2, 1.2));
        
        collidables.forEach(b => {
            if (nextBox.intersectsBox(b)) {
                if (mouse.position.y >= b.max.y - 1.2) { nP.y = b.max.y + 0.5; velY = 0; floorContact = true; }
                else { nP.x = mouse.position.x; nP.z = mouse.position.z; }
            }
        });

        interactables.forEach((obj, idx) => {
            if (obj.visible && nextBox.intersectsSphere(new THREE.Sphere(obj.position, 2.5))) {
                if (obj.userData.type === 'star') {
                    obj.visible = false; inventory.stars++;
                    ui.innerHTML = `ESTRELLAS: ${inventory.stars}/12 | TAGS: ${inventory.tags.length}`;
                } else if (obj.userData.type === 'tag') {
                    obj.visible = false; inventory.tags.push('<html>');
                    ui.innerHTML = `ESTRELLAS: ${inventory.stars}/12 | TAGS: ${inventory.tags.length}`;
                } else if (obj.userData.type === 'door') {
                    if (inventory.tags.length >= 3) {
                        const code = prompt("Ordena las etiquetas HTML para abrir: (html, body, /html)");
                        if (code === "html, body, /html") {
                            obj.visible = false;
                            collidables.splice(collidables.findIndex(c => c.intersectsBox(new THREE.Box3().setFromObject(obj))), 1);
                        }
                    }
                }
            }
        });

        lavaZones.forEach(lb => { if (nextBox.intersectsBox(lb)) { mouse.position.copy(spawnPoint); velY = 0; } });
        if (floorContact && keys['Space']) velY = 0.8;
        mouse.position.copy(nP);

        const idealOffset = new THREE.Vector3(0, 5, 10).applyQuaternion(mouse.quaternion);
        const cameraTarget = mouse.position.clone().add(new THREE.Vector3(0, 1.5, 0));
        const idealCamPos = mouse.position.clone().add(idealOffset);
        const rayDir = idealCamPos.clone().sub(cameraTarget).normalize();
        raycaster.set(cameraTarget, rayDir);
        const intersects = raycaster.intersectObjects(wallMeshes);

        if (intersects.length > 0 && intersects[0].distance < 10) {
            camera.position.copy(cameraTarget.clone().add(rayDir.multiplyScalar(intersects[0].distance * 0.8)));
        } else { camera.position.copy(idealCamPos); }
        
        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    }
    animate();
}