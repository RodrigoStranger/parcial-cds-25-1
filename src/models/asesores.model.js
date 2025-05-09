const pool = require('../config/database');

// Agregar un nuevo asesor
async function agregarAsesor(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador) {
    try {
        const [result] = await pool.query('CALL AgregarAsesor(?, ?, ?, ?, ?, ?, ?, ?)', 
            [dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador]);
        return result[0];
    } catch (error) {
        throw error;
    }
}

// Obtener todos los asesores
async function obtenerAsesores() {
    try {
        const [rows] = await pool.query('CALL ObtenerAsesores()');
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Obtener asesor por código
async function obtenerAsesorPorCodigo(codAsesor) {
    try {
        const [rows] = await pool.query('CALL ObtenerAsesorPorCodigo(?)', [codAsesor]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Actualizar asesor
async function actualizarAsesor(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador) {
    try {
        const [result] = await pool.query('CALL ActualizarAsesor(?, ?, ?, ?, ?, ?, ?, ?)', 
            [dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    agregarAsesor,
    obtenerAsesores,
    obtenerAsesorPorCodigo,
    actualizarAsesor
};
