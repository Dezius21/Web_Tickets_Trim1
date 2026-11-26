import { useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import TicketModal from "../TicketModal";
import { KPIS } from "../../utils/ticketKpis";
import { TICKETS_EJEMPLO } from "../../utils/mockTickets";
import { useAuth } from "../../context/AuthContext";

const NOMBRE_DEMO = "Cameron Winter"; // solo se usa en /demo-trabajador (sin login)

export default function WorkerDashboardPreview() {
  const { user, logout } = useAuth();
  const nombre = user?.username ?? NOMBRE_DEMO;
  const [tickets, setTickets] = useState(TICKETS_EJEMPLO); // temporal: luego vendrán de la API
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const kpiActivo = KPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  function guardarTicket(id, { priority, state, response }) {
    // temporal: luego será un PATCH a la API
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const responses = t.responses ?? [];
        return {
          ...t,
          priority,
          state,
          responses: response
            ? [
                ...responses,
                {
                  id: crypto.randomUUID(),
                  author: nombre,
                  text: response,
                  createdAt: new Date().toISOString(),
                },
              ]
            : responses,
        };
      })
    );
    setSeleccionadoId(null);
  }

  return (
    <WorkerDashboardLayout
      userName={nombre}
      onLogout={logout}
      placeholder="Selecciona un indicador para ver sus tickets"
      sidebarTitle="Resumen"
      sidebar={
        <WorkerKpis tickets={tickets} selectedId={kpiId} onSelect={setKpiId} />
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
        <TicketModal
          key={ticketSeleccionado.id}
          ticket={ticketSeleccionado}
          onSave={guardarTicket}
          onClose={() => setSeleccionadoId(null)}
        />
      )}
    </WorkerDashboardLayout>
  );
}