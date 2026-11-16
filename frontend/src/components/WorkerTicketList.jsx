export default function WorkerTicketList({ title, tickets }) {
  return (
    <section className="worker-list" aria-labelledby="worker-list-title">
      <h2 id="worker-list-title">
        {title}
      </h2>

      {tickets.length === 0 ? (
        <p>No hay tickets en esta categoría.</p>
      ) : (
        <ul className="ticket-rows">
          {tickets.map((t) => (
            <li key={t.id} className="ticket-row">
              <strong className="ticket-row-subject">{t.subject}</strong>
              <span className="ticket-row-meta">
                {t.category} · Prioridad {t.priority} · {t.state}
              </span>
              <span className="ticket-row-meta">
                {new Date(t.createdAt).toLocaleDateString("es-ES")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}