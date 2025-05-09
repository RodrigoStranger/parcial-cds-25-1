const pool = require('../config/database');

// Agregar un teléfono a un proveedor
async function agregarTelefonoProveedor(ruc, telefono) {
  const [result] = await pool.query('CALL AgregarTelefonoProveedor(?, ?)', [ruc, telefono]);
  return result;
}

// Obtener teléfonos de un proveedor
async function obtenerTelefonosProveedor(ruc) {
  const [rows] = await pool.query('CALL ObtenerTelefonosProveedor(?)', [ruc]);
  return rows[0];
}

// Actualizar teléfono de un proveedor
async function actualizarTelefonoProveedor(ruc, telefono_antiguo, telefono_nuevo) {
  const [result] = await pool.query('CALL ActualizarTelefonoProveedor(?, ?, ?)', [ruc, telefono_antiguo, telefono_nuevo]);
  return result;
}

module.exports = {
  agregarTelefonoProveedor,
  obtenerTelefonosProveedor,
  actualizarTelefonoProveedor
};
