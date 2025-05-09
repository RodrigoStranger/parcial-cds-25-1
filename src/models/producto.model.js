const pool = require('../config/database');

// Agregar un nuevo producto
async function agregarProducto(nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado) {
  const [result] = await pool.query('CALL AgregarProducto(?, ?, ?, ?, ?, ?, ?, ?)', [nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado]);
  return result;
}

// Obtener todos los productos
async function obtenerTodosLosProductos() {
  const [rows] = await pool.query('CALL ObtenerTodosLosProductos()');
  return rows[0];
}

// Obtener producto por ID
async function obtenerProductoPorId(cod_producto) {
  const [rows] = await pool.query('CALL ObtenerProductoPorId(?)', [cod_producto]);
  return rows[0];
}

// Buscar producto por nombre
async function buscarProductoPorNombre(nombre_producto) {
  const [rows] = await pool.query('CALL BuscarProductoPorNombre(?)', [nombre_producto]);
  return rows[0];
}

// Obtener stock por ID
async function obtenerStockPorId(cod_producto) {
  const [rows] = await pool.query('CALL ObtenerStockPorId(?)', [cod_producto]);
  return rows[0];
}

// Actualizar producto
async function actualizarProducto(cod_producto, nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado) {
  const [result] = await pool.query('CALL ActualizarProductos(?, ?, ?, ?, ?, ?, ?, ?, ?)', [cod_producto, nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado]);
  return result;
}

// Actualizar estado a agotado
async function actualizarEstadoAgotado(cod_producto) {
  const [result] = await pool.query('CALL ActualizarEstadoAgotado(?)', [cod_producto]);
  return result;
}

// Actualizar stock de producto
async function actualizarStockProducto(cod_producto, nuevo_stock) {
  const [result] = await pool.query('CALL ActualizarStockProducto(?, ?)', [cod_producto, nuevo_stock]);
  return result;
}

module.exports = {
  agregarProducto,
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  buscarProductoPorNombre,
  obtenerStockPorId,
  actualizarProducto,
  actualizarEstadoAgotado,
  actualizarStockProducto
};