export default function Card({ titulo, children }) {
  return (
    <article className="card">
      <h3 className="card-title">{titulo}</h3>
      {children}
    </article>
  );
}