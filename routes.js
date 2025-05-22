// Aceptar o actualizar viaje
router.patch("/viajes/:id", (req, res) => {
  const { id } = req.params;
  const { estado, conductor_id } = req.body;

  const db = loadDatabase();
  const viaje = db.viajes.find(v => v.id == id);
  if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });

  if (estado) viaje.estado = estado;
  if (conductor_id) {
    viaje.conductor_id = conductor_id;
    const conductor = db.usuarios.find(u => u.id == conductor_id);
    if (conductor) {
      viaje.nombre_conductor = conductor.nombre;
      viaje.contacto_conductor = conductor.telefono;
    }
  }

  saveDatabase(db);
  res.json({ message: "Viaje actualizado", viaje });
});
