const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Función para generar un token
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { nombre, telefono, password, tipo, vehiculo, placas } = req.body;
    
    const existeUsuario = await Usuario.findOne({ telefono });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El teléfono ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre,
      telefono,
      password,
      tipo,
      vehiculo: tipo === 'conductor' ? vehiculo : undefined,
      placas: tipo === 'conductor' ? placas : undefined,
    });

    if (usuario) {
      res.status(201).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        token: generarToken(usuario._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { telefono, password } = req.body;
    
    const usuario = await Usuario.findOne({ telefono });

    if (usuario && (await usuario.compararPassword(password))) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        token: generarToken(usuario._id),
      });
    } else {
      res.status(401).json({ message: 'Teléfono o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};