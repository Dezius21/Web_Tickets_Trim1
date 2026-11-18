import { Children } from "react";

export default function WorkerMainPanel({ action, placeholder, children }) {
  const hayContenido = Children.toArray(children).length > 0;

  return (
    <section className="panel panel-main">

      {hayContenido
        ? children
        : placeholder && <p className="panel-placeholder">{placeholder}</p>}
    </section>
  );
}