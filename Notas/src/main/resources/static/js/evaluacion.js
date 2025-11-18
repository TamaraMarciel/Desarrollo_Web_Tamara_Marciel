// Variable global para almacenar el ID del aviso actual
let avisoActualId = null;

function evaluarAviso(button) {
    console.log('Botón evaluar clickeado'); // Debug
    avisoActualId = button.getAttribute('data-aviso-id');
    console.log('Aviso ID:', avisoActualId); // Debug

    const modal = document.getElementById('modal-evaluacion');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');

    mensajeRespuesta.textContent = '';
    mensajeRespuesta.className = 'mensaje';

    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById('modal-evaluacion');
    modal.style.display = 'none';
    avisoActualId = null;
}

function seleccionarNota(nota) {
    console.log('Nota seleccionada:', nota); // Debug

    if (!avisoActualId) {
        mostrarMensaje('Error: No se ha seleccionado un aviso', 'error');
        return;
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 7) {
        mostrarMensaje('Error: La nota debe ser un número entero entre 1 y 7', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('avisoId', avisoActualId);
    formData.append('nota', nota);

    console.log('Enviando nota...'); // Debug

    fetch('/api/notas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => {
        console.log('Respuesta recibida:', response); // Debug
        return response.json();
    })
    .then(data => {
        console.log('Datos:', data); // Debug
        if (data.success) {
            actualizarNotaEnTabla(avisoActualId, data.promedioNota);
            mostrarMensaje('¡Nota agregada exitosamente!', 'success');
            setTimeout(() => {
                cerrarModal();
            }, 1500);
        } else {
            mostrarMensaje('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al agregar la nota: ' + error.message, 'error');
    });
}

function actualizarNotaEnTabla(avisoId, nuevaNota) {
    const notaCell = document.getElementById('nota-' + avisoId);
    if (notaCell) {
        notaCell.textContent = nuevaNota;
        notaCell.style.transition = 'all 0.3s ease';
        notaCell.style.backgroundColor = '#d4edda';

        setTimeout(() => {
            notaCell.style.backgroundColor = '';
        }, 1000);
    }
}

function mostrarMensaje(mensaje, tipo) {
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    mensajeRespuesta.textContent = mensaje;
    mensajeRespuesta.className = 'mensaje ' + tipo;
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-evaluacion');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Verificar que el script se cargó
console.log('Script evaluacion.js cargado correctamente');