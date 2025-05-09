const express = require('express');
const router = express.Router();
const { 
    agregarPersona, 
    obtenerPersonas, 
    obtenerPersonaPorDNI, 
    actualizarPersona, 
    eliminarPersona 
} = require('../models/personas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar una nueva persona
router.post('/', async (req, res) => {
    const { dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento } = req.body;
    try {
        await agregarPersona(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento);
        res.status(201).json({ mensaje: 'Persona agregada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.sqlMessage || error.message });
    }
});

// GET: Obtener todas las personas
router.get('/', async (req, res) => {
    try {
        const personas = await obtenerPersonas();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ error: error.sqlMessage || error.message });
    }
});

// GET: Obtener persona por DNI
router.get('/:dni', async (req, res) => {
    const { dni } = req.params;
    try {
        const persona = await obtenerPersonaPorDNI(dni);
        res.json(persona);
    } catch (error) {
        res.status(404).json({ error: error.sqlMessage || error.message });
    }
});

// PUT: Actualizar persona
router.put('/', async (req, res) => {
    const { dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento } = req.body;
    try {
        await actualizarPersona(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento);
        res.json({ mensaje: 'Persona actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.sqlMessage || error.message });
    }
});

module.exports = router;
