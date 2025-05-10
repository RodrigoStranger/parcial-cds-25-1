require('dotenv').config({ path: '.env.local' });

const express = require('express');
const pool = require('./src/config/database');
const lineasRouter = require('./src/routes/lineas.routes');
const rolesRouter = require('./src/routes/roles.routes');
const categoriasRouter = require('./src/routes/categorias.routes');
const productosRouter = require('./src/routes/productos.routes');
const proveedoresRouter = require('./src/routes/proveedores.routes');
const telefonosRouter = require('./src/routes/telefonos_personas.routes');
const telefonosProveedoresRouter = require('./src/routes/telefonos_proveedores.routes')
const direccionesPersonasRouter = require('./src/routes/direcciones_personas.routes')
const clientesRouter = require('./src/routes/clientes.routes');
const asesoresRouter = require('./src/routes/asesores.routes');
const asesoresEspecialidadesRouter = require('./src/routes/asesores_especialidades.routes');
const vendedoresRouter = require('./src/routes/vendedores.routes');
const contratosRouter = require('./src/routes/contratos.routes');
const detalleFacturasRouter = require('./src/routes/detalle_facturas.routes');
const facturasRouter = require('./src/routes/facturas.routes');
const especialidadesRouter = require('./src/routes/especialidades.routes')

const app = express();

// Swagger OpenAPI 3.0
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API FabiaNatura',
      version: '1.0.0',
      description: 'Documentación de la API FabiaNatura',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
  },
  apis: ['./src/routes/*.js'], // Documenta todos los endpoints en tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/lineas', lineasRouter);
app.use('/roles', rolesRouter);
app.use('/categorias', categoriasRouter);
app.use('/productos', productosRouter);
app.use('/proveedores', proveedoresRouter);
app.use('/telefonos_personas', telefonosRouter);
app.use('/telefonos_proveedores', telefonosProveedoresRouter);
app.use('/direcciones_personas', direccionesPersonasRouter);
app.use('/clientes', clientesRouter);
app.use('/asesores', asesoresRouter);
app.use('/asesores_especialidades', asesoresEspecialidadesRouter);
app.use('/vendedores', vendedoresRouter);
app.use('/contratos', contratosRouter);
app.use('/detalle_facturas', detalleFacturasRouter);
app.use('/facturas', facturasRouter);
app.use('/especialidades', especialidadesRouter);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log(`Base de datos: ${process.env.MYSQL_DATABASE}`);
    console.log(`Usuario: ${process.env.MYSQL_USER}`);
    console.log(`Puerto: ${process.env.MYSQL_PORT}`);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
  
  app.listen(PORT, () => { console.log(`Servidor corriendo en http://localhost:${PORT}`);});

})();