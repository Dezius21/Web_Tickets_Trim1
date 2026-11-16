export const KPIS = [
  {
    id: "total",
    label: "Tickets totales",
    filter: () => true,
  },
  {
    id: "pendientes",
    label: "Tickets por resolver",
    filter: (t) => t.state !== "Finalizado",
  },
  {
    id: "urgentes",
    label: "Tickets urgentes",
    filter: (t) => t.priority === "Alta" && t.state !== "Finalizado",
  },
  {
    id: "completados",
    label: "Tickets completados",
    filter: (t) => t.state === "Finalizado",
  },
];