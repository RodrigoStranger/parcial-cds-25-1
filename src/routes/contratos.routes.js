const express = require('express');
const router = express.Router();
const ContratoModel = require('../models/contratos.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

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

// GET: Obtener todos los contratos
router.get('/', async (req, res) => {
  try {
    const contratos = await ContratoModel.obtenerTodosLosContratos();
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

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
