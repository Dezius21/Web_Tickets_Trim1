import { CATEGORIAS} from "../utils/ticketOptions";

export default function TicketHistory({ tickets, selectedId, onSelect }) {
  if (tickets.length === 0) {
    return <p>Aún no has creado ningún ticket.</p>;
  }

  return (
    <ul className="ticket-list">
      {tickets.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            className="ticket-item"
            aria-current={t.id === selectedId ? "true" : undefined}
            onClick={() => onSelect(t.id)}
          >
            <strong className="ticket-item-subject">{t.subject}</strong>
            <span>
              {t.state} · {new Date(t.createdAt).toLocaleDateString("es-ES")}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}