import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Input";
import Button from "../Button";

export default function Registro() {
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  function handleChange(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevos = {};
    if (!datos.nombre.trim()) {
      nuevos.nombre = "Escribe tu nombre.";
    }
    if (!datos.email.trim()) {
      nuevos.email = "Escribe tu correo electrónico.";
    } else if (!/\S+@\S+\.\S+/.test(datos.email)) {
      nuevos.email = "El correo no tiene un formato válido.";
    }
    if (datos.password.length < 8) {
      nuevos.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (datos.confirmar !== datos.password) {
      nuevos.confirmar = "Las contraseñas no coinciden.";
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
      // TODO: sustituir por la llamada real al backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Registro de", datos.email);
    } catch (err) {
      setErrorGeneral("No se pudo crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Crear cuenta</h1>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="nombre"
            name="nombre"
            label="Nombre"
            autoComplete="name"
            value={datos.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />
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
            label="Contraseña (mínimo 8 caracteres)"
            autoComplete="new-password"
            value={datos.password}
            onChange={handleChange}
            error={errores.password}
          />
          <Input
            id="confirmar"
            name="confirmar"
            type="password"
            label="Repite la contraseña"
            autoComplete="new-password"
            value={datos.confirmar}
            onChange={handleChange}
            error={errores.confirmar}
          />

          {errorGeneral && (
            <p className="form-error" role="alert">{errorGeneral}</p>
          )}

          <Button type="submit" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}