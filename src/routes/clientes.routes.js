const express = require('express');
const router = express.Router();
const ClienteModel = require('../models/cliente.model');
const generarDatosCompletos = require('../utils/consultaDni');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     ClienteInput:
 *       type: object
 *       required:
 *         - dni
 *       properties:
 *         dni:
 *           type: string
 *           description: DNI del cliente
 *           example: "12345678"
 *     Cliente:
 *       type: object
 *       properties:
 *         cod_cliente:
 *           type: integer
 *           example: 1
 *         dni:
 *           type: string
 *           example: "12345678"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Pérez"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         estado:
 *           type: string
 *           example: "activo"
 *     MensajeExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Cliente creado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: El DNI es requerido
 *
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Devuelve una lista de todos los clientes registrados.
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
 *                 $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: No se encontraron clientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Registra un cliente solo con su DNI. El resto de los datos se completan automáticamente.
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *           example:
 *             dni: "12345678"
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MensajeExito'
 *       400:
 *         description: Datos faltantes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /clientes/{dni}:
 *   get:
 *     summary: Obtener cliente por DNI
 *     description: Devuelve los datos de un cliente a partir de su DNI.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @openapi
 * /clientes/{dni}/productos:
 *   get:
 *     summary: Obtener productos comprados por cliente
 *     description: Devuelve la lista de productos comprados por un cliente a partir de su DNI.
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
 *         description: Lista de productos comprados por el cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Cliente o productos no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
