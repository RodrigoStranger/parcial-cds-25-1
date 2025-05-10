const express = require('express');
const router = express.Router();
const ClienteModel = require('../models/cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron clientes
 */

/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Agregar un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Datos faltantes o inválidos
 */

/**
 * @openapi
 * /clientes/{dni}:
 *   get:
 *     summary: Obtener cliente por DNI
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI del cliente
 *     responses:
 *       200:
 *         description: Datos del cliente
 *       404:
 *         description: Cliente no encontrado
 */

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
    // Verificar si es mayor de 18 años
    const hoy = new Date();
    const nacimiento = new Date(datos.fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    if (edad < 18) {
      return res.status(400).json({ error: 'No se puede agregar un cliente menor de 18 años' });
    }
    await ClienteModel.agregarCliente(dni, datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento);
    res.status(201).json({ 
      mensaje: 'Cliente agregado correctamente',
      cliente: {
        dni,
        nombre: datos.nombre,
        apellido_paterno: datos.apellido_paterno,
        apellido_materno: datos.apellido_materno,
        fecha_nacimiento: datos.fecha_nacimiento
      }
    });
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
