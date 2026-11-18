import "../../blocks/home.css";
import Button from "../Button";
import Card from "../Card";
import heroImg from "../../images/banner-hero.webp";
import residenciaImg from "../../images/interior-de-la-residencia-con-zonas-comunes-y-bastante-luz-natural_20cb0798_251205100442_1280x854.webp";
import alquilerImg from "../../images/madrid-2-768x512.jpg";

const perfiles =[
  {
    titulo: "Residencias estudiantiles",
    texto: "Los residentes piden servicios y reportan incidencias, y la gestión sigue cada caso hasta cerrarlo.",
    imagen: residenciaImg,
    alt: "Zona común de una residencia de estudiantes"
  },
  {
    titulo: "Alquileres",
    texto: "Inquilinos y propietarios se coordinan en un solo sitio para resolver averías y solicitudes.",
    imagen: alquilerImg,
    alt: "Salón de un piso de alquiler"
  }
];

const pasos = [
  {
    titulo: "Crea tu cuenta",
    texto: "Regístrate como residente o inquilino en menos de un minuto.",
  },
  {
    titulo: "Pide servicios",
    texto: "Solicita limpieza, mantenimiento u otros servicios desde la web.",
  },
  {
    titulo: "Reporta incidencias",
    texto: "Avisa de una avería y sigue su estado hasta que se resuelva.",
  },
  {
    titulo: "Seguimiento Post-Incidencias",
    texto: "Opcion a revision post incidencia"
  }
];

const servicios = [
  { icon: "🧹", titulo: "Limpieza", texto: "Solicita la limpieza de tu habitación o zonas comunes." },
  { icon: "🔧", titulo: "Mantenimiento", texto: "Avisa de averías de fontanería, electricidad o mobiliario." },
  { icon: "🧺", titulo: "Lavandería", texto: "Reserva turno y consulta el estado de tu servicio." },
  { icon: "⚙️", titulo: "Otros", texto: "Reporta problemas y recibe soporte." },
];

const estados = [
  { nombre: "Abierta", clase: "abierta", texto: "Registras la incidencia y queda pendiente de atención." },
  { nombre: "En curso", clase: "en-curso", texto: "El equipo de gestión se ocupa de resolverla." },
  { nombre: "Resuelta", clase: "resuelta", texto: "Se cierra y puedes revisar cómo se resolvió." },
];


const faqs = [
  {
    pregunta: "¿Necesito una cuenta para pedir un servicio?",
    respuesta: "Sí. Al registrarte, cada solicitud queda asociada a ti y puedes seguir su estado desde tu cuenta.",
  },
  {
    pregunta: "¿Qué tipo de incidencias puedo reportar?",
    respuesta: "Averías de fontanería, electricidad, mobiliario o internet, y cualquier otro problema de tu alojamiento.",
  },
  {
    pregunta: "¿Puedo ver en qué estado está mi incidencia?",
    respuesta: "Sí. Cada incidencia muestra su estado, desde que se abre hasta que se resuelve.",
  },
  {
    pregunta: "¿Sirve para residencias y para pisos de alquiler?",
    respuesta: "Sí, está pensada para ambos: el funcionamiento es el mismo y solo cambia quién gestiona las solicitudes.",
  },
];


export default function Home(){
  return(
    <>
    {/*SECTION HERO*/}
    <section className="hero" style={{ "--hero-img": `url(${heroImg})` }}>
  <div className="hero-content">
    <h1>Tu residencia o alquiler, sin complicaciones</h1>
    <p>
      Pide servicios y reporta incidencias en un solo lugar, para
      residencias estudiantiles y alquileres.
    </p>
    <div className="hero-actions">
      <Button to="/register">Crear cuenta</Button>
      <Button to="/login" variant="secondary">Iniciar sesión</Button>
    </div>
  </div>
</section>

{/*SECTION AUDIENCE*/}

    <section className="audience">
      <h2>Pensado para cada tipo de alojamiento</h2>
      <div className="audience-grid">
        {perfiles.map((p) =>(
          <article className="audience-card" key={p.titulo}>
            {p.imagen ? (
              <img src={p.imagen} alt={p.alt} />
              ) : (
              <div className="audience-placeholder" aria-hidden="true" />
            )}
            <div className="audience-body">
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          </article>
        )
        )}
      </div>
    </section>

{/*SECTION HOW*/}
    <section className="how">

      <h2>Como funciona</h2>
      <div className="how-grid">
        {pasos.map((paso,index) =>(
          <article className="how-step" key={paso.titulo}>
            <span className="how-number">{index + 1 }</span>
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </article>
        ))}
      </div>
    </section>

{/*SECTION STATES*/}
    <section className="states">
      <h2>Sigue cada incidencia que se resuelva</h2>
      <ol className="states-list">
        {estados.map((e) =>(
          <li className="state" key={e.nombre}>
            <span className={`badge badge-${e.clase}`}>{e.nombre}</span>
            <p>{e.texto}</p>
          </li>
        ))}
      </ol>
    </section>
    
{/*SECTION SERVICES*/}
    <section className="services">
      <h2>Servicios disponibles</h2>
      <div className="services-grid">
        {servicios.map((s) => (
          <Card key={s.titulo} icon={s.icon} title={s.titulo}>
            {s.texto}
          </Card>
        ))}
      </div>
    </section>


{/*SECTION FAQ*/}

    <section className="faq">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-lis">
            {faqs.map((f) => (
              <details className="faq-item" key={f.pregunta}>
                <summary>{f.pregunta}</summary>
                <p>{f.respuesta}</p>
              </details>
            ))}
          </div>
      </section>

    <section className="cta">
        <h2>Empieza a gestionar tu residencia hoy</h2>
        <p>Crea tu cuenta y reporta tu primera incidencia en minutos.</p>
        <Button to="/register" variant="secondary">Crear cuenta</Button>
    </section>

    </>
  )
}