const express = require('express');
const router = express.Router();
const CategoriaModel = require('../models/categoria.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar una categoría
router.post('/', async (req, res) => {
  const { nombre_categoria, descripcion } = req.body;
  try {
    await CategoriaModel.agregarCategoria(nombre_categoria, descripcion);
    res.status(201).json({ mensaje: 'Categoría agregada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaModel.obtenerTodasLasCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener categoría por ID
router.get('/:cod_categoria', async (req, res) => {
  const { cod_categoria } = req.params;
  try {
    const categoria = await CategoriaModel.obtenerCategoriaPorId(cod_categoria);
    res.json(categoria);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener productos por categoría
router.get('/:cod_categoria/productos', async (req, res) => {
  const { cod_categoria } = req.params;
  try {
    const productos = await CategoriaModel.obtenerProductosPorCategoria(cod_categoria);
    res.json(productos);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar categoría
router.put('/:cod_categoria', async (req, res) => {
  const { cod_categoria } = req.params;
  const { nombre_categoria, descripcion } = req.body;
  try {
    await CategoriaModel.actualizarCategoria(cod_categoria, nombre_categoria, descripcion);
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;