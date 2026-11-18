export default function WorkerTicketList({ title, tickets, onSelect }) {
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
            <li key={t.id}>
              <button
                type="button"
                className="ticket-row"
                aria-haspopup="dialog"
                onClick={() => onSelect(t.id)}
              >
                <strong className="ticket-row-subject">{t.subject}</strong>
                <span className="chip">{t.category}</span>
                <span className="pill" data-value={t.priority}>Prioridad {t.priority}</span>
                <span className="pill" data-value={t.state}>{t.state}</span>
                <span className="ticket-row-date">
                  {new Date(t.createdAt).toLocaleDateString("es-ES")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
