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
    products.forEach((product, index) => {
        const pvpBase = (product.pvp || 0).toFixed(2);
        const createPriceDetail = (dto, finalPrice, netoInfo) => `<div class="price-details-grid"><p class="price-line"><strong>PVP Base:</strong> <span>${pvpBase} €</span></p><p class="price-line"><strong>Descuento:</strong> <span>${dto}</span></p><p class="price-line"><strong>Precio Final:</strong> <span class="final-price">${finalPrice}</span></p><p class="price-line"><strong>Precio Neto:</strong> <span class="neto-price">${netoInfo}</span></p></div>`;
        const generalPriceHTML = createPriceDetail('50%', `${(product.precio_estandar || 0).toFixed(2)} €`, product.condiciones_neto || 'No aplica');
        const bigmatPriceHTML = createPriceDetail('50%', `${(product.precio_estandar || 0).toFixed(2)} €`, product.condiciones_neto || 'No aplica');
        const neoproPriceHTML = createPriceDetail('52%', `${(product.precio_grupo1 || 0).toFixed(2)} €`, 'No aplica');
        const ehlisPriceHTML = createPriceDetail('52%', `${(product.precio_grupo1 || 0).toFixed(2)} €`, 'No aplica');
        const synergasPriceHTML = createPriceDetail('52%', `${(product.precio_grupo1 || 0).toFixed(2)} €`, 'No aplica');
        const cecofersaPriceHTML = createPriceDetail('52%', `${(product.precio_cecofersa || 0).toFixed(2)} €`, product.condiciones_neto || 'No aplica');
        const grandesCuentasPriceHTML = createPriceDetail('50%', `${(product.precio_estandar || 0).toFixed(2)} €`, product.condicion_neto_gc || 'No aplica');
        const coferdrozaPriceHTML = createPriceDetail('50%', `${(product.precio_grupo3 || 0).toFixed(2)} €`, 'No aplica');

        html += `
            <div class="product-card">
                <div class="product-header" data-reference="${product.referencia}" data-description="${product.descripcion || ''}" data-container-id="tech-sheet-${index}">
                    <div class="product-info">
                        <h2>${product.descripcion || 'Sin descripción'}</h2>
                        <p>Ref: ${product.referencia || 'N/A'}</p>
                    </div>
                    <div class="expand-icon"></div>
                </div>
                <div class="product-details">
                    <!-- FICHA TÉCNICA AHORA VA PRIMERO -->
                    <div class="tech-sheet-container" id="tech-sheet-${index}">
                        <!-- El botón de la ficha técnica se insertará aquí dinámicamente -->
                    </div>

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
        let hasBeenChecked = false;
        header.addEventListener('click', async () => {
            const isActive = header.classList.contains('active');
            document.querySelectorAll('.product-header.active').forEach(activeHeader => {
                if(activeHeader !== header) {
                    activeHeader.classList.remove('active');
                    activeHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            header.classList.toggle('active');
            const details = header.nextElementSibling;
            
            if (header.classList.contains('active')) {
                // Primero ajustamos la altura y luego buscamos, para una animación más suave
                details.style.maxHeight = details.scrollHeight + "px";
                
                if (!hasBeenChecked) {
                    hasBeenChecked = true;
                    const reference = header.dataset.reference;
                    const description = encodeURIComponent(header.dataset.description);
                    const containerId = header.dataset.containerId;
                    const container = document.getElementById(containerId);
                    
                    container.innerHTML = '<p class="tech-sheet-status">Buscando ficha técnica...</p>';
                    
                    const finderUrl = `${API_URL}?action=findFile&reference=${reference}&description=${description}`;

                    try {
                        const response = await fetch(finderUrl);
                        const fileUrl = await response.text();

                        if (fileUrl && fileUrl !== 'null' && fileUrl.startsWith('https://')) {
                            // Icono SVG para el botón
                            const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`;
                            container.innerHTML = `<a href="${fileUrl}" class="tech-sheet-button" target="_blank">${iconSVG} <span>Ver Ficha Técnica</span></a>`;
                        } else {
                            container.innerHTML = '<p class="tech-sheet-status">Ficha técnica no encontrada.</p>';
                        }
                    } catch (error) {
                        container.innerHTML = '<p class="tech-sheet-status">Error al buscar la ficha.</p>';
                        console.error('Error finding file:', error);
                    }
                    // Reajustar la altura del acordeón por si el contenido ha cambiado
                    details.style.maxHeight = details.scrollHeight + "px";
                }
            } else {
                details.style.maxHeight = null;
            }
        });
    });
}