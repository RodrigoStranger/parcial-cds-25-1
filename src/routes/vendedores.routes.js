const express = require('express');
const router = express.Router();
const VendedorModel = require('../models/vendedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     VendedorInput:
 *       type: object
 *       required:
 *         - dni
 *         - estado
 *         - contrasena
 *         - esAdministrador
 *         - cod_rol
 *       properties:
 *         dni:
 *           type: string
 *           description: DNI del vendedor
 *           example: "12345678"
 *         estado:
 *           type: string
 *           description: Estado del vendedor (activo/inactivo)
 *           example: "activo"
 *         contrasena:
 *           type: string
 *           description: Contraseña del vendedor
 *           example: "password123"
 *         esAdministrador:
 *           type: boolean
 *           description: Si el vendedor es administrador
 *           example: false
 *         cod_rol:
 *           type: integer
 *           description: Código del rol asignado
 *           example: 2
 *     Vendedor:
 *       allOf:
 *         - $ref: '#/components/schemas/VendedorInput'
 *         - type: object
 *           properties:
 *             cod_vendedor:
 *               type: integer
 *               example: 5
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Vendedor agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /vendedores:
 *   post:
 *     summary: Crear un nuevo vendedor
 *     description: Permite registrar un nuevo vendedor con sus datos completos y asignar rol.
 *     tags:
 *       - Vendedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendedorInput'
 *           example:
 *             dni: "12345678"
 *             estado: "activo"
 *             contrasena: "password123"
 *             esAdministrador: false
 *             cod_rol: 2
 *     responses:
 *       201:
 *         description: Vendedor agregado correctamente
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
 *     description: Devuelve la lista de todos los vendedores registrados.
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
 *                 $ref: '#/components/schemas/Vendedor'
 *       404:
 *         description: No se encontraron vendedores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
