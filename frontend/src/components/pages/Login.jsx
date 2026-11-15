import { use, useState } from "react";
import { Link } from "react-router-dom";
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

  const [form, setForm] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(e){
    const {name, value} = e.target;
    setForm({...form, [name]: value});
    setErrors({...errors, [name]: ""});
    setMessage("");
  }

  function handleSubmit(e){
    e.preventDefault();
    
    const newErrors = validate(form);
    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return;

    console.log("login valido", form.email);

    setMessage("Todo ok falta conexion al server");
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
          <Button type="submit">Entrar</Button>
        </form>
        {message && (
          <p className="auth-message" role="status">{message}</p>
        )}

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Crea una cuenta</Link>
        </p>
      </div>
    </section>
  )
}