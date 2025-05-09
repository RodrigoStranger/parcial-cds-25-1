const pool = require('../config/database');

// Agregar una nueva persona
async function agregarPersona(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
    try {
        const [result] = await pool.query('CALL AgregarPersona(?, ?, ?, ?, ?)', 
            [dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento]);
        return result;
    } catch (error) {
        throw error;
    }
}

// Obtener todas las personas
async function obtenerPersonas() {
    try {
        const [rows] = await pool.query('CALL ObtenerPersonas()');
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Obtener persona por DNI
async function obtenerPersonaPorDNI(dni) {
    try {
        const [rows] = await pool.query('CALL ObtenerPersonaPorDNI(?)', [dni]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Actualizar persona
async function actualizarPersona(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
    try {
        const [result] = await pool.query('CALL ActualizarPersona(?, ?, ?, ?, ?)', 
            [dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    agregarPersona,
    obtenerPersonas,
    obtenerPersonaPorDNI,
    actualizarPersona
};
