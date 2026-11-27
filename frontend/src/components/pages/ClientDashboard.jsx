import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import TicketForm from "../TicketForm";
import TicketHistory from "../TicketHistory";
import TicketDetail from "../TicketDetail";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

// MongoDB devuelve _id; los componentes del dashboard usan id
const conId = (t) => ({ ...t, id: t._id });
const mensaje = (err, texto) => (err.status === 0 ? err.message : texto);

// El back guarda replies { sender, message, date }; TicketResponses espera responses { author, text, createdAt }
const aRespuestas = (replies = []) =>
  replies.map((r) => ({
    id: r._id,
    author: r.sender?.username ?? "Usuario",
    text: r.message,
    createdAt: r.date,
  }));

export default function ClientDashboardPreview() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [cargandoRespuestas, setCargandoRespuestas] = useState(false);
  const [errorRespuestas, setErrorRespuestas] = useState("");
  const peticionRef = useRef(0); // si pulsas otro ticket antes de que llegue la respuesta, se ignora la antigua

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

  function abrirFormulario() {
    setError("");
    setSeleccionadoId(null);
    setCreando(true);
  }

  // El listado trae las respuestas sin el nombre de quien las escribió; el detalle sí.
  // Por eso al abrir un ticket se pide su detalle (y así siempre se ven las respuestas más recientes).
  async function seleccionarTicket(id) {
    const peticion = ++peticionRef.current;
    setCreando(false);
    setError("");
    setErrorRespuestas("");
    setSeleccionadoId(id);
    setCargandoRespuestas(true);

    try {
      const detalle = await api(`/tickets/${id}`);
      if (peticion !== peticionRef.current) return;
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, responses: aRespuestas(detalle.replies) } : t
        )
      );
    } catch (err) {
      if (peticion !== peticionRef.current) return;
      setErrorRespuestas(mensaje(err, "No se pudieron cargar las respuestas."));
    } finally {
      if (peticion === peticionRef.current) setCargandoRespuestas(false);
    }
  }

  async function crearTicket(datos) {
    setError("");
    try {
      const { data } = await api("/tickets", { method: "POST", body: datos });
      setTickets((prev) => [conId(data), ...prev]);
      setCreando(false);
    } catch (err) {
      setError(
        mensaje(err, "No se pudo crear el ticket. Revisa los datos e inténtalo de nuevo.")
      );
    }
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
        cargando ? (
          <p>Cargando tickets...</p>
        ) : (
          <TicketHistory
            tickets={tickets}
            selectedId={seleccionadoId}
            onSelect={seleccionarTicket}
          />
        )
      }
    >
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      {creando ? (
        <TicketForm onSubmit={crearTicket} onCancel={() => setCreando(false)} />
      ) : (
        ticketSeleccionado && (
          <TicketDetail
            ticket={ticketSeleccionado}
            cargandoRespuestas={cargandoRespuestas}
            errorRespuestas={errorRespuestas}
            onRetry={() => seleccionarTicket(ticketSeleccionado.id)}
          />
        )
      )}
    </ClientDashboardLayout>
  );
}