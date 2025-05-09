const express = require('express');
const router = express.Router();
const RolModel = require('../models/rol.model');
const verifyToken = require('../../auth/autentication');

// Proteger todas las rutas
router.use(verifyToken);

// POST: Agregar un rol
router.post('/', async (req, res) => {
  const { nombre_rol, descripcion } = req.body;
  try {
    const result = await RolModel.agregarRol(nombre_rol, descripcion);
    res.status(201).json({ mensaje: 'Rol agregado correctamente'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    const roles = await RolModel.obtenerTodosRoles();
    res.json(roles);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener rol por ID
router.get('/:cod_rol', async (req, res) => {
  const { cod_rol } = req.params;
  try {
    const rol = await RolModel.obtenerRolPorId(cod_rol);
    res.json(rol);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// GET: Obtener empleados por rol
router.get('/:cod_rol/empleados', async (req, res) => {
  const { cod_rol } = req.params;
  try {
    const empleados = await RolModel.obtenerEmpleadosPorRol(cod_rol);
    res.json(empleados);
  } catch (error) {
    res.status(404).json({ error: error.sqlMessage || error.message });
  }
});

// PUT: Actualizar rol
router.put('/:cod_rol', async (req, res) => {
  const { cod_rol } = req.params;
  const { nombre_rol, descripcion } = req.body;
  try {
    const result = await RolModel.actualizarRol(cod_rol, nombre_rol, descripcion);
    res.json({ mensaje: 'Rol actualizado correctamente'});
  } catch (error) {
    res.status(400).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;
