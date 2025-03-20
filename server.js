const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor MotoTaxi en ejecución');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
