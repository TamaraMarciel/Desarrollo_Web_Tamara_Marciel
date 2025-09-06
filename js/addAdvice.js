/////////////// PARA SELECTS ///////////////

const poblarSelects = () => {
    let regionSelect = document.getElementById("select-region");
    regionSelect.innerHTML = '<option value="">Seleccione una region</option>';
    
    region_comuna.regiones.forEach(region => {
        let option = document.createElement("option");
        option.value = region.nombre;
        option.text = region.nombre;
        regionSelect.appendChild(option);
    });

    let contactSelect = document.getElementById("input-contact");
    contactSelect.innerHTML = '<option value="">Seleccione un metodo de contacto</option>';
    
    const metodosContacto = ["whatsapp", "telegram", "X", "instagram", "tiktok", "otra"];
    metodosContacto.forEach(metodo => {
        let option = document.createElement("option");
        option.value = metodo;
        option.text = metodo;
        contactSelect.appendChild(option);
    });

    let tipoSelect = document.getElementById("input-type");
    tipoSelect.innerHTML = '<option value="">Seleccione tipo</option>';
    
    const tipos = ["gato", "perro"];
    tipos.forEach(tipo => {
        let option = document.createElement("option");
        option.value = tipo;
        option.text = tipo;
        tipoSelect.appendChild(option);
    });

    let unitySelect = document.getElementById("input-unity");
    unitySelect.innerHTML = '<option value="">Seleccione</option>';
    
    const unidades = ["meses", "años"];
    unidades.forEach(unidad => {
        let option = document.createElement("option");
        option.value = unidad;
        option.text = unidad;
        unitySelect.appendChild(option);
    });
};

const updateComunas = () => {
    let regionSelect = document.getElementById("select-region");
    let comunaSelect = document.getElementById("select-comuna");
    let selectedRegion = regionSelect.value;
    
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    if (selectedRegion) {
        let regionData = region_comuna.regiones.find(region => region.nombre === selectedRegion);
        
        if (regionData && regionData.comunas) {
            regionData.comunas.forEach(comuna => {
                let option = document.createElement("option");
                option.value = comuna.nombre;
                option.text = comuna.nombre;
                comunaSelect.appendChild(option);
            });
        }
    }
};

function changeContactInfo() {
    const contactSelect = document.getElementById("input-contact");
    let contactInfoInput = document.getElementById("input-contact-info");
    let contactInfoLabel = document.getElementById("contact-info-label");
    
    if (contactSelect.value !== "") {
        contactInfoInput.style.display = "block";
        contactInfoLabel.style.display = "block";
    } else {
        contactInfoInput.style.display = "none";
        contactInfoLabel.style.display = "none";
    }
}

const prellenarFecha = () => {
    const fechaInput = document.getElementById('input-date');
    if (fechaInput) {
        const ahora = new Date();
        ahora.setHours(ahora.getHours() + 3);
        const fechaISO = ahora.toISOString().slice(0, 16);
        fechaInput.value = fechaISO;
    }
};

/////////////// PARA MÚLTIPLES IMÁGENES ///////////////

// Variable para contar los inputs de archivo
let fileInputCount = 1;
const maxFiles = 5;

const addFileInput = () => {
    if (fileInputCount >= maxFiles) {
        alert(`Máximo ${maxFiles} fotos permitidas`);
        return;
    }
    
    fileInputCount++;
    
    let newInputContainer = document.createElement("div");
    newInputContainer.className = "col-6 col-12-xsmall";
    newInputContainer.id = `file-input-container-${fileInputCount}`;
    
    let newLabel = document.createElement("label");
    newLabel.setAttribute("for", `input-files-${fileInputCount}`);
    newLabel.textContent = `Foto ${fileInputCount}`;
    
    let newInput = document.createElement("input");
    newInput.type = "file";
    newInput.name = `input-files-${fileInputCount}`;
    newInput.id = `input-files-${fileInputCount}`;
    newInput.accept = "image/*";
    newInput.className = "file-input";
    
    let removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Eliminar";
    removeButton.className = "button small";
    removeButton.style.marginTop = "5px";
    removeButton.addEventListener("click", () => removeFileInput(fileInputCount));
    
    newInputContainer.appendChild(newLabel);
    newInputContainer.appendChild(newInput);
    newInputContainer.appendChild(removeButton);
    
    let fileRow = document.getElementById("file-inputs-row");
    let addButtonContainer = document.getElementById("add-button-container");
    fileRow.insertBefore(newInputContainer, addButtonContainer);
    
    updateAddButtonText();
};

