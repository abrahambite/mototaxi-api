const express = require("express");
const fs = require("fs");

const router = express.Router();
const databasePath = "./database.json";

// Utilidades de Base de Datos
const loadDatabase = () => {
  if (!fs.existsSync(databasePath)) return { usuarios: [], viajes: [], pagos: [] };
  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
};

const saveDatabase = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

// ✅ Registro
router.post("/register", (req, res) => {
  const { nombre, telefono, password, userType, licencia, vehiculo } = req.body;
  if (!nombre || !telefono || !password || !userType) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const db = loadDatabase();
  if (db.usuarios.find((u) => u.telefono === telefono)) {
    return res.status(400).json({ error: "El usuario ya existe" });
  }

  const newUser = {
    id: Date.now(),
    nombre,
    telefono,
    password,
    tipo: userType,
    licencia: licencia || "",
    vehiculo: vehiculo || "",
    disponible: userType === "conductor"
  };

  db.usuarios.push(newUser);
  saveDatabase(db);

  res.json({ message: "Registro exitoso", user: newUser });
});

// ✅ Login
router.post("/login", (req, res) => {
  const { telefono, password } = req.body;
  const db = loadDatabase();
  const user = db.usuarios.find((u) => u.telefono === telefono && u.password === password);
  if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

  res.json({ message: "Inicio de sesión exitoso", user });
});

// Otras rutas (como viajes)
router.get("/viajes", (req, res) => {
  const db = loadDatabase();
  res.json(db.viajes);
});

router.post("/viajes", (req, res) => {
  const { pasajero_id, origen, destino, metodo_pago } = req.body;
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
    metodo_pago,
    estado: "pendiente",
    hora_solicitud: new Date().toISOString()
  };

  db.viajes.push(nuevoViaje);
  saveDatabase(db);

  res.json({ message: "Viaje creado", viaje: nuevoViaje });
});

// ✅ Exportar router
module.exports = router;
