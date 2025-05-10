const express = require('express');
const router = express.Router();
const AsesorEspecialidadModel = require('../models/asesores_especialidades.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     AsignacionEspecialidad:
 *       type: object
 *       required:
 *         - cod_asesor
 *         - cod_especialidad
 *       properties:
 *         cod_asesor:
 *           type: integer
 *           description: Código único del asesor
 *           example: 1
 *         cod_especialidad:
 *           type: integer
 *           description: Código único de la especialidad
 *           example: 3
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Especialidad agregada al asesor correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /asesores_especialidades:
 *   post:
 *     summary: Asignar una especialidad a un asesor existente
 *     description: Permite asignar una especialidad a un asesor específico. Ambos códigos deben existir previamente.
 *     tags:
 *       - AsesoresEspecialidades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsignacionEspecialidad'
 *           example:
 *             cod_asesor: 1
 *             cod_especialidad: 3
 *     responses:
 *       201:
 *         description: Especialidad agregada al asesor correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Datos faltantes o error en la asignación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST: Agregar especialidad a asesor
router.post('/', async (req, res) => {
  const { cod_asesor, cod_especialidad } = req.body;
  if (!cod_asesor || !cod_especialidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await AsesorEspecialidadModel.agregarEspecialidadAAsesor(cod_asesor, cod_especialidad);
    res.status(201).json({ mensaje: 'Especialidad agregada al asesor correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /asesores_especialidades/{cod_asesor}:
 *   get:
 *     summary: Obtener especialidades asignadas a un asesor
 *     description: Devuelve la lista de especialidades asociadas a un asesor por su código único.
 *     tags:
 *       - AsesoresEspecialidades
 *     parameters:
 *       - in: path
 *         name: cod_asesor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código único del asesor
 *     responses:
 *       200:
 *         description: Lista de especialidades del asesor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cod_especialidad:
 *                     type: integer
 *                     example: 3
 *                   nombre:
 *                     type: string
 *                     example: Cardiología
 *       404:
 *         description: Asesor no encontrado o sin especialidades
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET: Obtener especialidades de un asesor
/**
 * @openapi
 * /asesores_especialidades/{cod_asesor}:
 *   get:
 *     summary: Obtener especialidades de un asesor
 *     description: Devuelve la lista de especialidades asignadas a un asesor por su código.
 *     tags:
 *       - AsesoresEspecialidades
 *     parameters:
 *       - in: path
 *         name: cod_asesor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código único del asesor
 *     responses:
 *       200:
 *         description: Lista de especialidades del asesor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cod_especialidad:
 *                     type: integer
 *                     example: 3
 *                   nombre_especialidad:
 *                     type: string
 *                     example: Cardiología
 *       404:
 *         description: Asesor o especialidades no encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:cod_asesor', async (req, res) => {
  try {
    const especialidades = await AsesorEspecialidadModel.obtenerEspecialidadesDeAsesor(req.params.cod_asesor);
    res.json(especialidades);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
