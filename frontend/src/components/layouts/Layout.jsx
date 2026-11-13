import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer"
import "../../blocks/layout.css";

export default function Layout() {
  return (
    <>
      <div className="app">
      <a href="#contenido" className="skip">Saltar al contenido</a>
      <Navbar />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
    </>
  );
}