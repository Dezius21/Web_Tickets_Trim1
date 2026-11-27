import { useEffect, useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import TicketModal from "../TicketModal";
import { KPIS } from "../../utils/ticketKpis";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

// MongoDB devuelve _id; los componentes del dashboard usan id
const conId = (t) => ({ ...t, id: t._id });

// El back guarda replies { sender, message, date }; el modal espera responses { author, text, createdAt }
const aRespuestas = (replies = []) =>
  replies.map((r) => ({
    id: r._id,
    author: r.sender?.username ?? "Usuario",
    text: r.message,
    createdAt: r.date,
  }));

const mensaje = (err, texto) => (err.status === 0 ? err.message : texto);

export default function WorkerDashboardPreview() {
  const { user, logout } = useAuth();
  const nombre = user?.username;
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const kpiActivo = KPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  useEffect(() => {
    let activo = true;

    api("/tickets")
      .then((data) => {
        if (activo) setTickets(data.map(conId));
      })
      .catch((err) => {
        if (activo) setError(mensaje(err, "No se pudieron cargar los tickets."));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  // El listado no trae el nombre de quien respondió; el detalle sí
  async function abrirTicket(id) {
    setError("");
    try {
      const detalle = await api(`/tickets/${id}`);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, responses: aRespuestas(detalle.replies) } : t
        )
      );
      setSeleccionadoId(id);
    } catch (err) {
      setError(mensaje(err, "No se pudo abrir el ticket."));
    }
  }

  async function guardarTicket(id, { priority, state, response }) {
    setError("");
    try {
      const { data } = await api(`/tickets/${id}/status`, {
        method: "PATCH",
        body: { state, priority },
      });
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, state: data.state, priority: data.priority } : t
        )
      );

      if (response) {
        const { data: reply } = await api(`/tickets/${id}/replies`, {
          method: "POST",
          body: { message: response },
        });
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  responses: [
                    ...(t.responses ?? []),
                    {
                      id: reply._id,
                      author: nombre,
                      text: reply.message,
                      createdAt: reply.date,
                    },
                  ],
                }
              : t
          )
        );
      }
      setSeleccionadoId(null);
    } catch (err) {
      setSeleccionadoId(null);
      setError(mensaje(err, "No se pudieron guardar los cambios."));
    }
  }

  return (
    <WorkerDashboardLayout
      userName={nombre}
      onLogout={logout}
      placeholder="Selecciona un indicador para ver sus tickets"
      sidebarTitle="Resumen"
      sidebar={
        cargando ? (
          <p>Cargando tickets...</p>
        ) : (
          <WorkerKpis tickets={tickets} selectedId={kpiId} onSelect={setKpiId} />
        )
      }
    >
      {error ? <p className="field-error" role="alert">{error}</p> : null}

      {kpiActivo && (
        <WorkerTicketList
          title={kpiActivo.label}
          tickets={ticketsFiltrados}
          onSelect={abrirTicket}
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