const pool = require('../config/database');

// Agregar factura
async function agregarFactura(dni_cliente, cod_vendedor, cod_asesor = null) {
    await pool.query('CALL AgregarFactura(?, ?, ?)', [dni_cliente, cod_vendedor, cod_asesor]);
    return true;
}

// Obtener todas las facturas
async function obtenerTodasLasFacturas() {
    const [rows] = await pool.query('CALL ObtenerTodasLasFacturas()');
    return rows[0];
}

// Obtener detalles de una factura específica
async function obtenerDetallesDeFactura(cod_factura) {
    const [rows] = await pool.query('CALL ObtenerDetallesDeFactura(?)', [cod_factura]);
    return rows[0];
}

// Eliminar factura
async function eliminarFactura(cod_factura) {
    await pool.query('CALL EliminarFactura(?)', [cod_factura]);
    return true;
}

module.exports = {
    agregarFactura,
    obtenerTodasLasFacturas,
    obtenerDetallesDeFactura,
    eliminarFactura
};
