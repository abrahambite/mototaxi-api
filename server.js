// =============================================================================
// ARCHIVO: server.js (Versión Final para Producción)
// =============================================================================
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const authRoutes = require('./routes/authRoutes');
// const viajeRoutes = require('./routes/viajeRoutes'); // Lo activaremos después

// Inicialización
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- CONEXIÓN A LA BASE DE DATOS (ACTIVADA) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ ¡Conectado a MongoDB Atlas!'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Rutas de la API
app.use('/api/auth', authRoutes);
// app.use('/api/viajes', viajeRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('<h1>¡El servidor del mototaxi está funcionando!</h1>');
});


// Lógica de WebSockets
io.on('connection', (socket) => {
  console.log('🔌 Nuevo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});