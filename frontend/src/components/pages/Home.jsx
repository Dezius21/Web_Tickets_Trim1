import Button from "../Button";
import Card from "../Card";

const pasos = [
  { titulo: "1. Abre un ticket", texto: "Cuéntanos qué hay que arreglar y qué recursos necesitas." },
  { titulo: "2. Te asignamos un agente", texto: "Una persona del equipo revisa tu solicitud y te responde." },
  { titulo: "3. Sigue el estado", texto: "Consulta el historial y el estado de tu ticket cuando quieras." },
];

const categorias = [
  { titulo: "Fontanería", texto: "Fugas, grifos, cisternas y desatascos." },
  { titulo: "Electricidad", texto: "Enchufes, luces y cuadros eléctricos." },
  { titulo: "Carpintería", texto: "Puertas, ventanas y muebles." },
  { titulo: "Pintura", texto: "Paredes, humedades y acabados." },
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="container">
          <h1 id="hero-titulo">Soluciona los arreglos de tu casa</h1>
          <p className="hero-texto">
            Pide ayuda para fontanería, electricidad y más. Abre un ticket,
            te asignamos a una persona y sigues todo el proceso desde tu cuenta.
          </p>
          <div className="hero-botones">
            <Button to="/registro">Crear cuenta</Button>
            <Button to="/catalogo" variant="secondary">Ver catálogo</Button>
          </div>
        </div>
      </section>

      <section className="seccion container" aria-labelledby="pasos-titulo">
        <h2 id="pasos-titulo">Cómo funciona</h2>
        <div className="grid grid-3">
          {pasos.map((p) => (
            <Card key={p.titulo} titulo={p.titulo}>
              <p>{p.texto}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="seccion container" aria-labelledby="cat-titulo">
        <h2 id="cat-titulo">¿Qué puedes pedir?</h2>
        <div className="grid grid-4">
          {categorias.map((c) => (
            <Card key={c.titulo} titulo={c.titulo}>
              <p>{c.texto}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta" aria-labelledby="cta-titulo">
        <div className="container">
          <h2 id="cta-titulo">¿Tienes algo roto en casa?</h2>
          <p>Regístrate gratis y abre tu primer ticket en un par de minutos.</p>
          <Button to="/registro" variant="secondary">Empezar ahora</Button>
        </div>
      </section>
    </>
  );
}