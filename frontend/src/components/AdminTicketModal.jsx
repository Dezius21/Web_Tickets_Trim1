import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Select from "./Select";
import TicketResponses from "./TicketResponses";
import { PRIORIDADES } from "../utils/ticketOptions";

// trabajadores: [{ id, username }]
export default function AdminTicketModal({ ticket, trabajadores, onSave, onClose }) {
  const dialogRef = useRef(null);
  const pulsadoEnFondo = useRef(false);

  const [agentId, setAgentId] = useState(ticket.assignedToUser ?? "");
  const [priority, setPriority] = useState(ticket.priority);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  const opciones = trabajadores.map((w) => ({ value: w.id, label: w.username }));
  const actual = trabajadores.find((w) => w.id === ticket.assignedToUser);
  const agenteCambiado = agentId !== (ticket.assignedToUser ?? "");
  const prioridadCambiada = priority !== ticket.priority;
  const sinCambios = !agenteCambiado && !prioridadCambiada;

  function handleSubmit(e) {
    e.preventDefault();
    if (sinCambios) return;
    onSave(ticket.id, {
      // solo se manda el agente si ha cambiado (así no se fuerza el estado a "Asignado" sin motivo)
      ...(agenteCambiado && agentId ? { agentId } : {}),
      ...(prioridadCambiada ? { priority } : {}),
    });
  }

  const textoBoton = agenteCambiado
    ? (actual ? "Reasignar" : "Asignar ticket")
    : "Guardar cambios";

  return (
    <dialog
      ref={dialogRef}
      className="ticket-modal"
      aria-labelledby="admin-modal-title"
      onClose={onClose}
      onMouseDown={(e) => { pulsadoEnFondo.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pulsadoEnFondo.current && e.target === e.currentTarget) onClose();
      }}
    >
      <form className="ticket-modal-content" onSubmit={handleSubmit}>
        <header className="ticket-modal-header">
          <h2 id="admin-modal-title">{ticket.subject}</h2>
          <button
            type="button"
            className="ticket-modal-close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <dl className="ticket-detail-meta">
          <div className="ticket-meta-box">
            <dt>Categoría</dt>
            <dd>{ticket.category}</dd>
          </div>
          <div className="ticket-meta-box">
            <dt>Prioridad</dt>
            <dd>{ticket.priority}</dd>
          </div>
          <div className="ticket-meta-box">
            <dt>Estado</dt>
            <dd>{ticket.state}</dd>
          </div>
          <div className="ticket-meta-box">
            <dt>Asignado a</dt>
            <dd>{actual ? actual.username : "Sin asignar"}</dd>
          </div>
          <div className="ticket-meta-box">
            <dt>Creado el</dt>
            <dd>{new Date(ticket.createdAt).toLocaleString("es-ES")}</dd>
          </div>
        </dl>

        <div className="ticket-detail-description">
          <h3>Descripción</h3>
          <p className="ticket-detail-body">{ticket.body}</p>
        </div>

        <TicketResponses responses={ticket.responses} />

        <div className="ticket-modal-fields">
          <Select
            id="admin-modal-agent"
            label={actual ? "Reasignar a" : "Asignar a"}
            options={opciones}
            placeholder="Selecciona un trabajador"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          />
          <Select
            id="admin-modal-priority"
            label="Prioridad"
            options={PRIORIDADES}
            placeholder={null}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>

        <div className="ticket-modal-actions">
          <Button type="button" variant="cancel" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="ok" disabled={sinCambios}>
            {textoBoton}
          </Button>
        </div>
      </form>
    </dialog>
  );
}