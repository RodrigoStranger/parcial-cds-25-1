const express = require('express');
const router = express.Router();
const ContratoModel = require('../models/contratos.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /contratos:
 *   post:
 *     summary: Agregar un nuevo contrato
 *     tags:
 *       - Contratos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_empleado:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               salario_men:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contrato agregado correctamente
 *       400:
 *         description: Datos faltantes o error
 */
// POST: Agregar contrato
router.post('/', async (req, res) => {
  const { cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones } = req.body;
  if (!cod_empleado || !fecha_inicio || !salario_men) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await ContratoModel.agregarContrato(cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones);
    res.status(201).json({ mensaje: 'Contrato agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /contratos:
 *   get:
 *     summary: Obtener todos los contratos
 *     tags:
 *       - Contratos
 *     responses:
 *       200:
 *         description: Lista de contratos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
// GET: Obtener todos los contratos
router.get('/', async (req, res) => {
  try {
    const contratos = await ContratoModel.obtenerTodosLosContratos();
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /contratos/{cod_contrato}:
 *   get:
 *     summary: Obtener contrato por código
 *     tags:
 *       - Contratos
 *     parameters:
 *       - in: path
 *         name: cod_contrato
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del contrato
 *     responses:
 *       200:
 *         description: Datos del contrato
 *       404:
 *         description: Contrato no encontrado
 */
// GET: Obtener contrato por código
router.get('/:cod_contrato', async (req, res) => {
  try {
    const contrato = await ContratoModel.obtenerContratoPorCodigo(req.params.cod_contrato);
    if (!contrato || contrato.length === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json(contrato[0]);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /contratos/{cod_contrato}:
 *   put:
 *     summary: Actualizar contrato
 *     tags:
 *       - Contratos
 *     parameters:
 *       - in: path
 *         name: cod_contrato
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del contrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               salario_men:
 *                 type: number
 *               observaciones:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contrato actualizado correctamente
 *       400:
 *         description: Error al actualizar contrato
 */
// PUT: Actualizar contrato
router.put('/:cod_contrato', async (req, res) => {
  const { fecha_inicio, fecha_fin, salario_men, observaciones, estado } = req.body;
  if (!fecha_inicio || !salario_men || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await ContratoModel.actualizarContrato(req.params.cod_contrato, fecha_inicio, fecha_fin, salario_men, observaciones, estado);
    res.json({ mensaje: 'Contrato actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

/**
 * @openapi
 * /contratos/desactivar/{cod_contrato}:
 *   put:
 *     summary: Desactivar contrato
 *     tags:
 *       - Contratos
 *     parameters:
 *       - in: path
 *         name: cod_contrato
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del contrato
 *     responses:
 *       200:
 *         description: Contrato desactivado correctamente
 *       400:
 *         description: Error al desactivar contrato
 */
// PUT: Desactivar contrato
router.put('/desactivar/:cod_contrato', async (req, res) => {
  try {
    await ContratoModel.desactivarContrato(req.params.cod_contrato);
    res.json({ mensaje: 'Contrato desactivado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
