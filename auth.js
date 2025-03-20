const express = require('express');
const fs = require('fs');

const router = express.Router();

// 📌 Ruta de la base de datos temporal
const dbPath = './database.json';
let users = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 📌 Registro de usuario
router.post('/register', (req, res) => {
    const { nombre, email, password, tipo } = req.body;
    
    if (!nombre || !email || !password || !tipo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const newUser = { id: users.length + 1, nombre, email, password, tipo };
    users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Usuario registrado con éxito' });
});

// 📌 Inicio de sesión SIN token
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    res.json({ message: 'Inicio de sesión exitoso', usuario: user });
});

// 📌 Exportar rutas
module.exports = { router };
