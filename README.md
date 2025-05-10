# Sistema de Gestión FabiaNatura

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

## Dependencias principales
- `express`
- `mysql2`
- `dotenv`

## Notas
- El sistema utiliza procedimientos almacenados en MySQL para la lógica de negocio y validaciones complejas.
- Para agregar asesores o vendedores solo se requiere el DNI y datos mínimos, el resto se obtiene automáticamente.
- El README debe actualizarse si agregas nuevas entidades o funcionalidades.

---
¿Necesitas ejemplos de uso de endpoints o detalles de algún módulo en particular? Modifica este README según tu flujo de trabajo.
