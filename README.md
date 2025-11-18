# Tarea 4 - Desarrollo de Aplicaciones Web Tamara Marciel

Repositorio con Tareas del Curso CC5002-1 - Primavera 2025

Sistema de evaluación de avisos de adopción desarrollado con Spring Boot, Java y MySQL.

El template de CSS fue sacado de https://html5up.net/ (Stellar) y en este mismo proyecto se encuentran sus licencias de uso.

## Requisitos Previos

- Java 21 o superior
- Maven 3.6+
- MySQL 8.0+

## Instalación

A continuación se dejan unas breves instrucciones para poder ejecutar correctamente el proyecto:

### 1. Configurar la base de datos

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
   ```bash
   mysql -u cc5002 -pprogramacionweb < tarea2.sql
   ```

4. **Cargar datos de regiones y comunas:**
   ```bash
   mysql -u cc5002 -pprogramacionweb tarea2 < region-comuna.sql
   ```

5. **Crear tabla de notas:**
   ```bash
   mysql -u cc5002 -pprogramacionweb tarea2 < tabla-nota.sql
   ```

6. **(Opcional) Insertar datos de prueba:**
   ```bash
   mysql -u cc5002 -pprogramacionweb tarea2 < datos-prueba.sql
   ```

### 2. Configurar el proyecto

El archivo `application.properties` ya está configurado con las credenciales correctas:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tarea2
spring.datasource.username=cc5002
spring.datasource.password=programacionweb
```

### 3. Compilar el proyecto

```bash
mvn clean install
```

### 4. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

Abrir en el navegador: `http://localhost:8080`

## Funcionalidades

- **Listar avisos de adopción:** Visualiza todos los avisos ordenados por ID descendente
- **Evaluar avisos:** Califica avisos con notas del 1 al 7
- **Ver promedio de notas:** Cada aviso muestra el promedio de todas sus evaluaciones
- **Interfaz responsive:** Diseño adaptable a dispositivos móviles

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/Notas/Notas/
│   │   ├── NotasApplication.java
│   │   ├── controllers/
│   │   │   └── AvisoController.java
│   │   ├── models/
│   │   │   ├── AvisoAdopcion.java
│   │   │   ├── AvisoAdopcionRepository.java
│   │   │   ├── Comuna.java
│   │   │   ├── Nota.java
│   │   │   ├── NotaRepository.java
│   │   │   └── Region.java
│   │   └── services/
│   │       └── AvisoService.java
│   └── resources/
│       ├── application.properties
│       ├── static/
│       │   ├── css/
│       │   │   ├── main.css
│       │   │   └── extra.css
│       │   └── js/
│       │       └── evaluacion.js
│       └── templates/
│           └── listado-avisos.html
└── test/
```

## Tecnologías Utilizadas

- **Backend:** Spring Boot 3.5.7, Java 21
- **Frontend:** Thymeleaf, JavaScript vanilla
- **Base de datos:** MySQL 8.4.6
- **ORM:** Hibernate/JPA
- **Build:** Maven

## API Endpoints

- `GET /` - Página principal con listado de avisos
- `POST /api/notas` - Agregar una nota a un aviso
  - Parámetros: `avisoId` (int), `nota` (int 1-7)
  - Respuesta: JSON con éxito y promedio actualizado

## Solución de Problemas

### Error: "Port 8080 already in use"
Cambiar el puerto en `application.properties`:
```properties
server.port=8081
```

### Error: "Access denied for user 'cc5002'"
Verificar que el usuario existe y tiene permisos:
```sql
SHOW GRANTS FOR 'cc5002'@'localhost';
```

### Error: "Table doesn't exist"
Ejecutar los scripts SQL en el orden correcto.

### Maven usa Java 8 en lugar de Java 21
Verificar y configurar JAVA_HOME:
```bash
# Windows PowerShell
echo $env:JAVA_HOME
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

# Verificar
mvn -version
```

## Autor

Tamara Marciel - CC5002-1 Primavera 2025