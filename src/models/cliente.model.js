const pool = require('../config/database');

// Agregar cliente (requiere todos los datos)
async function agregarCliente(dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento) {
  const [result] = await pool.query('CALL AgregarCliente(?, ?, ?, ?, ?)', [dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento]);
  return result;
}

// Obtener todos los clientes
async function obtenerTodosLosClientes() {
  const [rows] = await pool.query('CALL ObtenerTodosLosClientes()');
  return rows[0];
}

// Obtener cliente por DNI
async function obtenerClientePorDni(dni) {
  const [rows] = await pool.query('CALL ObtenerClientePorDni(?)', [dni]);
  return rows[0];
}

// Obtener productos comprados por cliente
async function obtenerProductosCompradosPorCliente(dni) {
  const [rows] = await pool.query('CALL ObtenerProductosCompradosPorCliente(?)', [dni]);
  return rows[0];
}

// Verificar si una persona existe por DNI usando el SP VerificarPersonaPorDni
async function verificarPersonaPorDni(dni) {
  const [rows] = await pool.query('CALL VerificarPersonaPorDni(?)', [dni]);
  // El valor estará en rows[0][0].existe
  return rows && rows[0] && rows[0][0] && rows[0][0].existe == 1;
}

module.exports = {
  agregarCliente,
  obtenerTodosLosClientes,
  obtenerClientePorDni,
  obtenerProductosCompradosPorCliente,
  verificarPersonaPorDni
};
