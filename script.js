// --- APUNTAMOS AL ARCHIVO LOCAL ---
const API_URL_BASE = ''; // No necesitamos API

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const tariffSelector = document.getElementById('tariffSelector');

let allProducts = [];
let currentTariffFile = 'Tarifa_General.json'; // Tarifa por defecto

async function loadTariffData(tariffFile) {
    searchInput.placeholder = 'Cargando datos...';
    try {
        const response = await fetch(`${tariffFile}?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const dataObject = await response.json();
        const sheetName = Object.keys(dataObject)[0]; 
        allProducts = dataObject[sheetName];

        searchInput.placeholder = 'Buscar por referencia o descripción...';
    } catch (error) {
        searchInput.placeholder = `Error al cargar ${tariffFile}.`;
        console.error('Error fetching data:', error);
        allProducts = [];
    }
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    loadTariffData(currentTariffFile);
});

tariffSelector.addEventListener('change', (event) => {
    currentTariffFile = event.target.value;
    loadTariffData(currentTariffFile);
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query.length < 2 || allProducts.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }
    const filteredProducts = allProducts.filter(product => {
        const descripcion = product.Descripcion ? product.Descripcion.toLowerCase() : '';
        const referencia = product.Referencia ? product.Referencia.toString().toLowerCase() : '';
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
    products.forEach((product) => {
        let pvpBase = 0;
        let descuento = 'N/A';
        let precioFinal = 'N/A';
        let precioNeto = 'No aplica';
        let precioFinalNumerico = 0;

        // LÓGICA EXPLÍCITA Y CORREGIDA PARA CADA TARIFA
        if (currentTariffFile.includes('General') || currentTariffFile.includes('Bigmat')) {
            descuento = '50%';
            precioFinalNumerico = product.PRECIO_ESTANDAR || 0;
            if (precioFinalNumerico > 0) pvpBase = precioFinalNumerico / 0.50;
            if (product.NETOS) precioNeto = product.CONDICIONES_NETO;
        } 
        else if (currentTariffFile.includes('Neopro') || currentTariffFile.includes('Ehlis') || currentTariffFile.includes('Synergas')) {
            descuento = '52%';
            // CORRECCIÓN: Usar el nombre de columna correcto del JSON
            precioFinalNumerico = product.PRECIO_GRUPO1 || 0;
            if (precioFinalNumerico > 0) pvpBase = precioFinalNumerico / 0.48;
            precioNeto = 'No aplica';
        } 
        else if (currentTariffFile.includes('Cecofersa')) {
            descuento = '52%';
            // CORRECCIÓN: Usar el nombre de columna correcto del JSON
            precioFinalNumerico = product.PRECIO_CECOFERSA || 0;
            if (precioFinalNumerico > 0) pvpBase = precioFinalNumerico / 0.48;
            if (product.NETOS) precioNeto = product.CONDICIONES_NETO;
        }
        else if (currentTariffFile.includes('Grandes_Cuentas')) {
            descuento = '50%';
            precioFinalNumerico = product.PRECIO_ESTANDAR || 0;
            if (precioFinalNumerico > 0) pvpBase = precioFinalNumerico / 0.50;
            if (product.NETOS_GRANDE_CUENTAS) precioNeto = product.CONDICION_NETO_GC;
        }
        else if (currentTariffFile.includes('Coferdroza')) {
            descuento = '50%';
            // CORRECCIÓN: Usar el nombre de columna correcto del JSON
            precioFinalNumerico = product.PRECIO_GRUPO3 || 0;
            if (precioFinalNumerico > 0) pvpBase = precioFinalNumerico / 0.50;
            precioNeto = 'No aplica';
        }
        
        // Formatear para mostrar
        precioFinal = precioFinalNumerico.toFixed(2);
        
        html += `
            <div class="product-card-single">
                <h2>${product.Descripcion || 'Sin descripción'}</h2>
                <p>Ref: ${product.Referencia || 'N/A'}</p>
                <div class="price-details-grid">
                    <p class="price-line"><strong>PVP Base:</strong> <span>${pvpBase.toFixed(2)} €</span></p>
                    <p class="price-line"><strong>Descuento:</strong> <span>${descuento}</span></p>
                    <p class="price-line"><strong>Precio Final:</strong> <span class="final-price">${precioFinal} €</span></p>
                    <p class="price-line"><strong>Precio Neto:</strong> <span class="neto-price">${precioNeto}</span></p>
                </div>
            </div>`;
    });
    resultsContainer.innerHTML = html;
}