const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const databasePath = path.join(__dirname, 'database.json');

// ?? Funcion para cargar la base de datos
const loadDatabase = () => {
    if (!fs.existsSync(databasePath)) return { usuarios: [], viajes: [], pagos: [] };
    return JSON.parse(fs.readFileSync(databasePath, 'utf8'));
};

// ?? Funcion para guardar la base de datos
const saveDatabase = (data) => {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

// ?? Registro de usuario
router.post('/register', (req, res) => {
    const { nombre, email, password, tipo } = req.body;

    if (!nombre || !email || !password || !tipo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const db = loadDatabase();
    if (db.usuarios.find(user => user.email === email)) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const newUser = { id: Date.now(), nombre, email, password, tipo };
    db.usuarios.push(newUser);
    saveDatabase(db);

    res.json({ message: 'Usuario registrado con exito', user: newUser });
});

// ?? Inicio de sesion SIN autenticacion
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = loadDatabase();
    const user = db.usuarios.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

    res.json({ message: 'Inicio de sesion exitoso', user });
});

// ?? Obtener todos los viajes (sin autenticacion)
router.get('/rides', (req, res) => {
    const db = loadDatabase();
    res.json(db.viajes);
});

// ?? Obtener historial de pagos (sin autenticacion)
router.get('/payments', (req, res) => {
    const db = loadDatabase();
    res.json(db.pagos);
});

// ?? Ruta de prueba
router.get('/', (req, res) => {
    res.send('API de MotoTaxi funcionando correctamente');
});

module.exports = router;
