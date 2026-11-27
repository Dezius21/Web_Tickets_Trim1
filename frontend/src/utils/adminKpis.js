// "Asignado" = tiene un trabajador (assignedToUser), no depende del estado.
// Es lo mismo que cuenta el backend en getAdminTicketMetrics.
export const AdminKPIS = [
  {
    id: "asignados",
    label: "Tickets asignados",
    filter: (t) => t.assignedToUser != null,
  },
  {
    id: "porAsignar",
    label: "Tickets por asignar",
    filter: (t) => t.assignedToUser == null,
  },
  {
    id: "urgentesAsignados",
    label: "Tickets urgentes asignados",
    filter: (t) =>
      t.priority === "Alta" && t.assignedToUser != null && t.state !== "Finalizado",
  },
  {
    id: "urgentesPorAsignar",
    label: "Tickets urgentes por asignar",
    filter: (t) =>
      t.priority === "Alta" && t.assignedToUser == null && t.state !== "Finalizado",
  },
];
