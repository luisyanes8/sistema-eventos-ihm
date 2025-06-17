document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos de Navegación y Secciones ---
    const navEventos = document.getElementById('nav-eventos');
    const navUbicaciones = document.getElementById('nav-ubicaciones');
    const navContactos = document.getElementById('nav-contactos');

    const eventosSection = document.getElementById('eventos-section');
    const ubicacionesSection = document.getElementById('ubicaciones-section');
    const contactosSection = document.getElementById('contactos-section');

    // --- Botones de Mostrar Formulario ---
    const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
    const btnNuevaUbicacion = document.getElementById('btn-nueva-ubicacion');
    const btnNuevoContacto = document.getElementById('btn-nuevo-contacto');

    // --- Formularios ---
    const formularioEvento = document.getElementById('formulario-evento');
    const formularioUbicacion = document.getElementById('formulario-ubicacion');
    const formularioContacto = document.getElementById('formulario-contacto');

    // --- Botones de Cancelar Formulario ---
    const btnCancelarEvento = document.getElementById('btn-cancelar-evento');
    const btnCancelarUbicacion = document.getElementById('btn-cancelar-ubicacion');
    const btnCancelarContacto = document.getElementById('btn-cancelar-contacto');

    // --- Elementos de Lista (para mostrar datos) ---
    const eventosUl = document.getElementById('eventos-ul');
    const ubicacionesUl = document.getElementById('ubicaciones-ul');
    const contactosUl = document.getElementById('contactos-ul');

    // --- Formularios y sus inputs ---
    const formEvento = document.getElementById('form-evento');
    const formUbicacion = document.getElementById('form-ubicacion');
    const formContacto = document.getElementById('form-contacto');

    // Variables para manejar el modo de edición (ID del elemento que se está editando)
    let editingEventId = null;
    let editingUbicacionId = null;
    let editingContactoId = null;

    // --- Funciones de Utilidad ---
    function hideAllSections() {
        eventosSection.classList.add('hidden');
        ubicacionesSection.classList.add('hidden');
        contactosSection.classList.add('hidden');
        // Ocultar todos los formularios al cambiar de sección
        formularioEvento.classList.add('hidden');
        formularioUbicacion.classList.add('hidden');
        formularioContacto.classList.add('hidden');
    }

    function setActiveNav(navItem) {
        document.querySelectorAll('nav ul li a').forEach(item => {
            item.classList.remove('active-nav');
        });
        navItem.classList.add('active-nav');
    }

    // Función para limpiar un formulario
    function clearForm(formId) {
        const form = document.getElementById(formId);
        form.reset(); // Resetea todos los campos del formulario
    }

    // --- Funciones para manejar Datos (simulado con localStorage) ---
    function getStoredData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    function saveStoredData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // --- Lógica para Eventos ---
    function renderEventos() {
        const eventos = getStoredData('eventos');
        eventosUl.innerHTML = ''; // Limpiar lista
        if (eventos.length === 0) {
            eventosUl.innerHTML = '<p>No hay eventos registrados.</p>';
            return;
        }
        eventos.forEach(evento => {
            const li = document.createElement('li');
            li.setAttribute('data-id', evento.id);
            li.innerHTML = `
                <div>
                    <strong>${evento.titulo}</strong><br>
                    <span>Fecha: ${evento.fecha} ${evento.hora}</span><br>
                    <span>Lugar: ${evento.lugar || 'No especificado'}</span><br>
                    <span>Invitados: ${evento.invitados || 'N/A'}</span><div class="actions">
<button class="btn-edit" data-type="evento" data-id="{evento.id}">Editar</button>
<button class="btn-delete" data-type="evento" data-id="${evento.id}">Eliminar</button>
</div>
`;
eventosUl.appendChild(li);
});
}
    formEvento.addEventListener('submit', (e) => {
        e.preventDefault();
        const evento = {
            id: editingEventId || Date.now(), // Usar ID existente si estamos editando, sino generar uno nuevo
            titulo: document.getElementById('evento-titulo').value,
            invitados: document.getElementById('evento-invitados').value,
            fecha: document.getElementById('evento-fecha').value,
            hora: document.getElementById('evento-hora').value,
            zonaHoraria: document.getElementById('evento-zona-horaria').value,
            descripcion: document.getElementById('evento-descripcion').value,
            repeticion: document.getElementById('evento-repeticion').value,
            recordatorio: document.getElementById('evento-recordatorio').value,
            clasificacion: document.getElementById('evento-clasificacion').value,
            lugar: document.getElementById('evento-lugar').value,
        };

        let eventos = getStoredData('eventos');
        if (editingEventId) {
            // Modo edición: encontrar y reemplazar el evento
            eventos = eventos.map(ev => ev.id === editingEventId ? evento : ev);
            alert('Evento actualizado con éxito!');
        } else {
            // Modo creación: añadir nuevo evento
            eventos.push(evento);
            alert('Evento creado con éxito!');
        }
        saveStoredData('eventos', eventos);
        renderEventos();
        formularioEvento.classList.add('hidden'); // Ocultar formulario
        clearForm('form-evento'); // Limpiar campos
        editingEventId = null; // Resetear ID de edición
    });

    // Event listener para botones de editar/eliminar en la lista de eventos
    eventosUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit') && e.target.dataset.type === 'evento') {
            editingEventId = parseInt(e.target.dataset.id);
            const eventos = getStoredData('eventos');
            const eventoToEdit = eventos.find(ev => ev.id === editingEventId);

            if (eventoToEdit) {
                document.getElementById('evento-titulo').value = eventoToEdit.titulo;
                document.getElementById('evento-invitados').value = eventoToEdit.invitados;
                document.getElementById('evento-fecha').value = eventoToEdit.fecha;
                document.getElementById('evento-hora').value = eventoToEdit.hora;
                document.getElementById('evento-zona-horaria').value = eventoToEdit.zonaHoraria;
                document.getElementById('evento-descripcion').value = eventoToEdit.descripcion;
                document.getElementById('evento-repeticion').value = eventoToEdit.repeticion;
                document.getElementById('evento-recordatorio').value = eventoToEdit.recordatorio;
                document.getElementById('evento-clasificacion').value = eventoToEdit.clasificacion;
                document.getElementById('evento-lugar').value = eventoToEdit.lugar;

                formularioEvento.classList.remove('hidden'); // Mostrar formulario
                // Asegúrate de que la sección de eventos esté activa
                hideAllSections();
                eventosSection.classList.remove('hidden');
            }
        } else if (e.target.classList.contains('btn-delete') && e.target.dataset.type === 'evento') {
            const idToDelete = parseInt(e.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                let eventos = getStoredData('eventos');
                eventos = eventos.filter(ev => ev.id !== idToDelete);
                saveStoredData('eventos', eventos);
                renderEventos();
                alert('Evento eliminado con éxito!');
            }
        }
    });


    // --- Lógica para Ubicaciones ---
    function renderUbicaciones() {
        const ubicaciones = getStoredData('ubicaciones');
        ubicacionesUl.innerHTML = ''; // Limpiar lista
        if (ubicaciones.length === 0) {
            ubicacionesUl.innerHTML = '<p>No hay ubicaciones registradas.</p>';
            return;
        }
        ubicaciones.forEach(ubicacion => {
            const li = document.createElement('li');
            li.setAttribute('data-id', ubicacion.id);
            li.innerHTML = `
                <div>
                    <strong>${ubicacion.titulo}</strong><br>
                    <span>Dirección: ${ubicacion.direccion}</span><br>
                    <span>Coordenadas: <span class="math-inline">\{ubicacion\.coordenadas \|\| 'N/A'\}</span\></div>
<div class="actions">
<button class="btn-edit" data-type="ubicacion" data-id="{ubicacion.id}">Editar</button>
<button class="btn-delete" data-type="ubicacion" data-id="${ubicacion.id}">Eliminar</button>
</div>
`;
ubicacionesUl.appendChild(li);
});
}

    formUbicacion.addEventListener('submit', (e) => {
        e.preventDefault();
        const ubicacion = {
            id: editingUbicacionId || Date.now(),
            titulo: document.getElementById('ubicacion-titulo').value,
            direccion: document.getElementById('ubicacion-direccion').value,
            coordenadas: document.getElementById('ubicacion-coordenadas').value,
        };

        let ubicaciones = getStoredData('ubicaciones');
        if (editingUbicacionId) {
            ubicaciones = ubicaciones.map(ub => ub.id === editingUbicacionId ? ubicacion : ub);
            alert('Ubicación actualizada con éxito!');
        } else {
            ubicaciones.push(ubicacion);
            alert('Ubicación creada con éxito!');
        }
        saveStoredData('ubicaciones', ubicaciones);
        renderUbicaciones();
        formularioUbicacion.classList.add('hidden');
        clearForm('form-ubicacion');
        editingUbicacionId = null;
    });

    ubicacionesUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit') && e.target.dataset.type === 'ubicacion') {
            editingUbicacionId = parseInt(e.target.dataset.id);
            const ubicaciones = getStoredData('ubicaciones');
            const ubicacionToEdit = ubicaciones.find(ub => ub.id === editingUbicacionId);

            if (ubicacionToEdit) {
                document.getElementById('ubicacion-titulo').value = ubicacionToEdit.titulo;
                document.getElementById('ubicacion-direccion').value = ubicacionToEdit.direccion;
                document.getElementById('ubicacion-coordenadas').value = ubicacionToEdit.coordenadas;
                formularioUbicacion.classList.remove('hidden');
                hideAllSections();
                ubicacionesSection.classList.remove('hidden');
            }
        } else if (e.target.classList.contains('btn-delete') && e.target.dataset.type === 'ubicacion') {
            const idToDelete = parseInt(e.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
                let ubicaciones = getStoredData('ubicaciones');
                ubicaciones = ubicaciones.filter(ub => ub.id !== idToDelete);
                saveStoredData('ubicaciones', ubicaciones);
                renderUbicaciones();
                alert('Ubicación eliminada con éxito!');
            }
        }
    });


    // --- Lógica para Contactos ---
    function renderContactos() {
        const contactos = getStoredData('contactos');
        contactosUl.innerHTML = ''; // Limpiar lista
        if (contactos.length === 0) {
            contactosUl.innerHTML = '<p>No hay contactos registrados.</p>';
            return;
        }
        contactos.forEach(contacto => {
            const li = document.createElement('li');
            li.setAttribute('data-id', contacto.id);
            li.innerHTML = `
                <div>
                    <strong>${contacto.nombreCompleto}</strong><br>
                    <span>Email: ${contacto.correoElectronico}</span><br>
                    <span>Teléfono: ${contacto.numeroTelefono || 'N/A'}</span>
                    ${contacto.fotografia ? `<br><img src="${contacto.fotografia}" alt="Foto" style="width: 50px; height: 50px; border-radius: 50%; margin-top: 5px;">` : ''}
                </div>
                <div class="actions">
                    <button class="btn-edit" data-type="contacto" data-id="<span class="math-inline">\{contacto\.id\}"\>Editar</button\>
<button class="btn-delete" data-type="contacto" data-id="{contacto.id}">Eliminar</button>
</div>
`;
contactosUl.appendChild(li);
});
}

    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        const contacto = {
            id: editingContactoId || Date.now(),
            saludo: document.getElementById('contacto-saludo').value,
            nombreCompleto: document.getElementById('contacto-nombre-completo').value,
            numeroIdentificacion: document.getElementById('contacto-identificacion').value,
            correoElectronico: document.getElementById('contacto-email').value,
            numeroTelefono: document.getElementById('contacto-telefono').value,
            fotografia: document.getElementById('contacto-fotografia').value,
        };

        let contactos = getStoredData('contactos');
        if (editingContactoId) {
            contactos = contactos.map(con => con.id === editingContactoId ? contacto : con);
            alert('Contacto actualizado con éxito!');
        } else {
            contactos.push(contacto);
            alert('Contacto creado con éxito!');
        }
        saveStoredData('contactos', contactos);
        renderContactos();
        formularioContacto.classList.add('hidden');
        clearForm('form-contacto');
        editingContactoId = null;
    });

    contactosUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit') && e.target.dataset.type === 'contacto') {
            editingContactoId = parseInt(e.target.dataset.id);
            const contactos = getStoredData('contactos');
            const contactoToEdit = contactos.find(con => con.id === editingContactoId);

            if (contactoToEdit) {
                document.getElementById('contacto-saludo').value = contactoToEdit.saludo;
                document.getElementById('contacto-nombre-completo').value = contactoToEdit.nombreCompleto;
                document.getElementById('contacto-identificacion').value = contactoToEdit.numeroIdentificacion;
                document.getElementById('contacto-email').value = contactoToEdit.correoElectronico;
                document.getElementById('contacto-telefono').value = contactoToEdit.numeroTelefono;
                document.getElementById('contacto-fotografia').value = contactoToEdit.fotografia;
                formularioContacto.classList.remove('hidden');
                hideAllSections();
                contactosSection.classList.remove('hidden');
            }
        } else if (e.target.classList.contains('btn-delete') && e.target.dataset.type === 'contacto') {
            const idToDelete = parseInt(e.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                let contactos = getStoredData('contactos');
                contactos = contactos.filter(con => con.id !== idToDelete);
                saveStoredData('contactos', contactos);
                renderContactos();
                alert('Contacto eliminado con éxito!');
            }
        }
    });


    // --- Event Listeners para Mostrar/Ocultar Formularios y Navegación ---
    navEventos.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        eventosSection.classList.remove('hidden');
        setActiveNav(navEventos);
        renderEventos(); // Asegurarse de renderizar los eventos al mostrar la sección
    });

    navUbicaciones.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        ubicacionesSection.classList.remove('hidden');
        setActiveNav(navUbicaciones);
        renderUbicaciones(); // Asegurarse de renderizar las ubicaciones al mostrar la sección
    });

    navContactos.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        contactosSection.classList.remove('hidden');
        setActiveNav(navContactos);
        renderContactos(); // Asegurarse de renderizar los contactos al mostrar la sección
    });

    btnNuevoEvento.addEventListener('click', () => {
        formularioEvento.classList.remove('hidden');
        clearForm('form-evento'); // Limpiar el formulario al abrirlo para un nuevo registro
        editingEventId = null; // Asegurarse de que no estamos en modo edición al crear uno nuevo
    });
    btnCancelarEvento.addEventListener('click', () => {
        formularioEvento.classList.add('hidden');
        clearForm('form-evento');
        editingEventId = null;
    });

    btnNuevaUbicacion.addEventListener('click', () => {
        formularioUbicacion.classList.remove('hidden');
        clearForm('form-ubicacion');
        editingUbicacionId = null;
    });
    btnCancelarUbicacion.addEventListener('click', () => {
        formularioUbicacion.classList.add('hidden');
        clearForm('form-ubicacion');
        editingUbicacionId = null;
    });

    btnNuevoContacto.addEventListener('click', () => {
        formularioContacto.classList.remove('hidden');
        clearForm('form-contacto');
        editingContactoId = null;
    });
    btnCancelarContacto.addEventListener('click', () => {
        formularioContacto.classList.add('hidden');
        clearForm('form-contacto');
        editingContactoId = null;
    });

    // --- Inicialización: Cargar la sección de eventos al inicio ---
    navEventos.click(); // Simular clic en Eventos al cargar la página
});