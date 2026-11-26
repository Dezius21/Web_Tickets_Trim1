import { useState } from "react";
import Input from "./Input";
import Textarea from "./TextArea";
import Select from "./Select";
import Button from "./Button";
import { CATEGORIAS } from "../utils/ticketOptions";

const VACIO = { subject: "", body: "", category: ""};

export default function TicketForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState(VACIO);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nuevos = {};
    if (!values.subject.trim()) nuevos.subject = "Escribe un asunto";
    if (!values.body.trim()) nuevos.body = "Describe el problema";
    if (!values.category) nuevos.category = "Elige una categoría";
    return nuevos;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nuevos = validate();
    setErrors(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onSubmit({
      subject: values.subject.trim(),
      body: values.body.trim(),
      category: values.category
    });
  }
  
  return (
    <div className="card ticket-card">
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <h2>Nuevo ticket</h2>

      <Input id="subject" name="subject" label="Asunto"
        value={values.subject} onChange={handleChange} error={errors.subject} />

      <Select id="category" name="category" label="Categoría" options={CATEGORIAS}
        value={values.category} onChange={handleChange} error={errors.category} />

      <Textarea id="body" name="body" label="Descripción" rows={6}
        value={values.body} onChange={handleChange} error={errors.body} />

      <div className="ticket-form-actions">
        <Button type="button" variant="cancel" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="ok">Crear ticket</Button>
      </div>
    </form>
    </div>
  );
}