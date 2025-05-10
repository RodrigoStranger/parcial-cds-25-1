const express = require('express');
const router = express.Router();
const CategoriaModel = require('../models/categoria.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /categorias:
 *   post:
 *     summary: Agregar una nueva categoría
 *     tags:
 *       - Categorias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría agregada correctamente
 *       400:
 *         description: Error al agregar categoría
 */
// POST: Agregar una categoría
router.post('/', async (req, res) => {
  const { nombre_categoria, descripcion } = req.body;
  try {
    await CategoriaModel.agregarCategoria(nombre_categoria, descripcion);
    res.status(201).json({ mensaje: 'Categoría agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron categorías
 */
// GET: Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaModel.obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /categorias/{cod_categoria}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: cod_categoria
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la categoría
 *     responses:
 *       200:
 *         description: Datos de la categoría
 *       404:
 *         description: Categoría no encontrada
 */
// GET: Obtener categoría por ID
router.get('/:cod_categoria', async (req, res) => {
  const { cod_categoria } = req.params;
  try {
    const categoria = await CategoriaModel.obtenerCategoriaPorId(cod_categoria);
    res.json(categoria);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /categorias/{cod_categoria}/productos:
 *   get:
 *     summary: Obtener productos por categoría
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: cod_categoria
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la categoría
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Categoría o productos no encontrados
 */
// GET: Obtener productos por categoría
router.get('/:cod_categoria/productos', async (req, res) => {
  const { cod_categoria } = req.params;
  try {
    const productos = await CategoriaModel.obtenerProductosPorCategoria(cod_categoria);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /categorias/{cod_categoria}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: cod_categoria
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       400:
 *         description: Error al actualizar categoría
 */
// PUT: Actualizar categoría
router.put('/:cod_categoria', async (req, res) => {
  const { cod_categoria } = req.params;
  const { nombre_categoria, descripcion } = req.body;
  try {
    await CategoriaModel.actualizarCategoria(cod_categoria, nombre_categoria, descripcion);
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;