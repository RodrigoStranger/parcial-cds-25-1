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

/**
 * @openapi
 * components:
 *   schemas:
 *     DireccionPersonaInput:
 *       type: object
 *       required:
 *         - dni
 *         - direccion
 *       properties:
 *         dni:
 *           type: string
 *           description: DNI de la persona
 *           example: "12345678"
 *         direccion:
 *           type: string
 *           description: Dirección de la persona
 *           example: "Av. Siempre Viva 742"
 *     DireccionPersona:
 *       allOf:
 *         - $ref: '#/components/schemas/DireccionPersonaInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Dirección agregada correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Faltan datos requeridos
 *
 * /direcciones_personas:
 *   post:
 *     summary: Agregar dirección a una persona
 *     description: Permite registrar una nueva dirección vinculada al DNI de una persona.
 *     tags:
 *       - DireccionesPersonas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DireccionPersonaInput'
 *           example:
 *             dni: "12345678"
 *             direccion: "Av. Siempre Viva 742"
 *     responses:
 *       201:
 *         description: Dirección agregada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Error al agregar dirección
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /direcciones_personas/{dni}:
 *   get:
 *     summary: Obtener direcciones de una persona
 *     description: Devuelve todas las direcciones asociadas a una persona por su DNI.
 *     tags:
 *       - DireccionesPersonas
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI de la persona
 *     responses:
 *       200:
 *         description: Lista de direcciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DireccionPersona'
 *       404:
 *         description: Persona o direcciones no encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /direcciones_personas:
 *   put:
 *     summary: Actualizar dirección de una persona
 *     tags:
 *       - DireccionesPersonas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               direccion_antigua:
 *                 type: string
 *               nueva_direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dirección actualizada correctamente
 *       400:
 *         description: Error al actualizar dirección
 */
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