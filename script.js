// =========================
// CARRITO
// =========================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// CREAR CONTENEDOR CARRITO
// =========================
const carritoContainer = document.createElement("div");
carritoContainer.className = "fixed top-20 right-0 w-80 h-[calc(100%-80px)] bg-white shadow-xl z-50 p-4 overflow-y-auto hidden";
carritoContainer.id = "carrito";
document.body.appendChild(carritoContainer);

// =========================
// BOTÓN CARRITO
// =========================
const btnCarrito = document.querySelector('[data-icon="shopping_cart"]').parentElement;

btnCarrito.addEventListener("click", () => {
    carritoContainer.classList.toggle("hidden");
    renderCarrito();
});

// =========================
// CONTADOR
// =========================
const contador = document.createElement("span");
contador.className = `
absolute -top-1 -right-1 
bg-red-500 text-white 
text-xs w-5 h-5 
flex items-center justify-center 
rounded-full
`;

btnCarrito.classList.add("relative");
btnCarrito.appendChild(contador);

// =========================
// ACTUALIZAR CONTADOR
// =========================
function actualizarContador() {
    contador.innerText = carrito.length;
    contador.style.display = carrito.length === 0 ? "none" : "flex";
}

// =========================
// NOTIFICACIÓN
// =========================
function mostrarNotificacion(texto) {
    const notif = document.createElement("div");

    notif.innerText = texto;
    notif.className = `
    fixed bottom-6 right-6 
    bg-green-500 text-white 
    px-4 py-3 rounded-lg shadow-lg 
    opacity-0 translate-y-4 
    transition-all duration-300 z-50
    `;

    document.body.appendChild(notif);

    setTimeout(() => notif.classList.remove("opacity-0", "translate-y-4"), 10);

    setTimeout(() => {
        notif.classList.add("opacity-0", "translate-y-4");
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// =========================
// AGREGAR PRODUCTO
// =========================
document.querySelectorAll(".group button").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".group");
        const nombre = card.querySelector("h4").innerText;
        const precio = card.querySelector("span").innerText;

        carrito.push({ nombre, precio });

        guardarCarrito();
        renderCarrito();
        actualizarContador();

        mostrarNotificacion("Producto agregado 🛒");
    });
});

// =========================
// GUARDAR
// =========================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =========================
// RENDER CARRITO
// =========================
function renderCarrito() {
    carritoContainer.innerHTML = `<h2 class="text-xl font-bold mb-4">🛒 Carrito</h2>`;

    if (carrito.length === 0) {
        carritoContainer.innerHTML += "<p>Vacío</p>";
        return;
    }

    carrito.forEach((item, index) => {
        carritoContainer.innerHTML += `
        <div class="flex justify-between items-center border-b py-2">
            <div>
                <p class="font-semibold">${item.nombre}</p>
                <p class="text-sm text-gray-500">${item.precio}</p>
            </div>
            <button onclick="eliminarProducto(${index})" class="text-red-500">❌</button>
        </div>
        `;
    });

    carritoContainer.innerHTML += `
    <button onclick="vaciarCarrito()" class="mt-4 w-full bg-red-500 text-white py-2 rounded">
        Vaciar carrito
    </button>
    `;
}

// =========================
// ELIMINAR
// =========================
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
    actualizarContador();
}

// =========================
// VACIAR
// =========================
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();
    actualizarContador();
}

// =========================
// BUSCADOR
// =========================
const buscador = document.querySelector("input[placeholder='Buscar tonos...']");
const productos = document.querySelectorAll(".group");

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();

    productos.forEach(producto => {
        const nombre = producto.querySelector("h4").innerText.toLowerCase();
        producto.style.display = nombre.includes(texto) ? "block" : "none";
    });
});

// =========================
// SWATCHES
// =========================
const swatches = document.querySelectorAll('[data-image]');
const mainImage = document.getElementById('mainimage');

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        mainImage.src = swatch.getAttribute('data-image');

        swatches.forEach(s => s.classList.remove('ring-4', 'ring-white'));
        swatch.classList.add('ring-4', 'ring-white');
    });
});

// =========================
// BOTONES HERO
// =========================
document.getElementById("btn-explorar").addEventListener("click", () => {
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btn-color").addEventListener("click", () => {
    document.getElementById("swatch").scrollIntoView({ behavior: "smooth" });
});

// =========================
// FILTROS
// =========================
const filtros = document.querySelectorAll(".filtro-btn");

filtros.forEach(btn => {
    btn.addEventListener("click", () => {
        const filtro = btn.dataset.filtro;

        filtros.forEach(b => {
            b.classList.remove("bg-primary", "text-white");
            b.classList.add("bg-white");
        });

        btn.classList.add("bg-primary", "text-white");

        document.querySelectorAll(".group").forEach(prod => {
            const cat = prod.dataset.categoria;

            if (filtro === "todo" || filtro === cat) {
                prod.style.display = "block";
            } else {
                prod.style.display = "none";
            }
        });
    });
});

// =========================
// INIT
// =========================
actualizarContador();

// =========================
// NAVBAR SCROLL + FILTRO
// =========================

// Ir al catálogo mostrando pinturas
document.getElementById("nav-pinturas").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("catalogo").scrollIntoView({
        behavior: "smooth"
    });

    filtrarProductos("pintura");
});

// Ir al catálogo mostrando accesorios
document.getElementById("nav-accesorios").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("catalogo").scrollIntoView({
        behavior: "smooth"
    });

    filtrarProductos("accesorio");
});

// Ir a swatch (opcional para "Mas")
document.getElementById("nav-mas").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("swatch").scrollIntoView({
        behavior: "smooth"
    });
});

function filtrarProductos(filtro) {
    const botones = document.querySelectorAll(".filtro-btn");

    botones.forEach(btn => {
        btn.classList.remove("bg-primary", "text-white");
        btn.classList.add("bg-white");
    });

    // activar botón correcto
    const btnActivo = document.querySelector(`[data-filtro="${filtro}"]`);
    if (btnActivo) {
        btnActivo.classList.add("bg-primary", "text-white");
    }

    document.querySelectorAll(".group").forEach(prod => {
        const cat = prod.dataset.categoria;

        if (filtro === "todo" || filtro === cat) {
            prod.style.display = "block";
        } else {
            prod.style.display = "none";
        }
    });
}