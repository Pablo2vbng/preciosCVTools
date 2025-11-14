// --- PEGA AQUÍ LA URL DE TU API DE GOOGLE APPS SCRIPT ---
const API_URL = 'https://script.google.com/macros/s/AKfycbyrFV__NgykcCsZS4eI--1N2j9JCFGbcWed8ZMhZqS3pdAeGzYn8Za0m9butWfYQIpafw/exec';

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
let allProducts = []; // Array para almacenar todos los productos

// 1. Cargar todos los datos de la API cuando la página se carga
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(API_URL);
        allProducts = await response.json();
        displayResults(allProducts); // Opcional: mostrar todos al inicio
    } catch (error) {
        resultsContainer.innerHTML = '<p>Error al cargar los datos.</p>';
        console.error('Error fetching data:', error);
    }
});

// 2. Escuchar lo que el usuario escribe en el buscador
searchInput.addEventListener('keyup', () => {
    const query = searchInput.value.toLowerCase();
    
    if (query.length < 2) { // No buscar hasta que haya al menos 2 letras
        displayResults(allProducts); // O mostrar nada: resultsContainer.innerHTML = '';
        return;
    }

    const filteredProducts = allProducts.filter(product => {
        return product.descripcion.toLowerCase().includes(query) || 
               product.referencia.toString().toLowerCase().includes(query);
    });

    displayResults(filteredProducts);
});

// 3. Función para mostrar los resultados en la página
function displayResults(products) {
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
        html += `
            <div class="product-card">
                <h2>${product.descripcion}</h2>
                <p>Referencia: ${product.referencia}</p>

                <div class="price-group">
                    <h3>Cliente Estándar / Bigmat / Cecofersa</h3>
                    <p>Precio General: <span>${product.precio_estandar.toFixed(2)} €</span></p>
                    ${product.netos ? `<p>${product.condiciones_neto}</p>` : ''}
                </div>
                
                <div class="price-group">
                    <h3>Grandes Cuentas</h3>
                    <p>Precio General: <span>${product.precio_estandar.toFixed(2)} €</span></p>
                    ${product.netos_grande_cuentas ? `<p>${product.condicion_neto_gc}</p>` : ''}
                </div>

                <div class="price-group">
                    <h3>Socios Neopro / Ehlis / Synergas</h3>
                    <p>Precio: <span>${product.precio_grupo1.toFixed(2)} €</span></p>
                </div>
                
                <div class="price-group">
                    <h3>Socios Coferdroza / Las Rias</h3>
                    <p>Precio: <span>${product.precio_grupo3.toFixed(2)} €</span> (Netos no aplicables)</p>
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = html;
}