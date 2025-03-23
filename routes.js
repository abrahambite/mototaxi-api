const express = require("express");
const fs = require("fs");

const router = express.Router();
const databasePath = "./database.json";

// ?? Cargar base de datos
const loadDatabase = () => {
    if (!fs.existsSync(databasePath)) return { usuarios: [], viajes: [], pagos: [] };
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
};

// ?? Guardar base de datos
const saveDatabase = (data) => {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

// ?? Registro de usuario
router.post("/register", (req, res) => {
    const { nombre, email, password, userType } = req.body;
    if (!nombre || !email || !password || !userType) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const db = loadDatabase();
    if (db.usuarios.find((user) => user.email === email)) {
        return res.status(400).json({ error: "El usuario ya existe" });
    }

    const newUser = { id: Date.now(), nombre, email, password, tipo: userType };
    db.usuarios.push(newUser);
    saveDatabase(db);

    res.json({ message: "Usuario registrado con ¨¦xito", user: newUser });
});

// ?? Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const db = loadDatabase();
    const user = db.usuarios.find((u) => u.email === email && u.password === password);

    if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

    res.json({ message: "Inicio de sesi¨®n exitoso", user });
});


// ?? CREAR NUEVO VIAJE
router.post("/viajes", (req, res) => {
    const { pasajero_id, origen, destino } = req.body;

    if (!pasajero_id || !origen || !destino) {
        return res.status(400).json({ error: "Faltan datos del viaje" });
    }

    const db = loadDatabase();
    const nuevoViaje = {
        id: Date.now(),
        pasajero_id,
        conductor_id: null,
        origen,
        destino,
        estado: "pendiente",
        hora_solicitud: new Date().toISOString()
    };

    db.viajes.push(nuevoViaje);
    saveDatabase(db);

    res.json({ message: "Viaje creado", viaje: nuevoViaje });
});

// ?? OBTENER VIAJES DISPONIBLES (para conductores)
router.get("/viajes-disponibles", (req, res) => {
    const db = loadDatabase();
    const disponibles = db.viajes.filter(v => v.estado === "pendiente");
    res.json(disponibles);
});

// ?? ACTUALIZAR ESTADO DEL VIAJE (aceptar, cancelar, finalizar)
router.patch("/viajes/:id", (req, res) => {
    const { id } = req.params;
    const { estado, conductor_id } = req.body;

    const db = loadDatabase();
    const viaje = db.viajes.find(v => v.id == id);
    if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });

    if (estado) viaje.estado = estado;
    if (conductor_id) viaje.conductor_id = conductor_id;

    saveDatabase(db);
    res.json({ message: "Viaje actualizado", viaje });
});

module.exports = router;
