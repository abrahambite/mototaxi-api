const express = require("express");
const fs = require("fs");

const router = express.Router();
const databasePath = "./database.json";

// Cargar base de datos
const loadDatabase = () => {
  if (!fs.existsSync(databasePath)) return { usuarios: [], viajes: [], pagos: [] };
  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
};

// Guardar base de datos
const saveDatabase = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

// Registro
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

// Login
router.post("/login", (req, res) => {
  const { telefono, password } = req.body;
  const db = loadDatabase();
  const user = db.usuarios.find((u) => u.telefono === telefono && u.password === password);
  if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

  res.json({ message: "Inicio de sesión exitoso", user });
});

// Crear viaje
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

// Obtener todos los viajes
router.get("/viajes", (req, res) => {
  const db = loadDatabase();
  res.json(db.viajes);
});

// Obtener usuarios (para seguimiento)
router.get("/usuarios", (req, res) => {
  const db = loadDatabase();
  res.json(db.usuarios);
});

// Obtener un viaje por ID
router.get("/viajes/:id", (req, res) => {
  const db = loadDatabase();
  const viaje = db.viajes.find((v) => v.id == req.params.id);
  if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });
  res.json(viaje);
});

// Aceptar o actualizar viaje
router.patch("/viajes/:id", (req, res) => {
  const { id } = req.params;
  const { estado, conductor_id } = req.body;

  const db = loadDatabase();
  const viaje = db.viajes.find(v => v.id == id);
  if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });

  if (viaje.estado !== "pendiente") {
    return res.status(400).json({ error: "Este viaje ya fue aceptado por otro conductor." });
  }

  viaje.estado = estado || "aceptado";
  viaje.conductor_id = conductor_id;

  const conductor = db.usuarios.find(u => u.id == conductor_id);
  if (conductor) {
    viaje.nombre_conductor = conductor.nombre;
    viaje.contacto_conductor = conductor.telefono;
    conductor.disponible = false; // lo marcamos ocupado
  }

  saveDatabase(db);
  res.json({ message: "Viaje aceptado correctamente", viaje });
});

module.exports = router;
