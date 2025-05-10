const express = require('express');
const router = express.Router();
const EspecialidadModel = require('../models/especialidad.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar especialidad
router.post('/', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
  try {
    await EspecialidadModel.agregarEspecialidad(nombre);
    res.status(201).json({ mensaje: 'Especialidad agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todas las especialidades
router.get('/', async (req, res) => {
  try {
    const especialidades = await EspecialidadModel.obtenerEspecialidades();
    res.json(especialidades);
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener especialidad por ID
router.get('/:id', async (req, res) => {
  try {
    const especialidad = await EspecialidadModel.obtenerEspecialidadPorId(req.params.id);
    if (!especialidad || especialidad.length === 0) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    res.json(especialidad[0]);
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar especialidad
router.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
  try {
    await EspecialidadModel.actualizarEspecialidad(req.params.id, nombre);
    res.json({ mensaje: 'Especialidad actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
