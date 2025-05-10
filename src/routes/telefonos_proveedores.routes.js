const express = require('express');
const router = express.Router();
const TelefonosProveedores = require('../models/telefonos_proveedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /telefonos_proveedores:
 *   post:
 *     summary: Agregar teléfono a un proveedor
 *     tags:
 *       - TelefonosProveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruc:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teléfono agregado correctamente
 *       400:
 *         description: Error al agregar teléfono
 */
// POST: Agregar teléfono a un proveedor
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

/**
 * @openapi
 * /telefonos_proveedores/{ruc}:
 *   get:
 *     summary: Obtener teléfonos de un proveedor
 *     tags:
 *       - TelefonosProveedores
 *     parameters:
 *       - in: path
 *         name: ruc
 *         schema:
 *           type: string
 *         required: true
 *         description: RUC del proveedor
 *     responses:
 *       200:
 *         description: Lista de teléfonos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Proveedor o teléfonos no encontrados
 */
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

/**
 * @openapi
 * /telefonos_proveedores:
 *   put:
 *     summary: Actualizar teléfono de un proveedor
 *     tags:
 *       - TelefonosProveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruc:
 *                 type: string
 *               telefono_antiguo:
 *                 type: string
 *               telefono_nuevo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teléfono actualizado correctamente
 *       400:
 *         description: Error al actualizar teléfono
 */
// PUT: Actualizar teléfono de un proveedor
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
