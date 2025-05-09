const express = require('express');
const router = express.Router();
const TelefonosProveedores = require('../models/telefonos_proveedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar un teléfono a un proveedor
router.post('/', async (req, res) => {
    try {
        const { ruc, telefono } = req.body;
        const result = await TelefonosProveedores.agregarTelefonoProveedor(ruc, telefono);
        res.status(201).json({ message: 'Teléfono agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al agregar el teléfono', 
            error: error.message 
        });
    }
});

// GET: Obtener teléfonos de un proveedor
router.get('/:ruc', async (req, res) => {
    try {
        const { ruc } = req.params;
        const telefonos = await TelefonosProveedores.obtenerTelefonosProveedor(ruc);
        res.status(200).json(telefonos);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los teléfonos', 
            error: error.message 
        });
    }
});

// PUT: Actualizar un teléfono de un proveedor
router.put('/', async (req, res) => {
    try {
        const { ruc, telefono_antiguo, telefono_nuevo } = req.body;
        const result = await TelefonosProveedores.actualizarTelefonoProveedor(ruc, telefono_antiguo, telefono_nuevo);
        res.status(200).json({ message: 'Teléfono actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el teléfono', 
            error: error.message 
        });
    }
});

module.exports = router;
