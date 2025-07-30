const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rutas = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Rutas principales
app.use(rutas);

// ✅ Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Servidor MotoTaxi en ejecución 🚀");
});

// ✅ Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ✅ Iniciar servidor en Railway correctamente
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});
