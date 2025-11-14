// Espera a que la librería jsPDF esté lista
window.jsPDF = window.jspdf.jsPDF;

// --- URL DE TU API DE GOOGLE APPS SCRIPT ---
const API_URL = 'https://script.google.com/macros/s/AKfycbyrFV__NgykcCsZS4eI--1N2j9JCFGbcWed8ZMhZqS3pdAeGzYn8Za0m9butWfYQIpafw/exec';
let allProducts = [];

// 1. Cargar todos los datos al entrar en la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar datos');
        allProducts = await response.json();
    } catch (error) {
        alert('No se pudieron cargar los datos para generar los PDFs. Inténtalo de nuevo.');
        console.error(error);
    }
});

// 2. Función genérica para crear un PDF (sin cambios)
function generatePdf(title, head, bodyData, button) {
    if (allProducts.length === 0) {
        alert('Los datos aún no se han cargado. Espera un momento y vuelve a intentarlo.');
        return;
    }
    const originalText = button.textContent;
    button.textContent = 'Generando...';
    button.disabled = true;

    const doc = new jsPDF({ orientation: 'landscape' }); // Orientación horizontal para más espacio
    doc.text(title, 14, 20);
    doc.autoTable({
        head: [head], body: bodyData, startY: 25, theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5 }, 
        headStyles: { fillColor: [0, 122, 255], fontSize: 7 }
    });
    doc.save(`${title}.pdf`);

    button.textContent = originalText;
    button.disabled = false;
}

// 3. NUEVA LÓGICA PARA LOS BOTONES DE PDF
const head = ['Ref.', 'Descripción', 'PVP Base', 'Dto.', 'Precio Final', 'Precio por Cantidad'];

document.getElementById('pdf-general').addEventListener('click', (e) => {
    const body = allProducts.map(p => {
        const pvpBase = `${(p.pvp || 0).toFixed(2)} €`;
        if (p.netos) return [p.referencia, p.descripcion, pvpBase, 'Neto', '-', p.condiciones_neto];
        return [p.referencia, p.descripcion, pvpBase, '50%', `${(p.precio_estandar || 0).toFixed(2)} €`, '-'];
    });
    generatePdf('Tarifa General', head, body, e.target);
});

document.getElementById('pdf-bigmat').addEventListener('click', (e) => {
    const body = allProducts.map(p => {
        const pvpBase = `${(p.pvp || 0).toFixed(2)} €`;
        if (p.netos) return [p.referencia, p.descripcion, pvpBase, 'Neto', '-', p.condiciones_neto];
        return [p.referencia, p.descripcion, pvpBase, '50%', `${(p.precio_estandar || 0).toFixed(2)} €`, '-'];
    });
    generatePdf('Tarifa BigMat', head, body, e.target);
});

document.getElementById('pdf-neopro').addEventListener('click', (e) => {
    const body = allProducts.map(p => [p.referencia, p.descripcion, `${(p.pvp || 0).toFixed(2)} €`, '52%', `${(p.precio_grupo1 || 0).toFixed(2)} €`, '-']);
    generatePdf('Tarifa Neopro', head, body, e.target);
});

document.getElementById('pdf-ehlis').addEventListener('click', (e) => {
    const body = allProducts.map(p => [p.referencia, p.descripcion, `${(p.pvp || 0).toFixed(2)} €`, '52%', `${(p.precio_grupo1 || 0).toFixed(2)} €`, '-']);
    generatePdf('Tarifa Ehlis', head, body, e.target);
});

document.getElementById('pdf-cecofersa').addEventListener('click', (e) => {
    const body = allProducts.map(p => {
        const pvpBase = `${(p.pvp || 0).toFixed(2)} €`;
        if (p.netos) return [p.referencia, p.descripcion, pvpBase, 'Neto', '-', p.condiciones_neto];
        return [p.referencia, p.descripcion, pvpBase, '52%', `${(p.precio_cecofersa || 0).toFixed(2)} €`, '-'];
    });
    generatePdf('Tarifa Cecofersa', head, body, e.target);
});

document.getElementById('pdf-synergas').addEventListener('click', (e) => {
    const body = allProducts.map(p => [p.referencia, p.descripcion, `${(p.pvp || 0).toFixed(2)} €`, '52%', `${(p.precio_grupo1 || 0).toFixed(2)} €`, '-']);
    generatePdf('Tarifa Synergas', head, body, e.target);
});

document.getElementById('pdf-grandes-cuentas').addEventListener('click', (e) => {
    const body = allProducts.map(p => {
        const pvpBase = `${(p.pvp || 0).toFixed(2)} €`;
        if (p.netos_grande_cuentas) return [p.referencia, p.descripcion, pvpBase, 'Neto G.C.', '-', p.condicion_neto_gc];
        return [p.referencia, p.descripcion, pvpBase, '50%', `${(p.precio_estandar || 0).toFixed(2)} €`, '-'];
    });
    generatePdf('Tarifa Grandes Cuentas', head, body, e.target);
});

document.getElementById('pdf-coferdroza').addEventListener('click', (e) => {
    const body = allProducts.map(p => [p.referencia, p.descripcion, `${(p.pvp || 0).toFixed(2)} €`, '50%', `${(p.precio_grupo3 || 0).toFixed(2)} €`, '-']);
    generatePdf('Tarifa Coferdroza', head, body, e.target);
});