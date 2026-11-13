import { NavLink } from "react-router-dom";
import Button from "./Button";
import "../blocks/navbar.css";

export default function Navbar(){

  return(
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">Nombreee</NavLink>

      <nav className="navbar-links" aria-label="Principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/login">Iniciar Sesion</NavLink>
        <NavLink to="/register">Crear Cuenta</NavLink>
      </nav>
    </header>
  )
}