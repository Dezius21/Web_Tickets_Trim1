export default function TicketDetail({ ticket }) {
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
      </article>
    </div>
  );
}