const removeFileInput = (inputId) => {
    let container = document.getElementById(`file-input-container-${inputId}`);
    if (container) {
        container.remove();
        updateAddButtonText();
    }
};

const updateAddButtonText = () => {
    let addButton = document.getElementById("image-btn");
    let currentInputs = document.querySelectorAll('.file-input').length + 1;
    
    if (currentInputs >= maxFiles) {
        addButton.textContent = `Máximo ${maxFiles} fotos`;
        addButton.disabled = true;
        addButton.style.opacity = "0.5";
    } else {
        addButton.textContent = "Agregar otra foto";
        addButton.disabled = false;
        addButton.style.opacity = "1";
    }
};

const getAllSelectedFiles = () => {
    let allFiles = [];
    
    let mainInput = document.getElementById("input-files");
    if (mainInput.files) {
        for (let file of mainInput.files) {
            allFiles.push(file);
        }
    }
    
    let additionalInputs = document.querySelectorAll('.file-input');
    additionalInputs.forEach(input => {
        if (input.files) {
            for (let file of input.files) {
                allFiles.push(file);
            }
        }
    });
    
    return allFiles;
};

////////////// VALIDACIÓN///////////////

const validateRegion = (region) => {
    return region && region.trim() !== "";
};

const validateComuna = (comuna) => {
    return comuna && comuna.trim() !== "";
};

const validateSector = (sector) => {
    if (!sector || sector.trim() === "") return true;
    return sector.trim().length <= 100;
};

const validateNombre = (nombre) => {
    if (!nombre) return false;
    let cleanName = nombre.trim();
    return cleanName.length >= 3 && cleanName.length <= 200;
};

const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length <= 100;
    
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let formatValid = re.test(email);
    
    return lengthValid && formatValid;
};

const validateTelefono = (telefono) => {
    if (!telefono || telefono.trim() === "") return true;
    
    let re = /^\+\d{3}\.\d{8}$/;
    return re.test(telefono.trim());
};

const validateContactoInfo = (contacto, contactoInfo) => {
    if (contacto && contacto !== "") {
        if (!contactoInfo || contactoInfo.trim() === "") {
            return false;
        }
        let info = contactoInfo.trim();
        return info.length >= 4 && info.length <= 50;
    }
    return true;
};

const validateTipoMascota = (tipo) => {
    return tipo === "gato" || tipo === "perro";
};

const validateCantidad = (cantidad) => {
    if (!cantidad) return false;
    let num = parseInt(cantidad);
    return !isNaN(num) && num >= 1;
};

const validateEdad = (edad) => {
    if (!edad) return false;
    let num = parseInt(edad);
    return !isNaN(num) && num >= 1;
};

const validateUnidadEdad = (unidad) => {
    return unidad === "meses" || unidad === "años";
};

const validateFechaEntrega = (fecha) => {
    if (!fecha) return false;
    
    let fechaIngresada = new Date(fecha);
    let fechaMinima = new Date();
    fechaMinima.setHours(fechaMinima.getHours() + 3);
    
    return fechaIngresada >= fechaMinima;
};

const validateFotos = () => {
    let allFiles = getAllSelectedFiles();
    
    if (allFiles.length === 0) return false;
    
    if (allFiles.length < 1 || allFiles.length > 5) return false;
    
    for (let file of allFiles) {
        if (!file.type.startsWith('image/')) {
            return false;
        }
    }
    
    return true;
};

const createValidationBox = () => {
    let validationBox = document.getElementById("val-box");
    if (!validationBox) {
        validationBox = document.createElement("div");
        validationBox.id = "val-box";
        validationBox.style.cssText = `
            margin-bottom: 2em;
            padding: 1em;
            border-left: solid 4px;
            border-radius: 4px;
            display: none;
        `;
        
        let validationMsg = document.createElement("h2");
        validationMsg.id = "val-msg";
        
        let validationList = document.createElement("ul");
        validationList.id = "val-list";
        
        validationBox.appendChild(validationMsg);
        validationBox.appendChild(validationList);
        
        let form = document.getElementById("advice-form");
        form.parentNode.insertBefore(validationBox, form);
    }
    return validationBox;
};

