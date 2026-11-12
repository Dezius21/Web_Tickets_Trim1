import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2026 ArreglaYa · Proyecto de DAM</p>
        <nav aria-label="Pie de página">
          <Link to="/sobre">Sobre el proyecto</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
      </div>
    </footer>
  );
}