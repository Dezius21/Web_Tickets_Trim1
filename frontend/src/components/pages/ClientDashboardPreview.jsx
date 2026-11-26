import { useState } from "react";
import Button from "../Button";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import TicketForm from "../TicketForm";
import TicketHistory from "../TicketHistory";
import TicketDetail from "../TicketDetail";
import { useAuth } from "../../context/AuthContext";

export default function ClientDashboardPreview() {
  const { user, logout } = useAuth(); // sin login (ruta /demo-cliente) user es null
  const [tickets, setTickets] = useState([]);
  const [creando, setCreando] = useState(false);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  function abrirFormulario() {
    setSeleccionadoId(null);
    setCreando(true);
  }

  function seleccionarTicket(id) {
    setCreando(false);
    setSeleccionadoId(id);
  }

  function crearTicket(datos) {
    const nuevo = {
      id: crypto.randomUUID(),   // temporal: luego será el _id de la base de datos
      ...datos,
      state: "Creado",           // temporal: lo pondrá el backend
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [nuevo, ...prev]); // el más reciente arriba
    setCreando(false);
  }

  return (
    <ClientDashboardLayout
      userName={user?.username ?? "Carlos Deza"}
      onLogout={logout}
      action={
        <Button onClick={abrirFormulario} disabled={creando}>
          + Nuevo ticket
        </Button>
      }
      placeholder="Selecciona un ticket del historial o crea uno nuevo"
      sidebarTitle="Historial"
      sidebar={
        <TicketHistory
          tickets={tickets}
          selectedId={seleccionadoId}
          onSelect={seleccionarTicket}
        />
      }
    >
      {creando ? (
        <TicketForm onSubmit={crearTicket} onCancel={() => setCreando(false)} />
      ) : (
        ticketSeleccionado && <TicketDetail ticket={ticketSeleccionado} />
      )}
    </ClientDashboardLayout>
  );
}