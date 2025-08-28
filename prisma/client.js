// prisma/client.js
const { PrismaClient } = require('@prisma/client');

// Reutiliza la instancia en dev; en prod crea una nueva
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
