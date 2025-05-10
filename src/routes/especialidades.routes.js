const express = require('express');
const router = express.Router();
const EspecialidadModel = require('../models/especialidad.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /especialidades:
 *   post:
 *     summary: Agregar una nueva especialidad
 *     tags:
 *       - Especialidades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_especialidad:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Especialidad agregada correctamente
 *       400:
 *         description: Error al agregar especialidad
 */
// POST: Agregar especialidad
router.post('/', async (req, res) => {
  const { nombre_especialidad, descripcion } = req.body;
  if (!nombre_especialidad) return res.status(400).json({ error: 'El nombre de la especialidad es requerido' });
  try {
    await EspecialidadModel.agregarEspecialidad(nombre_especialidad, descripcion || null);
    res.status(201).json({ mensaje: 'Especialidad agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /especialidades:
 *   get:
 *     summary: Obtener todas las especialidades
 *     tags:
 *       - Especialidades
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Error al obtener especialidades
 */
// GET: Obtener todas las especialidades
router.get('/', async (req, res) => {
  try {
    const especialidades = await EspecialidadModel.obtenerTodasLasEspecialidades();
    res.json(especialidades);
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /especialidades/{cod_especialidad}:
 *   get:
 *     summary: Obtener especialidad por código
 *     tags:
 *       - Especialidades
 *     parameters:
 *       - in: path
 *         name: cod_especialidad
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la especialidad
 *     responses:
 *       200:
 *         description: Datos de la especialidad
 *       404:
 *         description: Especialidad no encontrada
 */
// GET: Obtener especialidad por código
router.get('/:cod_especialidad', async (req, res) => {
  try {
    const especialidad = await EspecialidadModel.obtenerEspecialidadPorCod(req.params.cod_especialidad);
    if (!especialidad || especialidad.length === 0) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    res.json(especialidad[0]);
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /especialidades/{cod_especialidad}:
 *   put:
 *     summary: Actualizar especialidad
 *     tags:
 *       - Especialidades
 *     parameters:
 *       - in: path
 *         name: cod_especialidad
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la especialidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_especialidad:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Especialidad actualizada correctamente
 *       400:
 *         description: Error al actualizar especialidad
 */
// PUT: Actualizar especialidad
router.put('/:cod_especialidad', async (req, res) => {
  const { nombre_especialidad, descripcion } = req.body;
  if (!nombre_especialidad) return res.status(400).json({ error: 'El nombre de la especialidad es requerido' });
  try {
    await EspecialidadModel.actualizarEspecialidad(req.params.cod_especialidad, nombre_especialidad, descripcion || null);
    res.json({ mensaje: 'Especialidad actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
