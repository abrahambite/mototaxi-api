const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
  pasajero: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  conductor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    default: null
  },
  origen: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  destino: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  estado: {
    type: String,
    enum: ['buscando', 'aceptado', 'en_camino', 'finalizado', 'cancelado'],
    default: 'buscando'
  },
  monto: { type: Number },
  metodo_pago: { type: String, enum: ['efectivo', 'tarjeta'] }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Viaje', viajeSchema);