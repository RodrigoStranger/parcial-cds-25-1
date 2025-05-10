const express = require('express');
const router = express.Router();
const ProductoModel = require('../models/producto.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - precio_venta
 *         - stock
 *         - cod_categoria
 *         - cod_linea
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *           example: "Paracetamol"
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *           example: "Medicamento para fiebre y dolor"
 *         precio_compra:
 *           type: number
 *           description: Precio de compra
 *           example: 2.50
 *         precio_venta:
 *           type: number
 *           description: Precio de venta
 *           example: 5.00
 *         stock:
 *           type: integer
 *           description: Stock disponible
 *           example: 100
 *         cod_categoria:
 *           type: integer
 *           description: Código de la categoría
 *           example: 3
 *         cod_linea:
 *           type: integer
 *           description: Código de la línea
 *           example: 1
 *         estado:
 *           type: string
 *           description: Estado del producto (activo/inactivo)
 *           example: "activo"
 *     Producto:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductoInput'
 *         - type: object
 *           properties:
 *             cod_producto:
 *               type: integer
 *               example: 10
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Producto agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Permite registrar un nuevo producto con sus datos completos.
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *           example:
 *             nombre: "Paracetamol"
 *             descripcion: "Medicamento para fiebre y dolor"
 *             precio_compra: 2.50
 *             precio_venta: 5.00
 *             stock: 100
 *             cod_categoria: 3
 *             cod_linea: 1
 *             estado: "activo"
 *     responses:
 *       201:
 *         description: Producto agregado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve la lista de todos los productos registrados.
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
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: No se encontraron productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @openapi
 * /productos/disponibles:
 *   get:
 *     summary: Obtener todos los productos disponibles
 *     description: Devuelve la lista de productos con stock disponible.
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: No se encontraron productos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /productos/buscar/{nombre_producto}:
 *   get:
 *     summary: Buscar producto por nombre
 *     description: Busca y devuelve productos que coincidan con el nombre dado.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: nombre_producto
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del producto a buscar
 *     responses:
 *       200:
 *         description: Productos encontrados por nombre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /productos/{cod_producto}/stock:
 *   get:
 *     summary: Obtener stock de producto por ID
 *     description: Devuelve el stock actual de un producto por su código.
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
 *         description: Stock del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stock:
 *                   type: integer
 *                   example: 100
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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