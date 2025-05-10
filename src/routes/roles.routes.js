const express = require('express');
const router = express.Router();
const RolModel = require('../models/rol.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /roles:
 *   post:
 *     summary: Agregar un nuevo rol
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol agregado correctamente
 *       400:
 *         description: Error al agregar rol
 */
// POST: Agregar rol
router.post('/', async (req, res) => {
  const { nombre_rol, descripcion } = req.body;
  try {
    const result = await RolModel.agregarRol(nombre_rol, descripcion);
    res.status(201).json({ mensaje: 'Rol agregado correctamente'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron roles
 */
// GET: Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    const roles = await RolModel.obtenerTodosRoles();
    res.json(roles);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /roles/{cod_rol}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: cod_rol
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del rol
 *     responses:
 *       200:
 *         description: Datos del rol
 *       404:
 *         description: Rol no encontrado
 */
// GET: Obtener rol por ID
router.get('/:cod_rol', async (req, res) => {
  const { cod_rol } = req.params;
  try {
    const rol = await RolModel.obtenerRolPorId(cod_rol);
    res.json(rol);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener empleados por rol
router.get('/:cod_rol/empleados', async (req, res) => {
  const { cod_rol } = req.params;
  try {
    const empleados = await RolModel.obtenerEmpleadosPorRol(cod_rol);
    res.json(empleados);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /roles/{cod_rol}:
 *   put:
 *     summary: Actualizar rol
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: cod_rol
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       400:
 *         description: Error al actualizar rol
 */
// PUT: Actualizar rol
router.put('/:cod_rol', async (req, res) => {
  const { cod_rol } = req.params;
  const { nombre_rol, descripcion } = req.body;
  try {
    const result = await RolModel.actualizarRol(cod_rol, nombre_rol, descripcion);
    res.json({ mensaje: 'Rol actualizado correctamente'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
