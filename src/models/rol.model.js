const pool = require('../config/database');

// Agregar un nuevo rol
async function agregarRol(nombre_rol, descripcion) {
  const [result] = await pool.query('CALL AgregarRol(?, ?)', [nombre_rol, descripcion]);
  return result;
}

// Obtener todos los roles
async function obtenerTodosRoles() {
  const [rows] = await pool.query('CALL ObtenerTodosRoles()');
  return rows[0];
}

// Obtener rol por ID
async function obtenerRolPorId(cod_rol) {
  const [rows] = await pool.query('CALL ObtenerRolPorId(?)', [cod_rol]);
  return rows[0];
}

// Obtener empleados por rol
async function obtenerEmpleadosPorRol(cod_rol) {
  const [rows] = await pool.query('CALL ObtenerEmpleadosPorRol(?)', [cod_rol]);
  return rows[0];
}

// Actualizar rol
async function actualizarRol(cod_rol, nuevo_nombre_rol, nueva_descripcion) {
  const [result] = await pool.query('CALL ActualizarRol(?, ?, ?)', [cod_rol, nuevo_nombre_rol, nueva_descripcion]);
  return result;
}

module.exports = {
  agregarRol,
  obtenerTodosRoles,
  obtenerRolPorId,
  obtenerEmpleadosPorRol,
  actualizarRol
};
