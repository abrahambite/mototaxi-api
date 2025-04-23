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

// Registro de usuario con teléfono
router.post("/register", (req, res) => {
  const { nombre, telefono, password, userType, licencia, vehiculo } = req.body;
  if (!nombre || !telefono || !password || !userType) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const db = loadDatabase();
  if (db.usuarios.find((user) => user.telefono === telefono)) {
    return res.status(400).json({ error: "El usuario ya existe" });
  }

  const nuevo = {
    id: Date.now(),
    nombre,
    telefono,
    password,
    tipo: userType,
    ...(licencia && { licencia }),
    ...(vehiculo && { vehiculo })
  };

  db.usuarios.push(nuevo);
  saveDatabase(db);
  res.json({ message: "Registro exitoso", user: nuevo });
});

// Login con teléfono
router.post("/login", (req, res) => {
  const { telefono, password } = req.body;
  const db = loadDatabase();
  const user = db.usuarios.find((u) => u.telefono === telefono && u.password === password);
  if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });
  res.json({ message: "Login exitoso", user });
});

// Crear viaje
router.post("/viajes", (req, res) => {
  const { pasajero_id, origen, destino, metodo_pago } = req.body;
  if (!pasajero_id || !origen || !destino || !metodo_pago) {
    return res.status(400).json({ error: "Faltan datos del viaje" });
  }

  const db = loadDatabase();
  const nuevo = {
    id: Date.now(),
    pasajero_id,
    origen,
    destino,
    metodo_pago,
    estado: "pendiente",
    conductor_id: null,
    hora_solicitud: new Date().toISOString()
  };

  db.viajes.push(nuevo);
  saveDatabase(db);
  res.json({ message: "Viaje creado", viaje: nuevo });
});

// Obtener todos los viajes
router.get("/viajes", (req, res) => {
  const db = loadDatabase();
  res.json(db.viajes);
});

// Obtener viaje por ID
router.get("/viajes/:id", (req, res) => {
  const db = loadDatabase();
  const viaje = db.viajes.find(v => v.id == req.params.id);
  if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });
  res.json(viaje);
});

// Obtener viajes disponibles
router.get("/viajes-disponibles", (req, res) => {
  const db = loadDatabase();
  const disponibles = db.viajes.filter(v => v.estado === "pendiente");
  res.json(disponibles);
});

// Aceptar viaje
router.post("/aceptar-viaje", (req, res) => {
  const { viaje_id, chofer_id } = req.body;
  if (!viaje_id || !chofer_id) {
    return res.status(400).json({ error: "Faltan datos para aceptar el viaje" });
  }

  const db = loadDatabase();
  const viaje = db.viajes.find(v => v.id == viaje_id);
  const chofer = db.usuarios.find(u => u.id == chofer_id);

  if (!viaje || !chofer) return res.status(404).json({ error: "Datos no encontrados" });

  viaje.conductor_id = chofer_id;
  viaje.estado = "asignado";

  saveDatabase(db);
  res.json({ message: "Viaje aceptado", viaje });
});

module.exports = router;
