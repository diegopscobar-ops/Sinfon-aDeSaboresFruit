const botones = document.querySelectorAll(".btn-comprar");

botones.forEach(boton => {
boton.addEventListener("click", () => {
    const producto = boton.dataset.producto;

    const numero = "573128900286"; 

    const mensaje = `Hola 👋 me interesa comprar en sinfonía de sabores fruit 🍓`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
});
});

    const galeriaItems = document.querySelectorAll('.galeria-item');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxNombre = document.getElementById('lightboxNombre');
    const lightboxCerrar = document.getElementById('lightboxCerrar');
    const lightboxPrev   = document.getElementById('lightboxPrev');
    const lightboxNext   = document.getElementById('lightboxNext');

    const galeriaData = Array.from(galeriaItems).map(item => ({
    src:  item.querySelector('img').src,
    alt:  item.querySelector('img').alt,
    nombre: item.querySelector('.galeria-overlay span').textContent
    }));

    let lightboxIndex = 0;

    function abrirLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src        = galeriaData[index].src;
    lightboxImg.alt        = galeriaData[index].alt;
    lightboxNombre.textContent = galeriaData[index].nombre;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', false);
    document.body.style.overflow = 'hidden';
    }

    function cerrarLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', true);
    document.body.style.overflow = '';
    }

    function lightboxIr(dir) {
    lightboxIndex = (lightboxIndex + dir + galeriaData.length) % galeriaData.length;
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight; // reflow
    lightboxImg.style.animation = '';
    lightboxImg.src            = galeriaData[lightboxIndex].src;
    lightboxImg.alt            = galeriaData[lightboxIndex].alt;
    lightboxNombre.textContent = galeriaData[lightboxIndex].nombre;
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

const SUPABASE_URL = 'https://pzyborxarrafofbqydhi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJvcnhhcnJhZm9mYnF5ZGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTM4MzIsImV4cCI6MjA4Nzg4OTgzMn0.WwB4INM4GIJbI70FacNvP3_kBqrlXW3eXzHW3xdxJDU';

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
                pagina: window.location.pathname,
                dispositivo: navigator.userAgent,
                created_at: new Date().toISOString()
            })
        });
        console.log('Status:', res.status);
    } catch (err) {
        console.error('Error:', err);
    }
}

registrarVisita();

    const modal     = document.getElementById("miModal");
    const btnAbrir  = document.getElementById("btnAbrir");
    const btnCerrar = document.getElementById("btnCerrar");

    btnAbrir.addEventListener("click", () => modal.style.display = "flex");
    btnCerrar.addEventListener("click", () => modal.style.display = "none");
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    const btnMenu    = document.getElementById('btnMenu');
const mobileMenu = document.getElementById('mobileMenu');

btnMenu.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    btnMenu.classList.toggle('open');
    btnMenu.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    btnMenu.classList.remove('open');
    btnMenu.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
    });
});


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));