const pool = require('../config/database');

// Agregar una nueva línea
async function agregarLinea(ruc, nombre_linea) {
  try {
    const [result] = await pool.query('CALL AgregarLinea(?, ?)', [ruc, nombre_linea]);
    return result;
  } catch (error) {
    throw error;
  }
}

// Obtener todas las líneas
async function obtenerTodasLasLineas() {
  try {
    const [rows] = await pool.query('CALL ObtenerTodasLasLineas()');
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Obtener línea por ID
async function obtenerLineaPorId(cod_linea) {
  try {
    const [rows] = await pool.query('CALL ObtenerLineaPorId(?)', [cod_linea]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Obtener productos por línea
async function obtenerProductosPorLinea(cod_linea) {
  try {
    const [rows] = await pool.query('CALL ObtenerProductosPorLinea(?)', [cod_linea]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Obtener facturas por línea
async function obtenerFacturasPorLinea(cod_linea) {
  try {
    const [rows] = await pool.query('CALL ObtenerFacturasPorLinea(?)', [cod_linea]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Actualizar nombre de línea
async function actualizarNombreLinea(cod_linea, nuevo_nombre_linea) {
  try {
    const [result] = await pool.query('CALL ActualizarNombreLinea(?, ?)', [cod_linea, nuevo_nombre_linea]);
    return result;
  } catch (error) {
    throw error;
  }
}

// Actualizar RUC de línea
async function actualizarRucLinea(cod_linea, nuevo_ruc) {
  try {
    const [result] = await pool.query('CALL ActualizarRucLinea(?, ?)', [cod_linea, nuevo_ruc]);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  agregarLinea,
  obtenerTodasLasLineas,
  obtenerLineaPorId,
  obtenerProductosPorLinea,
  obtenerFacturasPorLinea,
  actualizarNombreLinea,
  actualizarRucLinea
};