const express = require('express');
const router = express.Router();
const FacturasModel = require('../models/facturas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar factura
router.post('/', async (req, res) => {
  const { dni_cliente, cod_vendedor, cod_asesor } = req.body;
  if (!dni_cliente || !cod_vendedor) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await FacturasModel.agregarFactura(dni_cliente, cod_vendedor, cod_asesor);
    res.status(201).json({ mensaje: 'Factura agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todas las facturas
router.get('/', async (req, res) => {
  try {
    const facturas = await FacturasModel.obtenerTodasLasFacturas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener detalles de una factura específica
router.get('/:cod_factura', async (req, res) => {
  try {
    const detalles = await FacturasModel.obtenerDetallesDeFactura(req.params.cod_factura);
    res.json(detalles);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// DELETE: Eliminar factura
router.delete('/:cod_factura', async (req, res) => {
  try {
    await FacturasModel.eliminarFactura(req.params.cod_factura);
    res.json({ mensaje: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
