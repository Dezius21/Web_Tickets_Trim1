import "../../blocks/home.css";
import Button from "../Button";
import Card from "../Card";


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


export default function Home(){
  return(
    <>
    <section className="hero">
      <h1>Tu residencia o alquiler, sin complicaciones</h1>
      <p>
          Pide servicios y reporta incidencias en un solo lugar, para
          residencias estudiantiles y alquileres.
      </p>
      <div className="hero-actions">
        <Button to="/register">Crear cuenta</Button>
        <Button to="/login" variant="secondary">Iniciar Sesion</Button>
      </div>
    </section>

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

    <section className="cta">
        <h2>Empieza a gestionar tu residencia hoy</h2>
        <p>Crea tu cuenta y reporta tu primera incidencia en minutos.</p>
        <Button to="/register" variant="secondary">Crear cuenta</Button>
    </section>

    </>
  )
}