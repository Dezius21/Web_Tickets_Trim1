import { KPIS } from "../utils/ticketKpis";

// kpis: por defecto los del trabajador; el admin le pasa los suyos
export default function WorkerKpis({ kpis = KPIS, tickets, selectedId, onSelect }) {
  return (
    <ul className="kpi-list">
      {kpis.map((kpi) => (
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
