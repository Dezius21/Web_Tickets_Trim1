// assignedToUser: id del trabajador asignado, o null si está por asignar
export const TICKETS_EJEMPLO = [
  { id: "2", subject: "Enchufe del salón sin corriente", body: "No funciona ningún enchufe de la pared norte.", category: "Electricidad", priority: "Alta", state: "En proceso", createdAt: "2026-11-13T16:10:00.000Z", assignedToUser: "u1" },
  { id: "3", subject: "Puerta del baño no cierra", body: "El pestillo está torcido.", category: "Reparacion", priority: "Baja", state: "Asignado", createdAt: "2026-11-12T11:00:00.000Z", assignedToUser: "u2" },
  { id: "4", subject: "Cambiar bombilla del pasillo", body: "Necesita escalera.", category: "Electricidad", priority: "Baja", state: "Finalizado", createdAt: "2026-11-05T08:45:00.000Z", assignedToUser: "u1" },
  { id: "6", subject: "Persiana del dormitorio atascada", body: "No sube ni baja.", category: "Reparacion", priority: "Media", state: "Finalizado", createdAt: "2026-11-02T10:05:00.000Z", assignedToUser: "u3" },
  { id: "7", subject: "Olor a gas en la cocina", body: "Se nota sobre todo por la noche.", category: "Otros", priority: "Alta", state: "Creado", createdAt: "2026-11-01T20:40:00.000Z", assignedToUser: null },
  { id: "8", subject: "Revisar el cuadro eléctrico", body: "Salta el diferencial a veces.", category: "Electricidad", priority: "Media", state: "Asignado", createdAt: "2026-11-10T13:15:00.000Z", assignedToUser: "u2" },
  { id: "9", subject: "Gotera en el techo del baño", body: "Cae agua cuando el vecino de arriba se ducha.", category: "Fontaneria", priority: "Alta", state: "Creado", createdAt: "2026-11-15T09:30:00.000Z", assignedToUser: null },
  { id: "10", subject: "Grifo de la cocina gotea", body: "Gotea de forma constante.", category: "Fontaneria", priority: "Baja", state: "Creado", createdAt: "2026-11-16T18:20:00.000Z", assignedToUser: null }
];
