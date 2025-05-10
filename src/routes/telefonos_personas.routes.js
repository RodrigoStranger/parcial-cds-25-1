const express = require('express');
const router = express.Router();
const TelefonosPersonas = require('../models/telefonos_personas.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     TelefonoPersonaInput:
 *       type: object
 *       required:
 *         - dni
 *         - telefono
 *       properties:
 *         dni:
 *           type: string
 *           description: DNI de la persona
 *           example: "12345678"
 *         telefono:
 *           type: string
 *           description: Teléfono a registrar
 *           example: "987654321"
 *     TelefonoPersona:
 *       allOf:
 *         - $ref: '#/components/schemas/TelefonoPersonaInput'
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
 * /telefonos_personas:
 *   post:
 *     summary: Agregar teléfono a una persona
 *     description: Permite registrar un nuevo teléfono para una persona usando su DNI.
 *     tags:
 *       - TelefonosPersonas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelefonoPersonaInput'
 *           example:
 *             dni: "12345678"
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

/**
 * @openapi
 * /telefonos_personas/{dni}:
 *   get:
 *     summary: Obtener teléfonos de una persona
 *     description: Devuelve la lista de teléfonos asociados a una persona por su DNI.
 *     tags:
 *       - TelefonosPersonas
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI de la persona
 *     responses:
 *       200:
 *         description: Lista de teléfonos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TelefonoPersona'
 *       404:
 *         description: Persona o teléfonos no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /telefonos_personas:
 *   put:
 *     summary: Actualizar teléfono de una persona
 *     tags:
 *       - TelefonosPersonas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
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
