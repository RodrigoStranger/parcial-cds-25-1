const pool = require('../config/database');

class DireccionesPersonasModel {
    // Agregar dirección a una persona
    static async agregarDireccionPersona(dni, direccion) {
        try {
            const [result] = await pool.query('CALL AgregarDireccionPersona(?, ?)', [dni, direccion]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Obtener direcciones de una persona
    static async obtenerDireccionesPersona(dni) {
        try {
            const [result] = await pool.query('CALL ObtenerDireccionesPersona(?)', [dni]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Actualizar dirección de una persona
    static async actualizarDireccionPersona(dni, direccionAntigua, nuevaDireccion) {
        try {
            const [result] = await pool.query('CALL ActualizarDireccionPersona(?, ?, ?)', [dni, direccionAntigua, nuevaDireccion]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DireccionesPersonasModel;
