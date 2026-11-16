import { useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import { KPIS } from "../../utils/ticketKpis";
import { TICKETS_EJEMPLO } from "../../utils/mockTickets";

export default function WorkerDashboardPreview() {
  const tickets = TICKETS_EJEMPLO; // temporal: luego vendrán de la API
  const [kpiId, setKpiId] = useState(null);

  const kpiActivo = KPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];

  return (
    <WorkerDashboardLayout
      userName="Cameron Winter"
      placeholder="Selecciona un indicador para ver sus tickets"
      sidebarTitle="Resumen"
      sidebar={
        <WorkerKpis tickets={tickets} selectedId={kpiId} onSelect={setKpiId} />
      }
    >
      {kpiActivo && (
        <WorkerTicketList title={kpiActivo.label} tickets={ticketsFiltrados} />
      )}
    </WorkerDashboardLayout>
  );
}