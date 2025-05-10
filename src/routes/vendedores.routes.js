const express = require('express');
const router = express.Router();
const VendedorModel = require('../models/vendedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /vendedores:
 *   post:
 *     summary: Agregar un nuevo vendedor
 *     tags:
 *       - Vendedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               estado:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               esAdministrador:
 *                 type: boolean
 *               cod_rol:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vendedor agregado correctamente
 *       400:
 *         description: Error en los datos enviados
 */
// POST: Agregar vendedor
router.post('/', async (req, res) => {
  const { dni, estado, contrasena, esAdministrador, cod_rol } = req.body;
  if (!dni || !estado || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    const vendedor = await VendedorModel.agregarVendedor(dni, estado, contrasena, esAdministrador, cod_rol);
    res.status(201).json({ mensaje: 'Vendedor agregado correctamente', vendedor });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /vendedores:
 *   get:
 *     summary: Obtener todos los vendedores
 *     tags:
 *       - Vendedores
 *     responses:
 *       200:
 *         description: Lista de vendedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron vendedores
 */
// GET: Obtener todos los vendedores
router.get('/', async (req, res) => {
  try {
    const vendedores = await VendedorModel.obtenerTodosLosVendedores();
    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /vendedores/{cod_vendedor}:
 *   get:
 *     summary: Obtener vendedor por código
 *     tags:
 *       - Vendedores
 *     parameters:
 *       - in: path
 *         name: cod_vendedor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del vendedor
 *     responses:
 *       200:
 *         description: Datos del vendedor
 *       404:
 *         description: Vendedor no encontrado
 */
// GET: Obtener vendedor por código
router.get('/:cod_vendedor', async (req, res) => {
  try {
    const vendedor = await VendedorModel.obtenerVendedorPorCodigo(req.params.cod_vendedor);
    if (!vendedor || vendedor.length === 0) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }
    res.json(vendedor[0]);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /vendedores/{cod_vendedor}:
 *   put:
 *     summary: Actualizar vendedor
 *     tags:
 *       - Vendedores
 *     parameters:
 *       - in: path
 *         name: cod_vendedor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del vendedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               estado:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               esAdministrador:
 *                 type: boolean
 *               cod_rol:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vendedor actualizado correctamente
 *       400:
 *         description: Error al actualizar vendedor
 */
// PUT: Actualizar vendedor
router.put('/:cod_vendedor', async (req, res) => {
  const { dni, estado, contrasena, esAdministrador, cod_rol } = req.body;
  if (!dni || !estado || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await VendedorModel.actualizarVendedor(req.params.cod_vendedor, dni, estado, contrasena, esAdministrador, cod_rol);
    res.json({ mensaje: 'Vendedor actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
