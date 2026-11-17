import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./TextArea";
import TicketResponses from "./TicketResponses";
import { PRIORIDADES, ESTADOS } from "../utils/ticketOptions";

export default function TicketModal({ ticket, onSave, onClose }) {
  const dialogRef = useRef(null);
  const pulsadoEnFondo = useRef(false);

  const [priority, setPriority] = useState(ticket.priority);
  const [state, setState] = useState(ticket.state);
  const [response, setResponse] = useState("");

  // <dialog> nativo: gestiona el foco, la tecla Esc y el fondo oscuro
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    onSave(ticket.id, { priority, state, response: response.trim() });
  }

  return (
    <dialog
      ref={dialogRef}
      className="ticket-modal"
      aria-labelledby="ticket-modal-title"
      onClose={onClose}
      // Solo cierra si se pulsa Y se suelta sobre el fondo
      // (así no se cierra al seleccionar texto y soltar fuera)
      onMouseDown={(e) => { pulsadoEnFondo.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pulsadoEnFondo.current && e.target === e.currentTarget) onClose();
      }}
    >
      <form className="ticket-modal-content" onSubmit={handleSubmit}>s
        <header className="ticket-modal-header">
          <h2 id="ticket-modal-title">{ticket.subject}</h2>
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
            id="modal-priority"
            label="Prioridad"
            options={PRIORIDADES}
            placeholder={null}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
          <Select
            id="modal-state"
            label="Estado"
            options={ESTADOS}
            placeholder={null}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <Textarea
          id="modal-response"
          label="Nueva respuesta (la verá el cliente)"
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />

        <div className="ticket-modal-actions">
          <Button type="button" variant="cancel" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="ok">Guardar cambios</Button>
        </div>
      </form>
    </dialog>
  );
}
