/* PROJECTS: Gestión del Portafolio y Visor */
const projectsData = {
    ecommerce: [
        { n: "Tienda Luxury", p: "1.200€", u: "https://flxwalte.github.io/ethereal/", d: "E-commerce elegante con pasarela de pago." },
        { n: "Tech Store", p: "950€", u: "https://flxwalte.github.io/abogado/", d: "Tienda de gadgets con enfoque en velocidad." }
    ],
    corporate: [
        { n: "Abogados Pro", p: "900€", u: "https://flxwalte.github.io/abogado/", d: "Web corporativa con sistema de citas." }
    ],
    landing: [
        { n: "SaaS Start", p: "600€", u: "https://flxwalte.github.io/ethereal/", d: "Landing page de alta conversión." }
    ],

    // --- NUEVAS CATEGORÍAS ---
    portfolio: [
        { n: "Portfolio Creativo", p: "700€", u: "#", d: "Portfolio personal con animaciones y secciones dinámicas." }
    ],
    blog: [
        { n: "Blog Minimal", p: "500€", u: "#", d: "Blog optimizado con sistema de categorías y buscador." }
    ],
    webapp: [
        { n: "Task Manager", p: "1.100€", u: "#", d: "Aplicación web para gestión de tareas con login." }
    ],
    dashboard: [
        { n: "Admin Panel Pro", p: "1.300€", u: "#", d: "Dashboard con estadísticas, roles y gráficos." }
    ],
    educativo: [
        { n: "Academia Online", p: "1.400€", u: "#", d: "Plataforma educativa con cursos y progreso de alumnos." }
    ],
    inmobiliaria: [
        { n: "Real Estate Hub", p: "1.250€", u: "#", d: "Portal inmobiliario con filtros avanzados." }
    ],
    restaurante: [
        { n: "GastroWeb", p: "800€", u: "#", d: "Web para restaurante con menú dinámico y reservas." }
    ],
    eventos: [
        { n: "Eventify", p: "900€", u: "#", d: "Página para eventos con venta de entradas." }
    ],
    servicios: [
        { n: "Servicios Pro", p: "750€", u: "#", d: "Sitio para profesionales con formulario avanzado." }
    ],
    personalBrand: [
        { n: "Marca Personal", p: "650€", u: "#", d: "Web de marca personal con storytelling y CTA." }
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