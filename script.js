// --- PEGA AQUÍ LA URL DE TU API DE GOOGLE APPS SCRIPT ---
const API_URL = 'https://script.google.com/macros/s/AKfycbyrFV__NgykcCsZS4eI--1N2j9JCFGbcWed8ZMhZqS3pdAeGzYn8Za0m9butWfYQIpafw/exec';

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
let allProducts = []; // Array para almacenar todos los productos

// 1. Cargar todos los datos de la API cuando la página se carga
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        // Opcional: puedes quitar la siguiente línea si no quieres mostrar nada al inicio
        // displayResults(allProducts); 
    } catch (error) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error al cargar los datos. Revisa la URL de la API y la configuración del script de Google.</p>';
        console.error('Error fetching data:', error);
    }
});

// 2. Escuchar lo que el usuario escribe en el buscador
searchInput.addEventListener('input', () => { // Cambiado a 'input' para una respuesta más instantánea
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        resultsContainer.innerHTML = ''; // Limpiar resultados si la búsqueda es corta
        return;
    }

    const filteredProducts = allProducts.filter(product => {
        // Asegurarse de que los campos existen antes de buscar
        const descripcion = product.descripcion ? product.descripcion.toLowerCase() : '';
        const referencia = product.referencia ? product.referencia.toString().toLowerCase() : '';
        return descripcion.includes(query) || referencia.includes(query);
    });

    displayResults(filteredProducts);
});

// 3. Función para mostrar los resultados en la página
function displayResults(products) {
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center;">No se encontraron resultados.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
        html += `
            <div class="product-card">
                <h2>${product.descripcion || 'Sin descripción'}</h2>
                <p>Referencia: ${product.referencia || 'N/A'}</p>

                <div class="price-group">
                    <div class="price-group-header">
                        <img src="img/cvtools.png" alt="CV Tools">
                        <img src="img/bigmat.png" alt="Bigmat">
                        <img src="img/cecofersa.png" alt="Cecofersa">
                        <h3>Cliente Estándar / Bigmat / Cecofersa</h3>
                    </div>
                    <p>Precio General: <span>${(product.precio_estandar || 0).toFixed(2)} €</span></p>
                    ${product.netos ? `<p>${product.condiciones_neto}</p>` : ''}
                </div>
                
                <div class="price-group">
                     <div class="price-group-header">
                        <h3>Grandes Cuentas</h3>
                    </div>
                    <p>Precio General: <span>${(product.precio_estandar || 0).toFixed(2)} €</span></p>
                    ${product.netos_grande_cuentas ? `<p>${product.condicion_neto_gc}</p>` : ''}
                </div>

                <div class="price-group">
                    <div class="price-group-header">
                        <img src="img/neopro.jpg" alt="Neopro">
                        <img src="img/ehlis.jpg" alt="Ehlis">
                        <h3>Socios Neopro / Ehlis / Synergas</h3>
                    </div>
                    <p>Precio: <span>${(product.precio_grupo1 || 0).toFixed(2)} €</span></p>
                </div>
                
                <div class="price-group">
                    <div class="price-group-header">
                        <img src="img/coferdroza.png" alt="Coferdroza">
                        <h3>Socios Coferdroza / Las Rias</h3>
                    </div>
                    <p>Precio: <span>${(product.precio_grupo3 || 0).toFixed(2)} €</span> (Netos no aplicables)</p>
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = html;
}