import { Link } from "react-router-dom";
import "../blocks/footer.css";

export default function Footer(){
  const year = new Date().getFullYear();

  return(
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>Nombre</strong>
          <p>Gestion de servicios e incidencias para residencias y alquileres.</p>
        </div>
      </div>


         <p className="footer-copy">© {year} NombreApp. Proyecto académico.</p>
    </footer>
  )
}