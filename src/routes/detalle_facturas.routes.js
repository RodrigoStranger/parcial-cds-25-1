const express = require('express');
const router = express.Router();
const DetalleFacturasModel = require('../models/detalle_facturas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Crear detalle de factura
router.post('/', async (req, res) => {
  const { cod_factura, cod_producto, cantidad } = req.body;
  if (!cod_factura || !cod_producto || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await DetalleFacturasModel.crearDetalleFactura(cod_factura, cod_producto, cantidad);
    res.status(201).json({ mensaje: 'Detalle de factura creado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los detalles de facturas
router.get('/', async (req, res) => {
  try {
    const detalles = await DetalleFacturasModel.obtenerTodosLosDetallesDeFacturas();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener detalles de una factura específica
router.get('/:cod_factura', async (req, res) => {
  try {
    const detalles = await DetalleFacturasModel.obtenerDetallesDeFactura(req.params.cod_factura);
    res.json(detalles);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// DELETE: Eliminar detalle de factura (por factura y producto)
router.delete('/', async (req, res) => {
  const { cod_factura, cod_producto } = req.body;
  if (!cod_factura || !cod_producto) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await DetalleFacturasModel.eliminarDetalleFactura(cod_factura, cod_producto);
    res.json({ mensaje: 'Detalle de factura eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
