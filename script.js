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

function displayResults(products) {
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--subtle-text);">No se encontraron resultados.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
        // --- LÓGICA DE PRECIOS ACTUALIZADA ---
        let estandarPriceHTML = `<p>PVP: <span>${(product.precio_estandar || 0).toFixed(2)} €</span></p>`;
        if (product.netos) estandarPriceHTML += `<p>${product.condiciones_neto}</p>`;
        
        let grandesCuentasPriceHTML = `<p>PVP: <span>${(product.precio_estandar || 0).toFixed(2)} €</span></p>`;
        if (product.netos_grande_cuentas) grandesCuentasPriceHTML += `<p>${product.condicion_neto_gc}</p>`;
        
        // --- NUEVA LÓGICA PARA CECOFERSA ---
        let cecofersaPriceHTML = `<p>Precio: <span>${(product.precio_cecofersa || 0).toFixed(2)} €</span></p>`;
        if (product.netos) cecofersaPriceHTML += `<p>${product.condiciones_neto}</p>`;

        html += `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-info">
                        <h2>${product.descripcion || 'Sin descripción'}</h2>
                        <p>Ref: ${product.referencia || 'N/A'}</p>
                    </div>
                    <div class="expand-icon"></div>
                </div>
                <div class="product-details">
                    <div class="price-group group-standard">
                        <div class="price-group-header">
                            <img src="img/cvtools.png" alt="CV Tools"><img src="img/bigmat.png" alt="Bigmat">
                            <h3>Cliente Estándar / Bigmat/ 50% dto</h3>
                        </div>
                        ${estandarPriceHTML}
                    </div>
                    
                    <!-- NUEVO GRUPO PARA CECOFERSA -->
                    <div class="price-group group-cecofersa">
                        <div class="price-group-header">
                            <img src="img/cecofersa.png" alt="Cecofersa">
                            <h3>Socios Cecofersa/52% dto</h3>
                        </div>
                        ${cecofersaPriceHTML}
                    </div>

                    <div class="price-group group-grandes-cuentas">
                         <div class="price-group-header"><h3>Grandes Cuentas/ 50% dto</h3></div>
                        ${grandesCuentasPriceHTML}
                    </div>
                    <div class="price-group group-neopro">
                        <div class="price-group-header">
                            <img src="img/neopro.jpg" alt="Neopro"><img src="img/ehlis.jpg" alt="Ehlis">
                            <h3>Socios Neopro / Ehlis / 52% dto</h3>
                        </div>
                        <p>Precio: <span>${(product.precio_grupo1 || 0).toFixed(2)} €</span>(Netos no aplicables)</p>
                    </div>
                    <div class="price-group group-coferdroza">
                        <div class="price-group-header">
                            <img src="img/coferdroza.png" alt="Coferdroza">
                            <h3>Socios Coferdroza / 50% dto</h3>
                        </div>
                        <p>Precio: <span>${(product.precio_grupo3 || 0).toFixed(2)} €</span> (Netos no aplicables)</p>
                    </div>
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = html;
    addAccordionEvents();
}

function addAccordionEvents() {
    const headers = document.querySelectorAll('.product-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const details = header.nextElementSibling;
            if (details.style.maxHeight) {
                details.style.maxHeight = null;
            } else {
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    });
}