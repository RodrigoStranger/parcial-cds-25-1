const express = require('express');
const router = express.Router();
const ProveedorModel = require('../models/proveedor.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar proveedor
router.post('/', async (req, res) => {
  const { ruc, nombre } = req.body;
  try {
    await ProveedorModel.agregarProveedor(ruc, nombre);
    res.status(201).json({ mensaje: 'Proveedor agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await ProveedorModel.obtenerProveedores();
    res.json(proveedores);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener proveedor por RUC
router.get('/:ruc', async (req, res) => {
  const { ruc } = req.params;
  try {
    const proveedor = await ProveedorModel.obtenerProveedorPorRuc(ruc);
    res.json(proveedor);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos de un proveedor
router.get('/:ruc/productos', async (req, res) => {
  const { ruc } = req.params;
  try {
    const productos = await ProveedorModel.obtenerProductosDeProveedor(ruc);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos más vendidos por proveedor
router.get('/:ruc/productos-mas-vendidos', async (req, res) => {
  const { ruc } = req.params;
  try {
    const productos = await ProveedorModel.obtenerProductosMasVendidosPorProveedor(ruc);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar proveedor
router.put('/:ruc', async (req, res) => {
  const { ruc } = req.params;
  const { nuevo_nombre } = req.body;
  try {
    await ProveedorModel.actualizarProveedor(ruc, nuevo_nombre);
    res.json({ mensaje: 'Proveedor actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
