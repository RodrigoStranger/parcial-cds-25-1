const express = require('express');
const router = express.Router();
const LineaModel = require('../models/linea.model');

// POST: Agregar una línea
router.post('/', async (req, res) => {
  const { ruc, nombre_linea } = req.body;
  try {
    const result = await LineaModel.agregarLinea(ruc, nombre_linea);
    res.status(201).json({ message: 'Línea agregada correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todas las líneas
router.get('/', async (req, res) => {
  try {
    const lineas = await LineaModel.obtenerTodasLasLineas();
    res.json(lineas);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener línea por ID
router.get('/:cod_linea', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const linea = await LineaModel.obtenerLineaPorId(cod_linea);
    res.json(linea);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos por línea
router.get('/:cod_linea/productos', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const productos = await LineaModel.obtenerProductosPorLinea(cod_linea);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener facturas por línea
router.get('/:cod_linea/facturas', async (req, res) => {
  const { cod_linea } = req.params;
  try {
    const facturas = await LineaModel.obtenerFacturasPorLinea(cod_linea);
    res.json(facturas);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar nombre de línea
router.put('/:cod_linea/nombre', async (req, res) => {
  const { cod_linea } = req.params;
  const { nuevo_nombre_linea } = req.body;
  try {
    const result = await LineaModel.actualizarNombreLinea(cod_linea, nuevo_nombre_linea);
    res.json({ message: 'Nombre de línea actualizado', result });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar RUC de línea
router.put('/:cod_linea/ruc', async (req, res) => {
  const { cod_linea } = req.params;
  const { nuevo_ruc } = req.body;
  try {
    const result = await LineaModel.actualizarRucLinea(cod_linea, nuevo_ruc);
    res.json({ message: 'RUC de línea actualizado', result });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;