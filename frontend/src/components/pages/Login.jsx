import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_URL = "http://localhost:3000/api";
import Input from "../Input";
import Button from "../Button";
import "../../blocks/auth.css";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

function validate(form){
  const errors = {};

  if(!form.email.trim())
  {
    errors.email = "Escribe tu email";
  }
  else if(!EMAIL_REGEX.test(form.email))
  {
    errors.email = "El email no tiene un formato valido"
  }

  if(!form.password)
  {
    errors.password = "Escribe tu contraseña"
  }

  return errors;
}

export default function Login(){

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e){
    const {name, value} = e.target;
    setForm({...form, [name]: value});
    setErrors({...errors, [name]: ""});
    setServerError("");
  }

  async function handleSubmit(e){
    e.preventDefault();
    
    const newErrors = validate(form);
    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("")

    try {
    const res = await fetch(`${API_URL}/test/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();

    if(!res.ok)
    {
      setServerError(
        res.status === 401
        ? "Email o contraseña incorrectos."
        :data.message || "No se pudo iniciar sesion"
      );

      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/")
    } catch (error){
      setServerError("No se pudo conectar con el servidor.");
    } finally{
        setLoading(false);
    }
  }
  

  return(
    <section className="auth">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="auth-intro">
          Accedde para pedir servicios y reportar incidencias
        </p>

        <form onSubmit={handleSubmit} noValidate>
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
            label="Contraseña"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
        {serverError && (
          <p className="field-error" role="alert">{serverError}</p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>


        </form>



        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Crea una cuenta</Link>
        </p>
      </div>
    </section>
  )
}