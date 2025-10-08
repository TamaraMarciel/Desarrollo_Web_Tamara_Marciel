
# Tarea 2 - Desarrollo de Aplicaciones Web Tamara Marciel

Repositorio con Tareas del Curso CC5002-1 - Primavera 2025

Las imágenes fueron sacadas de https://www.pexels.com/es-es/buscar/ que cuenta con imágenes de libre uso

El template de CSS fue sacado de https://html5up.net/ y en este mismo proyecto se ecuentran sus licencias de uso



## Instalación

A continuación se dejan unas breves instrucciones para poder ejecutar correctamente el proyecto:

### 1. Crear entorno virtual

```bash
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar la base de datos

La base de datos se configuró manualmente ingresando a MySQL y ejecutando los scripts SQL.

#### Pasos realizados:

1. **Conectarse a MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Crear la base de datos y usuario:**
   ```sql
   CREATE DATABASE tarea2;
   CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
   GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Crear las tablas:**

   ```sql
   Copiar todo el contenido de tarea2.sql y pegarlo en mysql, apretar enter.
   ```

4. **Cargar datos de regiones y comunas:**
   ```sql
   Copiar todo el contenido de region-comunas.sql y pegarlo en mysql, apretar enter.
   ```

### 4. Ejecutar la aplicación

```bash
python app.py
```

Abrir en el navegador: `http://localhost:5000`