const pool = require('../config/database');

// Agregar una nueva categoría
async function agregarCategoria(nombre_categoria, descripcion) {
  const [result] = await pool.query('CALL AgregarCategoria(?, ?)', [nombre_categoria, descripcion]);
  return result;
}

// Obtener todas las categorías
async function obtenerTodasLasCategorias() {
  const [rows] = await pool.query('CALL ObtenerTodasLasCategorias()');
  return rows[0];
}

// Obtener categoría por ID
async function obtenerCategoriaPorId(cod_categoria) {
  const [rows] = await pool.query('CALL ObtenerCategoriaPorId(?)', [cod_categoria]);
  return rows[0];
}

// Obtener productos por categoría
async function obtenerProductosPorCategoria(cod_categoria) {
  const [rows] = await pool.query('CALL ObtenerProductosPorCategoria(?)', [cod_categoria]);
  return rows[0];
}

// Actualizar categoría
async function actualizarCategoria(cod_categoria, nuevo_nombre_categoria, nueva_descripcion) {
  const [result] = await pool.query('CALL ActualizarCategoria(?, ?, ?)', [cod_categoria, nuevo_nombre_categoria, nueva_descripcion]);
  return result;
}

module.exports = {
  agregarCategoria,
  obtenerTodasLasCategorias,
  obtenerCategoriaPorId,
  obtenerProductosPorCategoria,
  actualizarCategoria
};