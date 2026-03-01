import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.157.0/three.module.min.js';

export function createMousePlayer() {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Cuerpo
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 1), mat);
    // Cabeza
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), mat);
    head.position.set(0, 0.3, -0.6);
    // Orejas
    const earG = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const eL = new THREE.Mesh(earG, mat); eL.position.set(0.2, 0.6, -0.5);
    const eR = new THREE.Mesh(earG, mat); eR.position.set(-0.2, 0.6, -0.5);
    
    group.add(body, head, eL, eR);
    group.position.y = 0.5;
    
    // Propiedades de física
    group.userData = { velY: 0, isGrounded: true, jumps: 0 };
    return group;
}

export function createBug(x, z) {
    const bug = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0x440000 })
    );
    bug.position.set(x, 0.4, z);
    bug.userData = { type: 'bug', startZ: z, range: 5, dir: 1 };
    return bug;
}