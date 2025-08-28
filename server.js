// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./authRoutes'); // ← usa tu archivo existente

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('MotoTaxi API OK'));
app.use('/api/auth', authRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
