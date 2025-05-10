const express = require('express');
const router = express.Router();
const ClienteModel = require('../models/cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar cliente solo con DNI
router.post('/', async (req, res) => {
  const { dni } = req.body;
  if (!dni) return res.status(400).json({ error: 'El DNI es requerido' });
  try {
    // Verificar si ya existe la persona
    const existe = await ClienteModel.verificarPersonaPorDni(dni);
    if (existe) {
      return res.status(400).json({ error: 'El cliente ya existe' });
    }
    // Consultar datos por DNI
    const datos = await generarDatosCompletos(dni);
    if (!datos || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.fecha_nacimiento) {
      return res.status(404).json({ error: 'No se pudo obtener datos completos para el DNI' });
    }
    await ClienteModel.agregarCliente(dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento);
    res.status(201).json({ mensaje: 'Cliente agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await ClienteModel.obtenerTodosLosClientes();
    res.json(clientes);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener cliente por DNI
router.get('/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const cliente = await ClienteModel.obtenerClientePorDni(dni);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos comprados por cliente
router.get('/:dni/productos', async (req, res) => {
  const { dni } = req.params;
  try {
    const productos = await ClienteModel.obtenerProductosCompradosPorCliente(dni);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
