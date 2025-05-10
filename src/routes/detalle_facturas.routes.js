const express = require('express');
const router = express.Router();
const DetalleFacturasModel = require('../models/detalle_facturas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /detalle_facturas:
 *   post:
 *     summary: Agregar un detalle a una factura
 *     tags:
 *       - DetalleFacturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_factura:
 *                 type: integer
 *               cod_producto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Detalle agregado correctamente
 *       400:
 *         description: Error en los datos enviados
 */

/**
 * @openapi
 * /detalle_facturas:
 *   get:
 *     summary: Obtener todos los detalles de facturas
 *     tags:
 *       - DetalleFacturas
 *     responses:
 *       200:
 *         description: Lista de detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @openapi
 * /detalle_facturas/{cod_factura}:
 *   get:
 *     summary: Obtener detalles de una factura específica
 *     tags:
 *       - DetalleFacturas
 *     parameters:
 *       - in: path
 *         name: cod_factura
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la factura
 *     responses:
 *       200:
 *         description: Detalles de la factura
 *       404:
 *         description: Factura no encontrada
 */

/**
 * @openapi
 * /detalle_facturas:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     tags:
 *       - DetalleFacturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_factura:
 *                 type: integer
 *               cod_producto:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Detalle eliminado correctamente
 *       400:
 *         description: Error al eliminar el detalle
 */

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
