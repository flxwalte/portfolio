import { MouseGame } from './mouse64-engine.js';
import { createMousePlayer, createBug } from './mouse64-entities.js';

const game = new MouseGame();
const mouse = createMousePlayer();
game.scene.add(mouse);
game.createHUD();

const LEVELS = [
    { tags: ["<html>", "<body>", "</html>"], goal: "Estructura Básica" },
    { tags: ["<style>", "color:red;", "</style>"], goal: "Diseño Visual" }
];

// Generar Mapa (Habitaciones de Código)
function buildMap() {
    // Estrellas
    for(let i=0; i<3; i++) {
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshBasicMaterial({color:0xffff00}));
        star.position.set(Math.random()*40-20, 1.5, Math.random()*40-20);
        star.userData = { type: 'star' };
        game.scene.add(star);
    }

    // Etiquetas (Items)
    LEVELS[game.gameState.currentLevel].tags.forEach((tag, i) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshStandardMaterial({color: 0x4ade80}));
        box.position.set(i*5 - 5, 1, -10);
        box.userData = { type: 'tag', value: tag };
        game.scene.add(box);
    });

    // Enemigos
    game.scene.add(createBug(5, -5));
    game.scene.add(createBug(-10, -15));
}

buildMap();

function loop() {
    requestAnimationFrame(loop);
    
    // 1. Movimiento y Física de Salto
    const speed = 0.2;
    if(game.keys['ArrowUp']) mouse.translateZ(-speed);
    if(game.keys['ArrowDown']) mouse.translateZ(speed);
    if(game.keys['ArrowLeft']) mouse.rotation.y += 0.07;
    if(game.keys['ArrowRight']) mouse.rotation.y -= 0.07;

    // Salto Doble
    if(game.keys['Space'] && mouse.userData.jumps < 2) {
        mouse.userData.velY = 0.3;
        mouse.userData.jumps++;
        mouse.userData.isGrounded = false;
        game.keys['Space'] = false; // Reset instantáneo
    }

    mouse.position.y += mouse.userData.velY;
    mouse.userData.velY -= 0.015; // Gravedad

    if(mouse.position.y <= 0.5) {
        mouse.position.y = 0.5;
        mouse.userData.velY = 0;
        mouse.userData.jumps = 0;
        mouse.userData.isGrounded = true;
    }

    // 2. IA de Bugs y Colisiones
    game.scene.children.forEach(obj => {
        if(obj.userData.type === 'bug') {
            obj.position.z += 0.05 * obj.userData.dir;
            if(Math.abs(obj.position.z - obj.userData.startZ) > obj.userData.range) obj.userData.dir *= -1;
            
            if(mouse.position.distanceTo(obj.position) < 1) {
                game.gameState.lives--;
                mouse.position.set(0, 0.5, 0); // Respawn
                game.updateHUD();
                if(game.gameState.lives <= 0) alert("GAME OVER - Sistema Corrupto");
            }
        }

        if(obj.userData.type === 'tag' || obj.userData.type === 'star') {
            obj.rotation.y += 0.05;
            if(mouse.position.distanceTo(obj.position) < 1.2) {
                if(obj.userData.type === 'tag') game.gameState.inventory.push(obj.userData.value);
                else game.gameState.stars++;
                
                game.scene.remove(obj);
                game.updateHUD();
                checkWin();
            }
        }
    });

    // 3. Cámara Pro (Mario 64 Lerp)
    const camTarget = mouse.position.clone().add(new THREE.Vector3(0, 6, 10).applyQuaternion(mouse.quaternion));
    game.camera.position.lerp(camTarget, 0.1);
    game.camera.lookAt(mouse.position);

    game.renderer.render(game.scene, game.camera);
}

function checkWin() {
    const goal = LEVELS[game.gameState.currentLevel].tags;
    if(game.gameState.inventory.length === goal.length) {
        const finalStars = game.gameState.stars;
        document.body.innerHTML = `
            <div style="background:#000; color:#4ade80; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:monospace;">
                <h1>¡COMPILACIÓN EXITOSA!</h1>
                <p>Nivel de Desarrollador: ${finalStars === 3 ? 'SENIOR' : 'JUNIOR'}</p>
                <p>Estrellas: ${"⭐".repeat(finalStars)}</p>
                <button onclick="location.reload()" style="background:#4ade80; border:none; padding:15px; cursor:pointer;">REINICIAR SISTEMA</button>
            </div>
        `;
    }
}

loop();