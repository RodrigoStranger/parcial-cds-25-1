const express = require('express');
const router = express.Router();
const ProductoModel = require('../models/producto.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /productos:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_producto:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               cod_categoria:
 *                 type: integer
 *               cod_linea:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto agregado correctamente
 *       400:
 *         description: Error al agregar producto
 */
// POST: Agregar producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado } = req.body;
  try {
    await ProductoModel.agregarProducto(nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado);
    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron productos
 */
// GET: Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await ProductoModel.obtenerTodosLosProductos();
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los productos disponibles
router.get('/disponibles', async (req, res) => {
  try {
    const productos = await ProductoModel.obtenerTodosLosProductosDisponibles();
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /productos/{cod_producto}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: cod_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del producto
 *     responses:
 *       200:
 *         description: Datos del producto
 *       404:
 *         description: Producto no encontrado
 */
// GET: Obtener producto por ID
router.get('/:cod_producto', async (req, res) => {
  const { cod_producto } = req.params;
  try {
    const producto = await ProductoModel.obtenerProductoPorId(cod_producto);
    res.json(producto);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Buscar producto por nombre
router.get('/buscar/:nombre_producto', async (req, res) => {
  const { nombre_producto } = req.params;
  try {
    const producto = await ProductoModel.buscarProductoPorNombre(nombre_producto);
    res.json(producto);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener stock por ID
router.get('/:cod_producto/stock', async (req, res) => {
  const { cod_producto } = req.params;
  try {
    const stock = await ProductoModel.obtenerStockPorId(cod_producto);
    res.json(stock);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /productos/{cod_producto}:
 *   put:
 *     summary: Actualizar producto
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: cod_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_producto:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               cod_categoria:
 *                 type: integer
 *               cod_linea:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Error al actualizar producto
 */
// PUT: Actualizar producto
router.put('/:cod_producto', async (req, res) => {
  const { cod_producto } = req.params;
  const { nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado } = req.body;
  try {
    await ProductoModel.actualizarProducto(cod_producto, nombre, descripcion, precio_compra, precio_venta, stock, cod_categoria, cod_linea, estado);
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar estado a agotado
router.put('/:cod_producto/agotado', async (req, res) => {
  const { cod_producto } = req.params;
  try {
    await ProductoModel.actualizarEstadoAgotado(cod_producto);
    res.json({ mensaje: 'Estado actualizado a agotado' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar stock de producto
router.put('/:cod_producto/stock', async (req, res) => {
  const { cod_producto } = req.params;
  const { nuevo_stock } = req.body;
  try {
    await ProductoModel.actualizarStockProducto(cod_producto, nuevo_stock);
    res.json({ mensaje: 'Stock actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;