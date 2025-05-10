const pool = require('../config/database');

// Agregar un nuevo contrato
async function agregarContrato(cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones) {
    await pool.query('CALL AgregarContrato(?, ?, ?, ?, ?)', [cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones]);
    return true;
}

// Obtener todos los contratos
async function obtenerTodosLosContratos() {
    const [rows] = await pool.query('CALL ObtenerTodosLosContratos()');
    return rows[0];
}

// Obtener contrato por código
async function obtenerContratoPorCodigo(cod_contrato) {
    const [rows] = await pool.query('CALL ObtenerContratoPorCodigo(?)', [cod_contrato]);
    return rows[0];
}

// Actualizar contrato
async function actualizarContrato(cod_contrato, fecha_inicio, fecha_fin, salario_men, observaciones, estado) {
    await pool.query('CALL ActualizarContrato(?, ?, ?, ?, ?, ?)', [cod_contrato, fecha_inicio, fecha_fin, salario_men, observaciones, estado]);
    return true;
}

// Desactivar contrato
async function desactivarContrato(cod_contrato) {
    await pool.query('CALL DesactivarContrato(?)', [cod_contrato]);
    return true;
}

module.exports = {
    agregarContrato,
    obtenerTodosLosContratos,
    obtenerContratoPorCodigo,
    actualizarContrato,
    desactivarContrato
};
