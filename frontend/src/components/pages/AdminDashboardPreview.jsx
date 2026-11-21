import { useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import AdminTicketModal from "../AdminTicketModal";
import { AdminKPIS } from "../../utils/adminKpis";
import { TICKETS_EJEMPLO } from "../../utils/mockTickets";
import { TRABAJADORES_EJEMPLO } from "../../utils/mockUsers";

const NOMBRE_ADMIN = "Julian Casablancas"; // temporal: luego vendrá del AuthContext

export default function AdminDashboardPreview() {
  const [tickets, setTickets] = useState(TICKETS_EJEMPLO);          // temporal: luego vendrán de la API
  const [trabajadores] = useState(TRABAJADORES_EJEMPLO);            // temporal: GET /users?role=Contratista
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const kpiActivo = AdminKPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  function asignarTicket(id, agentId) {
    // temporal: luego será PATCH a la API (assignTicket del backend)
    // el backend pone assignedToUser y fuerza el estado a "Asignado"
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, assignedToUser: agentId, state: "Asignado" } : t
      )
    );
    setSeleccionadoId(null);
  }

  return (
    <WorkerDashboardLayout
      userName={NOMBRE_ADMIN}
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
          onAssign={asignarTicket}
          onClose={() => setSeleccionadoId(null)}
        />
      )}
    </WorkerDashboardLayout>
  );
}
