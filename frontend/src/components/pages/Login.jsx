import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../Input";
import Button from "../Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [datos, setDatos] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  function handleChange(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevos = {};
    if (!datos.email.trim()) {
      nuevos.email = "Escribe tu correo electrónico.";
    } else if (!/\S+@\S+\.\S+/.test(datos.email)) {
      nuevos.email = "El correo no tiene un formato válido.";
    }
    if (!datos.password) {
      nuevos.password = "Escribe tu contraseña.";
    }
    return nuevos;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      const usuario = await login(datos.email, datos.password);
      const destino =
        location.state?.from?.pathname ||
        (usuario.rol === "agente" ? "/soporte/tickets" : "/cuenta/tickets");
      navigate(destino, { replace: true });
    } catch (err) {
      setErrorGeneral("No se pudo iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            label="Correo electrónico"
            autoComplete="email"
            value={datos.email}
            onChange={handleChange}
            error={errores.email}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            autoComplete="current-password"
            value={datos.password}
            onChange={handleChange}
            error={errores.password}
          />

          {errorGeneral && (
            <p className="form-error" role="alert">{errorGeneral}</p>
          )}

          <Button type="submit" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="auth-alt">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}