// routes/authRoutes.js  (controladores inline con PRISMA)
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

const router = express.Router();
const generarToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, telefono, password, tipo, vehiculo, placas } = req.body;

    if (!telefono || !password) {
      return res.status(400).json({ message: 'Teléfono y contraseña son obligatorios' });
    }

    const existe = await prisma.user.findUnique({ where: { telefono } });
    if (existe) {
      return res.status(400).json({ message: 'El teléfono ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre: nombre ?? null,
        telefono,
        passwordHash,
        tipo: tipo || 'pasajero',
        vehiculo: tipo === 'conductor' ? (vehiculo ?? null) : null,
        placas:   tipo === 'conductor' ? (placas   ?? null) : null,
      },
    });

    return res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      tipo: user.tipo,
      token: generarToken(user.id),
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { telefono, password } = req.body;

    if (!telefono || !password) {
      return res.status(400).json({ message: 'Teléfono y contraseña son obligatorios' });
    }

    const user = await prisma.user.findUnique({ where: { telefono } });
    if (!user) {
      return res.status(401).json({ message: 'Teléfono o contraseña incorrectos' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Teléfono o contraseña incorrectos' });
    }

    return res.json({
      id: user.id,
      nombre: user.nombre,
      tipo: user.tipo,
      token: generarToken(user.id),
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
