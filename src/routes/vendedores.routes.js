const express = require('express');
const router = express.Router();
const VendedorModel = require('../models/vendedores.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar vendedor
router.post('/', async (req, res) => {
  const { dni, estado, contrasena, esAdministrador, cod_rol } = req.body;
  if (!dni || !estado || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    const vendedor = await VendedorModel.agregarVendedor(dni, estado, contrasena, esAdministrador, cod_rol);
    res.status(201).json({ mensaje: 'Vendedor agregado correctamente', vendedor });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los vendedores
router.get('/', async (req, res) => {
  try {
    const vendedores = await VendedorModel.obtenerTodosLosVendedores();
    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener vendedor por código
router.get('/:cod_vendedor', async (req, res) => {
  try {
    const vendedor = await VendedorModel.obtenerVendedorPorCodigo(req.params.cod_vendedor);
    if (!vendedor || vendedor.length === 0) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }
    res.json(vendedor[0]);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar vendedor
router.put('/:cod_vendedor', async (req, res) => {
  const { dni, estado, contrasena, esAdministrador, cod_rol } = req.body;
  if (!dni || !estado || !contrasena || esAdministrador === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    await VendedorModel.actualizarVendedor(req.params.cod_vendedor, dni, estado, contrasena, esAdministrador, cod_rol);
    res.json({ mensaje: 'Vendedor actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
