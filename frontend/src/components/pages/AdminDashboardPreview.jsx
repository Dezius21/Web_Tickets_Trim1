  import { useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";                                 //ADMIN KPIS 
import WorkerTicketList from "../WorkerTicketList";
import TicketModal from "../TicketModal";
import { KPIS } from "../../utils/ticketKpis";
import { TICKETS_EJEMPLO } from "../../utils/mockTickets";

const NOMBRE_ADMIN = "Julian Casablancas";                           // temporal: luego vendrá del AuthContext

export default function AdminDashboardPreview(){
  const [tickets, setTickets] = useState(TICKETS_EJEMPLO); // temporal: luego vendrán de la API
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const kpiActivo = KPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  return (
      <WorkerDashboardLayout
        userName={NOMBRE_ADMIN}
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