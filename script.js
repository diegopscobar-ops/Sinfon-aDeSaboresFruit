// ============================================================
// ⚠️ SEGURIDAD: Las credenciales de Supabase NO deben estar
// hardcodeadas aquí en producción. Muévelas a variables de
// entorno del servidor o usa un backend/proxy que las oculte.
//
// Si usas un bundler (Vite, Webpack, etc.):
//   SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
//   SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
//
// Si es un sitio estático puro, protege la tabla en Supabase
// con Row Level Security (RLS) para limitar el daño.
// ============================================================
const SUPABASE_URL = 'https://pzyborxarrafofbqydhi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJvcnhhcnJhZm9mYnF5ZGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTM4MzIsImV4cCI6MjA4Nzg4OTgzMn0.WwB4INM4GIJbI70FacNvP3_kBqrlXW3eXzHW3xdxJDU';

// ===== LOADER =====
// FIX: el loader ahora espera que la página esté 100% cargada
// Y además respeta un mínimo de 2 segundos para que se vea bien.
// Se usa Promise.all para cumplir ambas condiciones al mismo tiempo.
const loaderEl = document.getElementById('page-loader');

const esperarCarga = new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', resolve, { once: true });
    }
});

const esperarMinimo = new Promise(resolve => setTimeout(resolve, 2000));

Promise.all([esperarCarga, esperarMinimo]).then(() => {
    loaderEl.classList.add('hidden');
    forzarRevealVisibles();
});

// ===== BOTONES COMPRAR =====
const botones = document.querySelectorAll(".btn-comprar");

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const producto = boton.dataset.producto;
        const numero   = "573128900286";
        const mensaje  = `Hola 👋 me interesa comprar en sinfonía de sabores fruit 🍓`;
        const url      = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    });
});

// ===== LIGHTBOX =====
const galeriaItems  = document.querySelectorAll('.galeria-item');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxNombre = document.getElementById('lightboxNombre');
const lightboxCerrar = document.getElementById('lightboxCerrar');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

const galeriaData = Array.from(galeriaItems).map(item => ({
    src:    item.querySelector('img').src,
    alt:    item.querySelector('img').alt,
    nombre: item.querySelector('.galeria-overlay span').textContent
}));

let lightboxIndex = 0;

function abrirLightbox(index) {
    lightboxIndex              = index;
    lightboxImg.src            = galeriaData[index].src;
    lightboxImg.alt            = galeriaData[index].alt;
    lightboxNombre.textContent = galeriaData[index].nombre;
    lightbox.classList.add('open');
    // FIX: aria-hidden debe ser string, no booleano
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    lightbox.classList.remove('open');
    // FIX: aria-hidden debe ser string, no booleano
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function lightboxIr(dir) {
    lightboxIndex = (lightboxIndex + dir + galeriaData.length) % galeriaData.length;
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight; // fuerza reflow para reiniciar animación
    lightboxImg.style.animation = '';
    lightboxImg.src             = galeriaData[lightboxIndex].src;
    lightboxImg.alt             = galeriaData[lightboxIndex].alt;
    lightboxNombre.textContent  = galeriaData[lightboxIndex].nombre;
}

galeriaItems.forEach((item, i) => {
    item.addEventListener('click', () => abrirLightbox(i));
});

lightboxCerrar.addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
});

lightboxPrev.addEventListener('click', () => lightboxIr(-1));
lightboxNext.addEventListener('click', () => lightboxIr(1));

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') lightboxIr(1);
    if (e.key === 'ArrowLeft')  lightboxIr(-1);
    if (e.key === 'Escape')     cerrarLightbox();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lightboxIr(diff > 0 ? 1 : -1);
});

// ===== SUPABASE: REGISTRAR VISITA =====
async function registrarVisita() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/Visitas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                pagina:     window.location.pathname,
                dispositivo: navigator.userAgent,
                created_at: new Date().toISOString()
            })
        });
        console.log('Visita registrada. Status:', res.status);
    } catch (err) {
        console.error('Error registrando visita:', err);
    }
}

registrarVisita();

// ===== MODAL =====
const modal     = document.getElementById("miModal");
const btnAbrir  = document.getElementById("btnAbrir");
const btnCerrar = document.getElementById("btnCerrar");

btnAbrir.addEventListener("click",  () => modal.style.display = "flex");
btnCerrar.addEventListener("click", () => modal.style.display = "none");
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// ===== MENÚ HAMBURGUESA =====
const btnMenu    = document.getElementById('btnMenu');
const mobileMenu = document.getElementById('mobileMenu');

btnMenu.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    btnMenu.classList.toggle('open');
    btnMenu.setAttribute('aria-expanded', String(isOpen));
    // FIX: aria-hidden como string
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        btnMenu.classList.remove('open');
        btnMenu.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
});

// ===== REVEAL (animaciones al hacer scroll) =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Activa los elementos que ya están visibles al cargar la página
function forzarRevealVisibles() {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
}

// ===== TEMA OSCURO / CLARO =====
const btnTheme  = document.getElementById('btnTheme');
const root      = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    btnTheme.textContent = '☀️';
} else {
    root.removeAttribute('data-theme');
    btnTheme.textContent = '🌙';
}

btnTheme.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
        root.removeAttribute('data-theme');
        btnTheme.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        btnTheme.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// ===== ESTADÍSTICAS: LIQUID + BURBUJAS =====
const emojis = ['🍓','🥭','🍦','🥥','🍋','🫐','🍉'];

function addBubbles(box) {
    for (let i = 0; i < 5; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        const s = Math.random() * 10 + 4;
        b.style.cssText = `
            width:${s}px; height:${s}px;
            left:${Math.random() * 80 + 10}%;
            bottom:${Math.random() * 30}%;
            animation-duration:${Math.random() * 2 + 1.5}s;
            animation-delay:${Math.random() * 2}s;
        `;
        box.querySelector('.liquid').appendChild(b);
    }
    for (let i = 0; i < 4; i++) {
        const f = document.createElement('span');
        f.className    = 'fruit-float';
        f.textContent  = emojis[Math.floor(Math.random() * emojis.length)];
        f.style.cssText = `
            left:${Math.random() * 70 + 10}%;
            bottom:${Math.random() * 20 + 5}%;
            animation-duration:${Math.random() * 2 + 2}s;
            animation-delay:${Math.random() * 3 + 0.5}s;
        `;
        box.querySelector('.liquid').appendChild(f);
    }
}

function animateLiquidCounter(el) {
    const target   = +el.dataset.target;
    const duration = 3500;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

let liquidPlayed = false;

function playLiquid() {
    if (liquidPlayed) return;
    liquidPlayed = true;
    document.querySelectorAll('.liquid-box').forEach(box => {
        addBubbles(box);
        const liquid = box.querySelector('.liquid');
        const num    = box.querySelector('.liquid-num');
        setTimeout(() => {
            liquid.style.height = liquid.dataset.fill + '%';
            animateLiquidCounter(num);
        }, 200);
    });
}

const liquidObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            playLiquid();
            liquidObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

const liquidGrid = document.querySelector('#Estadisticas .stats-grid');
if (liquidGrid) liquidObserver.observe(liquidGrid);
