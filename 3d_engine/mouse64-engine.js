/* ============================================================
   DLBAS MOUSE-64 CORE ENGINE
   ============================================================ */
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.157.0/three.module.min.js';

export class MouseGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.gameState = {
            stars: 0,
            lives: 3,
            inventory: [],
            currentLevel: 0,
            reputation: 0,
            isGameOver: false
        };
        this.init();
    }

    init() {
        // Escena y Niebla (Estilo N64)
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.04);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.3, false);
        this.renderer.domElement.style = "width:100vw; height:100vh; image-rendering:pixelated; position:fixed; top:0; left:0; z-index:99999;";
        document.body.appendChild(this.renderer.domElement);

        // Luces
        const ambient = new THREE.AmbientLight(0x404040, 2);
        const sun = new THREE.DirectionalLight(0x4ade80, 1);
        sun.position.set(10, 20, 10);
        this.scene.add(ambient, sun);

        // Suelo (Placa Base)
        const grid = new THREE.GridHelper(200, 100, 0x4ade80, 0x111111);
        grid.position.y = -0.01;
        this.scene.add(grid);

        this.setupControls();
    }

    setupControls() {
        this.keys = {};
        window.onkeydown = (e) => this.keys[e.code] = true;
        window.onkeyup = (e) => this.keys[e.code] = false;
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.id = "mouse-hud";
        hud.style = "position:fixed; top:20px; left:20px; z-index:100000; color:#4ade80; font-family:monospace; font-size:1.5rem; text-shadow:2px 2px #000;";
        document.body.appendChild(hud);
        this.updateHUD();
    }

    updateHUD() {
        const hud = document.getElementById('mouse-hud');
        if(hud) {
            hud.innerHTML = `
                <div>RATÓN PROGRAMADOR - LVL: ${this.gameState.currentLevel + 1}</div>
                <div>VIDAS: ${"❤".repeat(this.gameState.lives)} | ESTRELLAS: ${"⭐".repeat(this.gameState.stars)}</div>
                <div style="color:#fff">BUFFER: [ ${this.gameState.inventory.join(' ')} ]</div>
            `;
        }
    }
}