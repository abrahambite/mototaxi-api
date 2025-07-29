const express = require('express');
const fs = require('fs');

const router = express.Router();

// 📌 Cargar base de datos
const dbPath = './database.json';
const loadDatabase = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const saveDatabase = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// 📌 Registro de usuario
router.post('/register', (req, res) => {
  const { nombre, email, password, tipo } = req.body;

  if (!nombre || !email || !password || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const users = loadDatabase();
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  const newUser = { id: Date.now(), nombre, email, password, tipo };
  users.push(newUser);
  saveDatabase(users);

  res.status(201).json({ message: 'Usuario registrado con éxito', usuario: newUser });
});

// 📌 Inicio de sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadDatabase();

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: 'Credenciales incorrectas' });
  }

  res.json({ message: 'Inicio de sesión exitoso', usuario: user });
});

module.exports = router;
