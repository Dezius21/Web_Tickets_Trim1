import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import "../blocks/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">Nombreee</Link>

      <nav className="navbar-links" aria-label="Principal">
        <Button to="/login" variant="secondary">Iniciar sesión</Button>
        <Button to="/register">Crear cuenta</Button>
      </nav>
    </header>
  );
}