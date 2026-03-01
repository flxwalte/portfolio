/* PROJECTS: Gestión del Portafolio y Visor */
const projectsData = {
    Perfil: [
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/pagina-de-perfil/", d: "Landing page de alta conversión." },
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/Mi-formacion/", d: "Landing page de alta conversión." },
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/curriculum/", d: "Landing page de alta conversión." }
    ],

    ecommerce: [
        { n: "Tech Store", p: "950€", u: "https://flxwalte.github.io/segunda-mano/", d: "Tienda de gadgets con enfoque en velocidad." },
        { n: "Tienda Luxury", p: "1.200€", u: "https://flxwalte.github.io/ethereal/", d: "E-commerce elegante con pasarela de pago." },
        { n: "Tech Store", p: "950€", u: "https://flxwalte.github.io/Tienda-de-juegos/", d: "Tienda de gadgets con enfoque en velocidad." },
        { n: "Tech Store", p: "950€", u: "https://flxwalte.github.io/segunda-mano/", d: "Tienda de gadgets con enfoque en velocidad." },
    ],
    corporate: [
        { n: "Abogados Pro", p: "900€", u: "https://flxwalte.github.io/abogado/", d: "Web corporativa con sistema de citas." },
        { n: "Abogados Pro", p: "900€", u: "https://flxwalte.github.io/dentista/", d: "Web corporativa con sistema de citas." },
        { n: "Abogados Pro", p: "900€", u: "https://flxwalte.github.io/agencia-de-viajes/", d: "Web corporativa con sistema de citas." }

    ],
    landing: [
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/Landing-GuideDoc/", d: "Landing page de alta conversión." },
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/venezuela/", d: "Landing page de alta conversión." },
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/tomas-jose-sanabria/", d: "Landing page de alta conversión." }
    ],

    // --- NUEVAS CATEGORÍAS ---
    
    webapp: [
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/carta-interactiva/", d: "Aplicación web para gestión de tareas con login." },
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/Capsular/", d: "Aplicación web para gestión de tareas con login." },
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/Reloj-digital/", d: "Aplicación web para gestión de tareas con login." },
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/calculadora/", d: "Aplicación web para gestión de tareas con login." },
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/Capsular/", d: "Aplicación web para gestión de tareas con login." },
        { n: "Task Manager", p: "1.100€", u: "https://flxwalte.github.io/Capsular/", d: "Aplicación web para gestión de tareas con login." }
    ],
    
    restaurante: [
        { n: "GastroWeb", p: "800€", u: "https://flxwalte.github.io/Tortillas-el-patron/", d: "Web para restaurante con menú dinámico y reservas." },
        { n: "GastroWeb", p: "800€", u: "https://flxwalte.github.io/masia/", d: "Web para restaurante con menú dinámico y reservas." },
        { n: "GastroWeb", p: "800€", u: "https://flxwalte.github.io/gastronomia/", d: "Web para restaurante con menú dinámico y reservas." }
    ]
};


let curCat = 'ecommerce';
let curIdx = 0;

function initProjects() {
    const nav = document.getElementById('cat-nav');
    nav.innerHTML = ''; 
    Object.keys(projectsData).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${cat === curCat ? 'active' : ''}`;
        btn.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.onclick = (e) => changeCat(cat, e.target);
        nav.appendChild(btn);
    });
    renderProject();
}

function renderProject() {
    const p = projectsData[curCat][curIdx];
    document.getElementById('viewer').src = p.u;
    document.getElementById('p-title').innerText = p.n;
    document.getElementById('p-desc').innerText = p.d;
    document.getElementById('p-price').innerText = p.p;
    // CONEXIÓN CON EL BOT
    if(window.DlbasBot) DlbasBot.reaccionarAPortfolio(p);
}

function changeCat(cat, btn) {
    curCat = cat; curIdx = 0;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProject();
    if(typeof playS === 'function') playS(600, 'sine', 0.1);
}

function nextProject() {
    curIdx = (curIdx + 1) % projectsData[curCat].length;
    renderProject();
    if(typeof playS === 'function') playS(500, 'square', 0.05);
}

function prevProject() {
    curIdx = (curIdx - 1 + projectsData[curCat].length) % projectsData[curCat].length;
    renderProject();
    if(typeof playS === 'function') playS(500, 'square', 0.05);
}

window.addEventListener('load', initProjects);