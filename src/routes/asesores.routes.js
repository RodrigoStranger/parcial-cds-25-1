const express = require('express');
const router = express.Router();
const { 
    agregarAsesor, 
    obtenerAsesores, 
    obtenerAsesorPorCodigo, 
    actualizarAsesor 
} = require('../models/asesores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar un nuevo asesor
router.post('/', async (req, res) => {
    const { dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador } = req.body;
    try {
        await agregarAsesor(dni, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, experiencia, contrasena, esAdministrador);
        res.status(201).json({ mensaje: 'Asesor agregado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.sqlMessage || error.message });
    }
});

// GET: Obtener todos los asesores
router.get('/', async (req, res) => {
    try {
        const asesores = await obtenerAsesores();
        res.json(asesores);
    } catch (error) {
        res.status(500).json({ error: error.sqlMessage || error.message });
    }
});

// GET: Obtener asesor por código
router.get('/:codAsesor', async (req, res) => {
    const { codAsesor } = req.params;
    try {
        const asesor = await obtenerAsesorPorCodigo(codAsesor);
        res.json(asesor);
    } catch (error) {
        res.status(404).json({ error: error.sqlMessage || error.message });
    }
});

// PUT: Actualizar asesor
router.put('/', async (req, res) => {
    const { 
        dni, 
        nombre, 
        apellidoPaterno, 
        apellidoMaterno, 
        fechaNacimiento,
        experiencia, 
        contrasena, 
        esAdministrador 
    } = req.body;
    try {
        await actualizarAsesor(
            dni, 
            nombre, 
            apellidoPaterno, 
            apellidoMaterno, 
            fechaNacimiento,
            experiencia, 
            contrasena, 
            esAdministrador
        );
        res.json({ mensaje: 'Asesor actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.sqlMessage || error.message });
    }
});

module.exports = router;
