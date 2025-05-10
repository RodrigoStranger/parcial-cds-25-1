const pool = require('../config/database');

// Agregar especialidad
async function agregarEspecialidad(nombre_especialidad, descripcion) {
  await pool.query('CALL AgregarEspecialidad(?, ?)', [nombre_especialidad, descripcion]);
}

// Obtener todas las especialidades
async function obtenerTodasLasEspecialidades() {
  const [rows] = await pool.query('CALL ObtenerTodasLasEspecialidades()');
  return rows[0];
}

// Obtener especialidad por código
async function obtenerEspecialidadPorCod(cod_especialidad) {
  const [rows] = await pool.query('CALL ObtenerEspecialidadPorCod(?)', [cod_especialidad]);
  return rows[0];
}

// Actualizar especialidad
async function actualizarEspecialidad(cod_especialidad, nuevo_nombre, nueva_descripcion) {
  await pool.query('CALL ActualizarEspecialidad(?, ?, ?)', [cod_especialidad, nuevo_nombre, nueva_descripcion]);
}

module.exports = {
  agregarEspecialidad,
  obtenerTodasLasEspecialidades,
  obtenerEspecialidadPorCod,
  actualizarEspecialidad
};
