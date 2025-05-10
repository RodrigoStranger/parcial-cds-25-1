const pool = require('../config/database');

// Agregar especialidad
async function agregarEspecialidad(nombre) {
  const [result] = await pool.query('CALL AgregarEspecialidad(?)', [nombre]);
  return result;
}

// Obtener todas las especialidades
async function obtenerEspecialidades() {
  const [rows] = await pool.query('CALL ObtenerEspecialidades()');
  return rows[0];
}

// Obtener especialidad por ID
async function obtenerEspecialidadPorId(id) {
  const [rows] = await pool.query('CALL ObtenerEspecialidadPorId(?)', [id]);
  return rows[0];
}

// Actualizar especialidad
async function actualizarEspecialidad(id, nombreNuevo) {
  const [result] = await pool.query('CALL ActualizarEspecialidad(?, ?)', [id, nombreNuevo]);
  return result;
}

module.exports = {
  agregarEspecialidad,
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  actualizarEspecialidad
};
