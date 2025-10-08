from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
from utils.validations import validate_aviso_adopcion
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
from datetime import datetime

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "tu_clave_secreta_aqui_cambiar"  # Cambia esto
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max

# Crear directorio de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --- Helper Functions ---

def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file(file):
    """Guarda un archivo y retorna el nombre generado"""
    # Generar nombre único usando hash
    _filename = hashlib.sha256(
        (secure_filename(file.filename) + str(datetime.now().timestamp())).encode("utf-8")
    ).hexdigest()
    
    # Obtener extensión
    # Primero intentar con filetype
    file.seek(0)  # Asegurar que estamos al inicio del archivo
    ftype = filetype.guess(file)
    file.seek(0)  # Volver al inicio
    
    if ftype is not None:
        _extension = ftype.extension
    else:
        # Si filetype no funciona, usar la extensión del nombre original
        if '.' in file.filename:
            _extension = file.filename.rsplit('.', 1)[1].lower()
        else:
            _extension = 'jpg'  # Por defecto
    
    img_filename = f"{_filename}.{_extension}"
    
    # Guardar archivo
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], img_filename)
    file.save(filepath)
    
    return img_filename


# --- Routes ---

@app.route("/")
def index():
    """Página principal - Portada"""
    try:
        # Obtener los últimos 5 avisos
        ultimos_avisos = db.get_last_avisos(limit=5)
        return render_template("index.html", avisos=ultimos_avisos)
    except Exception as e:
        print(f"Error al cargar la portada: {e}")
        flash("Error al cargar los avisos", "error")
        return render_template("index.html", avisos=[])


@app.route("/agregar-aviso", methods=["GET"])
def agregar_aviso():
    """Muestra el formulario para agregar un aviso de adopción"""
    try:
        regiones = db.get_all_regions()
        return render_template("addAdvice.html", regiones=regiones)
    except Exception as e:
        print(f"Error al cargar el formulario: {e}")
        flash("Error al cargar el formulario", "error")
        return redirect(url_for("index"))


@app.route("/get-comunas/<int:region_id>", methods=["GET"])
def get_comunas(region_id):
    """API endpoint para obtener comunas de una región"""
    try:
        comunas = db.get_comunas_by_region(region_id)
        comunas_list = [{"id": c.id, "nombre": c.nombre} for c in comunas]
        return jsonify({"comunas": comunas_list})
    except Exception as e:
        print(f"Error al obtener comunas: {e}")
        return jsonify({"comunas": []}), 500


@app.route("/procesar-aviso", methods=["POST"])
def procesar_aviso():
    """Procesa el formulario de agregar aviso de adopción"""
    try:
        # Validar datos del formulario
        errores = validate_aviso_adopcion(request.form, request.files)
        
        if errores:
            # Si hay errores, volver a mostrar el formulario
            for error in errores:
                flash(error, "error")
            regiones = db.get_all_regions()
            return render_template("addAdvice.html", regiones=regiones, form_data=request.form)
        
        # Extraer datos del formulario
        fecha_ingreso = datetime.now()
        comuna_id = int(request.form["select-comuna"])
        sector = request.form.get("sector", "").strip() or None
        nombre = request.form["input-name"].strip()
        email = request.form["input-email"].strip()
        celular = request.form.get("input-cel", "").strip() or None
        tipo = request.form["input-type"]
        cantidad = int(request.form["input-cant"])
        edad = int(request.form["input-age"])
        unidad_medida = request.form["input-unity"]
        fecha_entrega = datetime.fromisoformat(request.form["input-date"])
        descripcion = request.form.get("input-description", "").strip() or None
        
        # Crear el aviso de adopción
        aviso_id = db.create_aviso(
            fecha_ingreso=fecha_ingreso,
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            tipo=tipo,
            cantidad=cantidad,
            edad=edad,
            unidad_medida=unidad_medida,
            fecha_entrega=fecha_entrega,
            descripcion=descripcion
        )
        
        # Procesar y guardar las fotos
        fotos_guardadas = 0
        for key in request.files:
            if key.startswith("input-files"):
                file = request.files[key]
                if file and file.filename and allowed_file(file.filename):
                    # Guardar archivo
                    img_filename = save_file(file)
                    ruta_archivo = f"uploads/{img_filename}"
                    
                    # Guardar referencia en la base de datos
                    db.create_foto(
                        ruta_archivo=ruta_archivo,
                        nombre_archivo=img_filename,
                        aviso_id=aviso_id
                    )
                    fotos_guardadas += 1
        
        # Procesar contactos adicionales
        metodo_contacto = request.form.get("input-contact", "").strip()
        contacto_info = request.form.get("input-contact-info", "").strip()
        
        if metodo_contacto and contacto_info:
            db.create_contacto(
                nombre=metodo_contacto,
                identificador=contacto_info,
                aviso_id=aviso_id
            )
        
        flash("¡Aviso de adopción agregado exitosamente!", "success")
        return redirect(url_for("index"))
        
    except Exception as e:
        print(f"Error al procesar el aviso: {e}")
        flash("Error al procesar el aviso. Por favor, intenta nuevamente.", "error")
        regiones = db.get_all_regions()
        return render_template("addAdvice.html", regiones=regiones, form_data=request.form)


@app.route("/avisos")
def listar_avisos():
    """Lista todos los avisos de adopción con paginación"""
    try:
        page = request.args.get("page", 1, type=int)
        per_page = 5
        
        avisos, total = db.get_avisos_paginated(page=page, per_page=per_page)
        
        # Calcular información de paginación
        total_pages = (total + per_page - 1) // per_page  # Redondeo hacia arriba
        has_prev = page > 1
        has_next = page < total_pages
        
        return render_template(
            "advices.html",
            avisos=avisos,
            page=page,
            total_pages=total_pages,
            has_prev=has_prev,
            has_next=has_next
        )
    except Exception as e:
        print(f"Error al listar avisos: {e}")
        flash("Error al cargar los avisos", "error")
        return redirect(url_for("index"))


@app.route("/aviso/<int:aviso_id>")
def detalle_aviso(aviso_id):
    """Muestra el detalle de un aviso específico"""
    try:
        aviso = db.get_aviso_by_id(aviso_id)
        if aviso is None:
            flash("Aviso no encontrado", "error")
            return redirect(url_for("listar_avisos"))
        
        return render_template("detalle_aviso.html", aviso=aviso)
    except Exception as e:
        print(f"Error al cargar el detalle del aviso: {e}")
        flash("Error al cargar el aviso", "error")
        return redirect(url_for("listar_avisos"))


@app.route("/estadisticas")
def estadisticas():
    """Muestra las estadísticas (pendiente para Tarea 3)"""
    return render_template("stadistics.html")


# --- Template Filters ---

@app.template_filter("formato_fecha")
def formato_fecha(fecha):
    """Formatea una fecha al formato DD-MM-YYYY HH:MM"""
    if fecha:
        return fecha.strftime("%d-%m-%Y %H:%M")
    return ""


@app.template_filter("edad_texto")
def edad_texto(edad, unidad):
    """Convierte edad y unidad a texto legible"""
    texto_unidad = "años" if unidad == "a" else "meses"
    return f"{edad} {texto_unidad}"


if __name__ == "__main__":
    app.run(debug=True, port=5000)