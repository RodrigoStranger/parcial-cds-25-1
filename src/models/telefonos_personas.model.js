const pool = require('../config/database');

// Agregar un teléfono a una persona
async function agregarTelefonoPersona(dni, telefono) {
  const [result] = await pool.query('CALL AgregarTelefonoPersona(?, ?)', [dni, telefono]);
  return result;
}

// Obtener teléfonos de una persona
async function obtenerTelefonosPersona(dni) {
  const [rows] = await pool.query('CALL ObtenerTelefonosPersona(?)', [dni]);
  return rows[0];
}

// Actualizar teléfono de una persona
async function actualizarTelefonoPersona(dni, telefono_antiguo, telefono_nuevo) {
  const [result] = await pool.query('CALL ActualizarTelefonoPersona(?, ?, ?)', [dni, telefono_antiguo, telefono_nuevo]);
  return result;
}

module.exports = {
  agregarTelefonoPersona,
  obtenerTelefonosPersona,
  actualizarTelefonoPersona
};
