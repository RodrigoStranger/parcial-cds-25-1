const express = require('express');
const router = express.Router();
const AsesorEspecialidadModel = require('../models/asesores_especialidades.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

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
