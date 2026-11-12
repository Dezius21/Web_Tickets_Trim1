import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer"

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