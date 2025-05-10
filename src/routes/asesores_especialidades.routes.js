const express = require('express');
const router = express.Router();
const AsesorEspecialidadModel = require('../models/asesores_especialidades.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /asesores_especialidades:
 *   post:
 *     summary: Asignar una especialidad a un asesor
 *     tags:
 *       - AsesoresEspecialidades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_asesor:
 *                 type: integer
 *               cod_especialidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Especialidad agregada al asesor correctamente
 *       400:
 *         description: Datos faltantes o error
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
 *     summary: Obtener especialidades de un asesor
 *     tags:
 *       - AsesoresEspecialidades
 *     parameters:
 *       - in: path
 *         name: cod_asesor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del asesor
 *     responses:
 *       200:
 *         description: Lista de especialidades del asesor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Asesor no encontrado o sin especialidades
 */
// GET: Obtener especialidades de un asesor
router.get('/:cod_asesor', async (req, res) => {
  try {
    const especialidades = await AsesorEspecialidadModel.obtenerEspecialidadesDeAsesor(req.params.cod_asesor);
    res.json(especialidades);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
