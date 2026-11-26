export default function TicketResponses({ responses = [], emptyMessage }) {
  if (responses.length === 0) {
    // sin emptyMessage no se pinta nada
    if (!emptyMessage) return null;
    return (
      <section className="ticket-responses">
        <h3>Respuestas</h3>
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="ticket-responses">
      <h3>Respuestas</h3>
      <ul>
        {responses.map((r) => (
          <li key={r.id} className="ticket-response">
            <span className="ticket-response-meta">
              {r.author} · {new Date(r.createdAt).toLocaleString("es-ES")}
            </span>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}