import { useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import AdminTicketModal from "../AdminTicketModal";
import { AdminKPIS } from "../../utils/adminKpis";
import { TICKETS_EJEMPLO } from "../../utils/mockTickets";
import { TRABAJADORES_EJEMPLO } from "../../utils/mockUsers";
import { useAuth } from "../../context/AuthContext";

const NOMBRE_DEMO = "Julian Casablancas"; // solo se usa en /demo-admin (sin login)

export default function AdminDashboardPreview() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState(TICKETS_EJEMPLO);          // temporal: luego vendrán de la API
  const [trabajadores] = useState(TRABAJADORES_EJEMPLO);            // temporal: GET /users?role=Contratista
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const kpiActivo = AdminKPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  function guardarCambios(id, { agentId, priority }) {
    // temporal: luego será PATCH a la API
    // - agentId: assignTicket del backend (pone assignedToUser y fuerza el estado a "Asignado")
    // - priority: cambio de prioridad (solo admin y agente pueden hacerlo)
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...(agentId ? { assignedToUser: agentId, state: "Asignado" } : {}),
          ...(priority ? { priority } : {}),
        };
      })
    );
    setSeleccionadoId(null);
  }

  return (
    <WorkerDashboardLayout
      userName={user?.username ?? NOMBRE_DEMO}
      onLogout={logout}
      placeholder="Selecciona un indicador para ver sus tickets"
      sidebarTitle="Resumen"
      sidebar={
        <WorkerKpis
          kpis={AdminKPIS}
          tickets={tickets}
          selectedId={kpiId}
          onSelect={setKpiId}
        />
      }
    >
      {kpiActivo && (
        <WorkerTicketList
          title={kpiActivo.label}
          tickets={ticketsFiltrados}
          onSelect={setSeleccionadoId}
        />
      )}

      {ticketSeleccionado && (
        <AdminTicketModal
          key={ticketSeleccionado.id}
          ticket={ticketSeleccionado}
          trabajadores={trabajadores}
          onSave={guardarCambios}
          onClose={() => setSeleccionadoId(null)}
        />
      )}
    </WorkerDashboardLayout>
  );
}