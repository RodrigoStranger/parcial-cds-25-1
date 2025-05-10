const express = require('express');
const router = express.Router();
const ProveedorModel = require('../models/proveedor.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /proveedores:
 *   post:
 *     summary: Agregar un nuevo proveedor
 *     tags:
 *       - Proveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruc:
 *                 type: string
 *               razon_social:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor agregado correctamente
 *       400:
 *         description: Error al agregar proveedor
 */
// POST: Agregar proveedor
router.post('/', async (req, res) => {
  const { ruc, nombre } = req.body;
  try {
    await ProveedorModel.agregarProveedor(ruc, nombre);
    res.status(201).json({ mensaje: 'Proveedor agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags:
 *       - Proveedores
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron proveedores
 */
// GET: Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await ProveedorModel.obtenerProveedores();
    res.json(proveedores);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /proveedores/{ruc}:
 *   get:
 *     summary: Obtener proveedor por RUC
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: path
 *         name: ruc
 *         schema:
 *           type: string
 *         required: true
 *         description: RUC del proveedor
 *     responses:
 *       200:
 *         description: Datos del proveedor
 *       404:
 *         description: Proveedor no encontrado
 */
// GET: Obtener proveedor por RUC
router.get('/:ruc', async (req, res) => {
  const { ruc } = req.params;
  try {
    const proveedor = await ProveedorModel.obtenerProveedorPorRuc(ruc);
    res.json(proveedor);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos de un proveedor
router.get('/:ruc/productos', async (req, res) => {
  const { ruc } = req.params;
  try {
    const productos = await ProveedorModel.obtenerProductosDeProveedor(ruc);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos más vendidos por proveedor
router.get('/:ruc/productos-mas-vendidos', async (req, res) => {
  const { ruc } = req.params;
  try {
    const productos = await ProveedorModel.obtenerProductosMasVendidosPorProveedor(ruc);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener líneas de un proveedor
router.get('/:ruc/lineas', async (req, res) => {
  const { ruc } = req.params;
  try {
    const lineas = await ProveedorModel.obtenerLineasDeProveedor(ruc);
    res.json(lineas);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /proveedores/{ruc}:
 *   put:
 *     summary: Actualizar proveedor
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: path
 *         name: ruc
 *         schema:
 *           type: string
 *         required: true
 *         description: RUC del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razon_social:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       400:
 *         description: Error al actualizar proveedor
 */
// PUT: Actualizar proveedor
router.put('/:ruc', async (req, res) => {
  const { ruc } = req.params;
  const { nuevo_nombre } = req.body;
  try {
    await ProveedorModel.actualizarProveedor(ruc, nuevo_nombre);
    res.json({ mensaje: 'Proveedor actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
