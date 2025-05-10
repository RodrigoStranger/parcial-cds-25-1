const express = require('express');
const router = express.Router();
const FacturasModel = require('../models/facturas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     FacturaInput:
 *       type: object
 *       required:
 *         - dni_cliente
 *         - cod_vendedor
 *       properties:
 *         dni_cliente:
 *           type: string
 *           description: DNI del cliente
 *           example: "12345678"
 *         cod_vendedor:
 *           type: integer
 *           description: Código del vendedor
 *           example: 2
 *         cod_asesor:
 *           type: integer
 *           description: Código del asesor (opcional)
 *           nullable: true
 *           example: 3
 *     Factura:
 *       allOf:
 *         - $ref: '#/components/schemas/FacturaInput'
 *         - type: object
 *           properties:
 *             cod_factura:
 *               type: integer
 *               example: 10
 *             fecha:
 *               type: string
 *               format: date
 *               example: "2024-05-09"
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Factura creada correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     description: Permite registrar una nueva factura, vinculando cliente, vendedor y opcionalmente asesor.
 *     tags:
 *       - Facturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FacturaInput'
 *           example:
 *             dni_cliente: "12345678"
 *             cod_vendedor: 2
 *             cod_asesor: 3
 *     responses:
 *       201:
 *         description: Factura creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /facturas:
 *   get:
 *     summary: Obtener todas las facturas
 *     description: Devuelve la lista de todas las facturas registradas.
 *     tags:
 *       - Facturas
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: No se encontraron facturas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /facturas/{cod_factura}:
 *   get:
 *     summary: Obtener detalles de una factura específica
 *     description: Devuelve los datos de una factura por su código único.
 *     tags:
 *       - Facturas
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /facturas/{cod_factura}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: cod_factura
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada correctamente
 *       400:
 *         description: Error al eliminar la factura
 */

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
