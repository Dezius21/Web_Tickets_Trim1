import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Input";
import Button from "../Button";
import "../../blocks/auth.css";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Escribe tu nombre.";
  } else if (form.name.trim().length < 2) {
    errors.name = "El nombre es demasiado corto.";
  }

  if (!form.email.trim()) {
    errors.email = "Escribe tu email.";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "El email no tiene un formato válido.";
  }

  if (!form.password) {
    errors.password = "Escribe una contraseña.";
  } else if (form.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!form.confirm) {
    errors.confirm = "Repite la contraseña.";
  } else if (form.confirm !== form.password) {
    errors.confirm = "Las contraseñas no coinciden.";
  }

  return errors;
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    console.log("Registro válido:", form.name, form.email);
    setMessage("Todo ok falta conexion al server.");
  }

  return (
    <section className="auth">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-intro">
          Regístrate para pedir servicios y reportar incidencias.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="name"
            name="name"
            type="text"
            label="Nombre"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Contraseña (mínimo 8 caracteres)"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            id="confirm"
            name="confirm"
            type="password"
            label="Repite la contraseña"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
          />


          <Button type="submit">Crear cuenta</Button>
        </form>

        {message && (
          <p className="auth-message" role="status">{message}</p>
        )}

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}