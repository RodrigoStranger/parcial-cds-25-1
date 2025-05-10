const pool = require('../config/database');

const ClienteModel = require('./cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');

// Agregar un nuevo asesor solo con DNI y otros campos requeridos
async function agregarAsesor(dni, experiencia, contrasena, esAdministrador) {
    // Verificar si ya existe la persona
    const existe = await ClienteModel.verificarPersonaPorDni(dni);
    if (existe) {
        throw new Error('El asesor ya existe');
    }
    // Obtener datos desde la API
    const datos = await generarDatosCompletos(dni);
    if (!datos || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.fecha_nacimiento) {
        throw new Error('No se pudo obtener datos completos para el DNI');
    }
    // Usa los datos obtenidos y los campos adicionales
    const [result] = await pool.query('CALL AgregarAsesor(?, ?, ?, ?, ?, ?, ?, ?)', 
        [dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento, experiencia, contrasena, esAdministrador]);
    return result[0];
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
