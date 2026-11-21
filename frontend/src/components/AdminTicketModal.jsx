import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Select from "./Select";
import TicketResponses from "./TicketResponses";

// trabajadores: [{ id, username }]
export default function AdminTicketModal({ ticket, trabajadores, onAssign, onClose }) {
  const dialogRef = useRef(null);
  const pulsadoEnFondo = useRef(false);

  const [agentId, setAgentId] = useState(ticket.assignedToUser ?? "");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  const opciones = trabajadores.map((w) => ({ value: w.id, label: w.username }));
  const actual = trabajadores.find((w) => w.id === ticket.assignedToUser);
  const sinCambios = agentId === (ticket.assignedToUser ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    if (!agentId) return;
    onAssign(ticket.id, agentId);
  }

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

        <Select
          id="admin-modal-agent"
          label={actual ? "Reasignar a" : "Asignar a"}
          options={opciones}
          placeholder="Selecciona un trabajador"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        />

        <div className="ticket-modal-actions">
          <Button type="button" variant="cancel" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="ok" disabled={!agentId || sinCambios}>
            {actual ? "Reasignar" : "Asignar ticket"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
