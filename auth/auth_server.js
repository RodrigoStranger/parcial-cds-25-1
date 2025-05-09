require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/database');

const app = express();

app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

app.post('/login', async (req, res) => {
  const { dni, contraseña } = req.body;
  if (!dni || !contraseña) {
    return res.status(400).json({ error: 'DNI o contraseña faltante' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM Empleados WHERE dni = ?', [dni]);
    const empleado = rows[0];
    if (!empleado) {
      return res.status(401).json({ error: 'No se encontró un usuario con ese DNI' });
    }
    if (empleado.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta para el usuario ' + dni});
    }
    if (empleado.estado !== 'activo') {
      return res.status(403).json({ error: 'El usuario existe pero está inactivo ' + dni});
    }
    const payload = {
      dni: empleado.dni,
      cod_empleado: empleado.cod_empleado,
      es_administrador: empleado.es_administrador
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos', detalle: error.message });
  }
});

app.listen(4000, () => {
  console.log('Servidor de autenticación escuchando en http://localhost:4000');
});