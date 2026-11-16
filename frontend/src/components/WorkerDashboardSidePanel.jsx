export default function WorkerSidePanel({ title, children }) {
  return (
    <aside className="panel panel-side panel-side-kpis" aria-labelledby="side-title">
      <h2 id="side-title">{title}</h2>
      {children}
    </aside>
  );
}