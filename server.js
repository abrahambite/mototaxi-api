const express = require("express");
const cors = require("cors");
const rutas = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // Body parser integrado en express

// ✅ Rutas principales
app.use('/api', rutas);

// ✅ Ruta raíz de prueba
app.get("/", (req, res) => {
  res.status(200).send("Servidor MotoTaxi en ejecución 🚀");
});

// ✅ Manejo global de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ✅ Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error interno:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ✅ Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});
