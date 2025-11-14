// --- URL DE TU API DE GOOGLE APPS SCRIPT ---
const API_URL = 'https://script.google.com/macros/s/AKfycbyrFV__NgykcCsZS4eI--1N2j9JCFGbcWed8ZMhZqS3pdAeGzYn8Za0m9butWfYQIpafw/exec';

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allProducts = await response.json();
    } catch (error) {
        searchInput.placeholder = "Error al cargar los datos.";
        console.error('Error fetching data:', error);
    }
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    const filteredProducts = allProducts.filter(product => {
        const descripcion = product.descripcion ? product.descripcion.toLowerCase() : '';
        const referencia = product.referencia ? product.referencia.toString().toLowerCase() : '';
        return descripcion.includes(query) || referencia.includes(query);
    });
    displayResults(filteredProducts);
});

// FUNCIÓN PARA MOSTRAR RESULTADOS CON LA NUEVA LÓGICA DE CLARIDAD
function displayResults(products) {
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--subtle-text);">No se encontraron resultados.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
        // --- LÓGICA DE PRECIOS PARA CADA UNA DE LAS 8 TARIFAS ---
        const generalPriceHTML = product.netos ? `<p>${product.condiciones_neto}</p>` : `<p>Precio Final: <span>${(product.precio_estandar || 0).toFixed(2)} €</span> (Dto. 50%)</p>`;
        const bigmatPriceHTML = product.netos ? `<p>${product.condiciones_neto}</p>` : `<p>Precio Final: <span>${(product.precio_estandar || 0).toFixed(2)} €</span> (Dto. 50%)</p>`;
        const neoproPriceHTML = `<p>Precio Final: <span>${(product.precio_grupo1 || 0).toFixed(2)} €</span> (Dto. 52%)</p>`;
        const ehlisPriceHTML = `<p>Precio Final: <span>${(product.precio_grupo1 || 0).toFixed(2)} €</span> (Dto. 52%)</p>`;
        const synergasPriceHTML = `<p>Precio Final: <span>${(product.precio_grupo1 || 0).toFixed(2)} €</span> (Dto. 52%)</p>`;
        const cecofersaPriceHTML = product.netos ? `<p>${product.condiciones_neto}</p>` : `<p>Precio Final: <span>${(product.precio_cecofersa || 0).toFixed(2)} €</span> (Dto. 52%)</p>`;
        const grandesCuentasPriceHTML = product.netos_grande_cuentas ? `<p>${product.condicion_neto_gc}</p>` : `<p>Precio Final: <span>${(product.precio_estandar || 0).toFixed(2)} €</span> (Dto. 50%)</p>`;
        const coferdrozaPriceHTML = `<p>Precio Final: <span>${(product.precio_grupo3 || 0).toFixed(2)} €</span> (Dto. 50%)</p>`;

        html += `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-info">
                        <h2>${product.descripcion || 'Sin descripción'}</h2>
                        <p>Ref: ${product.referencia || 'N/A'} &nbsp; | &nbsp; PVP Base: <strong>${(product.pvp || 0).toFixed(2)} €</strong></p>
                    </div>
                    <div class="expand-icon"></div>
                </div>
                <div class="product-details">
                    <div class="price-group group-standard"><div class="price-group-header"><h3>Tarifa General</h3></div>${generalPriceHTML}</div>
                    <div class="price-group group-bigmat"><div class="price-group-header"><img src="img/bigmat.png" alt="Bigmat"><h3>Tarifa BigMat</h3></div>${bigmatPriceHTML}</div>
                    <div class="price-group group-neopro"><div class="price-group-header"><img src="img/neopro.jpg" alt="Neopro"><h3>Tarifa Neopro</h3></div>${neoproPriceHTML}</div>
                    <div class="price-group group-ehlis"><div class="price-group-header"><img src="img/ehlis.jpg" alt="Ehlis"><h3>Tarifa Ehlis</h3></div>${ehlisPriceHTML}</div>
                    <div class="price-group group-cecofersa"><div class="price-group-header"><img src="img/cecofersa.png" alt="Cecofersa"><h3>Tarifa Cecofersa</h3></div>${cecofersaPriceHTML}</div>
                    <div class="price-group group-synergas"><div class="price-group-header"><h3>Tarifa Synergas</h3></div>${synergasPriceHTML}</div>
                    <div class="price-group group-grandes-cuentas"><div class="price-group-header"><h3>Tarifa Grandes Cuentas</h3></div>${grandesCuentasPriceHTML}</div>
                    <div class="price-group group-coferdroza"><div class="price-group-header"><img src="img/coferdroza.png" alt="Coferdroza"><h3>Tarifa Coferdroza</h3></div>${coferdrozaPriceHTML}</div>
                </div>
            </div>`;
    });
    resultsContainer.innerHTML = html;
    addAccordionEvents();
}

function addAccordionEvents() {
    document.querySelectorAll(".product-header").forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const details = header.nextElementSibling;
            details.style.maxHeight ? details.style.maxHeight = null : details.style.maxHeight = details.scrollHeight + "px";
        });
    });
}