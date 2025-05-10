# Sistema de Gestión FabiaNatura

> **Recursos de la base de datos**: scripts, diagramas y procedimientos almacenados están disponibles en el repositorio [parcial-cds-25-1-base-de-datos](https://github.com/RodrigoStranger/parcial-cds-25-1-base-de-datos)


Este proyecto es un sistema de gestión para FabiaNatura, desarrollado en Node.js con Express y MySQL. Permite la administración de clientes, asesores, vendedores, contratos, especialidades, productos, facturas y más.

## Configuración Inicial de MySQL

Para el correcto funcionamiento del sistema, crea el usuario de base de datos y otórgale los privilegios necesarios ejecutando lo siguiente en tu consola MySQL:

```sql
CREATE USER 'fabianatura'@'localhost' IDENTIFIED BY 'ulasalle2025';
GRANT ALL PRIVILEGES ON *.* TO 'fabianatura'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
GRANT SUPER ON *.* TO 'fabianatura'@'localhost';
SHOW VARIABLES LIKE 'log_bin_trust_function_creators';
SET GLOBAL log_bin_trust_function_creators = 1;
```

## Documentación Swagger (OpenAPI)

Puedes acceder a la documentación interactiva de los endpoints de ambos servidores desde tu navegador:

- **API principal:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Autenticación:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## Cómo correr los servidores (API y Auth)

El sistema se compone de dos servidores independientes:

### 1. Servidor principal (API de gestión)

Ubicación: raíz del proyecto

- Instala dependencias:
  ```bash
  npm install
  ```
- Configura `.env.local` con las variables de conexión a la base de datos y JWT.
- Inicia el servidor principal:
  ```bash
  nodemon server.js
  ```
  Por defecto corre en `http://localhost:3000`.

### 2. Servidor de Autenticación (auth)

Ubicación: `/auth`

- Entra a la carpeta:
  ```bash
  cd auth
  ```
- Instala dependencias:
  ```bash
  npm install
  ```
- Configura `.env.local` en la carpeta `/auth` (puerto, JWT_SECRET, etc).
- Inicia el servidor de autenticación:
  ```bash
  nodemon auth_server.js
  ```
  Por defecto corre en `http://localhost:3001`.

## Sobre el módulo de autenticación

El servidor `auth` gestiona el login y la generación de tokens JWT. Los endpoints protegidos en la API principal requieren que envíes un token JWT válido en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

Para obtener un token, haz login en `/auth/login` enviando tu usuario y contraseña. El token devuelto úsalo en todas las peticiones protegidas.

## Uso de la API de consultaDni

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura tu archivo `.env.local` con las variables de conexión a la base de datos y JWT.
3. Inicia el servidor:
   ```bash
   npm start
   ```
   El servidor correrá por defecto en `http://localhost:3000`.

## Uso de la función consultaDni

`consultaDni` es una función interna del sistema, no es un servicio ni un endpoint externo. Se ejecuta automáticamente al registrar un asesor o vendedor: recibe el DNI y obtiene los datos personales (nombre, apellidos, fecha de nacimiento) para completar el registro. **No necesitas llamarla manualmente ni correrla aparte.**

Solo debes enviar el DNI y los datos mínimos requeridos en el endpoint correspondiente, y el sistema completará el resto de la información usando esta función.
## Estructura principal

- **/src/models/**: Modelos de acceso a datos y lógica de negocio.
- **/src/routes/**: Rutas Express para cada entidad (API REST).
- **/src/utils/**: Utilidades como consultaDni y configuración de entorno.
- **server.js**: Archivo principal, integra todos los routers y configura el servidor.

## Funcionalidades principales

- **Clientes**: Alta, consulta, verificación por DNI, historial de compras.
- **Asesores**: Alta usando API de DNI, consulta, actualización, especialidades.
- **Vendedores**: Alta usando API de DNI, consulta, actualización, asignación de rol opcional.
- **Contratos**: Alta, consulta, actualización y desactivación de contratos de empleados.
- **Especialidades**: Gestión de especialidades y asignación a asesores.
- **Facturas**: Alta de facturas (cliente, vendedor, asesor opcional), consulta y eliminación.
- **Detalle de Facturas**: Alta, consulta y eliminación de productos en facturas.
- **Productos, Categorías, Líneas, Proveedores**: Gestión CRUD.

## Endpoints principales

- `/clientes` - Gestión de clientes
- `/asesores` - Gestión de asesores
- `/asesores_especialidades` - Asignación y consulta de especialidades de asesores
- `/vendedores` - Gestión de vendedores
- `/contratos` - Gestión de contratos
- `/especialidades` - Gestión de especialidades
- `/facturas` - Gestión de facturas
- `/detalle_facturas` - Gestión de detalles de facturas
- `/productos`, `/categorias`, `/lineas`, `/proveedores`, etc.

## Seguridad
- Todas las rutas principales están protegidas con autenticación JWT.