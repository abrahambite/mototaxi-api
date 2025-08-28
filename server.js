// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); // usa el de /routes (PRISMA)

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('MotoTaxi API OK (PRISMA MODE)'));

// Rutas
app.use('/api/auth', authRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server listening on', PORT, '— PRISMA MODE');
});
