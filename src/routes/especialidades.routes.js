const express = require('express');
const router = express.Router();
const EspecialidadModel = require('../models/especialidad.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

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

// GET: Obtener todas las especialidades
router.get('/', async (req, res) => {
  try {
    const especialidades = await EspecialidadModel.obtenerTodasLasEspecialidades();
    res.json(especialidades);
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

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
