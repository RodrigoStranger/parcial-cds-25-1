const pool = require('../config/database');
const ClienteModel = require('./cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');

// Agregar un nuevo asesor
async function agregarAsesor(dni, experiencia, contrasena, esAdministrador, estado = 'activo') {
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
    await pool.query('CALL AgregarAsesor(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento, estado, contrasena, esAdministrador, experiencia]);
    return {
        dni,
        nombre: datos.nombre,
        apellido_paterno: datos.apellido_paterno,
        apellido_materno: datos.apellido_materno,
        fecha_nacimiento: datos.fecha_nacimiento,
        experiencia,
        esAdministrador,
        estado
    };
}

// Obtener todos los asesores
async function obtenerAsesores() {
    const [rows] = await pool.query('CALL ObtenerAsesores()');
    return rows[0];
}

// Obtener asesor por código
async function obtenerAsesorPorCodigo(cod_asesor) {
    const [rows] = await pool.query('CALL ObtenerAsesorPorCodigo(?)', [cod_asesor]);
    return rows[0];
}

// Actualizar asesor
async function actualizarAsesor(cod_asesor, dni, experiencia, contrasena, esAdministrador, estado = 'activo') {
    // Obtener datos desde la API
    const datos = await generarDatosCompletos(dni);
    if (!datos || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.fecha_nacimiento) {
        throw new Error('No se pudo obtener datos completos para el DNI');
    }
    await pool.query('CALL ActualizarAsesor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cod_asesor, dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento, estado, contrasena, esAdministrador, experiencia]);
    return true;
}

module.exports = {
    agregarAsesor,
    obtenerAsesores,
    obtenerAsesorPorCodigo,
    actualizarAsesor
};
