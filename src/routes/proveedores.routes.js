const express = require('express');
const router = express.Router();
const ProveedorModel = require('../models/proveedor.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     ProveedorInput:
 *       type: object
 *       required:
 *         - ruc
 *         - nombre
 *       properties:
 *         ruc:
 *           type: string
 *           description: RUC del proveedor
 *           example: "20123456789"
 *         nombre:
 *           type: string
 *           description: Nombre o razón social del proveedor
 *           example: "Laboratorios Salud S.A."
 *     Proveedor:
 *       allOf:
 *         - $ref: '#/components/schemas/ProveedorInput'
 *         - type: object
 *           properties:
 *             direccion:
 *               type: string
 *               description: Dirección del proveedor
 *               example: "Av. Salud 123, Lima"
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Proveedor agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     description: Permite registrar un nuevo proveedor con su RUC y nombre o razón social.
 *     tags:
 *       - Proveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProveedorInput'
 *           example:
 *             ruc: "20123456789"
 *             nombre: "Laboratorios Salud S.A."
 *     responses:
 *       201:
 *         description: Proveedor agregado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar proveedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve la lista de todos los proveedores registrados.
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
 *                 $ref: '#/components/schemas/Proveedor'
 *       404:
 *         description: No se encontraron proveedores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @openapi
 * /proveedores/{ruc}/productos:
 *   get:
 *     summary: Obtener productos de un proveedor
 *     description: Devuelve la lista de productos que ofrece un proveedor por su RUC.
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
 *         description: Lista de productos del proveedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Proveedor o productos no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /proveedores/{ruc}/productos-mas-vendidos:
 *   get:
 *     summary: Obtener productos más vendidos por proveedor
 *     description: Devuelve la lista de productos más vendidos de un proveedor por su RUC.
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
 *         description: Lista de productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Proveedor o productos no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /proveedores/{ruc}/lineas:
 *   get:
 *     summary: Obtener líneas de un proveedor
 *     description: Devuelve la lista de líneas asociadas a un proveedor por su RUC.
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
 *         description: Lista de líneas del proveedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Linea'
 *       404:
 *         description: Proveedor o líneas no encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
