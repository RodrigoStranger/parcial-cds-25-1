const express = require('express');
const router = express.Router();
const { 
  agregarDireccionPersona, 
  obtenerDireccionesPersona, 
  actualizarDireccionPersona 
} = require('../models/direcciones_personas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar dirección a una persona
router.post('/', async (req, res) => {
  const { dni, direccion } = req.body;
  try {
    await agregarDireccionPersona(dni, direccion);
    res.status(201).json({ mensaje: 'Dirección agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener direcciones de una persona
router.get('/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const direcciones = await obtenerDireccionesPersona(dni);
    res.json(direcciones);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar dirección de una persona
router.put('/', async (req, res) => {
  const { dni, direccion_antigua, nueva_direccion } = req.body;
  try {
    await actualizarDireccionPersona(dni, direccion_antigua, nueva_direccion);
    res.json({ mensaje: 'Dirección actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;