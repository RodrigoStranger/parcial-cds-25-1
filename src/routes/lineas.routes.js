const express = require('express');
const router = express.Router();
const LineaModel = require('../models/linea.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     LineaInput:
 *       type: object
 *       required:
 *         - ruc
 *         - nombre_linea
 *       properties:
 *         ruc:
 *           type: string
 *           description: RUC del proveedor
 *           example: "20123456789"
 *         nombre_linea:
 *           type: string
 *           description: Nombre de la línea
 *           example: "Línea Salud"
 *     Linea:
 *       allOf:
 *         - $ref: '#/components/schemas/LineaInput'
 *         - type: object
 *           properties:
 *             cod_linea:
 *               type: integer
 *               example: 1
 *     MensajeExito:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Línea agregada correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /lineas:
 *   post:
 *     summary: Crear una nueva línea
 *     description: Permite registrar una nueva línea asociada a un proveedor por RUC.
 *     tags:
 *       - Lineas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LineaInput'
 *           example:
 *             ruc: "20123456789"
 *             nombre_linea: "Línea Salud"
 *     responses:
 *       201:
 *         description: Línea agregada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar línea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST: Agregar una línea
router.post('/', async (req, res) => {
  const { ruc, nombre_linea } = req.body;
  try {
    const result = await LineaModel.agregarLinea(ruc, nombre_linea);
    res.status(201).json({ message: 'Línea agregada correctamente'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas:
 *   get:
 *     summary: Obtener todas las líneas
 *     description: Devuelve la lista de todas las líneas registradas.
 *     tags:
 *       - Lineas
 *     responses:
 *       200:
 *         description: Lista de líneas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Linea'
 *       404:
 *         description: No se encontraron líneas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET: Obtener todas las líneas
router.get('/', async (req, res) => {
  try {
    const lineas = await LineaModel.obtenerTodasLasLineas();
    res.json(lineas);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas/{cod_linea}:
 *   get:
 *     summary: Obtener línea por ID
 *     tags:
 *       - Lineas
 *     parameters:
 *       - in: path
 *         name: cod_linea
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la línea
 *     responses:
 *       200:
 *         description: Datos de la línea
 *       404:
 *         description: Línea no encontrada
 */
// GET: Obtener línea por ID
router.get('/:cod_linea', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const linea = await LineaModel.obtenerLineaPorId(cod_linea);
    res.json(linea);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas/{cod_linea}/productos:
 *   get:
 *     summary: Obtener productos por línea
 *     tags:
 *       - Lineas
 *     parameters:
 *       - in: path
 *         name: cod_linea
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la línea
 *     responses:
 *       200:
 *         description: Lista de productos de la línea
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Línea o productos no encontrados
 */
// GET: Obtener productos por línea
router.get('/:cod_linea/productos', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const productos = await LineaModel.obtenerProductosPorLinea(cod_linea);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas/{cod_linea}/facturas:
 *   get:
 *     summary: Obtener facturas por línea
 *     tags:
 *       - Lineas
 *     parameters:
 *       - in: path
 *         name: cod_linea
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la línea
 *     responses:
 *       200:
 *         description: Lista de facturas de la línea
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Línea o facturas no encontradas
 */
// GET: Obtener facturas por línea
router.get('/:cod_linea/facturas', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const facturas = await LineaModel.obtenerFacturasPorLinea(cod_linea);
    res.json(facturas);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas/{cod_linea}/nombre:
 *   put:
 *     summary: Actualizar nombre de línea
 *     tags:
 *       - Lineas
 *     parameters:
 *       - in: path
 *         name: cod_linea
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la línea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevo_nombre_linea:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nombre de línea actualizado
 *       400:
 *         description: Error al actualizar nombre
 */
// PUT: Actualizar nombre de línea
router.put('/:cod_linea/nombre', async (req, res) => {
  const { cod_linea } = req.params;
  const { nuevo_nombre_linea } = req.body;
  try {
    const result = await LineaModel.actualizarNombreLinea(cod_linea, nuevo_nombre_linea);
    res.json({ message: 'Nombre de línea actualizado'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /lineas/{cod_linea}/ruc:
 *   put:
 *     summary: Actualizar RUC de línea
 *     tags:
 *       - Lineas
 *     parameters:
 *       - in: path
 *         name: cod_linea
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la línea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevo_ruc:
 *                 type: string
 *     responses:
 *       200:
 *         description: RUC de línea actualizado
 *       400:
 *         description: Error al actualizar RUC
 */
// PUT: Actualizar RUC de línea
router.put('/:cod_linea/ruc', async (req, res) => {
  const { cod_linea } = req.params;
  const { nuevo_ruc } = req.body;
  try {
    const result = await LineaModel.actualizarRucLinea(cod_linea, nuevo_ruc);
    res.json({ message: 'RUC de línea actualizado'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;