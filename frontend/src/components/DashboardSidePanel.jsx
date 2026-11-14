export default function SidePanel({ title, children }) {
  return (
    <aside className="panel panel-side" aria-labelledby="side-title">
      <h2 id="side-title">{title}</h2>
      {children}
    </aside>
  );
}