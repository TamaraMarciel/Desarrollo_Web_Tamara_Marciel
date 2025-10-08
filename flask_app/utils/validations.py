import re
import filetype
from datetime import datetime


def validate_email(email):
    """Valida el formato de un email"""
    return "@" in email and "." in email


def validate_nombre(nombre):
    """Valida que el nombre tenga entre 3 y 200 caracteres"""
    return nombre and 3 <= len(nombre) <= 200


def validate_celular(celular):
    """Valida el formato del celular (opcional)"""
    if not celular:
        return True  # Es opcional
    return 3 <= len(celular) <= 15 and re.match(r'^[\d\s\+\-\(\)]+$', celular)


def validate_sector(sector):
    """Valida el sector (opcional, máximo 100 caracteres)"""
    if not sector:
        return True  # Es opcional
    return len(sector) <= 100


def validate_cantidad(cantidad):
    """Valida que la cantidad sea un número positivo"""
    try:
        cant = int(cantidad)
        return 0 < cant <= 100
    except (ValueError, TypeError):
        return False


def validate_edad(edad):
    """Valida que la edad sea un número positivo"""
    try:
        age = int(edad)
        return 0 < age <= 50
    except (ValueError, TypeError):
        return False


def validate_fecha_entrega(fecha_str):
    """Valida que la fecha de entrega no sea en el pasado"""
    try:
        fecha_entrega = datetime.fromisoformat(fecha_str)
        fecha_actual = datetime.now()
        return fecha_entrega >= fecha_actual
    except (ValueError, TypeError):
        return False


def validate_descripcion(descripcion):
    """Valida la descripción (opcional, máximo 500 caracteres)"""
    if not descripcion:
        return True  # Es opcional
    return len(descripcion) <= 500


def validate_contacto_info(metodo, info):
    """Valida la información de contacto adicional"""
    # Si hay método, debe haber info
    if metodo and not info:
        return False
    # Si hay info, debe haber método
    if info and not metodo:
        return False
    # Si hay info, validar longitud
    if info and not (4 <= len(info) <= 150):
        return False
    return True


def validate_foto(foto):
    """Valida que el archivo sea una imagen válida"""
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}
    
    # check if a file was submitted
    if foto is None:
        return False

    # check if the browser submitted an empty file
    if foto.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(foto)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True


def validate_aviso_adopcion(form_data, files):
    """
    Valida todos los datos del formulario de aviso de adopción
    Retorna una lista de errores (vacía si todo está correcto)
    """
    errores = []
    
    # Validar región y comuna
    if not form_data.get("select-region"):
        errores.append("Debe seleccionar una región")
    
    if not form_data.get("select-comuna"):
        errores.append("Debe seleccionar una comuna")
    
    # Validar sector (opcional)
    sector = form_data.get("sector", "").strip()
    if not validate_sector(sector):
        errores.append("El sector no puede exceder los 100 caracteres")
    
    # Validar nombre
    nombre = form_data.get("input-name", "").strip()
    if not validate_nombre(nombre):
        errores.append("El nombre debe tener entre 3 y 200 caracteres")
    
    # Validar email
    email = form_data.get("input-email", "").strip()
    if not email:
        errores.append("El email es obligatorio")
    elif len(email) > 100:
        errores.append("El email no puede exceder los 100 caracteres")
    elif not validate_email(email):
        errores.append("El formato del email no es válido")
    
    # Validar celular (opcional)
    celular = form_data.get("input-cel", "").strip()
    if not validate_celular(celular):
        errores.append("El celular debe tener entre 3 y 15 caracteres y solo puede contener números, espacios, +, -, ( y )")
    
    # Validar método de contacto adicional
    metodo_contacto = form_data.get("input-contact", "").strip()
    contacto_info = form_data.get("input-contact-info", "").strip()
    
    if not validate_contacto_info(metodo_contacto, contacto_info):
        if metodo_contacto and not contacto_info:
            errores.append("Debe ingresar la información de contacto para el método seleccionado")
        elif contacto_info and not metodo_contacto:
            errores.append("Debe seleccionar un método de contacto")
        else:
            errores.append("La información de contacto debe tener entre 4 y 150 caracteres")
    
    # Validar tipo de mascota
    tipo = form_data.get("input-type", "")
    if not tipo:
        errores.append("Debe seleccionar el tipo de mascota")
    elif tipo not in ["gato", "perro"]:
        errores.append("Tipo de mascota no válido")
    
    # Validar cantidad
    cantidad = form_data.get("input-cant", "")
    if not validate_cantidad(cantidad):
        errores.append("La cantidad debe ser un número entre 1 y 100")
    
    # Validar edad
    edad = form_data.get("input-age", "")
    if not validate_edad(edad):
        errores.append("La edad debe ser un número entre 1 y 50")
    
    # Validar unidad de medida
    unidad = form_data.get("input-unity", "")
    if not unidad:
        errores.append("Debe seleccionar la unidad de medida de edad")
    elif unidad not in ["a", "m"]:
        errores.append("Unidad de medida no válida")
    
    # Validar fecha de entrega
    fecha_entrega_str = form_data.get("input-date", "")
    if not fecha_entrega_str:
        errores.append("Debe seleccionar una fecha de entrega")
    elif not validate_fecha_entrega(fecha_entrega_str):
        errores.append("La fecha de entrega no puede ser en el pasado")
    
    # Validar descripción (opcional)
    descripcion = form_data.get("input-description", "").strip()
    if not validate_descripcion(descripcion):
        errores.append("La descripción no puede exceder los 500 caracteres")
    
    # Validar fotos (al menos una obligatoria)
    foto_encontrada = False
    for key in files:
        if key.startswith("input-files"):
            file = files[key]
            if file and file.filename:
                if validate_foto(file):
                    foto_encontrada = True
                else:
                    errores.append(f"El archivo '{file.filename}' no es válido. Use imágenes PNG, JPG, JPEG o GIF")
    
    if not foto_encontrada:
        errores.append("Debe subir al menos una foto válida")
    
    return errores