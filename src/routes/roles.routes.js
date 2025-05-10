const express = require('express');
const router = express.Router();
const RolModel = require('../models/rol.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     RolInput:
 *       type: object
 *       required:
 *         - nombre_rol
 *         - descripcion
 *       properties:
 *         nombre_rol:
 *           type: string
 *           description: Nombre del rol
 *           example: "Administrador"
 *         descripcion:
 *           type: string
 *           description: Descripción del rol
 *           example: "Acceso total al sistema"
 *     Rol:
 *       allOf:
 *         - $ref: '#/components/schemas/RolInput'
 *         - type: object
 *           properties:
 *             cod_rol:
 *               type: integer
 *               example: 1
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Rol agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     description: Permite registrar un nuevo rol para el sistema.
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolInput'
 *           example:
 *             nombre_rol: "Administrador"
 *             descripcion: "Acceso total al sistema"
 *     responses:
 *       201:
 *         description: Rol agregado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve la lista de todos los roles registrados.
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
 *                 $ref: '#/components/schemas/Rol'
 *       404:
 *         description: No se encontraron roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @openapi
 * /roles/{cod_rol}/empleados:
 *   get:
 *     summary: Obtener empleados por rol
 *     description: Devuelve la lista de empleados asociados a un rol específico por su código.
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
 *         description: Lista de empleados del rol
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 *       404:
 *         description: Rol o empleados no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
