import { NavLink } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav aria-label="Principal" className="navbar-inner container">
        <NavLink to="/" className="navbar-logo">ArreglaYa</NavLink>

        <ul className="navbar-links">
          <li><NavLink to="/catalogo">Catálogo</NavLink></li>
          <li><NavLink to="/sobre">Sobre el proyecto</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
        </ul>

        <div className="navbar-actions">
          <Button to="/login" variant="secondary">Entrar</Button>
          <Button to="/registro">Registrarse</Button>
        </div>
      </nav>
    </header>
  );
}