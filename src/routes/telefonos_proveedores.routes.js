const express = require('express');
const router = express.Router();
const TelefonosProveedores = require('../models/telefonos_proveedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     TelefonoProveedorInput:
 *       type: object
 *       required:
 *         - ruc
 *         - telefono
 *       properties:
 *         ruc:
 *           type: string
 *           description: RUC del proveedor
 *           example: "20123456789"
 *         telefono:
 *           type: string
 *           description: Teléfono a registrar
 *           example: "987654321"
 *     TelefonoProveedor:
 *       allOf:
 *         - $ref: '#/components/schemas/TelefonoProveedorInput'
 *     MensajeExito:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Teléfono agregado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /telefonos_proveedores:
 *   post:
 *     summary: Agregar teléfono a un proveedor
 *     description: Permite registrar un nuevo teléfono para un proveedor usando su RUC.
 *     tags:
 *       - TelefonosProveedores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelefonoProveedorInput'
 *           example:
 *             ruc: "20123456789"
 *             telefono: "987654321"
 *     responses:
 *       201:
 *         description: Teléfono agregado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar teléfono
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve la lista de teléfonos asociados a un proveedor por su RUC.
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
 *                 $ref: '#/components/schemas/TelefonoProveedor'
 *       404:
 *         description: Proveedor o teléfonos no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
