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
        fileInputCount--;
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

///// Listeners  ////
document.addEventListener('DOMContentLoaded', function() {
    // Botón para agregar más fotos
    const imageBtn = document.getElementById("image-btn");
    if (imageBtn) {
        imageBtn.addEventListener("click", function(e) {
            e.preventDefault();
            addFileInput();
        });
    }
});