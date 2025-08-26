const express = require('express');
const router = express.Router();

// Importamos las funciones que creamos en el controlador.
// Usamos la desestructuración { } para traer solo las funciones que necesitamos.
const { register, login } = require('../controllers/authController');

// Definimos la ruta para el registro.
// Cuando llegue una petición POST a '/register', se ejecutará la función 'register'.
router.post('/register', register);

// Definimos la ruta para el inicio de sesión.
// Cuando llegue una petición POST a '/login', se ejecutará la función 'login'.
router.post('/login', login);


// Exportamos el router para poder usarlo en nuestro archivo principal 'server.js'.
module.exports = router;