const SUPABASE_URL = 'https://pzyborxarrafofbqydhi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJvcnhhcnJhZm9mYnF5ZGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTM4MzIsImV4cCI6MjA4Nzg4OTgzMn0.WwB4INM4GIJbI70FacNvP3_kBqrlXW3eXzHW3xdxJDU';

let seleccion = {};

function cambiarCantidad(btn, delta) {
    const item = btn.closest('.crema-item');
    const crema = item.dataset.crema;
    const valEl = item.querySelector('.counter-val');

    seleccion[crema] = Math.max(0, (seleccion[crema] || 0) + delta);
    valEl.textContent = seleccion[crema];

    if (seleccion[crema] === 0) {
        item.classList.remove('activa');
        delete seleccion[crema];
    } else {
        item.classList.add('activa');
    }

    actualizarResumen();
}

function actualizarResumen() {
    const items = Object.entries(seleccion).filter(([, v]) => v > 0);
    const el = document.getElementById('resumen-texto');

    if (items.length === 0) {
        el.textContent = '🛒 Nada seleccionado aún';
    } else {
        const total = items.reduce((s, [, v]) => s + v, 0);
        const texto = items.map(([k, v]) => `${k} ×${v}`).join(', ');
        el.textContent = `🛒 ${total} unidad${total > 1 ? 'es' : ''}: ${texto}`;
    }
}

function irPaso2() {
    const items = Object.entries(seleccion).filter(([, v]) => v > 0);
    if (items.length === 0) {
        alert('¡Selecciona al menos una crema! 🍦');
        return;
    }

    const display = document.getElementById('pedido-resumen-display');
    const lineas = items.map(([k, v]) => `${k} × ${v}`).join(' &nbsp;·&nbsp; ');
    display.innerHTML = `<strong>📦 Tu pedido</strong>${lineas}`;

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function irPaso1() {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function enviarPedido(e) {
    e.preventDefault();

    const btn = document.getElementById('btn-enviar');
    const btnTexto = document.getElementById('btn-texto');
    btn.disabled = true;
    btnTexto.textContent = 'Enviando...';

    const nombre    = document.getElementById('nombre').value.trim();
    const correo    = document.getElementById('correo').value.trim();
    const telefono  = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad    = document.getElementById('Ciudad').value;
    const comuna    = document.getElementById('Comuna').value;

    const items = Object.entries(seleccion)
        .filter(([, v]) => v > 0)
        .map(([crema, cantidad]) => ({ crema, cantidad }));

    const payload = {
        nombre,
        correo,
        telefono,
        direccion,
        ciudad,
        comuna,
        productos: items,          
        total_unidades: items.reduce((s, i) => s + i.cantidad, 0),
        estado: 'pendiente',
        created_at: new Date().toISOString()
    };

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-3').classList.remove('hidden');
        document.getElementById('success-msg').textContent =
            `¡Gracias ${nombre}! Tu pedido fue registrado. Te contactaremos al ${telefono} pronto 🍦`;
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        alert('Hubo un error al enviar el pedido. Intenta de nuevo.');
        btn.disabled = false;
        btnTexto.textContent = 'Enviar Pedido 🚀';
    }
}

function reiniciar() {
    seleccion = {};
    document.querySelectorAll('.crema-item').forEach(item => {
        item.classList.remove('activa');
        item.querySelector('.counter-val').textContent = '0';
    });
    actualizarResumen();
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('form-pedido').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}