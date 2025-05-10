require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/database');

const app = express();

// Swagger OpenAPI 3.0
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Autenticación',
      version: '1.0.0',
      description: 'Documentación de la API de autenticación (login)',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Servidor de autenticación' }
    ],
  },
  apis: ['./auth_server.js'], // Solo este archivo
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - dni
 *         - contraseña
 *       properties:
 *         dni:
 *           type: string
 *           description: DNI del usuario
 *           example: "12345678"
 *         contraseña:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "password123"
 *     LoginExito:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Login exitoso
 *         token:
 *           type: string
 *           description: Token JWT generado
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJk..."
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Credenciales inválidas
 *
 * /login:
 *   post:
 *     summary: Autenticación de usuario (login)
 *     description: Permite autenticar a un usuario con su DNI y contraseña. Devuelve un JWT si las credenciales son correctas.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             dni: "12345678"
 *             contraseña: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginExito'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos', detalle: error.message });
  }
});

app.listen(4000, () => {
  console.log('Servidor de autenticación escuchando en http://localhost:4000');
});