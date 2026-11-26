import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { rutaInicio } from "../utils/roles";
import "../blocks/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">Nombreee</Link>

      <nav className="navbar-links" aria-label="Principal">
        {user ? (
          <>
            <Button to={rutaInicio(user.role)} variant="secondary">Mi panel</Button>
            <Button onClick={logout}>Cerrar sesión</Button>
          </>
        ) : (
          <>
            <Button to="/login" variant="secondary">Iniciar sesión</Button>
            <Button to="/register">Crear cuenta</Button>
          </>
        )}
      </nav>
    </header>
  );
}