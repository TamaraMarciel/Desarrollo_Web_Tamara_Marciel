document.addEventListener('DOMContentLoaded', function() {
    // Obtener todas las filas del tbody
    const filas = document.querySelectorAll('.adoption-table tbody tr');
    
    filas.forEach(function(fila, index) {
        // Hacer las filas clickeables
        fila.style.cursor = 'pointer';
        
        // Agregar evento click
        fila.addEventListener('click', function() {
            // Redirigir a la página de detalle correspondiente
            // El índice + 1 corresponde al número del archivo
            window.location.href = `animals/animal${index + 1}.html`;
        });
        
        // Efecto visual al hacer hover (opcional)
        fila.addEventListener('mouseenter', function() {
            fila.style.backgroundColor = 'rgba(140, 201, 240, 0.1)';
        });
        
        fila.addEventListener('mouseleave', function() {
            fila.style.backgroundColor = '';
        });
    });
});