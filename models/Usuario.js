const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, enum: ['pasajero', 'conductor'], required: true },
  
  // --- Campos específicos para el conductor ---
  vehiculo: { type: String },
  placas: { type: String },
  disponible: { type: Boolean, default: true },
  ubicacion_actual: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { 
    timestamps: true 
});

usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);