import { useEffect, useState } from "react";
import WorkerDashboardLayout from "../layouts/WorkerDashboardLayout";
import WorkerKpis from "../WorkerKpis";
import WorkerTicketList from "../WorkerTicketList";
import AdminTicketModal from "../AdminTicketModal";
import NewWorkerModal from "../NewWorkerModal";
import Button from "../Button";
import { AdminKPIS } from "../../utils/adminKpis";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import { api } from "../../utils/api";

const NOMBRE_DEMO = "Julian Casablancas"; // solo se usa en /demo-admin (sin login)

// MongoDB devuelve _id, y el listado trae assignedToUser como objeto { _id, username, email };
// los componentes del dashboard esperan id y el id del trabajador como texto (o null)
const aTicket = (t) => ({
  ...t,
  id: t._id,
  assignedToUser: t.assignedToUser?._id ?? null,
});

// El back guarda replies { sender, message, date }; el modal espera responses { author, text, createdAt }
const aRespuestas = (replies = []) =>
  replies.map((r) => ({
    id: r._id,
    author: r.sender?.username ?? "Usuario",
    text: r.message,
    createdAt: r.date,
  }));

const mensaje = (err, texto) => (err.status === 0 ? err.message : texto);

export default function AdminDashboardPreview() {
  const { user, logout, register } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [kpiId, setKpiId] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [registrando, setRegistrando] = useState(false);
  const [aviso, setAviso] = useState("");

  const kpiActivo = AdminKPIS.find((k) => k.id === kpiId);
  const ticketsFiltrados = kpiActivo ? tickets.filter(kpiActivo.filter) : [];
  const ticketSeleccionado = tickets.find((t) => t.id === seleccionadoId);

  useEffect(() => {
    let activo = true;

    Promise.all([api("/tickets"), api("/users?role=Contratista")])
      .then(([listaTickets, listaUsuarios]) => {
        if (!activo) return;
        setTickets(listaTickets.map(aTicket));
        setTrabajadores(
          listaUsuarios.map((u) => ({ id: u._id, username: u.username }))
        );
      })
      .catch((err) => {
        if (activo) setError(mensaje(err, "No se pudieron cargar los datos."));
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
    setAviso("");
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

  async function guardarCambios(id, { agentId, priority }) {
    setError("");
    let cambios = {};

    try {
      if (agentId) {
        const { data } = await api(`/tickets/${id}/assign`, {
          method: "PATCH",
          body: { agentId },
        });
        cambios = { ...cambios, assignedToUser: data.assignedToUser, state: data.state };
      }
      if (priority) {
        const { data } = await api(`/tickets/${id}/status`, {
          method: "PATCH",
          body: { priority },
        });
        cambios = { ...cambios, priority: data.priority };
      }
    } catch (err) {
      setError(mensaje(err, "No se pudieron guardar los cambios."));
    } finally {
      if (Object.keys(cambios).length > 0) {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...cambios } : t))
        );
      }
      setSeleccionadoId(null);
    }
  }

  // Crear un trabajador son dos pasos con la API que ya existe:
  // 1) registrar la cuenta (el backend siempre la crea como Inquilino)
  // 2) cambiarle el rol a Contratista (solo un administrador puede)
  // Si el paso 1 falla, el error llega al modal (nombre repetido, email mal...).
  async function crearTrabajador({ username, email, password }) {
    const res = await register(username, email, password);
    const id = res.data.id;

    try {
      await api(`/users/${id}/permissions`, {
        method: "PATCH",
        body: { role: ROLES.trabajador },
      });
    } catch {
      // la cuenta existe pero se quedó como Inquilino
      setRegistrando(false);
      setError(
        `La cuenta «${username}» se creó, pero no se pudo convertir en trabajador. Hay que cambiarle el rol a mano.`
      );
      return;
    }

    setTrabajadores((prev) => [...prev, { id, username }]);
    setError("");
    setAviso(`Trabajador «${username}» creado correctamente.`);
    setRegistrando(false);
  }

  return (
    <WorkerDashboardLayout
      userName={user?.username ?? NOMBRE_DEMO}
      onLogout={logout}
      headerActions={
        <Button
          variant="ok"
          onClick={() => {
            setAviso("");
            setRegistrando(true);
          }}
        >
          + Nuevo trabajador
        </Button>
      }
      placeholder="Selecciona un indicador para ver sus tickets"
      sidebarTitle="Resumen"
      sidebar={
        cargando ? (
          <p>Cargando tickets...</p>
        ) : (
          <WorkerKpis
            kpis={AdminKPIS}
            tickets={tickets}
            selectedId={kpiId}
            onSelect={setKpiId}
          />
        )
      }
    >
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      {aviso ? <p className="status-ok" role="status">{aviso}</p> : null}

      {kpiActivo && (
        <WorkerTicketList
          title={kpiActivo.label}
          tickets={ticketsFiltrados}
          onSelect={abrirTicket}
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

      {registrando && (
        <NewWorkerModal
          onSave={crearTrabajador}
          onClose={() => setRegistrando(false)}
        />
      )}
    </WorkerDashboardLayout>
  );
}