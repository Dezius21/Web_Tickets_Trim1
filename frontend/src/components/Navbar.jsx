import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ultimoScroll = window.scrollY;

    function handleScroll() {
      const actual = window.scrollY;
      if (Math.abs(actual - ultimoScroll) < 10) return;
      setVisible(actual < ultimoScroll || actual < 80);
      ultimoScroll = actual;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const rutaTickets = user?.rol === "agente" ? "/soporte/tickets" : "/cuenta/tickets";

  return (
    <header
      className={`navbar ${visible ? "" : "navbar-hidden"}`}
      onFocusCapture={() => setVisible(true)}
    >
      <nav aria-label="Principal" className="navbar-inner container">
        <NavLink to="/" className="navbar-logo">ArreglaYa</NavLink>

        <ul className="navbar-links">
          <li><NavLink to="/catalogo">Catálogo</NavLink></li>
          <li><NavLink to="/sobre">Sobre el proyecto</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
          {user && <li><NavLink to={rutaTickets}>Mis tickets</NavLink></li>}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">Hola, {user.nombre}</span>
              <Button variant="secondary" onClick={handleLogout}>Salir</Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="secondary">Entrar</Button>
              <Button to="/registro">Registrarse</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}