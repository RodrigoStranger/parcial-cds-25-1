require('dotenv').config({ path: '.env.local' });

const express = require('express');
const pool = require('./src/config/database');
const lineasRouter = require('./src/routes/lineas.routes');
const rolesRouter = require('./src/routes/roles.routes');
const categoriasRouter = require('./src/routes/categorias.routes');
const productosRouter = require('./src/routes/productos.routes');

const app = express();

app.use(express.json());
app.use('/lineas', lineasRouter);
app.use('/roles', rolesRouter);
app.use('/categorias', categoriasRouter);
app.use('/productos', productosRouter);

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