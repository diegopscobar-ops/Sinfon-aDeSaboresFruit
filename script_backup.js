// ============================================================
// CONFIGURACIÓN SUPABASE
// ⚠️  Asegúrate de tener RLS activo en tu tabla "Visitas"
//     para que la anon key solo pueda hacer INSERT.
//     Ver: https://supabase.com/docs/guides/auth/row-level-security
// ============================================================
const SUPABASE_URL = 'https://pzyborxarrafofbqydhi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJvcnhhcnJhZm9mYnF5ZGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTM4MzIsImV4cCI6MjA4Nzg4OTgzMn0.WwB4INM4GIJbI70FacNvP3_kBqrlXW3eXzHW3xdxJDU';

// ===== TEMA OSCURO / CLARO =====
const btnTheme = document.getElementById('btnTheme');
const root     = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (btnTheme) btnTheme.textContent = '☀️';
} else {
    root.removeAttribute('data-theme');
    if (btnTheme) btnTheme.textContent = '🌙';
}

if (btnTheme) {
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
}

// ===== LOADER =====
const loaderEl = document.getElementById('page-loader');

if (loaderEl) {
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
        iniciarTypewriter();
    });
}

// ===== TYPEWRITER HERO =====
// Respeta prefers-reduced-motion: si el usuario lo tiene activo,
// muestra el texto directamente sin animación.
function iniciarTypewriter() {
    const heroTitulo = document.querySelector('.hero-titulo');
    if (!heroTitulo) return;

    const linea1 = '100% fruta,';
    const linea2 = '100% amor';

    // Sin animación para usuarios que la desactivan por accesibilidad
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido) {
        heroTitulo.innerHTML =
            `<span class="linea1">${linea1}</span><br>` +
            `<span class="hero-titulo-accent linea2">${linea2}</span>`;
        return;
    }

    let char = 0;
    let fase = 1; // 1 = escribiendo linea1, 2 = escribiendo linea2

    heroTitulo.innerHTML =
        '<span class="linea1"></span><br>' +
        '<span class="hero-titulo-accent linea2"></span>';

    const span1 = heroTitulo.querySelector('.linea1');
    const span2 = heroTitulo.querySelector('.linea2');

    function escribir() {
        if (fase === 1) {
            if (char < linea1.length) {
                span1.textContent += linea1[char];
                char++;
                setTimeout(escribir, 80);
            } else {
                char = 0;
                fase = 2;
                setTimeout(escribir, 500);
            }
        } else {
            if (char < linea2.length) {
                span2.textContent += linea2[char];
                char++;
                setTimeout(escribir, 80);
            }
        }
    }

    escribir();
}

// ===== BOTONES COMPRAR =====
const botones = document.querySelectorAll('.btn-comprar');

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        const producto = boton.dataset.producto;
        const numero   = '573128900286';
        const mensaje  = `Hola 👋 me interesa comprar en sinfonía de sabores fruit 🍓`;
        const url      = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });
});

// ===== LIGHTBOX =====
const galeriaItems   = document.querySelectorAll('.galeria-item');
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxNombre = document.getElementById('lightboxNombre');
const lightboxCerrar = document.getElementById('lightboxCerrar');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');

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
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Usa una clase CSS para reanimar en vez de forzar reflow con offsetHeight
function lightboxIr(dir) {
    lightboxIndex = (lightboxIndex + dir + galeriaData.length) % galeriaData.length;
    lightboxImg.classList.remove('lightbox-anim');
    // Forzar reflow mínimo solo en el img, no en todo el documento
    void lightboxImg.offsetWidth;
    lightboxImg.classList.add('lightbox-anim');
    lightboxImg.src            = galeriaData[lightboxIndex].src;
    lightboxImg.alt            = galeriaData[lightboxIndex].alt;
    lightboxNombre.textContent = galeriaData[lightboxIndex].nombre;
}

if (lightbox) {
    galeriaItems.forEach((item, i) => {
        item.addEventListener('click', () => abrirLightbox(i));
    });

    lightboxCerrar.addEventListener('click', cerrarLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) cerrarLightbox();
    });

    lightboxPrev.addEventListener('click', () => lightboxIr(-1));
    lightboxNext.addEventListener('click', () => lightboxIr(1));

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'ArrowRight') lightboxIr(1);
        if (e.key === 'ArrowLeft')  lightboxIr(-1);
        if (e.key === 'Escape')     cerrarLightbox();
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) lightboxIr(diff > 0 ? 1 : -1);
    }, { passive: true });
}

// ===== SUPABASE: REGISTRAR VISITA =====
// Solo guarda tipo de dispositivo (móvil/escritorio) — no el userAgent completo,
// para respetar la privacidad del usuario (Ley 1581 de Colombia / GDPR).
async function registrarVisita() {
    try {
        const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'móvil' : 'escritorio';

        const res = await fetch(`${SUPABASE_URL}/rest/v1/Visitas`, {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'apikey':        SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer':        'return=minimal'
            },
            body: JSON.stringify({
                pagina:      window.location.pathname,
                dispositivo: dispositivo,
                created_at:  new Date().toISOString()
            })
        });

        if (!res.ok) {
            console.warn('Visita no registrada. Status:', res.status);
        }
    } catch (err) {
        // Error silencioso — no interrumpe la experiencia del usuario
        console.error('Error registrando visita:', err);
    }
}

registrarVisita();

// ===== MODAL =====
// Usa clases CSS para mostrar/ocultar (consistente con el resto del código)
const modal     = document.getElementById('miModal');
const btnAbrir  = document.getElementById('btnAbrir');
const btnCerrar = document.getElementById('btnCerrar');

function abrirModal() {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (modal && btnAbrir && btnCerrar) {
    btnAbrir.addEventListener('click', abrirModal);
    btnCerrar.addEventListener('click', cerrarModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) cerrarModal();
    });
    // Cerrar modal con Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'flex') cerrarModal();
    });
}

// ===== MENÚ HAMBURGUESA =====
const btnMenu    = document.getElementById('btnMenu');
const mobileMenu = document.getElementById('mobileMenu');

if (btnMenu && mobileMenu) {
    btnMenu.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        btnMenu.classList.toggle('open');
        btnMenu.setAttribute('aria-expanded', String(isOpen));
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
}

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

function forzarRevealVisibles() {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
}

// ===== ESTADÍSTICAS: LIQUID + BURBUJAS =====
const emojis = ['🍓','🥭','🍦','🥥','🍋','🫐','🍉'];

function addBubbles(box) {
    const liquid = box.querySelector('.liquid');

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
        liquid.appendChild(b);
    }

    for (let i = 0; i < 4; i++) {
        const f = document.createElement('span');
        f.className   = 'fruit-float';
        f.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        f.style.cssText = `
            left:${Math.random() * 70 + 10}%;
            bottom:${Math.random() * 20 + 5}%;
            animation-duration:${Math.random() * 2 + 2}s;
            animation-delay:${Math.random() * 3 + 0.5}s;
        `;
        liquid.appendChild(f);
    }
}

function animateLiquidCounter(el) {
    const target   = +el.dataset.target;
    const duration = 3500;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
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

const liquidGrid = document.querySelector('#Estadisticas .stats-grid');
if (liquidGrid) {
    const liquidObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                playLiquid();
                liquidObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    liquidObserver.observe(liquidGrid);
}