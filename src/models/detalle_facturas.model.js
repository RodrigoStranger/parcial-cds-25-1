const pool = require('../config/database');

// Crear detalle de factura
async function crearDetalleFactura(cod_factura, cod_producto, cantidad) {
    await pool.query('CALL CrearDetalleFactura(?, ?, ?)', [cod_factura, cod_producto, cantidad]);
    return true;
}

// Obtener todos los detalles de facturas
async function obtenerTodosLosDetallesDeFacturas() {
    const [rows] = await pool.query('CALL ObtenerTodosLosDetallesDeFacturas()');
    return rows[0];
}

// Obtener detalles de una factura específica
async function obtenerDetallesDeFactura(cod_factura) {
    const [rows] = await pool.query('CALL ObtenerDetallesDeFactura(?)', [cod_factura]);
    return rows[0];
}

// Eliminar detalle de factura
async function eliminarDetalleFactura(cod_factura, cod_producto) {
    await pool.query('CALL EliminarDetalleFactura(?, ?)', [cod_factura, cod_producto]);
    return true;
}

module.exports = {
    crearDetalleFactura,
    obtenerTodosLosDetallesDeFacturas,
    obtenerDetallesDeFactura,
    eliminarDetalleFactura
};
