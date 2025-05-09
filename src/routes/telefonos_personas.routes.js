const express = require('express');
const router = express.Router();
const TelefonosPersonas = require('../models/telefonos_personas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar un teléfono a una persona
router.post('/', async (req, res) => {
    try {
        const { dni, telefono } = req.body;
        const result = await TelefonosPersonas.agregarTelefonoPersona(dni, telefono);
        res.status(201).json({ message: 'Teléfono agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al agregar el teléfono', 
            error: error.message 
        });
    }
});

// GET: Obtener teléfonos de una persona
router.get('/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const telefonos = await TelefonosPersonas.obtenerTelefonosPersona(dni);
        res.status(200).json(telefonos);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los teléfonos', 
            error: error.message 
        });
    }
});

// PUT: Actualizar un teléfono de una persona
router.put('/', async (req, res) => {
    try {
        const { dni, telefono_antiguo, telefono_nuevo } = req.body;
        const result = await TelefonosPersonas.actualizarTelefonoPersona(dni, telefono_antiguo, telefono_nuevo);
        res.status(200).json({ message: 'Teléfono actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el teléfono', 
            error: error.message 
        });
    }
});

module.exports = router;
