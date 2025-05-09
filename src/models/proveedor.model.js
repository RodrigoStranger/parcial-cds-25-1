const pool = require('../config/database');

// Agregar proveedor
async function agregarProveedor(ruc, nombre) {
  const [result] = await pool.query('CALL AgregarProveedor(?, ?)', [ruc, nombre]);
  return result;
}

// Obtener todos los proveedores
async function obtenerProveedores() {
  const [rows] = await pool.query('CALL ObtenerProveedores()');
  return rows[0];
}

// Obtener proveedor por RUC
async function obtenerProveedorPorRuc(ruc) {
  const [rows] = await pool.query('CALL ObtenerProveedorPorRuc(?)', [ruc]);
  return rows[0];
}

// Obtener productos de un proveedor
async function obtenerProductosDeProveedor(ruc) {
  const [rows] = await pool.query('CALL ObtenerProductosDeProveedor(?)', [ruc]);
  return rows[0];
}

// Obtener productos más vendidos por proveedor
async function obtenerProductosMasVendidosPorProveedor(ruc) {
  const [rows] = await pool.query('CALL ObtenerProductosMasVendidosPorProveedor(?)', [ruc]);
  return rows[0];
}

// Actualizar proveedor
async function actualizarProveedor(ruc, nuevo_nombre) {
  const [result] = await pool.query('CALL ActualizarProveedor(?, ?)', [ruc, nuevo_nombre]);
  return result;
}

module.exports = {
  agregarProveedor,
  obtenerProveedores,
  obtenerProveedorPorRuc,
  obtenerProductosDeProveedor,
  obtenerProductosMasVendidosPorProveedor,
  actualizarProveedor
};