const validateForm = () => {
    let region = document.getElementById("select-region").value;
    let comuna = document.getElementById("select-comuna").value;
    let sector = document.getElementById("sector").value;
    let nombre = document.getElementById("input-name").value;
    let email = document.getElementById("input-email").value;
    let telefono = document.getElementById("input-cel").value;
    let contacto = document.getElementById("input-contact").value;
    let contactoInfo = document.getElementById("input-contact-info") ? document.getElementById("input-contact-info").value : "";
    let tipo = document.getElementById("input-type").value;
    let cantidad = document.getElementById("input-cant").value;
    let edad = document.getElementById("input-age").value;
    let unidadEdad = document.getElementById("input-unity").value;
    let fechaEntrega = document.getElementById("input-date").value;

    let invalidInputs = [];
    let isValid = true;
    
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid = false;
    };

    if (!validateRegion(region)) {
        setInvalidInput("Región");
    }
    if (!validateComuna(comuna)) {
        setInvalidInput("Comuna");
    }
    if (!validateSector(sector)) {
        setInvalidInput("Sector (máximo 100 caracteres)");
    }
    if (!validateNombre(nombre)) {
        setInvalidInput("Nombre (entre 3 y 200 caracteres)");
    }
    if (!validateEmail(email)) {
        setInvalidInput("Email (formato válido, máximo 100 caracteres)");
    }
    if (!validateTelefono(telefono)) {
        setInvalidInput("Teléfono (formato +569.12345678)");
    }
    if (!validateContactoInfo(contacto, contactoInfo)) {
        setInvalidInput("Información de contacto (entre 4 y 50 caracteres si selecciona método)");
    }
    if (!validateTipoMascota(tipo)) {
        setInvalidInput("Tipo de mascota");
    }
    if (!validateCantidad(cantidad)) {
        setInvalidInput("Cantidad (número entero mayor a 0)");
    }
    if (!validateEdad(edad)) {
        setInvalidInput("Edad (número entero mayor a 0)");
    }
    if (!validateUnidadEdad(unidadEdad)) {
        setInvalidInput("Unidad de edad");
    }
    if (!validateFechaEntrega(fechaEntrega)) {
        setInvalidInput("Fecha de entrega (debe ser mayor o igual a la fecha prellenada)");
    }
    if (!validateFotos()) {
        setInvalidInput("Fotos (mínimo 1, máximo 5, solo archivos de imagen)");
    }

    let validationBox = createValidationBox();
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");

    if (!isValid) {
        validationListElem.innerHTML = "";
        
        invalidInputs.forEach(input => {
            let listElement = document.createElement("li");
            listElement.innerText = input;
            validationListElem.appendChild(listElement);
        });
        
        validationMessageElem.innerText = "Los siguientes campos son inválidos:";
        
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";
        validationBox.style.display = "block";
        
    } else {
        validationMessageElem.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
        validationListElem.innerHTML = "";
        
        validationBox.style.backgroundColor = "#fff3cd";
        validationBox.style.borderLeftColor = "#ffc107";
        
        let buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "15px";
        
        let confirmButton = document.createElement("button");
        confirmButton.innerText = "Sí, estoy seguro";
        confirmButton.style.cssText = `
            margin-right: 10px;
            padding: 8px 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        confirmButton.addEventListener("click", () => {
            validationMessageElem.innerText = "Hemos recibido la información de adopción, muchas gracias y suerte!";
            validationListElem.innerHTML = "";
            
            validationBox.style.backgroundColor = "#d4edda";
            validationBox.style.borderLeftColor = "#28a745";
            
            let homeButton = document.createElement("button");
            homeButton.innerText = "Volver a la portada";
            homeButton.style.cssText = `
                padding: 8px 16px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            `;
            
            homeButton.addEventListener("click", () => {
                window.location.href = "../index.html";
            });
            
            validationListElem.appendChild(homeButton);
        });
        
        let cancelButton = document.createElement("button");
        cancelButton.innerText = "No, no estoy seguro, quiero volver al formulario";
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        cancelButton.addEventListener("click", () => {
            validationBox.style.display = "none";
        });
        
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        validationListElem.appendChild(buttonContainer);
        
        validationBox.style.display = "block";
    }
};

///// Listeners  ////
document.addEventListener('DOMContentLoaded', function() {
    poblarSelects();
    prellenarFecha();
    
    document.getElementById("select-region").addEventListener("change", updateComunas);
    document.getElementById("input-contact").addEventListener("change", changeContactInfo);
    
    document.getElementById("submit-btn").addEventListener("click", function(e) {
        e.preventDefault();
        validateForm();
    });
    
    document.getElementById("image-btn").addEventListener("click", function(e) {
        e.preventDefault();
        addFileInput();
    });
});