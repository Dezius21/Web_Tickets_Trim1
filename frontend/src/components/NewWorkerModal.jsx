import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

function validate(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.username = "Escribe el nombre del trabajador";
  } else if (form.username.trim().length < 2) {
    errors.username = "El nombre es demasiado corto";
  }

  if (!form.email.trim()) {
    errors.email = "Escribe el email";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "El email no tiene un formato válido";
  }

  if (!form.password) {
    errors.password = "Escribe una contraseña";
  } else if (form.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  }

  return errors;
}

// onSave(datos) es async: si lanza un error, el modal lo enseña y se queda abierto.
// Si termina bien, es el padre quien lo cierra.
export default function NewWorkerModal({ onSave, onClose }) {
  const dialogRef = useRef(null);
  const pulsadoEnFondo = useRef(false);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nuevos = validate(form);
    setErrors(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      await onSave({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (err) {
      if (err.errors) {
        // errores por campo que manda el backend
        setErrors({
          username: err.errors.username,
          email: err.errors.email,
          password: err.errors.password,
        });
      } else if (err.status === 409) {
        setServerError("Ya existe una cuenta con ese email o nombre de usuario.");
      } else {
        setServerError(err.message);
      }
      setLoading(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="ticket-modal"
      aria-labelledby="new-worker-title"
      onClose={onClose}
      onMouseDown={(e) => { pulsadoEnFondo.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pulsadoEnFondo.current && e.target === e.currentTarget) onClose();
      }}
    >
      <form className="ticket-modal-content" onSubmit={handleSubmit} noValidate>
        <header className="ticket-modal-header">
          <h2 id="new-worker-title">Nuevo trabajador</h2>
          <button
            type="button"
            className="ticket-modal-close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <p>
          Se creará una cuenta de trabajador. Podrá entrar con este
          email y esta contraseña, así que recuerda comunicárselos.
        </p>

        <Input
          id="new-worker-username"
          name="username"
          type="text"
          label="Nombre de usuario"
          autoComplete="off"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />
        <Input
          id="new-worker-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="off"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          id="new-worker-password"
          name="password"
          type="password"
          label="Contraseña (mínimo 8 caracteres)"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        {serverError && (
          <p className="field-error" role="alert">{serverError}</p>
        )}

        <div className="ticket-modal-actions">
          <Button type="button" variant="cancel" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="ok" disabled={loading}>
            {loading ? "Creando..." : "Crear trabajador"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}