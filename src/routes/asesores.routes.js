const express = require('express');
const router = express.Router();
const AsesorModel = require('../models/asesores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /asesores:
 *   post:
 *     summary: Agregar un nuevo asesor
 *     tags:
 *       - Asesores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               experiencia:
 *                 type: integer
 *               contrasena:
 *                 type: string
 *               esAdministrador:
 *                 type: boolean
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asesor creado correctamente
 *       400:
 *         description: Error en los datos enviados
 */

// POST: Agregar asesor
router.post('/', async (req, res) => {
  const { dni, experiencia, contrasena, esAdministrador, estado } = req.body;
  if (!dni || experiencia === undefined || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    const asesor = await AsesorModel.agregarAsesor(dni, experiencia, contrasena, esAdministrador, estado);
    res.status(201).json({ mensaje: 'Asesor agregado correctamente', asesor });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /asesores:
 *   get:
 *     summary: Obtener todos los asesores
 *     tags:
 *       - Asesores
 *     responses:
 *       200:
 *         description: Lista de asesores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron asesores
 */
// GET: Obtener todos los asesores
router.get('/', async (req, res) => {
  try {
    const asesores = await AsesorModel.obtenerAsesores();
    res.json(asesores);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /asesores/{cod_asesor}:
 *   get:
 *     summary: Obtener asesor por código
 *     tags:
 *       - Asesores
 *     parameters:
 *       - in: path
 *         name: cod_asesor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del asesor
 *     responses:
 *       200:
 *         description: Datos del asesor
 *       404:
 *         description: Asesor no encontrado
 */
// GET: Obtener asesor por código
router.get('/:cod_asesor', async (req, res) => {
  try {
    const asesor = await AsesorModel.obtenerAsesorPorCodigo(req.params.cod_asesor);
    if (!asesor || asesor.length === 0) {
      return res.status(404).json({ error: 'Asesor no encontrado' });
    }
    res.json(asesor[0]);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /asesores/{cod_asesor}:
 *   put:
 *     summary: Actualizar asesor
 *     tags:
 *       - Asesores
 *     parameters:
 *       - in: path
 *         name: cod_asesor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del asesor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               experiencia:
 *                 type: integer
 *               contrasena:
 *                 type: string
 *               esAdministrador:
 *                 type: boolean
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asesor actualizado correctamente
 *       400:
 *         description: Error al actualizar asesor
 */
// PUT: Actualizar asesor
router.put('/:cod_asesor', async (req, res) => {
  const { dni, experiencia, contrasena, esAdministrador, estado } = req.body;
  if (!dni || experiencia === undefined || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await AsesorModel.actualizarAsesor(req.params.cod_asesor, dni, experiencia, contrasena, esAdministrador, estado);
    res.json({ mensaje: 'Asesor actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
