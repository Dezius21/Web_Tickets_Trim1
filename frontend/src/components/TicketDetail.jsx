import TicketResponses from "./TicketResponses";
import Button from "./Button";

export default function TicketDetail({ ticket, cargandoRespuestas = false, errorRespuestas = "", onRetry }) {
  return (
    <div className="card ticket-card">
      <article className="ticket-detail">
        <h2>{ticket.subject}</h2>

        <dl className="ticket-detail-meta">
          <div className="ticket-meta-box">
            <dt>Categoría</dt>
            <dd>{ticket.category}</dd>
          </div>

          <div className="ticket-meta-box">
            <dt>Estado</dt>
            <dd>{ticket.state}</dd>
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

        {cargandoRespuestas ? (
          <p>Cargando respuestas...</p>
        ) : errorRespuestas ? (
          <div role="alert">
            <p className="field-error">{errorRespuestas}</p>
            {onRetry && <Button variant="secondary" onClick={onRetry}>Reintentar</Button>}
          </div>
        ) : (
          <TicketResponses
            responses={ticket.responses}
            emptyMessage="Todavía no hay respuestas."
          />
        )}
      </article>
    </div>
  );
}