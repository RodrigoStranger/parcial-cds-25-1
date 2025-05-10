const pool = require('../config/database');
const ClienteModel = require('./cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');

// Agregar un nuevo vendedor
async function agregarVendedor(dni, estado, contrasena, esAdministrador, cod_rol) {
    // Verificar si ya existe la persona
    const existe = await ClienteModel.verificarPersonaPorDni(dni);
    if (existe) {
        throw new Error('El vendedor ya existe');
    }
    // Obtener datos desde la API
    const datos = await generarDatosCompletos(dni);
    if (!datos || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.fecha_nacimiento) {
        throw new Error('No se pudo obtener datos completos para el DNI');
    }
    await pool.query('CALL AgregarVendedor(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento, estado, contrasena, esAdministrador, cod_rol !== undefined ? cod_rol : null]);
    return {
        dni,
        nombre: datos.nombre,
        apellido_paterno: datos.apellido_paterno,
        apellido_materno: datos.apellido_materno,
        fecha_nacimiento: datos.fecha_nacimiento,
        estado,
        esAdministrador,
        cod_rol
    };
}

// Obtener todos los vendedores
async function obtenerTodosLosVendedores() {
    const [rows] = await pool.query('CALL ObtenerTodosLosVendedores()');
    return rows[0];
}

// Obtener vendedor por código
async function obtenerVendedorPorCodigo(cod_vendedor) {
    const [rows] = await pool.query('CALL ObtenerVendedorPorCodigo(?)', [cod_vendedor]);
    return rows[0];
}

// Actualizar vendedor
async function actualizarVendedor(cod_vendedor, dni, estado, contrasena, esAdministrador, cod_rol) {
    // Obtener datos desde la API
    const datos = await generarDatosCompletos(dni);
    if (!datos || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.fecha_nacimiento) {
        throw new Error('No se pudo obtener datos completos para el DNI');
    }
    await pool.query('CALL ActualizarVendedor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cod_vendedor, dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento, estado, contrasena, esAdministrador, cod_rol !== undefined ? cod_rol : null]);
    return true;
}

module.exports = {
    agregarVendedor,
    obtenerTodosLosVendedores,
    obtenerVendedorPorCodigo,
    actualizarVendedor
};
