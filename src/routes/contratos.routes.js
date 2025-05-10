const express = require('express');
const router = express.Router();
const ContratoModel = require('../models/contratos.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     ContratoInput:
 *       type: object
 *       required:
 *         - cod_empleado
 *         - fecha_inicio
 *         - salario_men
 *       properties:
 *         cod_empleado:
 *           type: integer
 *           description: Código del empleado
 *           example: 1
 *         fecha_inicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del contrato
 *           example: "2024-01-01"
 *         fecha_fin:
 *           type: string
 *           format: date
 *           description: Fecha de fin del contrato
 *           example: "2024-12-31"
 *         salario_men:
 *           type: number
 *           description: Salario mensual
 *           example: 2500.50
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *           example: "Contrato temporal"
 *     Contrato:
 *       allOf:
 *         - $ref: '#/components/schemas/ContratoInput'
 *         - type: object
 *           properties:
 *             cod_contrato:
 *               type: integer
 *               example: 10
 *             estado:
 *               type: string
 *               example: "activo"
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Contrato agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /contratos:
 *   post:
 *     summary: Crear un nuevo contrato
 *     description: Permite registrar un nuevo contrato para un empleado.
 *     tags:
 *       - Contratos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContratoInput'
 *           example:
 *             cod_empleado: 1
 *             fecha_inicio: "2024-01-01"
 *             fecha_fin: "2024-12-31"
 *             salario_men: 2500.50
 *             observaciones: "Contrato temporal"
 *     responses:
 *       201:
 *         description: Contrato agregado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Datos faltantes o error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve la lista de todos los contratos registrados.
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
 *                 $ref: '#/components/schemas/Contrato'
 *       404:
 *         description: No se encontraron contratos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
