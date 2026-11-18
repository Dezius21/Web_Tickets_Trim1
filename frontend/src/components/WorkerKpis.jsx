import { KPIS } from "../utils/ticketKpis";

export default function WorkerKpis({ tickets, selectedId, onSelect }) {
  return (
    <ul className="kpi-list">
      {KPIS.map((kpi) => (
        <li key={kpi.id}>
          <button
            type="button"
            className={`kpi kpi-${kpi.id}`}
            aria-pressed={kpi.id === selectedId}
            onClick={() => onSelect(kpi.id)}
          >
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-count">{tickets.filter(kpi.filter).length}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}