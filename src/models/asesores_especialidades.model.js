const pool = require('../config/database');

// Agregar especialidad a asesor
async function agregarEspecialidadAAsesor(cod_asesor, cod_especialidad) {
    await pool.query('CALL AgregarEspecialidadAAsesor(?, ?)', [cod_asesor, cod_especialidad]);
    return true;
}

// Obtener especialidades de un asesor
async function obtenerEspecialidadesDeAsesor(cod_asesor) {
    const [rows] = await pool.query('CALL ObtenerEspecialidadesDeAsesor(?)', [cod_asesor]);
    return rows[0];
}

module.exports = {
    agregarEspecialidadAAsesor,
    obtenerEspecialidadesDeAsesor
};
